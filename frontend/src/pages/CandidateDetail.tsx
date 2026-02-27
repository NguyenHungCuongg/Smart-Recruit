import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { CandidateCVsTab } from "../components/CandidateCVsTab";
import { CandidateApplicationsTab } from "../components/CandidateApplicationsTab";
import { LoadingSection } from "../components/LoadingSection";
import { GrMailOption, GrPhone } from "react-icons/gr";
import candidateService, { type Candidate, type CVSummary } from "../services/candidateService";
import applicationService, { type Application } from "../services/applicationService";
import { toast } from "react-hot-toast";
import { parseApiError } from "../utils/parseApiError";

export const CandidateDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"profile" | "cvs" | "applications">("profile");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [cvs, setCvs] = useState<CVSummary[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCandidateData(id);
    }
  }, [id]);

  const loadCandidateData = async (candidateId: string) => {
    try {
      setLoading(true);
      const [candidateData, cvsData, applicationsData] = await Promise.all([
        candidateService.getById(candidateId),
        candidateService.getCVs(candidateId),
        applicationService.getByCandidateId(candidateId),
      ]);

      setCandidate(candidateData);
      setCvs(cvsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error loading candidate data:", error);
      toast.error(parseApiError(error, "Failed to load candidate details"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSection />
      </DashboardLayout>
    );
  }

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Candidate not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/candidates" className="hover:text-primary">
            Candidates
          </Link>
          <span>/</span>
          <span className="text-foreground">{candidate.fullName}</span>
        </div>

        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-4xl">
                {candidate.fullName?.charAt(0) || "?"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{candidate.fullName}</h1>
                <p className="text-lg text-primary font-medium mb-3">{candidate.email}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <GrMailOption className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </span>
                  {candidate.phone && (
                    <span className="flex items-center space-x-1">
                      <GrPhone className="w-4 h-4 transform" />
                      <span>{candidate.phone}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">CVs Uploaded</p>
            <p className="text-3xl font-bold text-foreground">{cvs.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Applications</p>
            <p className="text-3xl font-bold text-foreground">{applications.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Evaluated</p>
            <p className="text-3xl font-bold text-foreground">
              {applications.filter((app) => app.status === "EVALUATED").length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("cvs")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "cvs"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              CVs ({cvs.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === "applications"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
              }`}
            >
              Applications ({applications.length})
            </button>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>
                      <span className="font-medium">Email:</span> {candidate.email}
                    </p>
                    {candidate.phone && (
                      <p>
                        <span className="font-medium">Phone:</span> {candidate.phone}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Member since:</span>{" "}
                      {new Date(candidate.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CVs Tab */}
            {activeTab === "cvs" && (
              <CandidateCVsTab cvs={cvs} candidateId={id || ""} onCVUploaded={() => loadCandidateData(id || "")} />
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && <CandidateApplicationsTab applications={applications} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
