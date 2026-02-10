from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ml_service.config import settings
from ml_service.api import health

app = FastAPI(
  title = settings.APP_NAME,
  version= settings.VERSION,
  docs_url=f"{settings.API_PREFIX}/docs",
  redoc_url=f"{settings.API_PREFIX}/redoc",
  openapi_url=f"{settings.API_PREFIX}/openapi.json"
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