from fastapi import APIRouter
from app.api.v1.endpoints import chat, embeddings, models, metrics, health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(models.router, prefix="/models", tags=["models"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(embeddings.router, prefix="/embeddings", tags=["embeddings"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
