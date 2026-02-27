package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.evaluation.EvaluationRequest;
import com.smartrecruit.backend.dto.evaluation.EvaluationResponse;
import com.smartrecruit.backend.service.EvaluationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
@Slf4j
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping("/jobs/{jobId}/evaluate")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<EvaluationResponse> evaluateJob(
            @PathVariable UUID jobId,
            @Valid @RequestBody EvaluationRequest request
    ) {
        log.info("Received evaluation request for job: {}", jobId);
        
        // Đảm bảo jobId trong path và trong body request khớp nhau bằng cách override jobId trong request bằng jobId từ path
        request.setJobId(jobId);

        EvaluationResponse response = evaluationService.evaluateCandidatesForJob(jobId, request);
        log.info("Evaluation completed for job: {}. Total: {}, Success: {}, Failed: {}",
                jobId,
                response.getTotalEvaluated(),
                response.getSuccessCount(),
                response.getFailureCount());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/jobs/{jobId}/history")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<EvaluationResponse>> getEvaluationHistory(
            @PathVariable UUID jobId
    ) {
        log.info("Fetching evaluation history for job: {}", jobId);

        List<EvaluationResponse> history = evaluationService.getEvaluationHistory(jobId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/jobs/{jobId}/latest")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<EvaluationResponse> getLatestEvaluation(
            @PathVariable UUID jobId
    ) {
        log.info("Fetching latest evaluation for job: {}", jobId);

        EvaluationResponse response = evaluationService.getLatestEvaluation(jobId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/jobs/{jobId}/re-evaluate")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<EvaluationResponse> reEvaluateJob(
            @PathVariable UUID jobId
    ) {
        log.info("Re-evaluating all candidates for job: {}", jobId);
        
        EvaluationRequest request = EvaluationRequest.builder()
                .jobId(jobId)
                .forceReEvaluation(true)
                .build();

        EvaluationResponse response = evaluationService.evaluateCandidatesForJob(jobId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{evaluationId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<EvaluationResponse> getEvaluationById(
            @PathVariable UUID evaluationId
    ) {
        log.info("Fetching evaluation: {}", evaluationId);

        EvaluationResponse response = evaluationService.getEvaluationById(evaluationId);
        return ResponseEntity.ok(response);
    }
}
