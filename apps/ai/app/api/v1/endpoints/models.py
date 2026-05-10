from fastapi import APIRouter
from app.services.llm.router import LLMRouter

router = APIRouter()

@router.get("/models")
async def list_models(llm_router: LLMRouter = None):
    """
    List available LLM models
    """
    return {
        "object": "list",
        "data": [
            {"id": "gpt-4", "object": "model", "owned_by": "openai"},
            {"id": "gpt-4-turbo", "object": "model", "owned_by": "openai"},
            {"id": "gpt-3.5-turbo", "object": "model", "owned_by": "openai"},
            {"id": "claude-3-opus", "object": "model", "owned_by": "anthropic"},
            {"id": "claude-3-sonnet", "object": "model", "owned_by": "anthropic"},
        ],
    }
