from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = ENV == "development"

    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "DevPilot AI"

    # Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-prod")
    JWT_ALGORITHM: str = "HS256"
    JWT_AUTH_HEADER: str = "Authorization"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/devpilot",
    )

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # LLM Providers
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    COHERE_API_KEY: str = os.getenv("COHERE_API_KEY", "")
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    AZURE_OPENAI_KEY: str = os.getenv("AZURE_OPENAI_KEY", "")

    # Observability
    ENABLE_TRACING: bool = True
    JAEGER_ENDPOINT: str = os.getenv("JAEGER_ENDPOINT", "http://localhost:14268/api/traces")

    class Config:
        env_file = ".env.local" if ENV == "development" else ".env"
        case_sensitive = True

settings = Settings()
