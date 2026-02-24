package com.smartrecruit.backend.dto.application;

import com.smartrecruit.backend.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {
    
    private UUID id;
    private UUID jobId;
    private UUID candidateId;
    private String candidateName;
    private String candidateEmail;
    private UUID cvId;
    private String cvFileName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    private Double score; // From latest evaluation if exists
}
