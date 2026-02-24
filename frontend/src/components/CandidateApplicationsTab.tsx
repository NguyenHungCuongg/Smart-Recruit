import { Link } from "react-router-dom";
import type { Application } from "../services/applicationService";
import jobService from "../services/jobService";
import { useEffect, useState } from "react";

interface CandidateApplicationsTabProps {
  applications: Application[];
}

interface JobTitle {
  [key: string]: string;
}

export const CandidateApplicationsTab = ({ applications }: CandidateApplicationsTabProps) => {
  const [jobTitles, setJobTitles] = useState<JobTitle>({});

  useEffect(() => {
    // Fetch job titles cho tất cả các lần ứng tuyển của candidate
    const fetchJobTitles = async () => {
      const titles: JobTitle = {};
      for (const app of applications) {
        try {
          const job = await jobService.getById(app.jobId);
          titles[app.jobId] = job.title;
        } catch (error) {
          console.error(`Failed to fetch job ${app.jobId}`, error);
          titles[app.jobId] = "Unknown Job";
        }
      }
      setJobTitles(titles);
    };

    if (applications.length > 0) {
      fetchJobTitles();
    }
  }, [applications]);
  const getScoreColor = (score: number | null) => {
    if (!score) return "text-score-poor";
    if (score >= 90) return "text-score-excellent";
    if (score >= 80) return "text-score-good";
    if (score >= 60) return "text-score-average";
    return "text-score-poor";
  };

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 border border-border rounded-xl">
          <p className="text-muted-foreground">No applications yet</p>
        </div>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="bg-secondary/30 border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Link
                  to={`/jobs/${app.jobId}`}
                  className="text-xl font-semibold text-foreground hover:text-primary mb-2 inline-block"
                >
                  {jobTitles[app.jobId] || "Loading..."}
                </Link>
                <p className="text-sm text-muted-foreground">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                to={`/jobs/${app.jobId}`}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
              >
                View Job
              </Link>
            </div>

            {app.status === "EVALUATED" && app.score !== undefined && app.score !== null ? (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                  <p className={`text-2xl font-bold ${getScoreColor(app.score)}`}>{app.score.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className="px-3 py-1 bg-chart-1/20 text-chart-1 rounded-full text-sm">{app.status}</span>
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-border">
                <span className="px-3 py-1 bg-muted/50 text-muted-foreground rounded-full text-sm">
                  {app.status === "PENDING" ? "Evaluation pending" : app.status}
                </span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
