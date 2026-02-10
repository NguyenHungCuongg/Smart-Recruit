from fastapi import APIRouter
from ml_service.schemas.response import HealthCheckResponse
from ml_service.models.model_loader import ModelLoader
import time

router = APIRouter()

# Track thời gian khởi động của service
_start_time = time.time()

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    model_loader = ModelLoader()  # Singleton(1 class = 1 instance) - sẽ trả về instance đã tồn tại
    
    try:
        # Kiểm tra xem model đã được load chưa
        model = model_loader.get_model()
        metadata = model_loader.get_metadata()
        
        return HealthCheckResponse(
            status="healthy",
            model_loaded=True,
            model_version=metadata.get("version", "unknown"),
            uptime_seconds=time.time() - _start_time
        )
    except RuntimeError:
        # Model chưa được load
        return HealthCheckResponse(
            status="degraded",
            model_loaded=False,
            model_version="not_loaded",
            uptime_seconds=time.time() - _start_time
        )