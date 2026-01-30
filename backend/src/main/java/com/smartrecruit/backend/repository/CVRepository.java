package com.smartrecruit.backend.repository;

import com.smartrecruit.backend.entity.CV;
import com.smartrecruit.backend.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CVRepository extends JpaRepository<CV, UUID> {

    List<CV> findByCandidate(Candidate candidate);

    List<CV> findByCandidateId(UUID candidateId);

    @Query("SELECT c FROM CV c LEFT JOIN FETCH c.candidate WHERE c.id = :cvId")
    Optional<CV> findByIdWithCandidate(@Param("cvId") UUID cvId);

    List<CV> findByUploadedAtAfter(LocalDateTime date);

    List<CV> findByUploadedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT c FROM CV c WHERE c.extractedText IS NOT NULL AND LENGTH(c.extractedText) > 0")
    List<CV> findAllWithExtractedText();
    
    @Query("SELECT c FROM CV c WHERE c.features IS NOT NULL")
    List<CV> findAllWithFeatures();
    
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END " +
           "FROM CV c WHERE c.id = :cvId AND c.candidate.id = :candidateId")
    boolean existsByIdAndCandidateId(@Param("cvId") UUID cvId, @Param("candidateId") UUID candidateId);
    
    long countByCandidateId(UUID candidateId);
    
    @Query("SELECT c FROM CV c WHERE c.uploadedAt = " +
           "(SELECT MAX(c2.uploadedAt) FROM CV c2 WHERE c2.candidate.id = c.candidate.id)")
    List<CV> findLatestCVForEachCandidate();
}
