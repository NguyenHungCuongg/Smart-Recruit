package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.admin.AdminAnalyticsResponse;
import com.smartrecruit.backend.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@Slf4j
public class AdminAnalyticsController {

    private final AdminAnalyticsService adminAnalyticsService;

    @GetMapping
    public ResponseEntity<?> getAnalytics() {
        try {
            return ResponseEntity.ok(adminAnalyticsService.getAnalytics());
        } catch (RuntimeException e) {
            log.error("Failed to fetch admin analytics", e);
            Map<String, Object> error = new HashMap<>();
            error.put("error", "ANALYTICS_FETCH_FAILED");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
