import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { CandidateProfileTab } from "../components/CandidateProfileTab";
import { CandidateCVsTab } from "../components/CandidateCVsTab";
import { CandidateApplicationsTab } from "../components/CandidateApplicationsTab";
import { GrLocation, GrMailOption, GrPhone } from "react-icons/gr";

export const CandidateDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"profile" | "cvs" | "applications">("profile");

  const candidate = {
    id: parseInt(id || "1"),
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA",
    links: {
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
    },
    education: "MASTER",
    yearsOfExperience: 6,
    currentRole: "Senior Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL", "MongoDB"],
  };

  const cvs = [
    {
      id: 1,
      filename: "John_Doe_Resume_Feb_2024.pdf",
      uploadDate: "2024-02-12 14:30",
      fileSize: "245 KB",
      status: "parsed",
      parsedData: {
        skills: 7,
        experience: "6 years",
        education: "Master of Computer Science",
      },
    },
    {
      id: 2,
      filename: "John_Doe_CV_2023.pdf",
      uploadDate: "2023-11-20 10:15",
      fileSize: "198 KB",
      status: "parsed",
      parsedData: {
        skills: 6,
        experience: "5 years",
        education: "Master of Computer Science",
      },
    },
  ];

  const applications = [
    {
      id: 1,
      jobId: 1,
      jobTitle: "Senior Full Stack Developer",
      appliedDate: "2024-02-12",
      status: "evaluated",
      score: 67,
      rank: 2,
      totalCandidates: 15,
    },
    {
      id: 2,
      jobId: 3,
      jobTitle: "Tech Lead - Frontend",
      appliedDate: "2024-02-10",
      status: "pending",
      score: null,
      rank: null,
      totalCandidates: null,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/candidates" className="hover:text-primary">
            Candidates
          </Link>
          <span>/</span>
          <span className="text-foreground">{candidate.name}</span>
        </div>

        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-4xl">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{candidate.name}</h1>
                <p className="text-lg text-primary font-medium mb-3">{candidate.currentRole}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <GrMailOption className="w-4 h-4" />
                    <span>{candidate.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <GrPhone className="w-4 h-4 transform" />
                    <span>{candidate.phone}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <GrLocation className="w-4 h-4" />
                    <span>{candidate.location}</span>
                  </span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">CVs Uploaded</p>
            <p className="text-3xl font-bold text-foreground">{cvs.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Applications</p>
            <p className="text-3xl font-bold text-foreground">{applications.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Experience</p>
            <p className="text-3xl font-bold text-foreground">
              {candidate.yearsOfExperience > 1 ? `${candidate.yearsOfExperience} years` : "Less than 1 year"}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-sm text-muted-foreground mb-1">Skills</p>
            <p className="text-3xl font-bold text-foreground">{candidate.skills.length}</p>
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
            {activeTab === "profile" && <CandidateProfileTab skills={candidate.skills} links={candidate.links} />}

            {/* CVs Tab */}
            {activeTab === "cvs" && <CandidateCVsTab cvs={cvs} />}

            {/* Applications Tab */}
            {activeTab === "applications" && <CandidateApplicationsTab applications={applications} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
