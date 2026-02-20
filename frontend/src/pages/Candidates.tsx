import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { CandidateCard } from "../components/CandidateCard";
import notFound from "../assets/not-found.png";
import { FaSistrix, FaPlus } from "react-icons/fa6";

export const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const candidates = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 234 567 8900",
      cvCount: 3,
      latestCv: "2024-02-12",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      education: "BACHELOR",
      experience: 6,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 234 567 8901",
      cvCount: 2,
      latestCv: "2024-02-10",
      skills: ["Python", "Django", "PostgreSQL"],
      education: "MASTER",
      experience: 4,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.j@email.com",
      phone: "+1 234 567 8902",
      cvCount: 1,
      latestCv: "2024-02-08",
      skills: ["Vue.js", "Docker", "Kubernetes"],
      education: "BACHELOR",
      experience: 5,
    },
  ];

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())),
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              id={candidate.id}
              name={candidate.name}
              email={candidate.email}
              phone={candidate.phone}
              cvCount={candidate.cvCount}
              latestCv={candidate.latestCv}
              skills={candidate.skills}
              experience={candidate.experience}
            />
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <img src={notFound} alt="No candidates found" className="mx-auto mb-4 w-64 h-64" />
            <p className="text-muted-foreground">No candidates found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
