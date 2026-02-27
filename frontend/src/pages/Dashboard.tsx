import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DashboardLayout } from "../components/DashboardLayout";
import { DashboardStatCard } from "../components/DashboardStatCard";
import { RecentJobListItem } from "../components/RecentJobListItem";
import { RecentEvaluationListItem } from "../components/RecentEvaluationListItem";
import { LoadingSection } from "../components/LoadingSection";
import { FaBriefcase, FaPeopleGroup, FaChartLine, FaStar } from "react-icons/fa6";
import toast from "react-hot-toast";
import { parseApiError } from "../utils/parseApiError";
import jobService from "../services/jobService";
import candidateService from "../services/candidateService";
import applicationService from "../services/applicationService";
import evaluationService from "../services/evaluationService";
import type { Evaluation } from "../services/evaluationService";

interface DashboardStats {
  activeJobs: number;
  totalCandidates: number;
  evaluationsThisMonth: number;
  avgMatchScore: number;
}

interface RecentJobItem {
  id: string;
  title: string;
  candidates: number;
  status: string;
  date: string;
}

interface RecentEvaluationItem {
  id: string;
  job: string;
  candidates: number;
  avgScore: number;
  date: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<DashboardStats>({
    activeJobs: 0,
    totalCandidates: 0,
    evaluationsThisMonth: 0,
    avgMatchScore: 0,
  });
  const [recentJobs, setRecentJobs] = useState<RecentJobItem[]>([]);
  const [recentEvaluations, setRecentEvaluations] = useState<RecentEvaluationItem[]>([]);

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const calculateEvaluationAverage = (evaluation: Evaluation): number => {
    if (evaluation.candidates.length === 0) return 0;
    const total = evaluation.candidates.reduce((sum, candidate) => sum + candidate.score, 0);
    return total / evaluation.candidates.length;
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [jobs, candidates] = await Promise.all([jobService.getAll(), candidateService.getAll()]);

      const jobsWithDetails = await Promise.all(
        jobs.map(async (job) => {
          const [applications, evaluations] = await Promise.all([
            applicationService.getByJobId(job.id).catch(() => []),
            evaluationService.getHistory(job.id).catch(() => []),
          ]);

          return {
            job,
            candidatesCount: applications.length,
            evaluations,
          };
        }),
      );

      const allEvaluations = jobsWithDetails.flatMap((item) => item.evaluations);
      const now = new Date();

      const evaluationsThisMonth = allEvaluations.filter((evaluation) => {
        const evaluatedDate = new Date(evaluation.evaluatedAt);
        return evaluatedDate.getMonth() === now.getMonth() && evaluatedDate.getFullYear() === now.getFullYear();
      }).length;

      const allScores = allEvaluations.flatMap((evaluation) =>
        evaluation.candidates.map((candidate) => candidate.score),
      );
      const avgMatchScore =
        allScores.length > 0 ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;

      const recentJobsData = [...jobsWithDetails]
        .sort((a, b) => new Date(b.job.createdAt).getTime() - new Date(a.job.createdAt).getTime())
        .slice(0, 3)
        .map(({ job, candidatesCount }) => ({
          id: job.id,
          title: job.title,
          candidates: candidatesCount,
          status: job.status,
          date: formatRelativeTime(job.createdAt),
        }));

      const recentEvaluationsData = [...allEvaluations]
        .sort((a, b) => new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime())
        .slice(0, 3)
        .map((evaluation) => ({
          id: evaluation.evaluationId,
          job: evaluation.jobTitle,
          candidates: evaluation.totalEvaluated,
          avgScore: Number(calculateEvaluationAverage(evaluation).toFixed(1)),
          date: formatRelativeTime(evaluation.evaluatedAt),
        }));

      setStatsData({
        activeJobs: jobs.filter((job) => job.status === "OPEN" || job.status === "ACTIVE").length,
        totalCandidates: candidates.length,
        evaluationsThisMonth,
        avgMatchScore,
      });
      setRecentJobs(recentJobsData);
      setRecentEvaluations(recentEvaluationsData);
    } catch (error) {
      toast.error(parseApiError(error, "Failed to load dashboard data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Active Jobs",
      value: statsData.activeJobs.toString(),
      change: "Live",
      trend: "up" as const,
      icon: <FaBriefcase className="text-primary" />,
    },
    {
      label: "Total Candidates",
      value: statsData.totalCandidates.toLocaleString(),
      change: "Live",
      trend: "up" as const,
      icon: <FaPeopleGroup className="text-primary" />,
    },
    {
      label: "Evaluations This Month",
      value: statsData.evaluationsThisMonth.toString(),
      change: "Live",
      trend: "up" as const,
      icon: <FaChartLine className="text-primary" />,
    },
    {
      label: "Avg Match Score",
      value: statsData.avgMatchScore.toFixed(1),
      change: "Live",
      trend: "up" as const,
      icon: <FaStar className="text-primary" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {firstName}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your recruitment today.</p>
        </div>

        {loading ? (
          <LoadingSection message="Loading dashboard data..." className="py-20" />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <DashboardStatCard
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  change={stat.change}
                  trend={stat.trend}
                  icon={stat.icon}
                />
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Recent Jobs</h2>
                  <Link to="/jobs" className="text-primary hover:text-primary/80 text-sm font-medium">
                    View all →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentJobs.length > 0 ? (
                    recentJobs.map((job) => (
                      <RecentJobListItem
                        key={job.id}
                        id={job.id}
                        title={job.title}
                        candidates={job.candidates}
                        status={job.status}
                        date={job.date}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No jobs yet</p>
                  )}
                </div>
              </div>

              {/* Recent Evaluations */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Recent Evaluations</h2>
                  <Link to="/evaluations" className="text-primary hover:text-primary/80 text-sm font-medium">
                    View all →
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentEvaluations.length > 0 ? (
                    recentEvaluations.map((evaluation) => (
                      <RecentEvaluationListItem
                        key={evaluation.id}
                        id={evaluation.id}
                        job={evaluation.job}
                        candidates={evaluation.candidates}
                        avgScore={evaluation.avgScore}
                        date={evaluation.date}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No evaluations yet</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="bg-linear-to-br from-primary to-accent rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/jobs/new"
              className="bg-white/20 hover:bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 transition-colors"
            >
              <FaBriefcase className="text-3xl mb-2" />
              <h3 className="font-semibold mb-1">Create New Job</h3>
              <p className="text-sm text-white/80">Post a new job description</p>
            </Link>
            <Link
              to="/candidates/new"
              className="bg-white/20 hover:bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 transition-colors"
            >
              <FaPeopleGroup className="text-3xl mb-2" />
              <h3 className="font-semibold mb-1">Add Candidate</h3>
              <p className="text-sm text-white/80">Upload a new CV</p>
            </Link>
            <Link
              to="/evaluations"
              className="bg-white/20 hover:bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-4 transition-colors"
            >
              <FaChartLine className="text-3xl mb-2" />
              <h3 className="font-semibold mb-1">Run Evaluation</h3>
              <p className="text-sm text-white/80">Analyze candidates with AI</p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
