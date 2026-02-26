import apiClient from "./apiClient";

export interface AdminSystemStats {
  totalJobs: number;
  totalCandidates: number;
  totalEvaluations: number;
  avgMatchScore: number;
}

export interface AdminMonthlyActivity {
  month: string;
  year: number;
  jobs: number;
  candidates: number;
  evaluations: number;
}

export interface AdminTopRecruiter {
  name: string;
  jobs: number;
  evaluations: number;
  avgScore: number;
}

export interface AdminRecentActivity {
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface AdminAnalyticsResponse {
  systemStats: AdminSystemStats;
  monthlyActivity: AdminMonthlyActivity[];
  topRecruiters: AdminTopRecruiter[];
  recentActivity: AdminRecentActivity[];
}

const adminAnalyticsService = {
  getAnalytics: async (): Promise<AdminAnalyticsResponse> => {
    const response = await apiClient.get("/admin/analytics");
    return response.data;
  },
};

export default adminAnalyticsService;
