package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.job.JobCreateRequest;
import com.smartrecruit.backend.dto.job.JobResponse;
import com.smartrecruit.backend.dto.job.JobUpdateRequest;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<JobResponse> create(
            @Valid @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal User currentUser) {
        JobResponse created = jobService.create(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> list(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(jobService.findAll(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(jobService.getById(id, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody JobUpdateRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(jobService.update(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        jobService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
