package com.smartrecruit.backend.dto.candidate;

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
public class CVSummaryResponse {

    private UUID id;
    private String filePath;
    private LocalDateTime uploadedAt;
    private boolean hasFeatures;
}
