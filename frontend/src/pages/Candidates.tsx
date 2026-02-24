import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { CandidateCard } from "../components/CandidateCard";
import { LoadingSection } from "../components/LoadingSection";
import notFound from "../assets/not-found.png";
import { FaSistrix, FaPlus } from "react-icons/fa6";
import candidateService from "../services/candidateService";
import type { Candidate } from "../services/candidateService";
import toast from "react-hot-toast";

interface CandidateWithStats extends Candidate {
  cvCount: number;
  latestCv: string;
}

export const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState<CandidateWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const candidatesData = await candidateService.getAll();

      // Fetch CVs for each candidate
      const candidatesWithStats = await Promise.all(
        candidatesData.map(async (candidate) => {
          const cvs = await candidateService.getCVs(candidate.id).catch(() => []);
          const latestCV =
            cvs.length > 0
              ? cvs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0]
              : null;

          return {
            ...candidate,
            cvCount: cvs.length,
            latestCv: latestCV ? latestCV.uploadedAt : "",
          };
        }),
      );

      setCandidates(candidatesWithStats);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load candidates";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Candidates</h1>
            <p className="text-muted-foreground">Manage your candidate database and CVs</p>
          </div>
          <Link
            to="/candidates/new"
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
          >
            <FaPlus className="w-5 h-5" />
            <span>Add Candidate</span>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <label className="block text-sm font-medium text-foreground mb-2">Search Candidates</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or skills..."
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <FaSistrix className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Candidates Grid */}
        {loading ? (
          <LoadingSection />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                name={candidate.fullName}
                email={candidate.email}
                phone={candidate.phone}
                cvCount={candidate.cvCount}
                latestCv={candidate.latestCv}
                skills={[]}
                experience={0}
              />
            ))}

            {filteredCandidates.length === 0 && (
              <div className="col-span-full text-center py-12">
                <img src={notFound} alt="No candidates found" className="mx-auto mb-4 w-64 h-64" />
                <p className="text-muted-foreground">No candidates found matching your search</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
