package com.smartrecruit.backend.dto.ml;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class PredictionRequest {

    private FeatureVector features;

    public PredictionRequest(FeatureVector features) {
        this.features = features;
    }
}

