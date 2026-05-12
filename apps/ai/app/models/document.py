from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, Boolean, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm relationship
import uuid

from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(String(255), nullable=False, index=True)
    user_id = Column(String(255), nullable=True, index=True)
    
    filename = Column(String(255), nullable=False)
    file_size = Column(String(255), nullable=True)
    mime_type = Column(String(100), nullable=False)
    
    # Storage info
    storage_path = Column(String(500), nullable=False)
    storage_bucket = Column(String(255), nullable=True)
    
    # Processing status
    status = Column(String(50), nullable=False, default="uploaded")  # uploaded, parsing, chunking, embedding, indexed, failed
    error_message = Column(Text, nullable=True)
    
    # Content info
    page_count = Column(String(255), nullable=True)
    language = Column(String(10), nullable=True)
    
    # Metadata
    metadata_ = Column("metadata", JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Indexes for performance
    __table_args__ = (
        Index('ix_documents_tenant_status', 'tenant_id', 'status'),
        Index('ix_documents_user_status', 'user_id', 'status'),
    )


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False, index=True)
    tenant_id = Column(String(255), nullable=False, index=True)
    
    # Content
    content = Column(Text, nullable=False)
    content_summary = Column(String(500), nullable=True)
    
    # Position info
    chunk_index = Column(String(255), nullable=False)
    start_char = Column(String(255), nullable=True)
    end_char = Column(String(255), nullable=True)
    
    # Token info
    token_count = Column(String(255), nullable=True)
    
    # Metadata
    metadata_ = Column("metadata", JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Indexes
    __table_args__ = (
        Index('ix_document_chunks_document_id', 'document_id'),
        Index('ix_document_chunks_tenant_id', 'tenant_id'),
    )


class DocumentEmbedding(Base):
    __tablename__ = "document_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chunk_id = Column(UUID(as_uuid=True), ForeignKey("document_chunks.id"), nullable=False, index=True)
    tenant_id = Column(String(255), nullable=False, index=True)
    
    # Embedding vector (using pgvector)
    embedding = Column(String(255), nullable=False)  # Will store as JSON array or use pgvector type
    
    # Model info
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Indexes
    __table_args__ = (
        Index('ix_document_embeddings_chunk_id', 'chunk_id'),
        Index('ix_document_embeddings_tenant_id', 'tenant_id'),
    )