from pydantic import BaseModel, Field, field_validator
from typing import List

class FeatureVector(BaseModel):
    
  # Skill-based features
  skill_jaccard: float = Field(..., ge=0.0, le=1.0, description="Jaccard similarity of skills")
  skill_coverage: float = Field(..., ge=0.0, le=1.0, description="% of job skills covered by CV")
  skills_count: int = Field(..., ge=0, description="Number of skills in CV")
  
  # Experience features
  experience_gap: float = Field(..., description="Years gap: CV exp - JD required exp")
  experience_years: float = Field(..., ge=0.0, description="Total years of experience in CV")
  min_experience: float = Field(..., ge=0.0, description="Minimum experience required by JD")
  
  # Education features
  education_match: int = Field(..., ge=0, le=1, description="1 if education matches, 0 otherwise")
  education_level_cv: int = Field(..., ge=0, le=4, description="CV education level (0=HS, 4=PhD)")
  education_level_job: int = Field(..., ge=0, le=4, description="JD education level (0=HS, 4=PhD)")
  
  # Seniority features
  seniority_match: int = Field(..., ge=0, le=1, description="1 if seniority matches, 0 otherwise")
  seniority_level_cv: int = Field(..., ge=0, le=4, description="CV seniority level")
  seniority_level_job: int = Field(..., ge=0, le=4, description="JD seniority level")
  
  # Derived features
  experience_ratio: float = Field(..., ge=0.0, description="Ratio: CV exp / JD exp")
  overqualified: int = Field(..., ge=0, le=1, description="1 if overqualified, 0 otherwise")
  underqualified: int = Field(..., ge=0, le=1, description="1 if underqualified, 0 otherwise")
  
  # Overall fit
  text_similarity: float = Field(..., ge=0.0, le=1.0, description="Text similarity between JD and CV")
  overall_match_score: float = Field(..., ge=0.0, le=100.0, description="Pre-calculated match score")

  @field_validator('*')
  @classmethod
  def check_not_nan(cls, v):
      """Ensure no NaN values"""
      if isinstance(v, float) and (v != v):  # NaN check
          raise ValueError("NaN values are not allowed")
      return v

class PredictionRequest(BaseModel):
   features: List[FeatureVector] = Field(...,min_length=1, max_length=1000)