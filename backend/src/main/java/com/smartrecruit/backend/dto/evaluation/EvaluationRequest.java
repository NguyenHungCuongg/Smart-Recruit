package com.smartrecruit.backend.dto.evaluation;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRequest {
    @NotNull
    private UUID jobId;

    private List<UUID> candidateIds;

    // Thuộc tính cho phép đánh giá lại (force re-evaluation)
    // Nếu true, sẽ bỏ qua cache và đánh giá lại tất cả CV, kể cả những CV đã từng được đánh giá trước đó
    @Builder.Default
    private Boolean forceReEvaluation = false;
}
