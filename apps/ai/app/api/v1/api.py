from fastapi import APIRouter
from app.api.v1.endpoints.documents.router import router as documents_router
from app.api.v1.endpoints.query.router import router as query_router
from app.api.v1.endpoints.copilot.router import router as copilot_router
from app.api.v1.endpoints.observability.router import router as observability_router
from app.api.v1.endpoints.evaluations.router import router as evaluations_router

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(documents_router, prefix="/documents", tags=["documents"])
api_router.include_router(query_router, prefix="/query", tags=["query"])
api_router.include_router(copilot_router, prefix="/copilot", tags=["copilot"])
api_router.include_router(observability_router, prefix="/observability", tags=["observability"])
api_router.include_router(evaluations_router, prefix="/evaluations", tags=["evaluations"])