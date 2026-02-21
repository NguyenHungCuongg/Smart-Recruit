import { Link } from "react-router-dom";

interface FeatureScores {
  skills: number;
  experience: number;
  education: number;
  relevance: number;
}

interface Result {
  candidateId: number;
  name: string;
  email: string;
  score: number;
  confidence: number;
  rank: number;
  featureScores: FeatureScores;
}

interface EvaluationResultCardProps {
  result: Result;
}

export const EvaluationResultCard = ({ result }: EvaluationResultCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-score-excellent";
    if (score >= 70) return "bg-score-good";
    if (score >= 50) return "bg-score-average";
    return "bg-score-poor";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 85) return "bg-score-excellent/20";
    if (score >= 70) return "bg-score-good/20";
    if (score >= 50) return "bg-score-average/20";
    return "bg-score-poor/20";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {result.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <Link
                to={`/candidates/${result.candidateId}`}
                className="text-xl font-semibold text-foreground hover:text-primary"
              >
                {result.name}
              </Link>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                #{result.rank}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{result.email}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-bold ${getScoreColor(result.score)} mb-1`}>{result.score}</div>
          <p className="text-xs text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Feature Scores */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Score Breakdown</p>
        {Object.entries(result.featureScores).map(([feature, score]) => (
          <div key={feature}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground capitalize">{feature}</span>
              <span className={`text-sm font-semibold ${getScoreColor(score)}`}>{score}</span>
            </div>
            <div className={`h-2 ${getScoreBarColor(score)} rounded-full overflow-hidden`}>
              <div className={`h-full ${getScoreBgColor(score)}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-border">
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
