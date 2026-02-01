package com.smartrecruit.backend.dto.candidate;

import com.smartrecruit.backend.domain.cv.CVFeatures;
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
public class CVResponse {

    private UUID id;
    private UUID candidateId;
    private String candidateName;
    private String filePath;
    private String extractedText;
    private CVFeatures features;
    private LocalDateTime uploadedAt;
}
