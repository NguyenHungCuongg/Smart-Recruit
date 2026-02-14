package com.smartrecruit.backend.dto.evaluation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponse {

    private UUID evaluationId;
    private UUID jobId;
    private String jobTitle;

    private List<CandidateScoreDTO> candidates;

    private Integer totalEvaluated;

    private Integer successCount;

    private Integer failureCount;

    private LocalDateTime evaluatedAt;

    private String modelVersion;

    //Recruiter ID
    private UUID evaluatedBy;
}
