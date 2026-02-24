package com.smartrecruit.backend.service;

import com.smartrecruit.backend.domain.job.JobRequirements;
import com.smartrecruit.backend.dto.job.JobCreateMultipartRequest;
import com.smartrecruit.backend.dto.job.JobCreateRequest;
import com.smartrecruit.backend.dto.job.JobResponse;
import com.smartrecruit.backend.dto.job.JobUpdateRequest;
import com.smartrecruit.backend.entity.JobDescription;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.JobDescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final AuthorizationService authorizationService;
    private final FileStorageService fileStorageService;

    @Transactional
    public JobResponse create(JobCreateRequest request, User currentUser) {
        if (currentUser.getRole() != RoleType.RECRUITER && currentUser.getRole() != RoleType.ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Only RECRUITER or ADMIN can create jobs");
        }

        JobDescription job = JobDescription.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .requirements(request.getRequirements() != null ? request.getRequirements() : new JobRequirements())
                .status(request.getStatus())
                .recruiter(currentUser)
                .build();
        job = jobDescriptionRepository.save(job);
        return toResponse(job);
    }

    @Transactional
    public JobResponse createWithFile(JobCreateMultipartRequest request, User currentUser) {
        if (currentUser.getRole() != RoleType.RECRUITER && currentUser.getRole() != RoleType.ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Only RECRUITER or ADMIN can create jobs");
        }

        // Create job entity first to get ID
        JobDescription job = JobDescription.builder()
                .title(request.getTitle())
                .description("Job in " + request.getDepartment() + ", " + request.getLocation())
                .department(request.getDepartment())
                .location(request.getLocation())
                .status(request.getStatus())
                .recruiter(currentUser)
                .requirements(new JobRequirements())
                .build();
        
        job = jobDescriptionRepository.save(job);

        // Store JD file
        if (request.getJdFile() != null && !request.getJdFile().isEmpty()) {
            String filePath = fileStorageService.storeJobDescriptionFile(request.getJdFile(), job.getId());
            job.setJdFilePath(filePath);
            job = jobDescriptionRepository.save(job);
        }

        return toResponse(job);
    }

    public List<JobResponse> findAll(User currentUser) {
        if (currentUser.getRole() == RoleType.ADMIN) {
            return jobDescriptionRepository.findAllWithRecruiter().stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }
        if (currentUser.getRole() == RoleType.RECRUITER) {
            return jobDescriptionRepository.findByRecruiterIdWithRecruiter(currentUser.getId()).stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }
        throw new org.springframework.security.access.AccessDeniedException("Only RECRUITER or ADMIN can list jobs");
    }

    public JobResponse getById(UUID jobId, User currentUser) {
        JobDescription job = jobDescriptionRepository.findByIdWithRecruiter(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));
        authorizationService.ensureCanAccessJob(currentUser, jobId);
        return toResponse(job);
    }

    @Transactional
    public JobResponse update(UUID jobId, JobUpdateRequest request, User currentUser) {
        JobDescription job = jobDescriptionRepository.findByIdWithRecruiter(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));
        authorizationService.ensureCanAccessJob(currentUser, jobId);

        if (request.getTitle() != null) {
            job.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            job.setDescription(request.getDescription());
        }
        if (request.getIndustry() != null) {
            job.setIndustry(request.getIndustry());
        }
        if (request.getRequirements() != null) {
            job.setRequirements(request.getRequirements());
        }
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        job = jobDescriptionRepository.save(job);
        return toResponse(job);
    }

    @Transactional
    public void delete(UUID jobId, User currentUser) {
        if (!jobDescriptionRepository.existsById(jobId)) {
            throw new IllegalArgumentException("Job not found: " + jobId);
        }
        authorizationService.ensureCanAccessJob(currentUser, jobId);
        jobDescriptionRepository.deleteById(jobId);
    }

    private JobResponse toResponse(JobDescription job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .department(job.getDepartment())
                .location(job.getLocation())
                .jdFilePath(job.getJdFilePath())
                .industry(job.getIndustry())
                .requirements(job.getRequirements())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .recruiterId(job.getRecruiter().getId())
                .recruiterName(job.getRecruiter().getFullName())
                .build();
    }
}
