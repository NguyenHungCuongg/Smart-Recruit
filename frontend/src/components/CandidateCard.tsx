import { Link } from "react-router-dom";
import { GrMailOption, GrPhone } from "react-icons/gr";

interface CandidateCardProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  cvCount: number;
  latestCv: string;
  skills: string[];
  experience: number;
}

export const CandidateCard = ({
  id,
  name,
  email,
  phone,
  cvCount,
  latestCv,
  skills,
  experience,
}: CandidateCardProps) => {
  return (
    <Link
      to={`/candidates/${id}`}
      className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
          {name.charAt(0)}
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          {cvCount} CV{cvCount > 1 ? "s" : ""}
        </span>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <GrMailOption className="w-4 h-4" />
          <span>{email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <GrPhone className="w-4 h-4 transform" />
          <span>{phone}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Skills</p>
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2 py-0.5 bg-secondary text-foreground rounded text-xs">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-xs">+{skills.length - 3}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
        <span>{experience} years exp</span>
        <span>Latest: {latestCv}</span>
      </div>
    </Link>
  );
};
