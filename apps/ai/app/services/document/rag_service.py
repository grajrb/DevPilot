import logging
from typing import List, Dict, Any, Optional
from app.services.document.document_service import DocumentService
from app.services.parsing.parsing_service import ParsingService
from app.services.chunking.chunking_service import ChunkingService
from app.services.vector.vector_service import VectorService
from app.services.llm.router import LLMRouter
from app.models.schemas import ChatCompletionRequest, ChatCompletionResponse
from app.core.dependencies import get_tenant_id, get_user_id
from fastapi import Depends

logger = logging.getLogger(__name__)


class RAGService:
    def __init__(
        self,
        document_service: DocumentService = None,
        parsing_service: ParsingService = None,
        chunking_service: ChunkingService = None,
        vector_service: VectorService = None,
        llm_router: LLMRouter = None,
    ):
        self.document_service = document_service or DocumentService()
        self.parsing_service = parsing_service or ParsingService()
        self.chunking_service = chunking_service or ChunkingService()
        self.vector_service = vector_service or VectorService()
        self.llm_router = llm_router or LLMRouter()

    async def process_document_upload(
        self, 
        file, 
        tenant_id: str, 
        user_id: Optional[str] = None
    ) -> str:
        """
        Full document processing pipeline: upload -> parse -> chunk -> embed
        Returns document ID
        """
        # 1. Validate and save file
        is_valid = await self.document_service.validate_file(file)
        if not is_valid:
            raise ValueError("Invalid file type or size")
        
        file_path, storage_filename = await self.document_service.save_file(file, tenant_id)
        
        # 2. Create document record
        document = await self.document_service.create_document_record(
            tenant_id=tenant_id,
            user_id=user_id,
            filename=file.filename or "unknown",
            file_size=len(await file.read()),
            mime_type=file.content_type,
            storage_path=storage_filename
        )
        # Reset file position
        await file.seek(0)
        
        try:
            # 3. Update status to parsing
            await self.document_service.update_document_status(
                document.id, tenant_id, "parsing"
            )
            
            # 4. Parse document
            text = await self.parsing_service.parse_document(
                file_path, file.content_type
            )
            
            # 5. Update status to chunking
            await self.document_service.update_document_status(
                document.id, tenant_id, "chunking"
            )
            
            # 6. Create chunks
            chunks = await self.chunking_service.create_chunks(
                document_id=str(document.id),
                tenant_id=tenant_id,
                text=text,
                metadata={"filename": file.filename}
            )
            
            # 7. Update status to embedding
            await self.document_service.update_document_status(
                document.id, tenant_id, "embedding"
            )
            
            # 8. Generate and store embeddings for each chunk
            for chunk in chunks:
                # Get embedding for chunk text
                embedding_list = await self.vector_service.provider.embed([chunk.content])
                embedding = embedding_list[0] if embedding_list else []
                
                if embedding:
                    # Store embedding
                    await self.vector_service.store_embedding(
                        chunk_id=str(chunk.id),
                        tenant_id=tenant_id,
                        embedding=embedding
                    )
            
            # 9. Update status to indexed
            await self.document_service.update_document_status(
                document.id, tenant_id, "indexed"
            )
            
            logger.info(f"Successfully processed document {document.id}")
            return str(document.id)
            
        except Exception as e:
            # Update status to failed on error
            await self.document_service.update_document_status(
                document.id, tenant_id, "failed", str(e)
            )
            logger.error(f"Error processing document {document.id}: {str(e)}")
            raise

    async def query_rag(
        self,
        query: str,
        tenant_id: str,
        user_id: Optional[str] = None,
        model: str = "gpt-3.5-turbo",
        temperature: float = 0.7,
        max_tokens: Optional[int] = 1000,
        limit: int = 5,
        threshold: float = 0.7
    ) -> ChatCompletionResponse:
        """
        Full RAG pipeline: retrieve relevant chunks -> generate answer with LLM
        """
        try:
            # 1. Generate query embedding
            query_embedding_list = await self.vector_service.provider.embed([query])
            query_embedding = query_embedding_list[0] if query_embedding_list else []
            
            if not query_embedding:
                raise ValueError("Failed to generate query embedding")
            
            # 2. Search for similar chunks
            similar_chunks = await self.vector_service.similarity_search(
                tenant_id=tenant_id,
                query_embedding=query_embedding,
                limit=limit,
                threshold=threshold
            )
            
            if not similar_chunks:
                # No relevant chunks found, answer based on general knowledge
                context = "No relevant documents found."
            else:
                # 3. Prepare context from retrieved chunks
                context_parts = []
                for chunk in similar_chunks:
                    context_parts.append(f"[Source {chunk['chunk_index']}]: {chunk['content']}")
                context = "\n\n".join(context_parts)
            
            # 4. Construct RAG prompt
            system_message = """You are a helpful assistant that answers questions based on provided context. 
            Use only the information from the context to answer the question. If the context doesn't contain 
            sufficient information to answer the question, say so clearly. Always cite your sources by 
            referencing the source numbers provided in the context."""
            
            user_message = f"""Context:
{context}

Question: {query}

Please provide a concise answer based only on the context above. If the context doesn't contain enough information to answer the question, state that clearly."""
            
            # 5. Generate response using LLM
            messages = [
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ]
            
            response = await self.llm_router.chat(
                messages=messages,
                model=model,
                tenant_id=tenant_id,
                user_id=user_id,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=False
            )
            
            # 6. Add retrieval metadata to response
            if hasattr(response, 'metadata'):
                response.metadata = {
                    "retrieved_chunks": len(similar_chunks),
                    "query": query,
                    "tenant_id": tenant_id
                }
            else:
                response.metadata = {
                    "retrieved_chunks": len(similar_chunks),
                    "query": query,
                    "tenant_id": tenant_id
                }
            
            return response
            
        except Exception as e:
            logger.error(f"Error in RAG query: {str(e)}")
            raise