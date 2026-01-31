package com.smartrecruit.backend.dto.job;

import com.smartrecruit.backend.domain.job.JobRequirements;
import com.smartrecruit.backend.enums.JobStatus;
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
public class JobResponse {

    private UUID id;
    private String title;
    private String description;
    private JobRequirements requirements;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID recruiterId;
    private String recruiterName;
}
