from fastapi import APIRouter, HTTPException, status
import logging

from ml_service.schemas.request import PredictionRequest
from ml_service.schemas.response import PredictionResponse
from ml_service.core.predictor import Predictor

logger = logging.getLogger(__name__)

router = APIRouter()

predictor = Predictor()

@router.post("/predict", response_model=PredictionResponse)
async def predict(
    request: PredictionRequest
) -> PredictionResponse:
    try:
        logger.info(f"Received prediction request with {len(request.features)} samples")
        
        response = predictor.predict_batch(request.features)
        
        logger.info(f"Prediction successful: returned {response.count} results")
        return response
        
    except RuntimeError as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error during prediction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during prediction"
        )
