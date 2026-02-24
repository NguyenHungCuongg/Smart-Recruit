import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { useState, useEffect } from "react";
import { FaPeopleGroup, FaChartLine, FaCalendarDays } from "react-icons/fa6";
import { GrLocation, GrAchievement } from "react-icons/gr";
import { JobStatusBadge } from "../components/JobStatusBadge";
import { JobInfoTab } from "../components/JobInfoTab";
import { JobCandidatesTab } from "../components/JobCandidatesTab";
import { JobEvaluationsTab } from "../components/JobEvaluationsTab";
import jobService from "../services/jobService";
import type { Job } from "../services/jobService";
import applicationService from "../services/applicationService";
import type { Application } from "../services/applicationService";
import evaluationService from "../services/evaluationService";
import type { Evaluation } from "../services/evaluationService";
import toast from "react-hot-toast";

export const JobDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"info" | "candidates" | "evaluations">("info");
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadJobData();
    }
  }, [id]);

  const loadJobData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [jobData, appsData, evalsData] = await Promise.all([
        jobService.getById(id),
        applicationService.getByJobId(id),
        evaluationService.getHistory(id),
      ]);
      setJob(jobData);
      setApplications(appsData);
      setEvaluations(evalsData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load job details";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const [daysOpen] = useState(() =>
    job ? Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Job not found</p>
          <Link to="/jobs" className="text-primary hover:text-primary/80 mt-4 inline-block">
            ← Back to Jobs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to="/jobs" className="text-primary hover:text-primary/80 text-sm mb-2 inline-block">
              ← Back to Jobs
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">{job.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span className="flex items-center space-x-1">
                <GrAchievement className="w-4 h-4" />
                <span>{job.department}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <GrLocation className="w-4 h-4" />
                <span>{job.location}</span>
              </span>
              <span>•</span>
              <JobStatusBadge status={job.status} />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/jobs/${id}/edit`}
              className="px-4 py-2 bg-secondary hover:bg-accent text-foreground rounded-lg transition-colors"
            >
              Edit Job
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
                <p className="text-3xl font-bold text-foreground">{applications.length}</p>
              </div>
              <FaPeopleGroup className="w-12 h-12 text-primary rounded-xl bg-primary/20 p-2" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Evaluations Run</p>
                <p className="text-3xl font-bold text-foreground">{evaluations.length}</p>
              </div>
              <FaChartLine className="w-12 h-12 text-primary rounded-xl bg-primary/20 p-2" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Days Open</p>
                <p className="text-3xl font-bold text-foreground">{daysOpen}</p>
              </div>
              <FaCalendarDays className="w-12 h-12 text-primary rounded-xl bg-primary/20 p-2" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="border-b border-border">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === "info"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Job Information
              </button>
              <button
                onClick={() => setActiveTab("candidates")}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === "candidates"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Candidates ({applications.length})
              </button>
              <button
                onClick={() => setActiveTab("evaluations")}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === "evaluations"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Evaluations ({evaluations.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Job Information Tab */}
            {activeTab === "info" && (
              <JobInfoTab
                description={job.description || "No description provided"}
                requirements={{ skills: [], experience: 0, education: "BACHELOR", seniority: "JUNIOR" }}
              />
            )}

            {/* Candidates Tab */}
            {activeTab === "candidates" && <JobCandidatesTab jobId={job.id} />}

            {/* Evaluations Tab */}
            {activeTab === "evaluations" && (
              <JobEvaluationsTab
                evaluations={evaluations.map((e) => ({
                  id: e.evaluationId,
                  date: e.evaluatedAt,
                  candidates: e.totalEvaluated,
                  avgScore:
                    e.candidates.length > 0
                      ? e.candidates.reduce((sum, r) => sum + r.score, 0) / e.candidates.length
                      : 0,
                  modelVersion: e.modelVersion,
                }))}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
