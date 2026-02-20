import { FaRegFile } from "react-icons/fa6";

interface CV {
  id: number;
  filename: string;
  uploadDate: string;
  fileSize: string;
  status: string;
  parsedData: {
    skills: number;
    experience: string;
    education: string;
  };
}

interface CandidateCVsTabProps {
  cvs: CV[];
}

export const CandidateCVsTab = ({ cvs }: CandidateCVsTabProps) => {
  return (
    <div className="space-y-4">
      {cvs.map((cv) => (
        <div key={cv.id} className="bg-secondary/30 border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FaRegFile className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{cv.filename}</h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{cv.uploadDate}</span>
                  <span>•</span>
                  <span>{cv.fileSize}</span>
                  <span>•</span>
                  <span className="px-2 py-0.5 bg-chart-1/20 text-chart-1 rounded text-xs">{cv.status}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors">
              Download
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Skills Extracted</p>
              <p className="font-semibold text-foreground">{cv.parsedData.skills} skills</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Experience</p>
              <p className="font-semibold text-foreground">{cv.parsedData.experience}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Education</p>
              <p className="font-semibold text-foreground">{cv.parsedData.education}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
