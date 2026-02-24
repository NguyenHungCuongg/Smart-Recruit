import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaUserPlus, FaChartLine } from "react-icons/fa";
import { CandidateSelectItem } from "./CandidateSelectItem";
import { CVSelectItem } from "./CVSelectItem";
import { LoadingSection } from "./LoadingSection";
import { LoadingSpinner } from "./LoadingSpinner";
import toast from "react-hot-toast";
import applicationService from "../services/applicationService";
import type { Application } from "../services/applicationService";
import candidateService from "../services/candidateService";
import evaluationService from "../services/evaluationService";

interface JobCandidatesTabProps {
  jobId: string;
}

interface CandidateWithCVs {
  id: string;
  fullName: string;
  email: string;
  cvs: Array<{
    id: string;
    fileName: string;
    uploadedAt: string;
  }>;
}

export const JobCandidatesTab = ({ jobId }: JobCandidatesTabProps) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [allCandidates, setAllCandidates] = useState<CandidateWithCVs[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadApplications();
    loadAllCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const apps = await applicationService.getByJobId(jobId);
      setApplications(apps);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const loadAllCandidates = async () => {
    try {
      const candidates = await candidateService.getAll();
      const candidatesWithCVs = await Promise.all(
        candidates.map(async (candidate) => {
          const cvs = await candidateService.getCVs(candidate.id).catch(() => []);
          return {
            id: candidate.id,
            fullName: candidate.fullName,
            email: candidate.email,
            cvs: cvs,
          };
        }),
      );
      setAllCandidates(candidatesWithCVs.filter((c) => c.cvs.length > 0));
    } catch {
      toast.error("Failed to load candidates");
    }
  };

  const handleAddCandidate = async () => {
    if (!selectedCandidate || !selectedCV) {
      toast.error("Please select a candidate and their CV");
      return;
    }

    try {
      await applicationService.create({
        jobId: jobId,
        cvId: selectedCV,
      });

      toast.success("Candidate added to job successfully!");
      setShowModal(false);
      setSelectedCandidate(null);
      setSelectedCV(null);
      setSearchTerm("");
      loadApplications(); // Reload applications
    } catch {
      toast.error("Failed to add candidate to job");
    }
  };

  const handleRunEvaluation = async () => {
    if (applications.length === 0) {
      toast.error("No candidates to evaluate");
      return;
    }

    const confirm = window.confirm(
      `Run evaluation for ${applications.length} candidate(s)? This will send their CVs to the ML service for scoring.`,
    );

    if (!confirm) return;

    try {
      setEvaluating(true);
      const candidateIds = applications.map((app) => app.candidateId);
      const evaluation = await evaluationService.runEvaluation(jobId, candidateIds);

      toast.success("Evaluation completed successfully!");
      navigate(`/evaluations/${evaluation.evaluationId}`);
    } catch (error: unknown) {
      // Extract error message from response
      const err = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to run evaluation";
      const errorCode = err?.response?.data?.error;

      if (errorCode === "ML_SERVICE_UNAVAILABLE") {
        toast.error("ML Service is not available. Please ensure it is running and try again.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const filteredCandidates = allCandidates.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedCandidateData = allCandidates.find((c) => c.id === selectedCandidate);

  if (loading) {
    return <LoadingSection />;
  }

  return (
    <div className="space-y-4">
      {/* Add Candidate & Run Evaluation Buttons */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          {applications.length} candidate{applications.length !== 1 ? "s" : ""} applied to this job
        </p>
        <div className="flex items-center space-x-3">
          {applications.length > 0 && (
            <button
              onClick={handleRunEvaluation}
              disabled={evaluating}
              className="px-4 py-2 bg-chart-1 hover:bg-chart-1/90 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evaluating ? (
                <>
                  <LoadingSpinner size="sm" className="border-white" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <FaChartLine className="w-4 h-4" />
                  <span>Run Evaluation</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center space-x-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* Applications List */}
      {applications.map((application) => (
        <div key={application.id} className="bg-secondary/30 rounded-xl p-4 hover:bg-secondary/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Link
                to={`/candidates/${application.candidateId}`}
                className="font-semibold text-foreground hover:text-primary"
              >
                {application.candidateName}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{application.cvFileName}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              {application.score !== undefined && application.score !== null ? (
                <>
                  <div className="text-3xl font-bold text-foreground">{application.score.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Match Score</div>
                </>
              ) : (
                <div className="px-3 py-1 bg-secondary rounded text-sm text-muted-foreground">Not evaluated</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {applications.length === 0 && (
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
                      name={candidate.fullName}
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
