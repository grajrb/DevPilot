import asyncio
import logging
from typing import List
import tiktoken
from app.models.document import DocumentChunk

logger = logging.getLogger(__name__)


class ChunkingService:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.tokenizer = tiktoken.get_encoding("cl100k_base")  # GPT-4 tokenizer

    async def create_chunks(
        self, 
        document_id: str, 
        tenant_id: str, 
        text: str,
        metadata: dict = None
    ) -> List[DocumentChunk]:
        """
        Split text into overlapping chunks
        """
        if not text.strip():
            return []
            
        # Tokenize the text
        tokens = self.tokenizer.encode(text)
        
        if len(tokens) == 0:
            return []
        
        chunks = []
        start = 0
        chunk_index = 0
        
        while start < len(tokens):
            # Calculate end position
            end = min(start + self.chunk_size, len(tokens))
            
            # Extract chunk tokens
            chunk_tokens = tokens[start:end]
            chunk_text = self.tokenizer.decode(chunk_tokens)
            
            # Create chunk object
            chunk = DocumentChunk(
                document_id=document_id,
                tenant_id=tenant_id,
                content=chunk_text,
                content_summary=self._generate_summary(chunk_text),
                chunk_index=str(chunk_index),
                start_char=str(self.tokenizer.decode(tokens[:start])),  # Approximate
                end_char=str(self.tokenizer.decode(tokens[:end])),      # Approximate
                token_count=len(chunk_tokens),
                metadata_=metadata or {}
            )
            
            chunks.append(chunk)
            chunk_index += 1
            
            # Move start position with overlap
            if end >= len(tokens):
                break
            start = end - self.chunk_overlap
            
            # Ensure we make progress
            if start < len(tokens) - self.chunk_overlap:
                start = max(start, end - self.chunk_overlap)
        
        logger.info(f"Created {len(chunks)} chunks for document {document_id}")
        return chunks

    def _generate_summary(self, text: str, max_length: int = 100) -> str:
        """Generate a simple summary of the chunk"""
        if len(text) <= max_length:
            return text
        return text[:max_length] + "..."