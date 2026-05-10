import httpx
from typing import List, AsyncGenerator, Optional
from app.models.schemas import ChatMessage, ChatCompletionResponse, ChatCompletionChunk
from app.services.llm.base import BaseLLMProvider
import json

class OpenAIProvider(BaseLLMProvider):
    """OpenAI API provider"""

    def __init__(self, api_key: str, base_url: str = "https://api.openai.com/v1"):
        super().__init__(api_key, base_url)
        self.base_url = base_url

    async def chat_completion(
        self,
        messages: List[ChatMessage],
        model: str = "gpt-4",
        temperature: float = 1.0,
        max_tokens: Optional[int] = None,
        stream: bool = False,
        **kwargs: Any,
    ) -> ChatCompletionResponse:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": model,
                    "messages": [m.dict() for m in messages],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "stream": False,
                },
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()

            return ChatCompletionResponse(
                id=data["id"],
                created=data["created"],
                model=data["model"],
                choices=[
                    {
                        "index": c["index"],
                        "message": ChatMessage(**c["message"]),
                        "finish_reason": c["finish_reason"],
                    }
                    for c in data["choices"]
                ],
                usage=data["usage"],
            )

    async def chat_completion_stream(
        self,
        messages: List[ChatMessage],
        model: str = "gpt-4",
        temperature: float = 1.0,
        max_tokens: Optional[int] = None,
        **kwargs: Any,
    ) -> AsyncGenerator[ChatCompletionChunk, None]:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": model,
                    "messages": [m.dict() for m in messages],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "stream": True,
                },
            ) as response:
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str == "[DONE]":
                            break
                        try:
                            data = json.loads(data_str)
                            yield ChatCompletionChunk(
                                id=data["id"],
                                created=data["created"],
                                model=data["model"],
                                choices=data["choices"],
                            )
                        except json.JSONDecodeError:
                            continue
