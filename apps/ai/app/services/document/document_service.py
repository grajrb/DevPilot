import os
import uuid
import aiofiles
from typing import Optional, BinaryIO
from fastapi import UploadFile, HTTPException
from app.models.document import Document
from app.core.database import async_session_maker
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import logging

logger = logging.getLogger(__name__)


class DocumentService:
    def __init__(self, upload_dir: str = "./uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
        self.allowed_extensions = {'.pdf', '.txt', '.md', '.docx'}
        self.allowed_mime_types = {
            'application/pdf',
            'text/plain',
            'text/markdown',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        self.max_file_size = 50 * 1024 * 1024  # 50MB

    async def validate_file(self, file: UploadFile) -> bool:
        """Validate file type and size"""
        # Check file extension
        file_ext = os.path.splitext(file.filename or "")[1].lower()
        if file_ext not in self.allowed_extensions:
            return False
            
        # Check MIME type
        if file.content_type not in self.allowed_mime_types:
            return False
            
        return True

    async def save_file(self, file: UploadFile, tenant_id: str) -> tuple[str, str]:
        """Save uploaded file and return file path and storage key"""
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_ext = os.path.splitext(file.filename or "")[1].lower()
        storage_filename = f"{file_id}{file_ext}"
        
        # Create tenant-specific directory
        tenant_dir = os.path.join(self.upload_dir, tenant_id)
        os.makedirs(tenant_dir, exist_ok=True)
        
        file_path = os.path.join(tenant_dir, storage_filename)
        
        # Save file
        content = await file.read()
        if len(content) > self.max_file_size:
            raise HTTPException(status_code=413, detail="File too large")
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
            
        # Reset file position for potential reuse
        await file.seek(0)
        
        return file_path, storage_filename

    async def create_document_record(
        self, 
        tenant_id: str, 
        user_id: Optional[str], 
        filename: str, 
        file_size: int, 
        mime_type: str,
        storage_path: str
    ) -> Document:
        """Create database record for uploaded document"""
        async with async_session_maker() as session:
            document = Document(
                tenant_id=tenant_id,
                user_id=user_id,
                filename=filename,
                file_size=str(file_size),
                mime_type=mime_type,
                storage_path=storage_path,
                status="uploaded"
            )
            session.add(document)
            await session.commit()
            await session.refresh(document)
            return document

    async def get_document(self, document_id: str, tenant_id: str) -> Optional[Document]:
        """Get document by ID with tenant validation"""
        async with async_session_maker() as session:
            stmt = select(Document).where(
                Document.id == document_id,
                Document.tenant_id == tenant_id
            )
            result = await session.execute(stmt)
            return result.scalar_one_or_none()

    async def update_document_status(
        self, 
        document_id: str, 
        tenant_id: str, 
        status: str,
        error_message: Optional[str] = None
    ):
        """Update document processing status"""
        async with async_session_maker() as session:
            stmt = select(Document).where(
                Document.id == document_id,
                Document.tenant_id == tenant_id
            )
            result = await session.execute(stmt)
            document = result.scalar_one_or_none()
            
            if document:
                document.status = status
                if error_message:
                    document.error_message = error_message
                if status == "indexed":
                    from sqlalchemy import func
                    document.processed_at = func.now()
                await session.commit()