package com.smartrecruit.backend.repository;

import com.smartrecruit.backend.entity.JobDescription;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobDescriptionRepository extends JpaRepository<JobDescription, UUID> {

    List<JobDescription> findByRecruiter(User recruiter);

    List<JobDescription> findByRecruiterId(UUID recruiterId);

    List<JobDescription> findByStatus(JobStatus status);

    List<JobDescription> findByRecruiterAndStatus(User recruiter, JobStatus status);

    List<JobDescription> findByRecruiterIdAndStatus(UUID recruiterId, JobStatus status);
    
    @Query("SELECT CASE WHEN COUNT(j) > 0 THEN true ELSE false END " +
           "FROM JobDescription j WHERE j.id = :jobId AND j.recruiter.id = :recruiterId")
    boolean existsByIdAndRecruiterId(@Param("jobId") UUID jobId, @Param("recruiterId") UUID recruiterId);

    @Query("SELECT j FROM JobDescription j LEFT JOIN FETCH j.recruiter WHERE j.id = :jobId")
    Optional<JobDescription> findByIdWithRecruiter(@Param("jobId") UUID jobId);

    @Query("SELECT DISTINCT j FROM JobDescription j LEFT JOIN FETCH j.recruiter ORDER BY j.createdAt DESC")
    List<JobDescription> findAllWithRecruiter();

    @Query("SELECT j FROM JobDescription j LEFT JOIN FETCH j.recruiter WHERE j.recruiter.id = :recruiterId ORDER BY j.createdAt DESC")
    List<JobDescription> findByRecruiterIdWithRecruiter(@Param("recruiterId") UUID recruiterId);

    List<JobDescription> findByTitleContainingIgnoreCase(String title);

    long countByRecruiterId(UUID recruiterId);

    long countByStatus(JobStatus status);
}
