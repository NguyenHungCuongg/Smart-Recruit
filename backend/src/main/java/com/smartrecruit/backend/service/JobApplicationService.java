package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.application.JobApplicationRequest;
import com.smartrecruit.backend.dto.application.JobApplicationResponse;
import com.smartrecruit.backend.entity.*;
import com.smartrecruit.backend.enums.ApplicationStatus;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final CVRepository cvRepository;
    private final CandidateRepository candidateRepository;
    private final EvaluationRepository evaluationRepository;
    private final AuthorizationService authorizationService;

    @Transactional
    public JobApplicationResponse create(JobApplicationRequest request, User currentUser) {
        log.info("Creating job application for job: {} and CV: {}", request.getJobId(), request.getCvId());

        // Validate job exists
        JobDescription job = jobDescriptionRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found: " + request.getJobId()));

        // Authorization: only the job owner can add candidates to their job
        authorizationService.ensureCanAccess(job.getRecruiter().getId(), currentUser);

        // Validate CV exists
        CV cv = cvRepository.findById(request.getCvId())
                .orElseThrow(() -> new RuntimeException("CV not found: " + request.getCvId()));

        // Validate candidate exists (from CV)
        Candidate candidate = cv.getCandidate();
        if (candidate == null) {
            throw new RuntimeException("CV has no associated candidate");
        }

        // Check if this CV is already applied to this job
        if (jobApplicationRepository.existsByJobIdAndCvId(request.getJobId(), request.getCvId())) {
            throw new RuntimeException("This CV has already been applied to this job");
        }

        // Create job application
        JobApplication application = JobApplication.builder()
                .job(job)
                .candidate(candidate)
                .cv(cv)
                .status(ApplicationStatus.PENDING)
                .build();

        JobApplication saved = jobApplicationRepository.save(application);
        log.info("Job application created with ID: {}", saved.getId());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getByJobId(UUID jobId, User currentUser) {
        // Validate job exists
        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        // Authorization check
        authorizationService.ensureCanAccess(job.getRecruiter().getId(), currentUser);

        List<JobApplication> applications = jobApplicationRepository.findByJobIdWithDetails(jobId);
        
        return applications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> getByCandidateId(UUID candidateId, User currentUser) {
        // Validate candidate exists
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found: " + candidateId));

        // Authorization check - candidates are shared resources, just check role
        ensureRecruiterOrAdmin(currentUser);

        List<JobApplication> applications = jobApplicationRepository.findByCandidateIdWithDetails(candidateId);
        
        return applications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public JobApplicationResponse getById(UUID id, User currentUser) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found: " + id));

        // Authorization check - user must own either the job or the candidate
        UUID recruiterId = application.getJob().getRecruiter().getId();
        authorizationService.ensureCanAccess(recruiterId, currentUser);

        return toResponse(application);
    }

    @Transactional
    public void delete(UUID id, User currentUser) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found: " + id));

        // Authorization check
        authorizationService.ensureCanAccess(application.getJob().getRecruiter().getId(), currentUser);

        jobApplicationRepository.delete(application);
        log.info("Deleted job application: {}", id);
    }

    private JobApplicationResponse toResponse(JobApplication application) {
        Candidate candidate = application.getCandidate();
        CV cv = application.getCv();
        
        // Try to get the latest evaluation score for this application
        Double score = null;
        Optional<Evaluation> latestEvaluation = evaluationRepository
                .findByJobIdAndCvId(application.getJob().getId(), cv.getId());
        
        if (latestEvaluation.isPresent()) {
            BigDecimal scoreValue = latestEvaluation.get().getScore();
            if (scoreValue != null) {
                score = scoreValue.doubleValue();
            }
        }

        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob().getId())
                .candidateId(candidate.getId())
                .candidateName(candidate.getFullName())
                .candidateEmail(candidate.getEmail())
                .cvId(cv.getId())
                .cvFileName(extractFileName(cv.getFilePath()))
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .score(score)
                .build();
    }

    private String extractFileName(String filePath) {
        if (filePath == null) {
            return "Unknown";
        }
        int lastSlash = filePath.lastIndexOf('/');
        int lastBackslash = filePath.lastIndexOf('\\');
        int lastSeparator = Math.max(lastSlash, lastBackslash);
        
        if (lastSeparator >= 0 && lastSeparator < filePath.length() - 1) {
            return filePath.substring(lastSeparator + 1);
        }
        return filePath;
    }

    private void ensureRecruiterOrAdmin(User user) {
        if (user.getRole() != RoleType.RECRUITER && user.getRole() != RoleType.ADMIN) {
            throw new AccessDeniedException("Only RECRUITER or ADMIN can access job applications");
        }
    }
}
