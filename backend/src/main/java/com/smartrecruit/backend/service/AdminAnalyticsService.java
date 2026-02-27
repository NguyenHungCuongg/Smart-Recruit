package com.smartrecruit.backend.service;

import com.smartrecruit.backend.dto.admin.AdminAnalyticsResponse;
import com.smartrecruit.backend.entity.Candidate;
import com.smartrecruit.backend.entity.Evaluation;
import com.smartrecruit.backend.entity.EvaluationHistory;
import com.smartrecruit.backend.entity.JobDescription;
import com.smartrecruit.backend.entity.User;
import com.smartrecruit.backend.enums.RoleType;
import com.smartrecruit.backend.repository.CandidateRepository;
import com.smartrecruit.backend.repository.EvaluationHistoryRepository;
import com.smartrecruit.backend.repository.EvaluationRepository;
import com.smartrecruit.backend.repository.JobDescriptionRepository;
import com.smartrecruit.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final UserRepository userRepository;
    private final JobDescriptionRepository jobDescriptionRepository;
    private final CandidateRepository candidateRepository;
    private final EvaluationRepository evaluationRepository;
    private final EvaluationHistoryRepository evaluationHistoryRepository;

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getAnalytics() {
        List<JobDescription> allJobs = jobDescriptionRepository.findAllWithRecruiter();
        List<Candidate> allCandidates = candidateRepository.findAll();
        List<Evaluation> allEvaluations = evaluationRepository.findAll();
        List<EvaluationHistory> allEvaluationHistories = evaluationHistoryRepository.findAll();

        AdminAnalyticsResponse.SystemStats systemStats = buildSystemStats(allJobs, allCandidates, allEvaluations);
        List<AdminAnalyticsResponse.MonthlyActivity> monthlyActivity = buildMonthlyActivity(allJobs, allCandidates, allEvaluationHistories);
        List<AdminAnalyticsResponse.TopRecruiter> topRecruiters = buildTopRecruiters();
        List<AdminAnalyticsResponse.RecentActivity> recentActivity = buildRecentActivity(allJobs, allEvaluationHistories, userRepository.findAll());

        return AdminAnalyticsResponse.builder()
                .systemStats(systemStats)
                .monthlyActivity(monthlyActivity)
                .topRecruiters(topRecruiters)
                .recentActivity(recentActivity)
                .build();
    }

    private AdminAnalyticsResponse.SystemStats buildSystemStats(
            List<JobDescription> jobs,
            List<Candidate> candidates,
            List<Evaluation> evaluations
    ) {
        double avgMatchScore = evaluations.isEmpty()
                ? 0
                : evaluations.stream()
                .map(Evaluation::getScore)
                .filter(score -> score != null)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(0);

        return AdminAnalyticsResponse.SystemStats.builder()
                .totalJobs(jobs.size())
                .totalCandidates(candidates.size())
                .totalEvaluations(evaluations.size())
                .avgMatchScore(roundToOneDecimal(avgMatchScore))
                .build();
    }

    private List<AdminAnalyticsResponse.MonthlyActivity> buildMonthlyActivity(
            List<JobDescription> jobs,
            List<Candidate> candidates,
            List<EvaluationHistory> evaluationHistories
    ) {
        LocalDate now = LocalDate.now();
        List<YearMonth> months = new ArrayList<>();

        // Lấy ra 6 tháng gần nhất (bao gồm tháng hiện tại)
        for (int index = 5; index >= 0; index--) {
            months.add(YearMonth.from(now.minusMonths(index)));
        }

        // Tạo Map để đếm số lượng jobs, candidates, evaluations theo từng tháng bằng cách sử dụng YearMonth làm key và đếm số lượng tương ứng
        Map<YearMonth, Long> jobsByMonth = new HashMap<>();
        for (JobDescription job : jobs) {
            if (job.getCreatedAt() == null) {
                continue;
            }
            YearMonth key = YearMonth.from(job.getCreatedAt());
            jobsByMonth.put(key, jobsByMonth.getOrDefault(key, 0L) + 1);
        }

        Map<YearMonth, Long> candidatesByMonth = new HashMap<>();
        for (Candidate candidate : candidates) {
            if (candidate.getCreatedAt() == null) {
                continue;
            }
            YearMonth key = YearMonth.from(candidate.getCreatedAt());
            candidatesByMonth.put(key, candidatesByMonth.getOrDefault(key, 0L) + 1);
        }

        Map<YearMonth, Long> evaluationsByMonth = new HashMap<>();
        for (EvaluationHistory history : evaluationHistories) {
            if (history.getEvaluationTime() == null) {
                continue;
            }
            YearMonth key = YearMonth.from(history.getEvaluationTime());
            evaluationsByMonth.put(key, evaluationsByMonth.getOrDefault(key, 0L) + 1);
        }

        List<AdminAnalyticsResponse.MonthlyActivity> result = new ArrayList<>();
        for (YearMonth yearMonth : months) {
            result.add(AdminAnalyticsResponse.MonthlyActivity.builder()
                    .month(yearMonth.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .year(yearMonth.getYear())
                    .jobs(jobsByMonth.getOrDefault(yearMonth, 0L))
                    .candidates(candidatesByMonth.getOrDefault(yearMonth, 0L))
                    .evaluations(evaluationsByMonth.getOrDefault(yearMonth, 0L))
                    .build());
        }
        return result;
    }

    private List<AdminAnalyticsResponse.TopRecruiter> buildTopRecruiters() {
        List<User> recruiters = userRepository.findByRole(RoleType.RECRUITER);

        return recruiters.stream()
                .map(recruiter -> {
                    long jobs = jobDescriptionRepository.countByRecruiterId(recruiter.getId());
                    List<Evaluation> recruiterEvaluations = evaluationRepository.findByRecruiterId(recruiter.getId());
                    long evaluations = recruiterEvaluations.size();
                    double avgScore = recruiterEvaluations.isEmpty()
                            ? 0
                            : recruiterEvaluations.stream()
                            .map(Evaluation::getScore)
                            .filter(score -> score != null)
                            .mapToDouble(BigDecimal::doubleValue)
                            .average()
                            .orElse(0);

                    return AdminAnalyticsResponse.TopRecruiter.builder()
                            .name(recruiter.getFullName())
                            .jobs(jobs)
                            .evaluations(evaluations)
                            .avgScore(roundToOneDecimal(avgScore))
                            .build();
                })
                .sorted(Comparator.comparingLong(AdminAnalyticsResponse.TopRecruiter::getJobs)
                        .thenComparingLong(AdminAnalyticsResponse.TopRecruiter::getEvaluations)
                        .reversed())
                .limit(5)
                .toList();
    }

    private List<AdminAnalyticsResponse.RecentActivity> buildRecentActivity(
            List<JobDescription> jobs,
            List<EvaluationHistory> evaluationHistories,
            List<User> users
    ) {
        List<ActivityEvent> events = new ArrayList<>();

        for (JobDescription job : jobs) {
            if (job.getCreatedAt() == null || job.getRecruiter() == null) {
                continue;
            }
            events.add(new ActivityEvent(
                    job.getCreatedAt(),
                    job.getRecruiter().getFullName(),
                    "Created job",
                    job.getTitle()
            ));
        }

        for (EvaluationHistory history : evaluationHistories) {
            if (history.getEvaluationTime() == null || history.getEvaluatedBy() == null || history.getJobDescription() == null) {
                continue;
            }
            events.add(new ActivityEvent(
                    history.getEvaluationTime(),
                    history.getEvaluatedBy().getFullName(),
                    "Ran evaluation",
                    history.getJobDescription().getTitle()
            ));
        }

        for (User user : users) {
            if (user.getCreatedAt() == null) {
                continue;
            }
            events.add(new ActivityEvent(
                    user.getCreatedAt(),
                    "System",
                    "Registered user",
                    user.getFullName()
            ));
        }

        return events.stream()
                .sorted(Comparator.comparing(ActivityEvent::time).reversed())
                .limit(8)
                .map(event -> AdminAnalyticsResponse.RecentActivity.builder()
                        .user(event.user())
                        .action(event.action())
                        .target(event.target())
                        .time(event.time().toString())
                        .build())
                .toList();
    }

    private double roundToOneDecimal(double value) {
        return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }

    private record ActivityEvent(LocalDateTime time, String user, String action, String target) {
    }
}
