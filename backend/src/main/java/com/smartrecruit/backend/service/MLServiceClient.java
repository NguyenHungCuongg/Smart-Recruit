package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.ml.PredictionRequest;
import com.smartrecruit.backend.dto.ml.PredictionResponse;
import com.smartrecruit.backend.exception.MLServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class MLServiceClient {
    
    private final RestTemplate restTemplate;
    
    @Value("${ml.service.url}")
    private String mlServiceUrl;
    
    public MLServiceClient(@Qualifier("mlServiceRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResponse predict(PredictionRequest request) {
        String url = mlServiceUrl + "/predict";
        
        log.info("Sending prediction request to ML Service: {} features", 
                 request.getFeatures() != null ? request.getFeatures().size() : 0);
        
        long startTime = System.currentTimeMillis();
        
        try {
            // Chuẩn bị headers và body cho request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<PredictionRequest> entity = new HttpEntity<>(request, headers);
            
            // Gọi ML Service
            ResponseEntity<PredictionResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                PredictionResponse.class
            );
            
            long duration = System.currentTimeMillis() - startTime;
            PredictionResponse body = response.getBody();
            log.info("ML prediction successful. Duration: {}ms, Predictions: {}, Model: {}", 
                     duration, 
                     body != null ? body.getCount() : 0,
                     body != null ? body.getModelVersion() : "N/A");
            
            return body;
            
        } catch (HttpClientErrorException e) {
            // Các lỗi 4xx (lỗi Client)
            log.error("ML Service client error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new MLServiceException(
                "Invalid request to ML Service",
                "ML_CLIENT_ERROR",
                e
            );
            
        } catch (HttpServerErrorException e) {
            // Các lỗi 5xx (lỗi Server)
            log.error("ML Service server error ({}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new MLServiceException(
                "ML Service internal error",
                "ML_SERVER_ERROR",
                e
            );
            
        } catch (ResourceAccessException e) {
            // Lỗi dịch vụ ML
            log.error("Cannot connect to ML Service at {}: {}", url, e.getMessage());
            throw new MLServiceException(
                "ML Service unavailable. Please ensure ML service is running.",
                "ML_SERVICE_UNAVAILABLE",
                e
            );
            
        } catch (Exception e) {
            // Các lỗi khác
            log.error("Unexpected error calling ML Service: ", e);
            throw new MLServiceException(
                "Unexpected error communicating with ML Service: " + e.getMessage(),
                "ML_UNEXPECTED_ERROR",
                e
            );
        }
    }

    public boolean isHealthy() {
        String url = mlServiceUrl + "/health";
        
        try {
            log.debug("Checking ML Service health at {}", url);
            
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> health = response.getBody();
                
                String status = (String) health.get("status");
                Boolean modelLoaded = (Boolean) health.get("model_loaded");
                
                boolean isHealthy = "healthy".equalsIgnoreCase(status) && 
                                   Boolean.TRUE.equals(modelLoaded);
                
                log.info("ML Service health check: status={}, model_loaded={}, healthy={}", 
                         status, modelLoaded, isHealthy);
                
                return isHealthy;
            }
            
            return false;
            
        } catch (Exception e) {
            log.warn("ML Service health check failed: {}", e.getMessage());
            return false;
        }
    }

    public String getServiceUrl() {
        return mlServiceUrl;
    }
}
