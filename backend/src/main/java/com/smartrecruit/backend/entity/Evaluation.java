package com.smartrecruit.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "evaluations",
    uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "cv_id"}),
    indexes = {
        @Index(name = "idx_evaluations_job_score", columnList = "job_id, score DESC"),
        @Index(name = "idx_evaluations_evaluated_at", columnList = "evaluated_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "UUID")
    private UUID id;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal score;

    @Column(precision = 4, scale = 3)
    private BigDecimal confidence;

    @Column(name = "model_version", length = 50)
    private String modelVersion;

    @Column(name = "evaluated_at", nullable = false, updatable = false)
    private LocalDateTime evaluatedAt;

    @PrePersist
    protected void onCreate() {
        evaluatedAt = LocalDateTime.now();
    }

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnore
    private JobDescription job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cv_id", nullable = false)
    @JsonIgnore
    private CV cv;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluated_by")
    @JsonIgnore
    private User evaluatedBy;
}
