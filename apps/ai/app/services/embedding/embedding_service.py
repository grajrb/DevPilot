from abc import ABC, abstractmethod
from typing import List
import numpy as np

class BaseEmbeddingProvider(ABC):
    @abstractmethod
    async def embed(self, texts: List[str]) -> List[List[float]]:
        pass

class OpenAIEmbeddingProvider(BaseEmbeddingProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    async def embed(self, texts: List[str]) -> List[List[float]]:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/embeddings",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": "text-embedding-ada-002", "input": texts},
            )
            response.raise_for_status()
            data = response.json()
            return [item["embedding"] for item in data["data"]]

class SentenceTransformerProvider(BaseEmbeddingProvider):
    """Local embedding model using sentence-transformers"""
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(model_name)

    async def embed(self, texts: List[str]) -> List[List[float]]:
        # Run in thread pool to avoid blocking
        import asyncio
        loop = asyncio.get_event_loop()
        embeddings = await loop.run_in_executor(
            None, lambda: self.model.encode(texts).tolist()
        )
        return embeddings

class EmbeddingService:
    """Unified embedding service"""
    def __init__(self):
        self.provider = None  # Initialize based on config

    async def embed(self, input: str | List[str], model: str, tenant_id: str) -> List[List[float]]:
        texts = [input] if isinstance(input, str) else input

        if self.provider is None:
            # TODO: Load based on tenant's configured provider
            from app.core.config import settings
            if settings.OPENAI_API_KEY:
                self.provider = OpenAIEmbeddingProvider(settings.OPENAI_API_KEY)
            else:
                self.provider = SentenceTransformerProvider()

        return await self.provider.embed(texts)
