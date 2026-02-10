import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):

  # Service info
  APP_NAME: str = "Smart Recruit ML Service"
  VERSION: str = "1.0.0"
  API_PREFIX: str = "/api/v1"

  # Các path dẫn đến file model và metadata
  MODEL_PATH: Path = Path(__file__).parent.parent /"models"/ "baseline_model_xgboost.joblib"
  METADATA_PATH: Path = Path(__file__).parent.parent /"models"/ "baseline_model_metadata.json"

  # Server config
  HOST: str = "0.0.0.0"
  PORT: int = 8000
  RELOAD: bool = False


  # CORS
  ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:8080"]

settings = Settings()