import { Link } from "react-router-dom";
import { useState } from "react";
import { FaPlus, FaTimes, FaUserPlus } from "react-icons/fa";
import { CandidateSelectItem } from "./CandidateSelectItem";
import { CVSelectItem } from "./CVSelectItem";
import toast from "react-hot-toast";

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

// Mock data - danh sách tất cả candidates trong hệ thống
const allCandidates = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    cvs: [
      { id: 101, fileName: "john_cv_2024.pdf", uploadedAt: "2024-02-12" },
      { id: 102, fileName: "john_cv_senior.pdf", uploadedAt: "2024-01-15" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    cvs: [{ id: 201, fileName: "jane_resume.pdf", uploadedAt: "2024-02-11" }],
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@email.com",
    cvs: [{ id: 301, fileName: "mike_cv.pdf", uploadedAt: "2024-02-10" }],
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    cvs: [
      { id: 401, fileName: "sarah_cv_latest.pdf", uploadedAt: "2024-02-09" },
      { id: 402, fileName: "sarah_cv_old.pdf", uploadedAt: "2023-12-01" },
    ],
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.b@email.com",
    cvs: [{ id: 501, fileName: "david_resume.pdf", uploadedAt: "2024-02-08" }],
  },
];

export const JobCandidatesTab = ({ candidates }: JobCandidatesTabProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [selectedCV, setSelectedCV] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCandidate = () => {
    if (!selectedCandidate || !selectedCV) {
      toast.error("Please select a candidate and their CV");
      return;
    }

    // TODO: Integrate with backend API
    const candidate = allCandidates.find((c) => c.id === selectedCandidate);
    const cv = candidate?.cvs.find((c) => c.id === selectedCV);

    toast.success(`Added ${candidate?.name} with ${cv?.fileName} to this job!`);
    setShowModal(false);
    setSelectedCandidate(null);
    setSelectedCV(null);
    setSearchTerm("");
  };

  const filteredCandidates = allCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedCandidateData = allCandidates.find((c) => c.id === selectedCandidate);

  return (
    <div className="space-y-4">
      {/* Add Candidate Button */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} applied to this job
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add Candidate to this Job</span>
        </button>
      </div>

      {/* Candidates List */}
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

      {candidates.length === 0 && (
        <div className="text-center py-12 bg-secondary/20 rounded-xl">
          <FaUserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No candidates applied yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors inline-flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add First Candidate</span>
          </button>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Add Candidate to Job</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCandidate(null);
                  setSelectedCV(null);
                  setSearchTerm("");
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Search Candidates</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Candidates List */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Candidate <span className="text-destructive">*</span>
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredCandidates.map((candidate) => (
                    <CandidateSelectItem
                      key={candidate.id}
                      id={candidate.id}
                      name={candidate.name}
                      email={candidate.email}
                      cvCount={candidate.cvs.length}
                      isSelected={selectedCandidate === candidate.id}
                      onSelect={(id) => {
                        setSelectedCandidate(id);
                        setSelectedCV(null);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* CV Selection */}
              {selectedCandidateData && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select CV Version <span className="text-destructive">*</span>
                  </label>
                  <div className="space-y-2">
                    {selectedCandidateData.cvs.map((cv) => (
                      <CVSelectItem
                        key={cv.id}
                        id={cv.id}
                        fileName={cv.fileName}
                        uploadedAt={cv.uploadedAt}
                        isSelected={selectedCV === cv.id}
                        onSelect={setSelectedCV}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCandidate(null);
                  setSelectedCV(null);
                  setSearchTerm("");
                }}
                className="px-6 py-2.5 border border-border text-foreground rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCandidate}
                disabled={!selectedCandidate || !selectedCV}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FaUserPlus className="w-4 h-4" />
                <span>Add to Job</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
