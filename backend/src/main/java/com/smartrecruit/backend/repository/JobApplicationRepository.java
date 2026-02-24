package com.smartrecruit.backend.repository;

import com.smartrecruit.backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    List<JobApplication> findByJobId(UUID jobId);

    List<JobApplication> findByCandidateId(UUID candidateId);

    @Query("SELECT ja FROM JobApplication ja " +
           "JOIN FETCH ja.candidate " +
           "JOIN FETCH ja.cv " +
           "WHERE ja.job.id = :jobId")
    List<JobApplication> findByJobIdWithDetails(@Param("jobId") UUID jobId);

    @Query("SELECT ja FROM JobApplication ja " +
           "JOIN FETCH ja.job " +
           "JOIN FETCH ja.cv " +
           "WHERE ja.candidate.id = :candidateId")
    List<JobApplication> findByCandidateIdWithDetails(@Param("candidateId") UUID candidateId);

    Optional<JobApplication> findByJobIdAndCvId(UUID jobId, UUID cvId);

    boolean existsByJobIdAndCvId(UUID jobId, UUID cvId);
}
