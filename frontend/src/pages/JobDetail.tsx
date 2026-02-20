import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { useState } from "react";
import { FaPeopleGroup, FaChartLine, FaCalendarDays } from "react-icons/fa6";
import { GrLocation, GrAchievement } from "react-icons/gr";
import { JobStatusBadge } from "../components/JobStatusBadge";
import { JobInfoTab } from "../components/JobInfoTab";
import { JobCandidatesTab } from "../components/JobCandidatesTab";
import { JobEvaluationsTab } from "../components/JobEvaluationsTab";

export const JobDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"info" | "candidates" | "evaluations">("info");

  // Mock data
  const job = {
    id,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    status: "OPEN",
    industry: "Technology",
    description: `We are looking for an experienced Full Stack Developer to join our growing engineering team. 
    You will work on building scalable web applications using modern technologies and best practices.`,
    requirements: {
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
      experience: 5,
      education: "BACHELOR",
      seniority: "SENIOR",
    },
    candidates: 24,
    evaluations: 2,
    createdAt: "2024-02-10",
  };

  const mockCandidates = [
    { id: 1, name: "John Doe", score: 92, skills: ["React", "Node.js", "TypeScript"], uploadedAt: "2024-02-12" },
    { id: 2, name: "Jane Smith", score: 87, skills: ["React", "Python", "AWS"], uploadedAt: "2024-02-11" },
    { id: 3, name: "Mike Johnson", score: 84, skills: ["Vue.js", "Node.js", "Docker"], uploadedAt: "2024-02-10" },
  ];

  const mockEvaluations = [
    { id: 1, date: "2024-02-13", candidates: 15, avgScore: 85.3, modelVersion: "v1.2.0" },
    { id: 2, date: "2024-02-11", candidates: 9, avgScore: 88.1, modelVersion: "v1.2.0" },
  ];

  const [daysOpen] = useState(() =>
    Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );

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
            <Link
              to={`/evaluations/${id}`}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
            >
              Run Evaluation
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
                <p className="text-3xl font-bold text-foreground">{job.candidates}</p>
              </div>
              <FaPeopleGroup className="w-12 h-12 text-primary rounded-xl bg-primary/20 p-2" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Evaluations Run</p>
                <p className="text-3xl font-bold text-foreground">{job.evaluations}</p>
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
                Candidates ({mockCandidates.length})
              </button>
              <button
                onClick={() => setActiveTab("evaluations")}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === "evaluations"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Evaluations ({mockEvaluations.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Job Information Tab */}
            {activeTab === "info" && <JobInfoTab description={job.description} requirements={job.requirements} />}

            {/* Candidates Tab */}
            {activeTab === "candidates" && <JobCandidatesTab candidates={mockCandidates} />}

            {/* Evaluations Tab */}
            {activeTab === "evaluations" && <JobEvaluationsTab evaluations={mockEvaluations} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
