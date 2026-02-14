package com.smartrecruit.backend.dto.evaluation;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateScoreDTO {

    private UUID candidateId;
    private String candidateName;
    private String candidateEmail;
    private UUID cvId;

    private Double score;

    private Integer rank;

    private Double confidence;

    private String status;

    private String errorMessage;
}
