import { DashboardLayout } from "../components/DashboardLayout";
import { AdminStatCard } from "../components/AdminStatCard";
import { FaBriefcase, FaPeopleGroup, FaChartLine, FaStar, FaTimeline } from "react-icons/fa6";

export const AdminAnalytics = () => {
  const systemStats = {
    totalJobs: 47,
    totalCandidates: 156,
    totalEvaluations: 23,
    avgMatchScore: 84.2,
  };

  const activityData = [
    { month: "Jan", jobs: 8, candidates: 32, evaluations: 5 },
    { month: "Feb", jobs: 12, candidates: 45, evaluations: 8 },
  ];

  const topRecruiters = [
    { name: "John Smith", jobs: 12, evaluations: 6, avgScore: 86.5 },
    { name: "Sarah Johnson", jobs: 8, evaluations: 4, avgScore: 84.2 },
    { name: "Mike Davis", jobs: 5, evaluations: 2, avgScore: 82.1 },
  ];

  const recentActivity = [
    { user: "John Smith", action: "Created job", target: "Senior Full Stack Developer", time: "2 hours ago" },
    { user: "Sarah Johnson", action: "Ran evaluation", target: "Product Manager", time: "5 hours ago" },
    { user: "Admin User", action: "Added user", target: "Emma Wilson", time: "1 day ago" },
    { user: "Mike Davis", action: "Updated job", target: "UX Designer", time: "2 days ago" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">System Analytics</h1>
          <p className="text-muted-foreground">Overview of system-wide metrics and activity</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Jobs"
            value={systemStats.totalJobs}
            change="+12 this month"
            icon={<FaBriefcase className="text-primary" />}
          />

          <AdminStatCard
            label="Total Candidates"
            value={systemStats.totalCandidates}
            change="+45 this month"
            icon={<FaPeopleGroup className="text-primary" />}
          />

          <AdminStatCard
            label="Total Evaluations"
            value={systemStats.totalEvaluations}
            change="+8 this month"
            icon={<FaChartLine className="text-primary" />}
          />

          <AdminStatCard
            label="Avg Match Score"
            value={systemStats.avgMatchScore}
            change="+2.3 points"
            icon={<FaStar className="text-primary" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart Placeholder */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Monthly Activity</h2>
            <div className="space-y-4">
              {activityData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{data.month}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-primary">Jobs: {data.jobs}</span>
                      <span className="text-score-average">Candidates: {data.candidates}</span>
                      <span className="text-score-good">Evaluations: {data.evaluations}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
                    <div className="bg-primary" style={{ width: `${(data.jobs / 15) * 100}%` }} />
                    <div className="bg-score-average" style={{ width: `${(data.candidates / 50) * 100}%` }} />
                    <div className="bg-score-good" style={{ width: `${(data.evaluations / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Recruiters */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Top Recruiters</h2>
            <div className="space-y-4">
              {topRecruiters.map((recruiter, index) => (
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
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent System Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-6 hover:bg-secondary/30 transition-colors">
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
                      <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
