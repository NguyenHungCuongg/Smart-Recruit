import { Link } from "react-router-dom";

interface Candidate {
  id: number;
  name: string;
  score: number;
  skills: string[];
  uploadedAt: string;
}

interface JobCandidatesTabProps {
  candidates: Candidate[];
}

export const JobCandidatesTab = ({ candidates }: JobCandidatesTabProps) => {
  return (
    <div className="space-y-4">
      {candidates.map((candidate) => (
        <div key={candidate.id} className="bg-secondary/30 rounded-xl p-4 hover:bg-secondary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Link to={`/candidates/${candidate.id}`} className="font-semibold text-foreground hover:text-primary">
                {candidate.name}
              </Link>
              <div className="flex flex-wrap gap-2 mt-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Uploaded {candidate.uploadedAt}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{candidate.score}</div>
              <div className="text-xs text-muted-foreground">Match Score</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
