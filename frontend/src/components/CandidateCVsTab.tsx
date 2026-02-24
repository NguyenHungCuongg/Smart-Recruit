import { useState } from "react";
import { FaRegFile } from "react-icons/fa6";
import type { CVSummary } from "../services/candidateService";
import candidateService from "../services/candidateService";
import { toast } from "react-hot-toast";

interface CandidateCVsTabProps {
  cvs: CVSummary[];
  candidateId: string;
  onCVUploaded: () => void;
}

export const CandidateCVsTab = ({ cvs, candidateId, onCVUploaded }: CandidateCVsTabProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await candidateService.uploadCV(candidateId, file);
      toast.success("CV uploaded successfully!");
      onCVUploaded();
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to upload CV");
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset input
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex justify-end">
        <label className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium cursor-pointer transition-colors">
          {uploading ? "Uploading..." : "Upload New CV"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* CVs List */}
      {cvs.length === 0 ? (
        <div className="text-center py-12 bg-secondary/30 border border-border rounded-xl">
          <p className="text-muted-foreground">No CVs uploaded yet</p>
        </div>
      ) : (
        cvs.map((cv) => (
          <div key={cv.id} className="bg-secondary/30 border border-border rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FaRegFile className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{cv.fileName}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Uploaded {new Date(cv.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
