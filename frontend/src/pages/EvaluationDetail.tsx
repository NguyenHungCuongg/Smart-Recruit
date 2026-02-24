import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { EvaluationResultCard } from "../components/EvaluationResultCard";
import { LoadingSection } from "../components/LoadingSection";
import evaluationService, { type Evaluation } from "../services/evaluationService";
import { toast } from "react-hot-toast";

export const EvaluationDetail = () => {
  const { id } = useParams();
  const [sortBy, setSortBy] = useState<"score" | "name">("score");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEvaluation(id);
    }
  }, [id]);

  const loadEvaluation = async (evaluationId: string) => {
    try {
      setLoading(true);
      const data = await evaluationService.getById(evaluationId);
      setEvaluation(data);
    } catch (error) {
      console.error("Error loading evaluation:", error);
      toast.error("Failed to load evaluation details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSection />
      </DashboardLayout>
    );
  }

  if (!evaluation) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Evaluation not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const sortedResults = [...evaluation.candidates].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    return a.candidateName.localeCompare(b.candidateName);
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  const avgScore =
    evaluation.candidates.length > 0
      ? evaluation.candidates.reduce((sum, r) => sum + r.score, 0) / evaluation.candidates.length
      : 0;

  const topScore = evaluation.candidates.length > 0 ? evaluation.candidates[0].score : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/evaluations" className="hover:text-primary">
            Evaluations
          </Link>
          <span>/</span>
          <Link to={`/jobs/${evaluation.jobId}`} className="hover:text-primary">
            {evaluation.jobTitle}
          </Link>
          <span>/</span>
          <span className="text-foreground">Results</span>
        </div>

        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Evaluation Results</h1>
              <Link to={`/jobs/${evaluation.jobId}`} className="text-lg text-primary hover:underline">
                {evaluation.jobTitle}
              </Link>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span>Evaluated on {new Date(evaluation.evaluatedAt).toLocaleString()}</span>
                <span>•</span>
                <span>Model {evaluation.modelVersion}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
            <p className="text-3xl font-bold text-foreground">{evaluation.totalEvaluated}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Top Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(topScore)}`}>{topScore.toFixed(1)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Qualified (≥85)</p>
            <p className="text-3xl font-bold text-chart-1">
              {evaluation.candidates.filter((r) => r.score >= 85).length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-foreground">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "score" | "name")}
              className="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="score">Score (High to Low)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground">Showing {sortedResults.length} candidates</p>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {sortedResults.map((result) => (
            <EvaluationResultCard key={result.candidateId} result={result} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};
