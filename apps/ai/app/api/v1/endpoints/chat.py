from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.models.schemas import ChatCompletionRequest, ChatCompletionResponse
from app.services.llm.router import LLMRouter
from app.core.dependencies import get_tenant_id, get_user_id
import json

router = APIRouter()

@router.post("/completions", response_model=ChatCompletionResponse)
async def create_chat_completion(
    request: ChatCompletionRequest,
    llm_router: LLMRouter = Depends(),
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
):
    """
    OpenAI-compatible chat completion endpoint
    """
    try:
        response = await llm_router.chat(
            messages=request.messages,
            model=request.model,
            tenant_id=tenant_id,
            user_id=user_id,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            stream=False,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/completions/stream")
async def create_chat_completion_stream(
    request: ChatCompletionRequest,
    llm_router: LLMRouter = Depends(),
    tenant_id: str = Depends(get_tenant_id),
    user_id: str = Depends(get_user_id),
):
    """
    Streaming chat completion endpoint (SSE)
    """
    async def generate():
        try:
            async for chunk in llm_router.chat_stream(
                messages=request.messages,
                model=request.model,
                tenant_id=tenant_id,
                user_id=user_id,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
            ):
                yield f"data: {json.dumps(chunk.dict())}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
