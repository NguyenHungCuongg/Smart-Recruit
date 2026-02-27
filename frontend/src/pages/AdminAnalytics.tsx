import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { AdminStatCard } from "../components/AdminStatCard";
import { LoadingSection } from "../components/LoadingSection";
import { FaBriefcase, FaPeopleGroup, FaChartLine, FaStar, FaTimeline } from "react-icons/fa6";
import toast from "react-hot-toast";
import { parseApiError } from "../utils/parseApiError";
import adminAnalyticsService, {
  type AdminAnalyticsResponse,
  type AdminMonthlyActivity,
} from "../services/adminAnalyticsService";

export const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdminAnalyticsResponse | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAnalyticsService.getAnalytics();
      setAnalytics(response);
    } catch (error) {
      toast.error(parseApiError(error, "Failed to load analytics"));
    } finally {
      setLoading(false);
    }
  };

  const monthlyActivity = useMemo(() => analytics?.monthlyActivity ?? [], [analytics]);
  const topRecruiters = analytics?.topRecruiters ?? [];
  const recentActivity = analytics?.recentActivity ?? [];
  const systemStats = analytics?.systemStats ?? {
    totalJobs: 0,
    totalCandidates: 0,
    totalEvaluations: 0,
    avgMatchScore: 0,
  };

  const getRelativeTime = (isoTime: string) => {
    const timestamp = new Date(isoTime).getTime();
    if (Number.isNaN(timestamp)) {
      return isoTime;
    }

    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return new Date(isoTime).toLocaleDateString();
  };

  const monthlyMax = useMemo(() => {
    const fallback = 1;
    return {
      jobs: Math.max(...monthlyActivity.map((item) => item.jobs), fallback),
      candidates: Math.max(...monthlyActivity.map((item) => item.candidates), fallback),
      evaluations: Math.max(...monthlyActivity.map((item) => item.evaluations), fallback),
    };
  }, [monthlyActivity]);

  const getPercent = (value: number, max: number) => {
    if (max <= 0) return 0;
    return Math.min((value / max) * 100, 100);
  };

  const getMonthlyChangeLabel = (field: keyof AdminMonthlyActivity, suffix = "this month") => {
    if (monthlyActivity.length === 0) {
      return `+0 ${suffix}`;
    }

    const current = monthlyActivity[monthlyActivity.length - 1]?.[field];
    const previous = monthlyActivity[monthlyActivity.length - 2]?.[field] ?? 0;

    if (typeof current !== "number" || typeof previous !== "number") {
      return `+0 ${suffix}`;
    }

    const delta = current - previous;
    const sign = delta >= 0 ? "+" : "";
    return `${sign}${delta} ${suffix}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">System Analytics</h1>
          <p className="text-muted-foreground">Overview of system-wide metrics and activity</p>
        </div>

        {loading ? (
          <LoadingSection message="Loading system analytics..." className="py-16" />
        ) : (
          <>
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AdminStatCard
                label="Total Jobs"
                value={systemStats.totalJobs}
                change={getMonthlyChangeLabel("jobs")}
                icon={<FaBriefcase className="text-primary" />}
              />

              <AdminStatCard
                label="Total Candidates"
                value={systemStats.totalCandidates}
                change={getMonthlyChangeLabel("candidates")}
                icon={<FaPeopleGroup className="text-primary" />}
              />

              <AdminStatCard
                label="Total Evaluations"
                value={systemStats.totalEvaluations}
                change={getMonthlyChangeLabel("evaluations")}
                icon={<FaChartLine className="text-primary" />}
              />

              <AdminStatCard
                label="Avg Match Score"
                value={systemStats.avgMatchScore}
                change="Live score"
                icon={<FaStar className="text-primary" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart Placeholder */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Monthly Activity</h2>
                <div className="space-y-4">
                  {monthlyActivity.length > 0 ? (
                    monthlyActivity.map((data) => (
                      <div key={`${data.month}-${data.year}`} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground font-medium">{data.month}</span>
                          <div className="flex items-center space-x-4">
                            <span className="text-primary">Jobs: {data.jobs}</span>
                            <span className="text-score-average">Candidates: {data.candidates}</span>
                            <span className="text-score-good">Evaluations: {data.evaluations}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
                          <div className="bg-primary" style={{ width: `${getPercent(data.jobs, monthlyMax.jobs)}%` }} />
                          <div
                            className="bg-score-average"
                            style={{ width: `${getPercent(data.candidates, monthlyMax.candidates)}%` }}
                          />
                          <div
                            className="bg-score-good"
                            style={{ width: `${getPercent(data.evaluations, monthlyMax.evaluations)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No monthly activity yet</p>
                  )}
                </div>
              </div>

              {/* Top Recruiters */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">Top Recruiters</h2>
                <div className="space-y-4">
                  {topRecruiters.length > 0 ? (
                    topRecruiters.map((recruiter, index) => (
                      <div key={recruiter.name} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{recruiter.name}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{recruiter.jobs} jobs</span>
                            <span>•</span>
                            <span>{recruiter.evaluations} evaluations</span>
                            <span>•</span>
                            <span className="text-primary font-medium">Avg: {recruiter.avgScore}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No recruiter activity yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Recent System Activity</h2>
              </div>
              <div className="divide-y divide-border">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={`${activity.user}-${activity.action}-${index}`}
                      className="p-6 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <FaTimeline className="text-primary" />
                          </div>
                          <div>
                            <p className="text-foreground">
                              <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                              <span className="font-semibold text-primary">{activity.target}</span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{getRelativeTime(activity.time)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">No recent system activity</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};
