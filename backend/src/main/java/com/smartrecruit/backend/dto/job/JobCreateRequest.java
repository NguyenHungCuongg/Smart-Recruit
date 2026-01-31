package com.smartrecruit.backend.dto.job;

import com.smartrecruit.backend.domain.job.JobRequirements;
import com.smartrecruit.backend.enums.JobStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCreateRequest {

    @NotBlank
    @Size(max = 255)
    private String title;

    @NotBlank
    private String description;

    @Valid
    private JobRequirements requirements;

    @NotNull
    private JobStatus status;
}
