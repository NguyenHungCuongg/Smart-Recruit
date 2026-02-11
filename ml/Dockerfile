FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements-ml-service.txt .
RUN pip install --no-cache-dir --user -r requirements-ml-service.txt

FROM python:3.11-slim

WORKDIR /app

# Install only runtime dependencies (curl for health check)
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder stage
COPY --from=builder /root/.local /root/.local

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

# Create non-root user for security
RUN useradd -m -u 1000 mlservice && \
    chown -R mlservice:mlservice /app

# Copy application code
COPY --chown=mlservice:mlservice ml_service ./ml_service/
COPY --chown=mlservice:mlservice models/ ./models/

# Switch to non-root user
USER mlservice

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Environment variables 
ENV MODEL_PATH=/app/models/baseline_model_xgboost.joblib
ENV METADATA_PATH=/app/models/baseline_model_metadata.json
ENV HOST=0.0.0.0
ENV PORT=8000

# Run application with production settings
CMD ["uvicorn", "ml_service.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "4", \
     "--log-level", "info", \
     "--access-log"]