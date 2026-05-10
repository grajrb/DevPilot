from typing import List, Optional, AsyncGenerator
from app.models.schemas import ChatMessage, ChatCompletionResponse, ChatCompletionChunk
from app.services.llm.base import BaseLLMProvider
from app.services.llm.openai import OpenAIProvider
from app.services.llm.anthropic import AnthropicProvider
from app.core.config import settings

class LLMRouter:
    """
    Routes LLM requests to appropriate providers with failover
    """

    def __init__(self):
        self.providers = {
            "openai": OpenAIProvider(api_key=settings.OPENAI_API_KEY),
            "anthropic": AnthropicProvider(api_key=settings.ANTHROPIC_API_KEY),
        }
        self.default_provider = "openai"

    async def chat(
        self,
        messages: List[ChatMessage],
        model: str,
        tenant_id: str,
        user_id: Optional[str] = None,
        temperature: float = 1.0,
        max_tokens: Optional[int] = None,
        stream: bool = False,
    ) -> ChatCompletionResponse:
        """
        Route chat request to appropriate provider
        """
        provider = self._select_provider(model)
        if not provider:
            raise ValueError(f"No provider available for model {model}")

        response = await provider.chat_completion(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            stream=stream,
        )

        # Enrich with tenant/user metadata
        response.tenantId = tenant_id
        response.userId = user_id
        return response

    async def chat_stream(
        self,
        messages: List[ChatMessage],
        model: str,
        tenant_id: str,
        user_id: Optional[str] = None,
        temperature: float = 1.0,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[ChatCompletionChunk, None]:
        """
        Stream chat completion
        """
        provider = self._select_provider(model)
        if not provider:
            raise ValueError(f"No provider available for model {model}")

        async for chunk in provider.chat_completion_stream(
            messages=messages,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        ):
            chunk.tenantId = tenant_id
            yield chunk

    def _select_provider(self, model: str) -> Optional[BaseLLMProvider]:
        """
        Select appropriate provider based on model name
        """
        if model.startswith("gpt-") or model.startswith("text-"):
            return self.providers.get("openai")
        elif model.startswith("claude-"):
            return self.providers.get("anthropic")
        return self.providers.get(self.default_provider)
