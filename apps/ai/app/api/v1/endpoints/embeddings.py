from fastapi import APIRouter, Depends, HTTPException
from app.models.schemas import EmbeddingRequest, EmbeddingResponse
from app.services.embedding.embedding_service import EmbeddingService
from app.core.dependencies import get_tenant_id

router = APIRouter()

@router.post("/embeddings", response_model=EmbeddingResponse)
async def create_embeddings(
    request: EmbeddingRequest,
    embedding_service: EmbeddingService = Depends(),
    tenant_id: str = Depends(get_tenant_id),
):
    """
    Create embeddings for input text(s)
    """
    try:
        embeddings = await embedding_service.embed(
            input=request.input,
            model=request.model,
            tenant_id=tenant_id,
        )
        return EmbeddingResponse(
            object="list",
            data=[{"index": i, "object": "embedding", "embedding": emb} for i, emb in enumerate(embeddings)],
            model=request.model,
            usage={"prompt_tokens": 0, "total_tokens": 0},
            tenant_id=tenant_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
