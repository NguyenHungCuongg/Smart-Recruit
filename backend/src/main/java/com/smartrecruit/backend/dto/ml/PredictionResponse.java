package com.smartrecruit.backend.dto.ml;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {
    private List<PredictionResult> predictions;
    
    @JsonProperty("model_version")
    private String modelVersion;
    
    private String timestamp;
    
    private Integer count;
}
