import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { JobStatusBadge } from "../components/JobStatusBadge";
import { FaSistrix, FaRegEye, FaRegPenToSquare } from "react-icons/fa6";
import notFound from "../assets/not-found.png";

export const Jobs = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const jobs = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      status: "OPEN",
      candidates: 24,
      evaluations: 2,
      createdAt: "2024-02-10",
      industry: "Technology",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      status: "ACTIVE",
      candidates: 18,
      evaluations: 3,
      createdAt: "2024-02-08",
      industry: "Technology",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "New York, NY",
      status: "OPEN",
      candidates: 12,
      evaluations: 1,
      createdAt: "2024-02-05",
      industry: "Design",
    },
    {
      id: 4,
      title: "Data Scientist",
      department: "Data",
      location: "Remote",
      status: "CLOSED",
      candidates: 32,
      evaluations: 5,
      createdAt: "2024-01-28",
      industry: "Analytics",
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Austin, TX",
      status: "ACTIVE",
      candidates: 15,
      evaluations: 2,
      createdAt: "2024-02-12",
      industry: "Technology",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Job Openings</h1>
            <p className="text-muted-foreground">
              Manage and track all your job postings {user?.role === "ADMIN" && "across the organization"}
            </p>
          </div>
          <Link
            to="/jobs/new"
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Job</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or department..."
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                <FaSistrix className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Candidates</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Evaluations</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/jobs/${job.id}`} className="font-semibold text-foreground hover:text-primary">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{job.department}</td>
                    <td className="px-6 py-4 text-muted-foreground">{job.location}</td>
                    <td className="px-6 py-4">
                      <JobStatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center space-x-1">
                        <span className="text-foreground font-semibold">{job.candidates}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{job.evaluations}</td>
                    <td className="px-6 py-4 text-muted-foreground text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaRegEye className="w-4 h-4 text-muted-foreground" />
                        </Link>
                        <Link
                          to={`/jobs/${job.id}/edit`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaRegPenToSquare className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <img src={notFound} alt="No jobs found" className="mx-auto mb-4 w-64 h-64" />
              <p className="text-muted-foreground">No jobs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
