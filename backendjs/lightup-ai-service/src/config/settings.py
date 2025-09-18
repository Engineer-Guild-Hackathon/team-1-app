"""Configuration settings for the AI service."""

import os
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Service Configuration
    ai_service_port: int = Field(default=8001, description="Port for AI service")
    ai_service_host: str = Field(default="0.0.0.0", description="Host for AI service")
    log_level: str = Field(default="INFO", description="Logging level")
    environment: str = Field(default="development", description="Environment")

    # OpenAI Configuration
    openai_api_key: str = Field(..., description="OpenAI API key")
    openai_model: str = Field(default="gpt-4-turbo-preview", description="OpenAI model")
    openai_max_tokens: int = Field(default=4000, description="Max tokens for OpenAI")
    openai_temperature: float = Field(default=0.7, description="Temperature for OpenAI")

    # Anthropic Configuration (optional)
    anthropic_api_key: Optional[str] = Field(default=None, description="Anthropic API key")
    anthropic_model: str = Field(default="claude-3-sonnet-20240229", description="Anthropic model")

    # External Services
    node_backend_url: str = Field(default="http://localhost:8000", description="Node.js backend URL")
    search_api_url: Optional[str] = Field(default=None, description="Search API URL")
    search_api_key: Optional[str] = Field(default=None, description="Search API key")

    # Redis Configuration
    redis_url: str = Field(default="redis://localhost:6379/0", description="Redis URL")
    redis_enabled: bool = Field(default=True, description="Enable Redis caching")
    cache_ttl: int = Field(default=3600, description="Cache TTL in seconds")

    # Rate Limiting
    rate_limit_requests: int = Field(default=100, description="Rate limit requests")
    rate_limit_period: int = Field(default=60, description="Rate limit period in seconds")

    # Timeouts
    llm_timeout: int = Field(default=60, description="LLM timeout in seconds")
    http_timeout: int = Field(default=30, description="HTTP timeout in seconds")
    assessment_generation_timeout: int = Field(default=120, description="Assessment generation timeout")
    study_plan_generation_timeout: int = Field(default=180, description="Study plan generation timeout")

    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.environment.lower() in ("development", "dev")

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.environment.lower() in ("production", "prod")


# Global settings instance
settings = Settings()