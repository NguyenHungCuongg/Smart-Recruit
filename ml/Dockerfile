# Stage 1: Build môi trường Python với các dependencies cần thiết để chạy ứng dụng
FROM python:3.11-slim AS builder

WORKDIR /app

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install các build-essential cần thiết chứa các compiler như gcc,g++ để các package như numpy, scipy sau này có thể được cài đặt thành công
RUN apt-get update && apt-get install -y \ 
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Tạo virtual environment và cài đặt dependencies
RUN python -m venv $VIRTUAL_ENV

# Copy và install Python dependencies được liệt kê trong requirements-ml-service.txt
COPY requirements-ml-service.txt .

# Cài đặt dependencies vào virtual environment
RUN pip install --no-cache-dir -r requirements-ml-service.txt

# Stage 2: Runtime stage - tạo image nhẹ chỉ chứa runtime
FROM python:3.11-slim

WORKDIR /app

# Cài đặt curl để health check
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy các dependencies đã được cài đặt từ builder stage (stage 1 ở trên) vào runtime image
COPY --from=builder /opt/venv /opt/venv

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

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