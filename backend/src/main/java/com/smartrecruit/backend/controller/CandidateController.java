package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.candidate.CandidateRequest;
import com.smartrecruit.backend.dto.candidate.CandidateResponse;
import com.smartrecruit.backend.dto.candidate.CVResponse;
import com.smartrecruit.backend.dto.candidate.CVSummaryResponse;
import com.smartrecruit.backend.security.SecurityUtils;
import com.smartrecruit.backend.service.CandidateService;
import com.smartrecruit.backend.service.CVService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;
    private final CVService cvService;
    private final SecurityUtils securityUtils;

    @PostMapping
    public ResponseEntity<CandidateResponse> create(@Valid @RequestBody CandidateRequest request) {
        CandidateResponse created = candidateService.create(request, securityUtils.getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<CandidateResponse>> list() {
        return ResponseEntity.ok(candidateService.findAll(securityUtils.getCurrentUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(candidateService.getById(id, securityUtils.getCurrentUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.ok(candidateService.update(id, request, securityUtils.getCurrentUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        candidateService.delete(id, securityUtils.getCurrentUser());
        return ResponseEntity.noContent().build();
    }


    @PostMapping(value = "/{candidateId}/cvs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CVResponse> uploadCV(
            @PathVariable UUID candidateId,
            @RequestParam("file") MultipartFile file) {
        CVResponse created = cvService.upload(candidateId, file, securityUtils.getCurrentUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{candidateId}/cvs")
    public ResponseEntity<List<CVSummaryResponse>> listCVs(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(cvService.listByCandidateId(candidateId, securityUtils.getCurrentUser()));
    }

    @GetMapping("/{candidateId}/cvs/{cvId}")
    public ResponseEntity<CVResponse> getCV(
            @PathVariable UUID candidateId,
            @PathVariable UUID cvId) {
        return ResponseEntity.ok(cvService.getById(cvId, securityUtils.getCurrentUser()));
    }

    @DeleteMapping("/{candidateId}/cvs/{cvId}")
    public ResponseEntity<Void> deleteCV(
            @PathVariable UUID candidateId,
            @PathVariable UUID cvId) {
        cvService.delete(cvId, securityUtils.getCurrentUser());
        return ResponseEntity.noContent().build();
    }
}
