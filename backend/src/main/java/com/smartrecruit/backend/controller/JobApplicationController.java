package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.application.JobApplicationRequest;
import com.smartrecruit.backend.dto.application.JobApplicationResponse;
import com.smartrecruit.backend.security.SecurityUtils;
import com.smartrecruit.backend.service.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/job-applications")
@RequiredArgsConstructor
@Slf4j
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobApplicationResponse> create(@Valid @RequestBody JobApplicationRequest request) {
        log.info("Creating job application for job: {} and CV: {}", request.getJobId(), request.getCvId());
        JobApplicationResponse created = jobApplicationService.create(request, securityUtils.getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<JobApplicationResponse>> getByJobId(@PathVariable UUID jobId) {
        log.info("Getting applications for job: {}", jobId);
        List<JobApplicationResponse> applications = jobApplicationService.getByJobId(jobId, securityUtils.getCurrentUser());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/candidate/{candidateId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<JobApplicationResponse>> getByCandidateId(@PathVariable UUID candidateId) {
        log.info("Getting applications for candidate: {}", candidateId);
        List<JobApplicationResponse> applications = jobApplicationService.getByCandidateId(candidateId, securityUtils.getCurrentUser());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobApplicationResponse> getById(@PathVariable UUID id) {
        log.info("Getting application: {}", id);
        JobApplicationResponse application = jobApplicationService.getById(id, securityUtils.getCurrentUser());
        return ResponseEntity.ok(application);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("Deleting application: {}", id);
        jobApplicationService.delete(id, securityUtils.getCurrentUser());
        return ResponseEntity.noContent().build();
    }
}
