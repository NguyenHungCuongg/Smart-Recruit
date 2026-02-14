package com.smartrecruit.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "evaluation_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private JobDescription jobDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_by", nullable = false)
    private User evaluatedBy;

    @Column(name = "evaluation_time", nullable = false)
    private LocalDateTime evaluationTime;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "total_candidates")
    private Integer totalCandidates;

    @Column(name = "success_count")
    private Integer successCount;

    @Column(name = "failure_count")
    private Integer failureCount;

    // Một Evaluation History có thể track được nhiều Evaluations nhỏ khác (trên mỗi Candidate)
    @OneToMany(mappedBy = "evaluationHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Evaluation> evaluations = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        evaluationTime = LocalDateTime.now();
    }
}
