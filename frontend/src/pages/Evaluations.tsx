import { DashboardLayout } from "../components/DashboardLayout";
import { Link } from "react-router-dom";
import { LoadingSection } from "../components/LoadingSection";
import { FaRegClock } from "react-icons/fa6";
import notFound from "../assets/not-found.png";
import { useState, useEffect } from "react";
import evaluationService from "../services/evaluationService";
import type { Evaluation } from "../services/evaluationService";
import jobService from "../services/jobService";
import toast from "react-hot-toast";

export const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = async () => {
    try {
      setLoading(true);
      const jobs = await jobService.getAll();

      const allEvaluations: Evaluation[] = [];
      for (const job of jobs) {
        try {
          const latest = await evaluationService.getLatest(job.id);
          if (latest && latest.totalEvaluated > 0) {
            allEvaluations.push(latest);
          }
        } catch {
          // No evaluation for this job yet, skip
        }
      }

      setEvaluations(allEvaluations);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load evaluations");
    } finally {
      setLoading(false);
    }
  };

  const totalCandidates = evaluations.reduce((sum, e) => sum + (e.totalEvaluated || 0), 0);
  const avgScore =
    evaluations.length > 0
      ? evaluations.reduce((sum, e) => {
          const evalAvg = e.candidates.reduce((s, r) => s + r.score, 0) / e.candidates.length;
          return sum + evalAvg;
        }, 0) / evaluations.length
      : 0;
  const topScore =
    evaluations.length > 0 ? Math.max(...evaluations.flatMap((e) => e.candidates.map((r) => r.score))) : 0;

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
            <p className="text-3xl font-bold text-foreground">{totalCandidates}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <p className="text-3xl font-bold text-primary">{avgScore.toFixed(1)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Top Score</p>
            <p className="text-3xl font-bold text-chart-1">{topScore.toFixed(1)}</p>
          </div>
        </div>

        {/* Evaluations List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Recent Evaluations</h2>
          </div>

          {loading ? (
            <LoadingSection />
          ) : (
            <div className="divide-y divide-border">
              {evaluations.map((evaluation) => {
                const evalAvgScore =
                  evaluation.candidates.reduce((sum, r) => sum + r.score, 0) / evaluation.candidates.length;
                const evalTopScore = Math.max(...evaluation.candidates.map((r) => r.score));

                return (
                  <div key={evaluation.evaluationId} className="p-6 hover:bg-secondary/30 transition-colors">
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
                            <span>{new Date(evaluation.evaluatedAt).toLocaleString()}</span>
                          </span>
                          <span>•</span>
                          <span>{evaluation.totalEvaluated} candidates</span>
                          <span>•</span>
                          <span>Model {evaluation.modelVersion}</span>
                        </div>
                      </div>
                      <Link
                        to={`/evaluations/${evaluation.evaluationId}`}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(evalAvgScore)}`}>{evalAvgScore.toFixed(1)}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Top Score</p>
                        <p className={`text-2xl font-bold ${getScoreColor(evalTopScore)}`}>{evalTopScore.toFixed(1)}</p>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Evaluated</p>
                        <p className="text-2xl font-bold text-foreground">{evaluation.totalEvaluated}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!loading && evaluations.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={notFound} alt="No evaluations" className="w-64 h-64 text-primary" />
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
    </DashboardLayout>
  );
};
