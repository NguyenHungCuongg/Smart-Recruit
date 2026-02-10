from fastapi import APIRouter
from ml_service.schemas.response import HealthCheckResponse
import time

router = APIRouter()

# Track thời gian khởi động của service
_start_time = time.time()

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():  
  return HealthCheckResponse(
    status="healthy",
    model_loaded=False,
    model_version="not_loaded",
    uptime_seconds=time.time() - _start_time
  )