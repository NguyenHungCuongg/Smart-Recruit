import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { EvaluationResultCard } from "../components/EvaluationResultCard";

export const EvaluationDetail = () => {
  const { id } = useParams();
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  const evaluation = {
    id: parseInt(id || "1"),
    jobId: 1,
    jobTitle: "Senior Full Stack Developer",
    date: "2024-02-13 14:30",
    modelVersion: "v1.2.0",
    totalCandidates: 15,
  };

  const results = [
    {
      candidateId: 1,
      name: "Alice Johnson",
      email: "alice.j@email.com",
      score: 94,
      confidence: 0.92,
      rank: 1,
      featureScores: {
        skills: 95,
        experience: 92,
        education: 96,
        relevance: 93,
      },
    },
    {
      candidateId: 2,
      name: "John Doe",
      email: "john.doe@email.com",
      score: 72,
      confidence: 0.89,
      rank: 2,
      featureScores: {
        skills: 94,
        experience: 90,
        education: 58,
        relevance: 95,
      },
    },
    {
      candidateId: 3,
      name: "Sarah Miller",
      email: "sarah.m@email.com",
      score: 38,
      confidence: 0.86,
      rank: 3,
      featureScores: {
        skills: 90,
        experience: 35,
        education: 22,
        relevance: 36,
      },
    },
    {
      candidateId: 4,
      name: "Mike Wilson",
      email: "mike.w@email.com",
      score: 85,
      confidence: 0.84,
      rank: 4,
      featureScores: {
        skills: 88,
        experience: 82,
        education: 85,
        relevance: 87,
      },
    },
    {
      candidateId: 5,
      name: "Emma Brown",
      email: "emma.b@email.com",
      score: 82,
      confidence: 0.81,
      rank: 5,
      featureScores: {
        skills: 80,
        experience: 84,
        education: 82,
        relevance: 83,
      },
    },
  ];

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

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
                <span>Evaluated on {evaluation.date}</span>
                <span>•</span>
                <span>Model {evaluation.modelVersion}</span>
              </div>
            </div>
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium">
              Export Results
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Candidates</p>
            <p className="text-3xl font-bold text-foreground">{evaluation.totalCandidates}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Average Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Top Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(results[0].score)}`}>{results[0].score}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Qualified (≥85)</p>
            <p className="text-3xl font-bold text-chart-1">{results.filter((r) => r.score >= 85).length}</p>
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
