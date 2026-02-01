package com.smartrecruit.backend.service;

import com.smartrecruit.backend.domain.cv.CVFeatures;
import com.smartrecruit.backend.dto.candidate.CVResponse;
import com.smartrecruit.backend.dto.candidate.CVSummaryResponse;
import com.smartrecruit.backend.entity.Candidate;
import com.smartrecruit.backend.entity.CV;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.CandidateRepository;
import com.smartrecruit.backend.repository.CVRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CVService {

    private final CVRepository cvRepository;
    private final CandidateRepository candidateRepository;
    private final CVTextExtractor textExtractor;
    private final CVFeatureParser featureParser;

    @Value("${app.upload.cv-dir:./uploads/cvs}")
    private String uploadDir;

    @Transactional
    public CVResponse upload(UUID candidateId, MultipartFile file, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found: " + candidateId));

        String contentType = file.getContentType();
        if (!CVTextExtractor.isSupportedContentType(contentType)) {
            throw new IllegalArgumentException("Unsupported file type. Use PDF, DOC or DOCX.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = "cv";
        }
        String ext = getExtension(originalFilename);
        String storedFileName = UUID.randomUUID() + ext;
        Path candidateDir = Paths.get(uploadDir, candidateId.toString());
        Path targetFile = candidateDir.resolve(storedFileName);

        String relativePath = candidateId + "/" + storedFileName;
        String extractedText;
        try (InputStream is = file.getInputStream()) {
            extractedText = textExtractor.extractTextNormalized(is);
        } catch (IOException | TikaException e) {
            extractedText = "";
        }
        CVFeatures features = featureParser.parse(extractedText);

        try {
            Files.createDirectories(candidateDir);
            file.transferTo(targetFile.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }

        CV cv = CV.builder()
                .filePath(relativePath)
                .extractedText(extractedText)
                .features(features)
                .candidate(candidate)
                .build();
        cv = cvRepository.save(cv);
        candidate.addCV(cv);

        return toResponse(cv);
    }

    public List<CVSummaryResponse> listByCandidateId(UUID candidateId, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        if (!candidateRepository.existsById(candidateId)) {
            throw new IllegalArgumentException("Candidate not found: " + candidateId);
        }
        return cvRepository.findByCandidateId(candidateId).stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }

    public CVResponse getById(UUID cvId, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        CV cv = cvRepository.findByIdWithCandidate(cvId)
                .orElseThrow(() -> new IllegalArgumentException("CV not found: " + cvId));
        return toResponse(cv);
    }

    @Transactional
    public void delete(UUID cvId, User currentUser) {
        ensureRecruiterOrAdmin(currentUser);
        CV cv = cvRepository.findByIdWithCandidate(cvId)
                .orElseThrow(() -> new IllegalArgumentException("CV not found: " + cvId));
        Path fullPath = Paths.get(uploadDir, cv.getFilePath());
        try {
            if (Files.exists(fullPath)) {
                Files.delete(fullPath);
            }
        } catch (IOException ignored) {
        }
        cv.getCandidate().removeCV(cv);
        cvRepository.delete(cv);
    }

    private void ensureRecruiterOrAdmin(User user) {
        if (user.getRole() != RoleType.RECRUITER && user.getRole() != RoleType.ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Only RECRUITER or ADMIN can manage CVs");
        }
    }

    private String getExtension(String filename) {
        int i = filename.lastIndexOf('.');
        if (i <= 0) return "";
        return filename.substring(i).toLowerCase();
    }

    private CVResponse toResponse(CV cv) {
        return CVResponse.builder()
                .id(cv.getId())
                .candidateId(cv.getCandidate().getId())
                .candidateName(cv.getCandidate().getFullName())
                .filePath(cv.getFilePath())
                .extractedText(cv.getExtractedText())
                .features(cv.getFeatures())
                .uploadedAt(cv.getUploadedAt())
                .build();
    }

    private CVSummaryResponse toSummaryResponse(CV cv) {
        return CVSummaryResponse.builder()
                .id(cv.getId())
                .filePath(cv.getFilePath())
                .uploadedAt(cv.getUploadedAt())
                .hasFeatures(cv.getFeatures() != null)
                .build();
    }
}
