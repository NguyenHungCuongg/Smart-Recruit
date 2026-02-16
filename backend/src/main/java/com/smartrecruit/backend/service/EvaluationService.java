package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.evaluation.CandidateScoreDTO;
import com.smartrecruit.backend.dto.evaluation.EvaluationRequest;
import com.smartrecruit.backend.dto.evaluation.EvaluationResponse;
import com.smartrecruit.backend.dto.ml.FeatureVector;
import com.smartrecruit.backend.dto.ml.PredictionRequest;
import com.smartrecruit.backend.dto.ml.PredictionResponse;
import com.smartrecruit.backend.dto.ml.PredictionResult;
import com.smartrecruit.backend.entity.*;
import com.smartrecruit.backend.repository.*;
import com.smartrecruit.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EvaluationService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final CVRepository cvRepository;
    private final CandidateRepository candidateRepository;
    private final EvaluationRepository evaluationRepository;
    private final EvaluationHistoryRepository evaluationHistoryRepository;
    private final FeatureEngineeringService featureEngineeringService;
    private final MLServiceClient mlServiceClient;
    private final SecurityUtils securityUtils;

    @Transactional
    public EvaluationResponse evaluateCandidatesForJob(UUID jobId, EvaluationRequest request) {
        log.info("Starting evaluation for job: {}", jobId);

        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        User currentUser = securityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new RuntimeException("User not authenticated");
        }

        if (!securityUtils.canCurrentUserAccess(job.getRecruiter().getId())) {
            throw new RuntimeException("Access denied: You can only evaluate your own jobs");
        }
        
        //Lấy danh sách CV cần đánh giá
        List<CV> cvsToEvaluate = getCVsForEvaluation(jobId, request);
        
        if (cvsToEvaluate.isEmpty()) {
            log.warn("No CVs found to evaluate for job: {}", jobId);
            return buildEmptyResponse(job, currentUser);
        }

        log.info("Found {} CVs to evaluate", cvsToEvaluate.size());

        // Tạo 1 record cho EvaluationHistory
        EvaluationHistory evaluationHistory = EvaluationHistory.builder()
                .jobDescription(job)
                .evaluatedBy(currentUser)
                .evaluationTime(LocalDateTime.now())
                .modelVersion("v1.0")
                .totalCandidates(cvsToEvaluate.size())
            .build();

        // Đánh giá từng CV
        List<Evaluation> evaluations = new ArrayList<>();
        int successCount = 0;
        int failureCount = 0;
        for (CV cv : cvsToEvaluate) {
            try {
                Evaluation evaluation = evaluateCV(job, cv, currentUser, evaluationHistory, request.getForceReEvaluation());
                evaluations.add(evaluation);
                successCount++;
                log.debug("Successfully evaluated CV: {} with score: {}", cv.getId(), evaluation.getScore());
            } catch (Exception e) {
                log.error("Failed to evaluate CV: {}", cv.getId(), e);
                Evaluation failedEvaluation = createFailedEvaluation(job, cv, currentUser, evaluationHistory, e.getMessage());
                evaluations.add(failedEvaluation);
                failureCount++;
            }
        }

        // Rank theo điểm số từ cao xuống thấp
        evaluations.sort(Comparator.comparing(Evaluation::getScore).reversed());

        // Cập nhật lại EvaluationHistory với kết quả
        evaluationHistory.setSuccessCount(successCount);
        evaluationHistory.setFailureCount(failureCount);
        evaluationHistory.setEvaluations(evaluations);
        
        evaluationHistoryRepository.save(evaluationHistory);

        return buildEvaluationResponse(evaluationHistory, evaluations);
    }

    // Lấy lịch sử đánh giá của một job
    @Transactional(readOnly = true)
    public List<EvaluationResponse> getEvaluationHistory(UUID jobId) {
        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        if (!securityUtils.canCurrentUserAccess(job.getRecruiter().getId())) {
            throw new RuntimeException("Access denied");
        }

        List<EvaluationHistory> histories = evaluationHistoryRepository
                .findByJobDescriptionIdOrderByEvaluationTimeDesc(jobId);

        return histories.stream()
                .map(history -> buildEvaluationResponse(history, history.getEvaluations()))
                .collect(Collectors.toList());
    }

    // Lấy kết quả đánh giá mới nhất của một job
    @Transactional(readOnly = true)
    public EvaluationResponse getLatestEvaluation(UUID jobId) {
        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found: " + jobId));

        // Authorization check
        if (!securityUtils.canCurrentUserAccess(job.getRecruiter().getId())) {
            throw new RuntimeException("Access denied");
        }

        Optional<EvaluationHistory> latestHistory = evaluationHistoryRepository
                .findFirstByJobDescriptionIdOrderByEvaluationTimeDesc(jobId);

        if (latestHistory.isEmpty()) {
            return buildEmptyResponse(job, securityUtils.getCurrentUser());
        }

        EvaluationHistory history = latestHistory.get();
        List<Evaluation> evaluations = evaluationRepository
                .findByJobIdWithCandidatesOrderByScore(jobId);

        return buildEvaluationResponse(history, evaluations);
    }

    private List<CV> getCVsForEvaluation(UUID jobId, EvaluationRequest request) {
        // Nếu request có candidateIds cụ thể, chỉ lấy CV của những candidate đó
        if (request.getCandidateIds() != null && !request.getCandidateIds().isEmpty()) {
            return cvRepository.findLatestCVForCandidates(request.getCandidateIds());
        } else {
            // Nếu không có candidateIds, lấy tất cả CV của những candidate đã ứng tuyển vào job này
            return cvRepository.findAllWithFeatures();
        }
    }

    private Evaluation evaluateCV(
            JobDescription job, 
            CV cv, 
            User evaluatedBy,
            EvaluationHistory evaluationHistory,
            Boolean forceReEvaluation
    ) {
        // Kiểm tra nếu đã từng đánh giá CV này cho job này trước đó và forceReEvaluation = false thì có thể tái sử dụng kết quả cũ (cache)
        if (!forceReEvaluation) {
            Optional<Evaluation> existingEvaluation = evaluationRepository.findByJobIdAndCvId(job.getId(), cv.getId());
            if (existingEvaluation.isPresent()) {
                log.debug("Using cached evaluation for CV: {}", cv.getId());
                Evaluation cached = existingEvaluation.get();
                cached.setEvaluationHistory(evaluationHistory);
                return cached;
            }
        }

        // Extract features
        FeatureVector features = featureEngineeringService.extractFeatures(job, cv);

        // Gọi ML service (Gộp vào batch sau này nếu cần)
        PredictionRequest predictionRequest = new PredictionRequest(features); // Constructor này sẽ tự động gói features vào một list
        PredictionResponse prediction = mlServiceClient.predict(predictionRequest);

        // Lấy kết quả đầu tiên từ batch response
        PredictionResult result = prediction.getFirstPrediction();
        if (result == null) {
            throw new RuntimeException("ML Service returned empty predictions");
        }

        // Tạo Evaluation entity từ kết quả dự đoán
        Evaluation evaluation = Evaluation.builder()
                .job(job)
                .cv(cv)
                .score(BigDecimal.valueOf(result.getScore()))
                .confidence(result.getConfidence() != null ? 
                           BigDecimal.valueOf(result.getConfidence()) : null)
                .modelVersion(prediction.getModelVersion())
                .evaluatedBy(evaluatedBy)
                .evaluationHistory(evaluationHistory)
                .build();

        return evaluationRepository.save(evaluation);
    }

    private Evaluation createFailedEvaluation(
            JobDescription job,
            CV cv,
            User evaluatedBy,
            EvaluationHistory evaluationHistory,
            String errorMessage
    ) {
        Evaluation evaluation = Evaluation.builder()
                .job(job)
                .cv(cv)
                .score(BigDecimal.ZERO)
                .modelVersion("FAILED")
                .evaluatedBy(evaluatedBy)
                .evaluationHistory(evaluationHistory)
                .build();

        return evaluationRepository.save(evaluation);
    }

    private EvaluationResponse buildEvaluationResponse(
            EvaluationHistory history,
            List<Evaluation> evaluations
    ) {
        List<CandidateScoreDTO> candidateScores = new ArrayList<>();
        int rank = 1;

        for (Evaluation eval : evaluations) {
            Candidate candidate = eval.getCv().getCandidate();
            
            CandidateScoreDTO dto = CandidateScoreDTO.builder()
                    .candidateId(candidate.getId())
                    .candidateName(candidate.getFullName())
                    .candidateEmail(candidate.getEmail())
                    .cvId(eval.getCv().getId())
                    .score(eval.getScore().doubleValue())
                    .rank(rank++)
                    .confidence(eval.getConfidence() != null ? eval.getConfidence().doubleValue() : null)
                    .status("SUCCESS")
                    .build();
            
            candidateScores.add(dto);
        }

        return EvaluationResponse.builder()
                .evaluationId(history.getId())
                .jobId(history.getJobDescription().getId())
                .jobTitle(history.getJobDescription().getTitle())
                .candidates(candidateScores)
                .totalEvaluated(history.getTotalCandidates())
                .successCount(history.getSuccessCount())
                .failureCount(history.getFailureCount())
                .evaluatedAt(history.getEvaluationTime())
                .modelVersion(history.getModelVersion())
                .evaluatedBy(history.getEvaluatedBy().getId())
                .build();
    }

    private EvaluationResponse buildEmptyResponse(JobDescription job, User user) {
        return EvaluationResponse.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .candidates(Collections.emptyList())
                .totalEvaluated(0)
                .successCount(0)
                .failureCount(0)
                .evaluatedAt(LocalDateTime.now())
                .modelVersion("N/A")
                .evaluatedBy(user != null ? user.getId() : null)
                .build();
    }
}
