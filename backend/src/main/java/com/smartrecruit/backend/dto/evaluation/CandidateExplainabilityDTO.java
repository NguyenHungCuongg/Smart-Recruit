package com.smartrecruit.backend.dto.evaluation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateExplainabilityDTO {

    private Double skillsScore;
    private Double experienceScore;
    private Double educationScore;
    private Double seniorityScore;

    private Double overallFitScore;

    private String confidenceBand;

    private List<String> strengths;
    private List<String> gaps;

    private String summary;
}
