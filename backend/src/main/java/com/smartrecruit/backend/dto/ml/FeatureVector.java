package com.smartrecruit.backend.dto.ml;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class FeatureVector {
    @JsonProperty("skill_jaccard")
    private Double skillJaccard;
    
    @JsonProperty("skill_coverage")
    private Double skillCoverage;
    
    @JsonProperty("skill_precision")
    private Double skillPrecision;
    
    @JsonProperty("skill_overlap_count")
    private Integer skillOverlapCount;
    
    @JsonProperty("job_skills_count")
    private Integer jobSkillsCount;
    
    @JsonProperty("cv_skills_count")
    private Integer cvSkillsCount;
    
    @JsonProperty("experience_gap")
    private Double experienceGap;
    
    @JsonProperty("experience_ratio")
    private Double experienceRatio;
    
    @JsonProperty("experience_match")
    private Integer experienceMatch;
    
    @JsonProperty("job_experience_required")
    private Double jobExperienceRequired;
    
    @JsonProperty("cv_experience_years")
    private Double cvExperienceYears;
    
    @JsonProperty("education_gap")
    private Integer educationGap;
    
    @JsonProperty("education_match")
    private Integer educationMatch;
    
    @JsonProperty("job_education_level")
    private Integer jobEducationLevel;
    
    @JsonProperty("cv_education_level")
    private Integer cvEducationLevel;
    
    @JsonProperty("seniority_match_score")
    private Integer seniorityMatchScore;
}

