"""Main FastAPI application for LightUp AI service."""

import logging
import time
from contextlib import asynccontextmanager
from typing import Dict, Any

import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from src.config.settings import settings
from src.api import assessment, study_plan, roadmap
from src.utils.logging_config import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    setup_logging()
    logger = logging.getLogger(__name__)
    logger.info("🚀 LightUp AI Service starting up...")

    # Initialize services here if needed
    yield

    # Shutdown
    logger.info("🛑 LightUp AI Service shutting down...")


app = FastAPI(
    title="LightUp AI Service",
    description="AI-powered learning platform backend service",
    version="1.0.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.is_development else [settings.node_backend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for security
if settings.is_production:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "0.0.0.0"]
    )

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing information."""
    start_time = time.time()

    # Generate request ID
    request_id = f"req_{int(start_time * 1000000)}"

    # Log request start
    logger = logging.getLogger(__name__)
    logger.info(
        f"Request started",
        extra={
            "request_id": request_id,
            "method": request.method,
            "url": str(request.url),
            "client_ip": request.client.host if request.client else None
        }
    )

    # Process request
    try:
        response = await call_next(request)
        process_time = time.time() - start_time

        # Log request completion
        logger.info(
            f"Request completed",
            extra={
                "request_id": request_id,
                "status_code": response.status_code,
                "process_time": f"{process_time:.4f}s"
            }
        )

        # Add custom headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{process_time:.4f}"

        return response

    except Exception as e:
        process_time = time.time() - start_time
        logger.error(
            f"Request failed",
            extra={
                "request_id": request_id,
                "error": str(e),
                "process_time": f"{process_time:.4f}s"
            }
        )
        raise


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    logger = logging.getLogger(__name__)
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": "HTTP_ERROR",
                    "message": exc.detail,
                    "status_code": exc.status_code
                }
            }
        )

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An internal server error occurred",
                "type": type(exc).__name__
            }
        }
    )


# Health check endpoint
@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "lightup-ai-service",
        "version": "1.0.0",
        "timestamp": time.time(),
        "environment": settings.environment
    }


# Include API routers
app.include_router(assessment.router, prefix="/ai", tags=["Assessment"])
app.include_router(study_plan.router, prefix="/ai", tags=["Study Plan"])
app.include_router(roadmap.router, prefix="/ai", tags=["Roadmap"])


if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host=settings.ai_service_host,
        port=settings.ai_service_port,
        reload=settings.is_development,
        log_level=settings.log_level.lower(),
        access_log=True
    )