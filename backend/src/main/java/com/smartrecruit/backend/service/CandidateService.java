package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.candidate.CandidateRequest;
import com.smartrecruit.backend.dto.candidate.CandidateResponse;
import com.smartrecruit.backend.dto.candidate.CVSummaryResponse;
import com.smartrecruit.backend.entity.Candidate;
import com.smartrecruit.backend.entity.CV;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.CandidateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public List<CandidateResponse> findAll(User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        return candidateRepository.findAll().stream()
                .map(this::toResponseWithoutCvs)
                .collect(Collectors.toList());
    }

    public CandidateResponse getById(UUID candidateId, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        Candidate candidate = candidateRepository.findByIdWithCvs(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found: " + candidateId));
        return toResponseWithCvs(candidate);
    }

    @Transactional
    public CandidateResponse create(CandidateRequest request, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        Candidate candidate = Candidate.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        candidate = candidateRepository.save(candidate);
        return toResponseWithoutCvs(candidate);
    }

    @Transactional
    public CandidateResponse update(UUID candidateId, CandidateRequest request, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found: " + candidateId));
        if (request.getFullName() != null) candidate.setFullName(request.getFullName());
        if (request.getEmail() != null) candidate.setEmail(request.getEmail());
        if (request.getPhone() != null) candidate.setPhone(request.getPhone());
        candidate = candidateRepository.save(candidate);
        return toResponseWithoutCvs(candidate);
    }

    @Transactional
    public void delete(UUID candidateId, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        if (!candidateRepository.existsById(candidateId)) {
            throw new IllegalArgumentException("Candidate not found: " + candidateId);
        }
        candidateRepository.deleteById(candidateId);
    }

    private void ensureRecruiterOrAdmin(User user) {
        if (user.getRole() != RoleType.RECRUITER && user.getRole() != RoleType.ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Only RECRUITER or ADMIN can manage candidates");
        }
    }

    private CandidateResponse toResponseWithoutCvs(Candidate c) {
        return CandidateResponse.builder()
                .id(c.getId())
                .fullName(c.getFullName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .createdAt(c.getCreatedAt())
                .cvs(null)
                .build();
    }

    private CandidateResponse toResponseWithCvs(Candidate c) {
        List<CVSummaryResponse> cvs = c.getCvList().stream()
                .map(cv -> CVSummaryResponse.builder()
                        .id(cv.getId())
                        .filePath(cv.getFilePath())
                        .uploadedAt(cv.getUploadedAt())
                        .hasFeatures(cv.getFeatures() != null)
                        .build())
                .collect(Collectors.toList());
        return CandidateResponse.builder()
                .id(c.getId())
                .fullName(c.getFullName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .createdAt(c.getCreatedAt())
                .cvs(cvs)
                .build();
    }
}
