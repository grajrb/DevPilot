import httpx
from typing import List, AsyncGenerator, Optional
from app.models.schemas import ChatMessage, ChatCompletionResponse, ChatCompletionChunk
from app.services.llm.base import BaseLLMProvider

class AnthropicProvider(BaseLLMProvider):
    """Anthropic Claude API provider"""

    def __init__(self, api_key: str, base_url: str = "https://api.anthropic.com/v1"):
        super().__init__(api_key, base_url)
        self.base_url = base_url

    async def chat_completion(
        self,
        messages: List[ChatMessage],
        model: str = "claude-3-sonnet-20240229",
        temperature: float = 1.0,
        max_tokens: Optional[int] = None,
        stream: bool = False,
        **kwargs: Any,
    ) -> ChatCompletionResponse:
        # Transform messages to Anthropic format
        system_msg = ""
        user_messages = []
        for msg in messages:
            if msg.role == "system":
                system_msg = msg.content
            else:
                user_messages.append({"role": msg.role, "content": msg.content})

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/messages",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": model,
                    "max_tokens": max_tokens or 1024,
                    "system": system_msg,
                    "messages": user_messages,
                    "temperature": temperature,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()

            # Transform Anthropic response to OpenAI format
            return ChatCompletionResponse(
                id=data["id"],
                created=data["created_at"],
                model=data["model"],
                choices=[
                    {
                        "index": 0,
                        "message": ChatMessage(role="assistant", content=data["content"][0]["text"]),
                        "finish_reason": data.get("stop_reason", "stop"),
                    }
                ],
                usage={
                    "prompt_tokens": data["usage"]["input_tokens"],
                    "completion_tokens": data["usage"]["output_tokens"],
                    "total_tokens": data["usage"]["input_tokens"] + data["usage"]["output_tokens"],
                },
            )

    async def chat_completion_stream(
        self,
        messages: List[ChatMessage],
        model: str = "claude-3-sonnet-20240229",
        temperature: float = 1.0,
        max_tokens: Optional[int] = None,
        **kwargs: Any,
    ) -> AsyncGenerator[ChatCompletionChunk, None]:
        # Implementation similar to OpenAI but handling Anthropic SSE format
        # For brevity, this is simplified
        raise NotImplementedError("Streaming not yet implemented for Anthropic")
