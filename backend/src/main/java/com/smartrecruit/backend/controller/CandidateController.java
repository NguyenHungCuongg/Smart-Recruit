package com.smartrecruit.backend.controller;

import com.smartrecruit.backend.dto.candidate.CandidateRequest;
import com.smartrecruit.backend.dto.candidate.CandidateResponse;
import com.smartrecruit.backend.dto.candidate.CVResponse;
import com.smartrecruit.backend.dto.candidate.CVSummaryResponse;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.service.CandidateService;
import com.smartrecruit.backend.service.CVService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PostMapping
    public ResponseEntity<CandidateResponse> create(
            @Valid @RequestBody CandidateRequest request,
            @AuthenticationPrincipal User currentUser) {
        CandidateResponse created = candidateService.create(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<CandidateResponse>> list(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(candidateService.findAll(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(candidateService.getById(id, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CandidateRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(candidateService.update(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal User currentUser) {
        candidateService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    // --- CV endpoints (nested under candidate) ---

    @PostMapping(value = "/{candidateId}/cvs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CVResponse> uploadCV(
            @PathVariable UUID candidateId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser) {
        CVResponse created = cvService.upload(candidateId, file, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{candidateId}/cvs")
    public ResponseEntity<List<CVSummaryResponse>> listCVs(
            @PathVariable UUID candidateId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(cvService.listByCandidateId(candidateId, currentUser));
    }

    @GetMapping("/{candidateId}/cvs/{cvId}")
    public ResponseEntity<CVResponse> getCV(
            @PathVariable UUID candidateId,
            @PathVariable UUID cvId,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(cvService.getById(cvId, currentUser));
    }

    @DeleteMapping("/{candidateId}/cvs/{cvId}")
    public ResponseEntity<Void> deleteCV(
            @PathVariable UUID candidateId,
            @PathVariable UUID cvId,
            @AuthenticationPrincipal User currentUser) {
        cvService.delete(cvId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
