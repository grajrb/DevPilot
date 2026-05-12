import logging
from typing import List, Optional, Dict, Any
import numpy as np
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import DocumentChunk, DocumentEmbedding
from app.core.database import async_session_maker

logger = logging.getLogger(__name__)


class VectorService:
    def __init__(self):
        pass

    async def store_embedding(
        self, 
        chunk_id: str, 
        tenant_id: str, 
        embedding: List[float],
        model_name: str = "text-embedding-ada-002",
        model_version: str = "2"
    ) -> DocumentEmbedding:
        """Store embedding vector for a chunk"""
        async with async_session_maker() as session:
            # Convert embedding to string format for storage
            # In production with pgvector, you'd use the proper vector type
            embedding_str = str(embedding)
            
            db_embedding = DocumentEmbedding(
                chunk_id=chunk_id,
                tenant_id=tenant_id,
                embedding=embedding_str,
                model_name=model_name,
                model_version=model_version
            )
            session.add(db_embedding)
            await session.commit()
            await session.refresh(db_embedding)
            return db_embedding

    async def similarity_search(
        self, 
        tenant_id: str, 
        query_embedding: List[float], 
        limit: int = 10,
        threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Search for similar vectors using cosine similarity
        Note: This is a simplified implementation. With pgvector, you'd use:
        SELECT * FROM document_embeddings 
        WHERE tenant_id = :tenant_id 
        ORDER BY embedding <=> :query_embedding 
        LIMIT :limit
        """
        async with async_session_maker() as session:
            # Get all embeddings for tenant (in production, use vector index)
            stmt = select(DocumentEmbedding, DocumentChunk).join(
                DocumentChunk, DocumentEmbedding.chunk_id == DocumentChunk.id
            ).where(DocumentEmbedding.tenant_id == tenant_id)
            
            result = await session.execute(stmt)
            rows = result.fetchall()
            
            if not rows:
                return []
            
            # Calculate cosine similarity (simplified)
            query_vec = np.array(query_embedding)
            query_norm = np.linalg.norm(query_vec)
            
            similarities = []
            for embedding_record, chunk_record in rows:
                try:
                    # Parse embedding string back to list
                    import ast
                    stored_embedding = ast.literal_eval(embedding_record.embedding)
                    stored_vec = np.array(stored_embedding)
                    
                    # Calculate cosine similarity
                    dot_product = np.dot(query_vec, stored_vec)
                    norm_product = query_norm * np.linalg.norm(stored_vec)
                    
                    if norm_product == 0:
                        similarity = 0
                    else:
                        similarity = dot_product / norm_product
                    
                    if similarity >= threshold:
                        similarities.append({
                            "chunk_id": str(chunk_record.id),
                            "document_id": str(chunk_record.document_id),
                            "content": chunk_record.content,
                            "content_summary": chunk_record.content_summary,
                            "chunk_index": chunk_record.chunk_index,
                            "metadata": chunk_record.metadata_,
                            "similarity": float(similarity),
                            "tenant_id": str(chunk_record.tenant_id)
                        })
                except (ValueError, SyntaxError) as e:
                    logger.warning(f"Error parsing embedding for chunk {chunk_record.id}: {e}")
                    continue
            
            # Sort by similarity (descending) and limit
            similarities.sort(key=lambda x: x["similarity"], reverse=True)
            return similarities[:limit]

    async def get_chunks_by_document(
        self, 
        document_id: str, 
        tenant_id: str
    ) -> List[DocumentChunk]:
        """Get all chunks for a document"""
        async with async_session_maker() as session:
            stmt = select(DocumentChunk).where(
                DocumentChunk.document_id == document_id,
                DocumentChunk.tenant_id == tenant_id
            ).order_by(DocumentChunk.chunk_index)
            
            result = await session.execute(stmt)
            return result.scalars().all()

    async def delete_document_vectors(
        self, 
        document_id: str, 
        tenant_id: str
    ):
        """Delete all vectors for a document"""
        async with async_session_maker() as session:
            # Delete embeddings
            stmt = select(DocumentEmbedding).join(
                DocumentChunk, DocumentEmbedding.chunk_id == DocumentChunk.id
            ).where(
                DocumentChunk.document_id == document_id,
                DocumentChunk.tenant_id == tenant_id
            )
            
            result = await session.execute(stmt)
            embeddings = result.scalars().all()
            
            for embedding in embeddings:
                await session.delete(embedding)
            
            # Delete chunks
            stmt = select(DocumentChunk).where(
                DocumentChunk.document_id == document_id,
                DocumentChunk.tenant_id == tenant_id
            )
            
            result = await session.execute(stmt)
            chunks = result.scalars().all()
            
            for chunk in chunks:
                await session.delete(chunk)
            
            await session.commit()