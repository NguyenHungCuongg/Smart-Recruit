import { Link } from "react-router-dom";

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  appliedDate: string;
  status: string;
  score: number | null;
  rank: number | null;
  totalCandidates: number | null;
}

interface CandidateApplicationsTabProps {
  applications: Application[];
}

export const CandidateApplicationsTab = ({ applications }: CandidateApplicationsTabProps) => {
  const getScoreColor = (score: number | null) => {
    if (!score) return "text-score-poor";
    if (score >= 90) return "text-score-excellent";
    if (score >= 80) return "text-score-good";
    if (score >= 60) return "text-score-average";
    return "text-score-poor";
  };

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="bg-secondary/30 border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link
                to={`/jobs/${app.jobId}`}
                className="text-xl font-semibold text-foreground hover:text-primary mb-2 inline-block"
              >
                {app.jobTitle}
              </Link>
              <p className="text-sm text-muted-foreground">Applied on {app.appliedDate}</p>
            </div>
            <Link
              to={`/jobs/${app.jobId}`}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
            >
              View Job
            </Link>
          </div>

          {app.status === "evaluated" ? (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(app.score)}`}>{app.score}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ranking</p>
                <p className="text-2xl font-bold text-foreground">
                  #{app.rank} of {app.totalCandidates}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Percentile</p>
                <p className="text-2xl font-bold text-primary">
                  {app.rank && app.totalCandidates ? Math.round((1 - app.rank / app.totalCandidates) * 100) : 0}%
                </p>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-border">
              <span className="px-3 py-1 bg-muted/50 text-muted-foreground rounded-full text-sm">
                Evaluation pending
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
