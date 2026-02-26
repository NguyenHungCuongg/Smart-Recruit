package com.smartrecruit.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {
    private SystemStats systemStats;
    private List<MonthlyActivity> monthlyActivity;
    private List<TopRecruiter> topRecruiters;
    private List<RecentActivity> recentActivity;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemStats {
        private long totalJobs;
        private long totalCandidates;
        private long totalEvaluations;
        private double avgMatchScore;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyActivity {
        private String month;
        private int year;
        private long jobs;
        private long candidates;
        private long evaluations;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopRecruiter {
        private String name;
        private long jobs;
        private long evaluations;
        private double avgScore;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivity {
        private String user;
        private String action;
        private String target;
        private String time;
    }
}
