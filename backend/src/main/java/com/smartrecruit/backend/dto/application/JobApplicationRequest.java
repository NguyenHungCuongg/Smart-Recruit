package com.smartrecruit.backend.dto.application;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationRequest {
    
    @NotNull(message = "Job ID is required")
    private UUID jobId;
    
    @NotNull(message = "CV ID is required")
    private UUID cvId;
}
