package com.smartrecruit.backend.repository;

import com.smartrecruit.backend.entity.JDHistory;
import com.smartrecruit.backend.entity.JobDescription;
import com.smartrecruit.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface JDHistoryRepository extends JpaRepository<JDHistory, UUID> {

    @Query("SELECT h FROM JDHistory h WHERE h.job.id = :jobId ORDER BY h.changedAt DESC")
    List<JDHistory> findByJobIdOrderByChangedAtDesc(@Param("jobId") UUID jobId);

    List<JDHistory> findByJob(JobDescription job);

    List<JDHistory> findByChangedBy(User user);

    List<JDHistory> findByChangedById(UUID userId);

    @Query("SELECT h FROM JDHistory h " +
           "LEFT JOIN FETCH h.job " +
           "LEFT JOIN FETCH h.changedBy " +
           "WHERE h.job.id = :jobId ORDER BY h.changedAt DESC")
    List<JDHistory> findByJobIdWithDetailsOrderByChangedAtDesc(@Param("jobId") UUID jobId);

    @Query("SELECT h FROM JDHistory h WHERE h.job.id = :jobId " +
           "AND h.changedAt BETWEEN :startDate AND :endDate ORDER BY h.changedAt DESC")
    List<JDHistory> findByJobIdAndChangedAtBetween(
        @Param("jobId") UUID jobId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT h FROM JDHistory h WHERE h.job.id = :jobId " +
           "ORDER BY h.changedAt DESC LIMIT 1")
    JDHistory findLatestByJobId(@Param("jobId") UUID jobId);

    long countByJobId(UUID jobId);
    
    long countByChangedById(UUID userId);

    List<JDHistory> findByChangedAtAfter(LocalDateTime date);

    void deleteByJobId(UUID jobId);
}
