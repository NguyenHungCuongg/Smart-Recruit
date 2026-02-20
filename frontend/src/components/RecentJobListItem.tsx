import { Link } from "react-router-dom";
import { JobStatusBadge } from "./JobStatusBadge";

interface RecentJobListItemProps {
  id: number;
  title: string;
  candidates: number;
  status: string;
  date: string;
}

export const RecentJobListItem = ({ id, title, candidates, status, date }: RecentJobListItemProps) => {
  return (
    <Link to={`/jobs/${id}`} className="block p-4 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {candidates} candidates • {date}
          </p>
        </div>
        <JobStatusBadge status={status} />
      </div>
    </Link>
  );
};
