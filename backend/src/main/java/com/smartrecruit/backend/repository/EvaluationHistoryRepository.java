package com.smartrecruit.backend.repository;

import com.smartrecruit.backend.entity.EvaluationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EvaluationHistoryRepository extends JpaRepository<EvaluationHistory, UUID> {
    
    // Tìm tất cả lịch sử đánh giá cho một công việc
    List<EvaluationHistory> findByJobDescriptionIdOrderByEvaluationTimeDesc(UUID jobId);

    // Tìm lịch sử đánh giá gần nhất cho một công việc
    Optional<EvaluationHistory> findFirstByJobDescriptionIdOrderByEvaluationTimeDesc(UUID jobId);

    // Tìm tất cả lịch sử đánh giá do 1 recruiter thực hiện 
    List<EvaluationHistory> findByEvaluatedByIdOrderByEvaluationTimeDesc(UUID userId);

    // Tìm tất cả lịch sử đánh giá trong khoảng thời gian nhất định
    List<EvaluationHistory> findByEvaluationTimeBetween(
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    // Tìm lịch sử đánh giá theo ID và load luôn các Evaluations con bên trong
    @Query("SELECT DISTINCT eh FROM EvaluationHistory eh " +
           "LEFT JOIN FETCH eh.evaluations " +
           "WHERE eh.id = :id")
    Optional<EvaluationHistory> findByIdWithEvaluations(@Param("id") UUID id);

    long countByJobDescriptionId(UUID jobId);
}
