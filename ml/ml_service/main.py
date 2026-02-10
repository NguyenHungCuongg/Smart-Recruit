from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from ml_service.config import settings
from ml_service.api import health
from ml_service.models.model_loader import ModelLoader

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khi start: Load model khi service khởi động
    logger.info("Starting up ML Service...")
    
    try:
        model_loader = ModelLoader()
        model, metadata = model_loader.load(
            model_path=settings.MODEL_PATH,
            metadata_path=settings.METADATA_PATH
        )
        
        logger.info("Model loaded successfully!")
        logger.info(f"Model type: {metadata.get('model_type', 'unknown')}")
        logger.info(f"Model version: {metadata.get('version', 'unknown')}")
        logger.info(f"Features count: {metadata.get('n_features', 'unknown')}")
        
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise RuntimeError(f"Cannot start service without model: {e}")
    
    yield  # Điểm phân chia - code trước yield chạy khi start, sau yield chạy khi shutdown
    
    # Khi shutdown: Cleanup khi service tắt
    logger.info("Shutting down ML Service...")

app = FastAPI(
    title = settings.APP_NAME,
    version= settings.VERSION,
    docs_url=f"{settings.API_PREFIX}/docs", # Cập nhật endpoint docs (API này đã có sẵn ở FastAPI, chỉ cần endpoint đúng)
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    lifespan=lifespan  # Đăng ký lifespan handler
)

# CORS middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.ALLOWED_ORIGINS,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Thêm các router
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["Health"])

@app.get("/")
async def root():
  return {
    "service": settings.APP_NAME,
    "version": settings.VERSION,
    "status": "running", 
    "docs": f"{settings.API_PREFIX}/docs"
  }

# Chạy server với Uvicorn
if __name__ == "__main__":
  import uvicorn
  uvicorn.run(
    "ml_service.main:app",
    host=settings.HOST,
    port=settings.PORT,
    reload=settings.RELOAD
  )