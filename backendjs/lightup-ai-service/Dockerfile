# Multi-stage Docker build for LightUp AI Service

# Base Python image
FROM python:3.11-slim as base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash --uid 1001 lightup

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Development stage
FROM base as development

# Install development dependencies
RUN pip install pytest pytest-asyncio pytest-mock httpx

# Copy source code
COPY . .

# Change ownership to non-root user
RUN chown -R lightup:lightup /app

# Switch to non-root user
USER lightup

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Command for development
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]

# Production stage
FROM base as production

# Copy only necessary files
COPY src/ ./src/
COPY pyproject.toml .

# Create logs directory
RUN mkdir -p logs

# Change ownership to non-root user
RUN chown -R lightup:lightup /app

# Switch to non-root user
USER lightup

# Expose port
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

# Command for production
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8001", "--workers", "4"]

# Testing stage
FROM development as testing

# Run tests
RUN python -m pytest tests/ -v

# The default stage
FROM production