from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from app.services.document.rag_service import RAGService
from app.core.dependencies import get_tenant_id, get_user_id
from app.models.schemas import ChatCompletionRequest, ChatCompletionResponse
from typing import Optional

router = APIRouter()


@router.post("/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    file: UploadFile = File(...),
    tenant_id: str = Depends(get_tenant_id),
    user_id: Optional[str] = Depends(get_user_id),
    rag_service: RAGService = Depends()
):
    """
    Upload and process a document
    """
    try:
        document_id = await rag_service.process_document_upload(file, tenant_id, user_id)
        return {
            "document_id": document_id,
            "status": "processing",
            "message": "Document uploaded and processing started"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{document_id}/status")
async def get_document_status(
    document_id: str,
    tenant_id: str = Depends(get_tenant_id),
    rag_service: RAGService = Depends()
):
    """
    Get processing status of a document
    """
    document = await rag_service.document_service.get_document(document_id, tenant_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {
        "document_id": document.id,
        "filename": document.filename,
        "status": document.status,
        "error_message": document.error_message,
        "created_at": document.created_at,
        "processed_at": document.processed_at
    }


@router.get("")
async def list_documents(
    tenant_id: str = Depends(get_tenant_id),
    rag_service: RAGService = Depends(),
    limit: int = 100,
    offset: int = 0
):
    """
    List documents for a tenant
    """
    # This would require adding a list method to document_service
    # For now, return placeholder
    return {
        "documents": [],
        "total": 0,
        "limit": limit,
        "offset": offset
    }


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    tenant_id: str = Depends(get_tenant_id),
    rag_service: RAGService = Depends()
):
    """
    Delete a document and all associated data
    """
    # Verify document exists and belongs to tenant
    document = await rag_service.document_service.get_document(document_id, tenant_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete vectors and chunks
    await rag_service.vector_service.delete_document_vectors(document_id, tenant_id)
    
    # Delete document record (would need to add delete method to document_service)
    # For now, just mark as deleted or implement proper deletion
    
    return None