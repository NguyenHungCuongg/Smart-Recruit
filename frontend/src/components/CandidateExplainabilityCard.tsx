import { type CandidateExplainability } from "../services/evaluationService";

interface CandidateExplainabilityCardProps {
  explainability: CandidateExplainability;
  candidateId: string;
}

export const CandidateExplainabilityCard = ({ explainability, candidateId }: CandidateExplainabilityCardProps) => {
  const scoreBarClass = (value: number) => {
    if (value >= 75) return "bg-score-good";
    if (value >= 50) return "bg-score-average";
    return "bg-score-poor";
  };

  return (
    <div className="rounded-xl border border-border bg-background p-4 mb-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">Why this score</h4>
      <p className="text-sm text-muted-foreground mb-4">{explainability.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {[
          { label: "Skills", value: explainability.skillsScore },
          { label: "Experience", value: explainability.experienceScore },
          { label: "Education", value: explainability.educationScore },
          { label: "Seniority", value: explainability.seniorityScore },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs text-foreground mb-1">
              <span>{item.label}</span>
              <span>{item.value.toFixed(1)}/100</span>
            </div>
            <div className="w-full h-2 rounded bg-muted overflow-hidden">
              <div
                className={`h-2 ${scoreBarClass(item.value)}`}
                style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Strengths</p>
          {explainability.strengths?.length ? (
            <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
              {explainability.strengths.map((item, index) => (
                <li key={`${candidateId}-strength-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No significant strengths captured.</p>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Gaps</p>
          {explainability.gaps?.length ? (
            <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
              {explainability.gaps.map((item, index) => (
                <li key={`${candidateId}-gap-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">No critical gaps detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};
