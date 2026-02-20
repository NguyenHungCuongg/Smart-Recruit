import { FaLink } from "react-icons/fa6";

interface CandidateProfileTabProps {
  skills: string[];
  links?: {
    linkedin?: string;
    github?: string;
    [key: string]: string | undefined;
  };
}

export const CandidateProfileTab = ({ skills, links }: CandidateProfileTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill} className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Links</h3>
        <div className="space-y-2">
          {links &&
            Object.entries(links).map(([platform, url]) =>
              url ? (
                <a
                  key={platform}
                  href={`https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                >
                  <FaLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {platform}: {url}
                  </span>
                </a>
              ) : null,
            )}
        </div>
      </div>
    </div>
  );
};
