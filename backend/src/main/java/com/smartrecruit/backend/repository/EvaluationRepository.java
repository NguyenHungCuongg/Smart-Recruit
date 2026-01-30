package com.smartrecruit.backend.repository;

import com.smartrecruit.backend.entity.Evaluation;
import com.smartrecruit.backend.entity.JobDescription;
import com.smartrecruit.backend.entity.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {

    Optional<Evaluation> findByJobAndCv(JobDescription job, CV cv);

    Optional<Evaluation> findByJobIdAndCvId(UUID jobId, UUID cvId);

    @Query("SELECT e FROM Evaluation e WHERE e.job.id = :jobId ORDER BY e.score DESC")
    List<Evaluation> findByJobIdOrderByScoreDesc(@Param("jobId") UUID jobId);

    @Query("SELECT e FROM Evaluation e " +
           "LEFT JOIN FETCH e.cv cv " +
           "LEFT JOIN FETCH cv.candidate " +
           "WHERE e.job.id = :jobId ORDER BY e.score DESC")
    List<Evaluation> findByJobIdWithCandidatesOrderByScore(@Param("jobId") UUID jobId);

    List<Evaluation> findByCvId(UUID cvId);

    @Query("SELECT e FROM Evaluation e WHERE e.job.id = :jobId AND e.score >= :minScore ORDER BY e.score DESC")
    List<Evaluation> findByJobIdAndScoreGreaterThanEqualOrderByScore(
        @Param("jobId") UUID jobId, 
        @Param("minScore") BigDecimal minScore
    );

    @Query("SELECT e FROM Evaluation e " +
           "WHERE e.job.id = :jobId " +
           "ORDER BY e.score DESC " +
           "LIMIT :limit")
    List<Evaluation> findTopNByJobId(@Param("jobId") UUID jobId, @Param("limit") int limit);

    boolean existsByJobIdAndCvId(UUID jobId, UUID cvId);

    List<Evaluation> findByModelVersion(String modelVersion);

    List<Evaluation> findByEvaluatedAtAfter(LocalDateTime date);

    long countByJobId(UUID jobId);
    
    long countByCvId(UUID cvId);

    @Query("SELECT AVG(e.score) FROM Evaluation e WHERE e.job.id = :jobId")
    BigDecimal getAverageScoreByJobId(@Param("jobId") UUID jobId);

    @Query("SELECT MAX(e.score) FROM Evaluation e WHERE e.job.id = :jobId")
    BigDecimal getMaxScoreByJobId(@Param("jobId") UUID jobId);

    @Query("SELECT MIN(e.score) FROM Evaluation e WHERE e.job.id = :jobId")
    BigDecimal getMinScoreByJobId(@Param("jobId") UUID jobId);

    @Query("SELECT e FROM Evaluation e WHERE e.job.recruiter.id = :recruiterId")
    List<Evaluation> findByRecruiterId(@Param("recruiterId") UUID recruiterId);

    void deleteByJobId(UUID jobId);

    void deleteByCvId(UUID cvId);
}
