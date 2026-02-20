import { Link } from "react-router-dom";

interface RecentEvaluationListItemProps {
  id: number;
  job: string;
  candidates: number;
  avgScore: number;
  date: string;
}

export const RecentEvaluationListItem = ({ id, job, candidates, avgScore, date }: RecentEvaluationListItemProps) => {
  return (
    <div className="p-4 bg-secondary/50 rounded-xl">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{job}</h3>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{avgScore}</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{candidates} candidates evaluated</span>
        <Link to={`/evaluations/${id}`} className="text-primary hover:text-primary/80">
          Details →
        </Link>
      </div>
    </div>
  );
};
