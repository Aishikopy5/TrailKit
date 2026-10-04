"""
Application Configuration with Strict Pydantic Typing
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    ENVIRONMENT: str = Field(default="development", description="Environment: development, staging, production")
    DEBUG: bool = Field(default=False, description="Debug mode - MUST BE FALSE in production (S18)")
    HOST: str = Field(default="0.0.0.0")
    PORT: int = Field(default=8000)
    
    # Security & CORS (S14: exact allow-list of origins, no wildcard with credentials)
    FRONTEND_URL: str = Field(default="http://localhost:5173")
    CORS_ORIGINS: str = Field(default="http://localhost:5173,http://127.0.0.1:5173")
    SESSION_SECRET_KEY: str = Field(default="trailkit-secure-dev-session-key-change-in-prod-xyz")
    RATE_LIMIT_PER_MINUTE: int = Field(default=20)
    
    # Model Endpoints (Open-weight Gemma / Tinker fine-tuned planner)
    GEMMA_API_BASE: str = Field(default="http://localhost:11434/v1")
    GEMMA_MODEL_NAME: str = Field(default="gemma2:9b")
    TINKER_MODEL_ENDPOINT: str = Field(default="")
    TINKER_API_KEY: str = Field(default="")
    
    # External Grounding (SerpApi)
    SERPAPI_API_KEY: str = Field(default="")
    
    # Voice (ElevenLabs - in-memory stream, no persistence)
    ELEVENLABS_API_KEY: str = Field(default="")
    ELEVENLABS_VOICE_ID: str = Field(default="21m00Tcm4TlvDq8ikWAM")
    
    # WhatsApp Webhook Security (S31 HMAC verification)
    WHATSAPP_WEBHOOK_SECRET: str = Field(default="dev_webhook_secret_key_32_bytes_min")
    WHATSAPP_PHONE_NUMBER_ID: str = Field(default="")
    WHATSAPP_ACCESS_TOKEN: str = Field(default="")
    
    # Database
    MONGODB_URI: str = Field(default="")
    POSTGRES_URI: str = Field(default="")
    
    # Monitoring
    SENTRY_DSN: str = Field(default="")
    
    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
