package com.smartrecruit.backend.dto.job;

import com.smartrecruit.backend.domain.job.JobRequirements;
import com.smartrecruit.backend.enums.JobStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobUpdateRequest {

    @Size(max = 255)
    private String title;

    private String description;

    @Valid
    private JobRequirements requirements;

    private JobStatus status;
}
