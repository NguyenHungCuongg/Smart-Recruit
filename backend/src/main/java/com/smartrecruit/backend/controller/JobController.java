package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.job.JobCreateMultipartRequest;
import com.smartrecruit.backend.dto.job.JobResponse;
import com.smartrecruit.backend.dto.job.JobUpdateRequest;
import com.smartrecruit.backend.enums.JobStatus;
import com.smartrecruit.backend.security.SecurityUtils;
import com.smartrecruit.backend.service.JobService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final JobService jobService;
    private final SecurityUtils securityUtils;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<JobResponse> create(
        @RequestParam(value = "title", required = false) String title,
        @RequestParam(value = "department", required = false) String department,
        @RequestParam(value = "location", required = false) String location,
        @RequestParam(value = "status", required = false) String statusStr,
        @RequestParam(value = "jdFile", required = false) MultipartFile jdFile
    ) {
        log.info("Received job creation request - title: {}, department: {}, location: {}, status: {}, file: {}", 
                 title, department, location, statusStr, jdFile != null ? jdFile.getOriginalFilename() : "null");
        
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (department == null || department.isBlank()) {
            throw new IllegalArgumentException("Department is required");
        }
        if (location == null || location.isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }
        if (statusStr == null) {
            throw new IllegalArgumentException("Status is required");
        }
        
        JobStatus status;
        try {
            status = JobStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + statusStr);
        }
        
        JobCreateMultipartRequest dto = JobCreateMultipartRequest.builder()
                .title(title)
                .department(department)
                .location(location)
                .status(status)
                .jdFile(jdFile)
                .build();
        
        JobResponse created = jobService.createWithFile(dto, securityUtils.getCurrentUser());
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
