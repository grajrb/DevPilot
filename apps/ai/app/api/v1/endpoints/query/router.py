from fastapi import APIRouter, Depends, HTTPException, status
from app.services.document.rag_service import RAGService
from app.core.dependencies import get_tenant_id, get_user_id
from app.models.schemas import ChatCompletionRequest, ChatCompletionResponse

router = APIRouter()


@router.post("/query", response_model=ChatCompletionResponse)
async def query_documents(
    request: ChatCompletionRequest,
    tenant_id: str = Depends(get_tenant_id),
    user_id: Optional[str] = Depends(get_user_id),
    rag_service: RAGService = Depends()
):
    """
    Query documents using RAG (Retrieval-Augmented Generation)
    """
    # Override user message with the query from request
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
    
    # Use the last user message as the query
    query = None
    for message in reversed(request.messages):
        if message.role == "user":
            query = message.content
            break
    
    if not query:
        raise HTTPException(status_code=400, detail="No user query found in messages")
    
    try:
        response = await rag_service.query_rag(
            query=query,
            tenant_id=tenant_id,
            user_id=user_id,
            model=request.model,
            temperature=request.temperature or 0.7,
            max_tokens=request.max_tokens,
            limit=5,  # Could make configurable
            threshold=0.7  # Could make configurable
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))