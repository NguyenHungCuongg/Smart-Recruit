import numpy as np
from typing import List
from datetime import datetime
import logging

from ml_service.models.model_loader import ModelLoader
from ml_service.schemas.request import FeatureVector
from ml_service.schemas.response import PredictionResult, PredictionResponse

logger = logging.getLogger(__name__)

class Predictor:    
    def __init__(self):
        self.model_loader = ModelLoader()
        logger.info("Predictor initialized")
    
    def _feature_vector_to_array(self, feature: FeatureVector) -> np.ndarray:
        feature_array = np.array([
            feature.skill_jaccard,           
            feature.skill_coverage,         
            feature.skill_precision,         
            feature.skill_overlap_count,     
            feature.job_skills_count,        
            feature.cv_skills_count,         
            feature.experience_gap,          
            feature.experience_ratio,       
            feature.experience_match,       
            feature.job_experience_required, 
            feature.cv_experience_years,    
            feature.education_gap,           
            feature.education_match,        
            feature.job_education_level,     
            feature.cv_education_level,      
            feature.seniority_match_score    
        ], dtype=np.float32)
        
        return feature_array
    
    # Dự đoán 1 chuỗi các CVs (1 chuỗi các feature vectors)
    def predict_batch(self, features: List[FeatureVector]) -> PredictionResponse:
        try:
            model = self.model_loader.get_model()
            metadata = self.model_loader.get_metadata()
            
            logger.info(f"Starting prediction for {len(features)} samples")
          
            feature_arrays = [self._feature_vector_to_array(f) for f in features]
            X = np.vstack(feature_arrays) 
            
            logger.debug(f"Input shape: {X.shape}")
            
            # Tiến hành dự đoán
            predictions = model.predict(X)  # XGBoost trả về mảng numpy
            predictions = np.clip(predictions, 0, 100)  # Đảm bảo score trong [0, 100]
            
            # Lúc này Convert ngược lại từ mảng numpy thành các đối tượng PredictionResult
            results = [
                PredictionResult(
                    score=float(score),
                    confidence=None  
                )
                for score in predictions
            ]
            
            logger.info(f"Prediction completed: {len(results)} results")
            
            return PredictionResponse(
                predictions=results,
                model_version=metadata.get("version", "unknown"),
                timestamp=datetime.utcnow(),
                count=len(results)
            )
            
        except RuntimeError as e:
            logger.error(f"Model not loaded: {e}")
            raise
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise RuntimeError(f"Prediction error: {e}")
    
    # Dự đoán chỉ 1 CV
    def predict_single(self, feature: FeatureVector) -> PredictionResult:
        response = self.predict_batch([feature])
        return response.predictions[0]
