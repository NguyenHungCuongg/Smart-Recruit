import { DashboardLayout } from "../components/DashboardLayout";
import { Link } from "react-router-dom";
import { FaRegClock } from "react-icons/fa6";

export const Evaluations = () => {
  const evaluations = [
    {
      id: 1,
      jobId: 1,
      jobTitle: "Senior Full Stack Developer",
      date: "2024-02-13 14:30",
      candidates: 15,
      avgScore: 35.3,
      topScore: 44,
      modelVersion: "v1.2.0",
      status: "completed",
    },
    {
      id: 2,
      jobId: 2,
      jobTitle: "Product Manager",
      date: "2024-02-12 10:15",
      candidates: 12,
      avgScore: 82.7,
      topScore: 91,
      modelVersion: "v1.2.0",
      status: "completed",
    },
    {
      id: 3,
      jobId: 3,
      jobTitle: "UX Designer",
      date: "2024-02-11 16:45",
      candidates: 8,
      avgScore: 68.1,
      topScore: 70,
      modelVersion: "v1.2.0",
      status: "completed",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Evaluations</h1>
          <p className="text-muted-foreground">View and manage all candidate evaluations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Evaluations</p>
            <p className="text-3xl font-bold text-foreground">{evaluations.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Candidates Evaluated</p>
            <p className="text-3xl font-bold text-foreground">
              {evaluations.reduce((sum, e) => sum + e.candidates, 0)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <p className="text-3xl font-bold text-primary">
              {(evaluations.reduce((sum, e) => sum + e.avgScore, 0) / evaluations.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Top Score</p>
            <p className="text-3xl font-bold text-chart-1">{Math.max(...evaluations.map((e) => e.topScore))}</p>
          </div>
        </div>

        {/* Evaluations List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent Evaluations</h2>
          </div>

          <div className="divide-y divide-border">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="p-6 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/jobs/${evaluation.jobId}`}
                      className="text-xl font-semibold text-foreground hover:text-primary mb-2 inline-block"
                    >
                      {evaluation.jobTitle}
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-0.5 space-x-1">
                        <FaRegClock className="w-4 h-4" />
                        <span>{evaluation.date}</span>
                      </span>
                      <span>•</span>
                      <span>{evaluation.candidates} candidates</span>
                      <span>•</span>
                      <span>Model {evaluation.modelVersion}</span>
                    </div>
                  </div>
                  <Link
                    to={`/evaluations/${evaluation.id}`}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(evaluation.avgScore)}`}>{evaluation.avgScore}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Top Score</p>
                    <p className={`text-2xl font-bold ${getScoreColor(evaluation.topScore)}`}>{evaluation.topScore}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {Math.round(((evaluation.candidates * 0.6) / evaluation.candidates) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {evaluations.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No evaluations yet</h3>
            <p className="text-muted-foreground mb-6">Start by running an evaluation on your job postings</p>
            <Link
              to="/jobs"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all"
            >
              Go to Jobs
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
