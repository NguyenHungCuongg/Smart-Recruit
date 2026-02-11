from pydantic import BaseModel, Field, field_validator
from typing import List

class FeatureVector(BaseModel):
    # Skill-based features (6 features)
    skill_jaccard: float = Field(..., ge=0.0, le=1.0, description="Jaccard similarity of skills")
    skill_coverage: float = Field(..., ge=0.0, le=1.0, description="% of job skills covered by CV")
    skill_precision: float = Field(..., ge=0.0, le=1.0, description="Precision of skill match")
    skill_overlap_count: int = Field(..., ge=0, description="Number of overlapping skills")
    job_skills_count: int = Field(..., ge=0, description="Number of skills required in JD")
    cv_skills_count: int = Field(..., ge=0, description="Number of skills in CV")
    
    # Experience features (5 features)
    experience_gap: float = Field(..., description="Years gap: CV exp - JD required exp (can be negative)")
    experience_ratio: float = Field(..., ge=0.0, description="Ratio: CV exp / JD exp")
    experience_match: int = Field(..., ge=0, le=1, description="1 if experience requirement met, 0 otherwise")
    job_experience_required: float = Field(..., ge=0.0, description="Minimum experience required by JD (years)")
    cv_experience_years: float = Field(..., ge=0.0, description="Total years of experience in CV")
    
    # Education features (4 features)
    education_gap: int = Field(..., description="Education level gap: CV - JD (can be negative)")
    education_match: int = Field(..., ge=0, le=1, description="1 if education matches or exceeds, 0 otherwise")
    job_education_level: int = Field(..., ge=0, le=4, description="JD education level (0=HS, 4=PhD)")
    cv_education_level: int = Field(..., ge=0, le=4, description="CV education level (0=HS, 4=PhD)")
    
    # Seniority feature (1 feature)
    seniority_match_score: float = Field(..., ge=0.0, le=1.0, description="Seniority match score (0-1)")

    @field_validator('*')
    @classmethod
    def check_not_nan(cls, v):
        if isinstance(v, float) and (v != v):  # NaN check (NaN là giá trị duy nhất không bằng chính nó)
            raise ValueError("NaN values are not allowed")
        return v

class PredictionRequest(BaseModel):
   features: List[FeatureVector] = Field(...,min_length=1, max_length=1000)