package com.smartrecruit.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class MLServiceConfig {

    @Bean(name = "mlServiceRestTemplate")
    public RestTemplate mlServiceRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        
        // Connection timeout (Thời gian tạo connection): 5 giây
        factory.setConnectTimeout(5000);

        // Read timeout (Thời gian đợi ML service trả về Prediction Response): 30 giây
        factory.setReadTimeout(30000);
        
        return new RestTemplate(factory);
    }
}
