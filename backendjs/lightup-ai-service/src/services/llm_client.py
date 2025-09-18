"""LLM client for handling OpenAI and Anthropic API calls."""

import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Union
from datetime import datetime

import openai
from openai import AsyncOpenAI
import httpx

from src.config.settings import settings


logger = logging.getLogger(__name__)


class LLMClient:
    """Client for interacting with various LLM providers."""

    def __init__(self):
        """Initialize the LLM client."""
        self.openai_client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            timeout=settings.llm_timeout
        )
        self.anthropic_client = None

        # Initialize Anthropic client if API key is provided
        if settings.anthropic_api_key:
            try:
                import anthropic
                self.anthropic_client = anthropic.AsyncAnthropic(
                    api_key=settings.anthropic_api_key,
                    timeout=settings.llm_timeout
                )
            except ImportError:
                logger.warning("Anthropic client not available - anthropic package not installed")

    async def generate_completion(
        self,
        prompt: str,
        model: Optional[str] = None,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
        response_format: Optional[str] = None,
        system_message: Optional[str] = None,
        provider: str = "openai"
    ) -> str:
        """
        Generate a completion using the specified LLM provider.

        Args:
            prompt: The prompt to send to the LLM
            model: Model to use (defaults to configured model)
            max_tokens: Maximum tokens to generate
            temperature: Temperature for generation
            response_format: Expected response format (json, text)
            system_message: System message to guide the LLM
            provider: LLM provider to use (openai, anthropic)

        Returns:
            Generated completion as string
        """
        start_time = datetime.utcnow()

        try:
            if provider == "openai":
                response = await self._generate_openai_completion(
                    prompt, model, max_tokens, temperature, response_format, system_message
                )
            elif provider == "anthropic" and self.anthropic_client:
                response = await self._generate_anthropic_completion(
                    prompt, model, max_tokens, temperature, system_message
                )
            else:
                raise ValueError(f"Unsupported provider: {provider}")

            processing_time = (datetime.utcnow() - start_time).total_seconds()

            logger.info(
                "LLM completion generated",
                extra={
                    "provider": provider,
                    "model": model or "default",
                    "processing_time": processing_time,
                    "prompt_length": len(prompt),
                    "response_length": len(response)
                }
            )

            return response

        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(
                "LLM completion failed",
                extra={
                    "provider": provider,
                    "error": str(e),
                    "processing_time": processing_time
                }
            )
            raise

    async def _generate_openai_completion(
        self,
        prompt: str,
        model: Optional[str],
        max_tokens: Optional[int],
        temperature: Optional[float],
        response_format: Optional[str],
        system_message: Optional[str]
    ) -> str:
        """Generate completion using OpenAI API."""
        messages = []

        if system_message:
            messages.append({"role": "system", "content": system_message})

        messages.append({"role": "user", "content": prompt})

        kwargs = {
            "model": model or settings.openai_model,
            "messages": messages,
            "max_tokens": max_tokens or settings.openai_max_tokens,
            "temperature": temperature or settings.openai_temperature,
        }

        if response_format == "json":
            kwargs["response_format"] = {"type": "json_object"}

        response = await self.openai_client.chat.completions.create(**kwargs)

        return response.choices[0].message.content or ""

    async def _generate_anthropic_completion(
        self,
        prompt: str,
        model: Optional[str],
        max_tokens: Optional[int],
        temperature: Optional[float],
        system_message: Optional[str]
    ) -> str:
        """Generate completion using Anthropic API."""
        if not self.anthropic_client:
            raise ValueError("Anthropic client not initialized")

        kwargs = {
            "model": model or settings.anthropic_model,
            "max_tokens": max_tokens or settings.openai_max_tokens,
            "temperature": temperature or settings.openai_temperature,
            "messages": [{"role": "user", "content": prompt}]
        }

        if system_message:
            kwargs["system"] = system_message

        response = await self.anthropic_client.messages.create(**kwargs)

        return response.content[0].text if response.content else ""

    async def generate_json_completion(
        self,
        prompt: str,
        expected_schema: Optional[Dict[str, Any]] = None,
        model: Optional[str] = None,
        max_retries: int = 3,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate a JSON completion with validation and retry logic.

        Args:
            prompt: The prompt to send
            expected_schema: Expected JSON schema for validation
            model: Model to use
            max_retries: Maximum retry attempts for invalid JSON
            **kwargs: Additional arguments for completion

        Returns:
            Parsed JSON response
        """
        system_message = kwargs.get('system_message', '')
        if expected_schema:
            system_message += f"\n\nPlease respond with valid JSON following this schema: {json.dumps(expected_schema, indent=2)}"

        for attempt in range(max_retries + 1):
            try:
                response = await self.generate_completion(
                    prompt=prompt,
                    model=model,
                    response_format="json",
                    system_message=system_message,
                    **{k: v for k, v in kwargs.items() if k != 'system_message'}
                )

                # Parse JSON response
                parsed_response = json.loads(response)

                # Basic schema validation if provided
                if expected_schema:
                    self._validate_json_schema(parsed_response, expected_schema)

                return parsed_response

            except (json.JSONDecodeError, ValueError) as e:
                if attempt < max_retries:
                    logger.warning(
                        f"JSON parsing failed (attempt {attempt + 1}/{max_retries + 1}): {e}"
                    )
                    continue
                else:
                    logger.error(f"JSON parsing failed after {max_retries + 1} attempts: {e}")
                    raise ValueError(f"Failed to generate valid JSON response: {e}")

    def _validate_json_schema(self, data: Dict[str, Any], schema: Dict[str, Any]) -> None:
        """Basic JSON schema validation."""
        required_fields = schema.get('required', [])
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")

    async def generate_with_retry(
        self,
        prompt: str,
        max_retries: int = 3,
        backoff_factor: float = 1.0,
        **kwargs
    ) -> str:
        """
        Generate completion with exponential backoff retry logic.

        Args:
            prompt: The prompt to send
            max_retries: Maximum retry attempts
            backoff_factor: Backoff factor for delays
            **kwargs: Additional arguments for completion

        Returns:
            Generated completion
        """
        last_exception = None

        for attempt in range(max_retries + 1):
            try:
                return await self.generate_completion(prompt, **kwargs)

            except Exception as e:
                last_exception = e

                if attempt < max_retries:
                    delay = backoff_factor * (2 ** attempt)
                    logger.warning(
                        f"LLM request failed (attempt {attempt + 1}/{max_retries + 1}): {e}. "
                        f"Retrying in {delay:.1f} seconds..."
                    )
                    await asyncio.sleep(delay)
                else:
                    logger.error(f"LLM request failed after {max_retries + 1} attempts")

        raise last_exception or Exception("Unknown error in LLM generation")

    async def batch_generate(
        self,
        prompts: List[str],
        concurrent_limit: int = 5,
        **kwargs
    ) -> List[str]:
        """
        Generate completions for multiple prompts concurrently.

        Args:
            prompts: List of prompts to process
            concurrent_limit: Maximum concurrent requests
            **kwargs: Additional arguments for completion

        Returns:
            List of generated completions
        """
        semaphore = asyncio.Semaphore(concurrent_limit)

        async def generate_single(prompt: str) -> str:
            async with semaphore:
                return await self.generate_completion(prompt, **kwargs)

        tasks = [generate_single(prompt) for prompt in prompts]
        return await asyncio.gather(*tasks, return_exceptions=False)

    async def health_check(self) -> Dict[str, Any]:
        """
        Check the health of LLM providers.

        Returns:
            Health status information
        """
        health_status = {
            "timestamp": datetime.utcnow().isoformat(),
            "providers": {}
        }

        # Check OpenAI
        try:
            test_response = await self.generate_completion(
                prompt="Say 'OK' if you can hear me.",
                max_tokens=10,
                temperature=0
            )
            health_status["providers"]["openai"] = {
                "status": "healthy" if "OK" in test_response.upper() else "degraded",
                "response": test_response
            }
        except Exception as e:
            health_status["providers"]["openai"] = {
                "status": "unhealthy",
                "error": str(e)
            }

        # Check Anthropic if available
        if self.anthropic_client:
            try:
                test_response = await self.generate_completion(
                    prompt="Say 'OK' if you can hear me.",
                    max_tokens=10,
                    temperature=0,
                    provider="anthropic"
                )
                health_status["providers"]["anthropic"] = {
                    "status": "healthy" if "OK" in test_response.upper() else "degraded",
                    "response": test_response
                }
            except Exception as e:
                health_status["providers"]["anthropic"] = {
                    "status": "unhealthy",
                    "error": str(e)
                }

        return health_status


# Global LLM client instance
llm_client = LLMClient()