package com.smartrecruit.backend.dto.ml;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {

    private List<PredictionResult> predictions;

    @JsonProperty("model_version")
    private String modelVersion;

    private LocalDateTime timestamp;

    private Integer count;

    // Helper method để lấy kết quả dự đoán đầu tiên
    public PredictionResult getFirstPrediction() {
        if (predictions == null || predictions.isEmpty()) {
            return null;
        }
        return predictions.get(0);
    }
}
