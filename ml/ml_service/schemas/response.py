from datetime import datetime 
from pydantic import BaseModel, Field
from typing import Optional, List

class PredictionResult(BaseModel):
    score: float = Field(..., ge=0.0, le=100.0, description="Predicted match score (0-100)")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0, description="Prediction confidence")

class PredictionResponse(BaseModel):
    predictions: List[PredictionResult]
    model_version: str
    timestamp: datetime
    count: int

class HealthCheckResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: str
    uptime_seconds: float