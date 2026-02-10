import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):

  # Service info
  APP_NAME: str = "Smart Recruit ML Service"
  VERSION: str = "1.0.0"
  API_PREFIX: str = "/api/v1"

  # Các path dẫn đến file model và metadata (hỗ trợ cấu hình qua biến môi trường (env) Docker)
  MODEL_PATH: Path = Path(
    os.getenv("MODEL_PATH", str(Path(__file__).parent.parent / "models" / "baseline_model_xgboost.joblib"))
  )
  METADATA_PATH: Path = Path(
    os.getenv("METADATA_PATH", str(Path(__file__).parent.parent / "models" / "baseline_model_metadata.json"))
  )

  # Server config (hỗ trợ cấu hình qua biến môi trường (env) Docker)
  HOST: str = os.getenv("HOST", "0.0.0.0")
  PORT: int = int(os.getenv("PORT", "8000"))
  RELOAD: bool = os.getenv("RELOAD", "false").lower() == "true"


  # CORS
  ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:8080"]

settings = Settings()