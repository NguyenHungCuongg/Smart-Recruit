import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DashboardLayout } from "../components/DashboardLayout";
import { DashboardStatCard } from "../components/DashboardStatCard";
import { RecentJobListItem } from "../components/RecentJobListItem";
import { RecentEvaluationListItem } from "../components/RecentEvaluationListItem";
import { FaBriefcase, FaPeopleGroup, FaChartLine, FaStar } from "react-icons/fa6";

export const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Active Jobs",
      value: user?.role === "ADMIN" ? "24" : "8",
      change: "+12%",
      trend: "up" as const,
      icon: <FaBriefcase className="text-primary" />,
    },
    {
      label: "Total Candidates",
      value: user?.role === "ADMIN" ? "1,247" : "156",
      change: "+23%",
      trend: "up" as const,
      icon: <FaPeopleGroup className="text-primary" />,
    },
    {
      label: "Evaluations This Month",
      value: user?.role === "ADMIN" ? "342" : "48",
      change: "+8%",
      trend: "up" as const,
      icon: <FaChartLine className="text-primary" />,
    },
    {
      label: "Avg Match Score",
      value: "86.5",
      change: "+2.3%",
      trend: "up" as const,
      icon: <FaStar className="text-primary" />,
    },
  ];

  const recentJobs = [
    { id: 1, title: "Senior Full Stack Developer", candidates: 24, status: "OPEN", date: "2 days ago" },
    { id: 2, title: "Product Manager", candidates: 18, status: "ACTIVE", date: "5 days ago" },
    { id: 3, title: "UX Designer", candidates: 12, status: "OPEN", date: "1 week ago" },
  ];

  const recentEvaluations = [
    { id: 1, job: "Senior Full Stack Developer", candidates: 24, avgScore: 87.5, date: "1 hour ago" },
    { id: 2, job: "Product Manager", candidates: 18, avgScore: 82.3, date: "3 hours ago" },
    { id: 3, job: "UX Designer", candidates: 12, avgScore: 91.2, date: "1 day ago" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.fullName.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your recruitment today.</p>
        </div>

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
              {recentJobs.map((job) => (
                <RecentJobListItem
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  candidates={job.candidates}
                  status={job.status}
                  date={job.date}
                />
              ))}
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
              {recentEvaluations.map((evaluation) => (
                <RecentEvaluationListItem
                  key={evaluation.id}
                  id={evaluation.id}
                  job={evaluation.job}
                  candidates={evaluation.candidates}
                  avgScore={evaluation.avgScore}
                  date={evaluation.date}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-white">
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
