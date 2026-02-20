interface JobInfoTabProps {
  description: string;
  requirements: {
    skills: string[];
    experience: number;
    education: string;
    seniority: string;
  };
}

export const JobInfoTab = ({ description, requirements }: JobInfoTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground mb-2">Skills Required</p>
            <div className="flex flex-wrap gap-2">
              {requirements.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground mb-2">Experience Level</p>
            <p className="text-muted-foreground">{requirements.experience}+ years</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground mb-2">Education</p>
            <p className="text-muted-foreground">{requirements.education}</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-sm font-medium text-foreground mb-2">Seniority</p>
            <p className="text-muted-foreground">{requirements.seniority}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
