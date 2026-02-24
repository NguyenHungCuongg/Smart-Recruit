import { Link } from "react-router-dom";
import { type CandidateScore } from "../services/evaluationService";

interface EvaluationResultCardProps {
  result: CandidateScore;
}

export const EvaluationResultCard = ({ result }: EvaluationResultCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  const getBgByRank = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600"; // Gold
    if (rank === 2) return "from-gray-300 to-gray-500"; // Silver
    if (rank === 3) return "from-amber-600 to-amber-800"; // Bronze
    return "from-primary to-accent";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div
            className={`w-16 h-16 bg-gradient-to-br ${getBgByRank(result.rank)} rounded-full flex items-center justify-center text-white font-bold text-2xl`}
          >
            {result.candidateName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Link
                to={`/candidates/${result.candidateId}`}
                className="text-xl font-semibold text-foreground hover:text-primary"
              >
                {result.candidateName}
              </Link>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                #{result.rank}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.candidateEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${getScoreColor(result.score)} mb-1`}>{result.score.toFixed(1)}</div>
          {result.confidence && (
            <p className="text-xs text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
          )}
          {result.status && (
            <p className="text-xs mt-1">
              <span
                className={`px-2 py-0.5 rounded ${
                  result.status === "SUCCESS" ? "bg-active/20 text-active" : "bg-red-500/20 text-red-500"
                }`}
              >
                {result.status}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Link
          to={`/candidates/${result.candidateId}`}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};
