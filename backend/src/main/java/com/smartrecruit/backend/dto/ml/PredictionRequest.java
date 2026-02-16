package com.smartrecruit.backend.dto.ml;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequest {
    private List<FeatureVector> features;

    // Constructor cho phép tạo PredictionRequest từ một FeatureVector duy nhất
    public PredictionRequest(FeatureVector feature) {
        this.features = List.of(feature);
    }   
}

