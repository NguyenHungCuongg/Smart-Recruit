import { Link } from "react-router-dom";

interface Evaluation {
  id: string;
  date: string;
  candidates: number;
  avgScore: number;
  modelVersion: string;
}

interface JobEvaluationsTabProps {
  evaluations: Evaluation[];
}

export const JobEvaluationsTab = ({ evaluations }: JobEvaluationsTabProps) => {
  return (
    <div className="space-y-4">
      {evaluations.map((evaluation) => (
        <Link
          key={evaluation.id}
          to={`/evaluations/${evaluation.id}`}
          className="block bg-secondary/30 rounded-xl p-4 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{evaluation.date}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {evaluation.candidates} candidates • Model {evaluation.modelVersion}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{evaluation.avgScore}</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
