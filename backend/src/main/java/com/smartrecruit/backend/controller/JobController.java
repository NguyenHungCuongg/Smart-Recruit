package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.job.JobCreateRequest;
import com.smartrecruit.backend.dto.job.JobResponse;
import com.smartrecruit.backend.dto.job.JobUpdateRequest;
import com.smartrecruit.backend.security.SecurityUtils;
import com.smartrecruit.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final SecurityUtils securityUtils;

    @PostMapping
    public ResponseEntity<JobResponse> create(@Valid @RequestBody JobCreateRequest request) {
        JobResponse created = jobService.create(request, securityUtils.getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> list() {
        return ResponseEntity.ok(jobService.findAll(securityUtils.getCurrentUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(jobService.getById(id, securityUtils.getCurrentUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody JobUpdateRequest request) {
        return ResponseEntity.ok(jobService.update(id, request, securityUtils.getCurrentUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        jobService.delete(id, securityUtils.getCurrentUser());
        return ResponseEntity.noContent().build();
    }
}
