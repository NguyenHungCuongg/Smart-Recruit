import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { FileUploadItem } from "../components/FileUploadItem";
import { FaArrowLeft, FaUpload, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import jobService from "../services/jobService";

export const JobNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    status: "OPEN",
  });
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload PDF, DOC, DOCX, or TXT file only");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }

    setJdFile(file);
    toast.success("Job Description file selected");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleRemoveFile = () => {
    setJdFile(null);
    toast.success("File removed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Job title is required");
      return;
    }

    if (!formData.department.trim()) {
      toast.error("Department is required");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    if (!jdFile) {
      toast.error("Please upload a Job Description file");
      return;
    }

    try {
      setSubmitting(true);
      const job = await jobService.create({
        title: formData.title,
        department: formData.department,
        location: formData.location,
        status: formData.status,
        jdFile: jdFile,
      });

      toast.success("Job created successfully!");
      navigate(`/jobs/${job.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create job";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link
            to="/jobs"
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Create New Job</h1>
            <p className="text-muted-foreground">Add a new job opening with job description</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Job Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Full Stack Developer"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Department <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Engineering"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Remote, San Francisco, CA"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  <option value="OPEN">Open</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Description Upload */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Job Description <span className="text-destructive">*</span>
              </h2>
              <span className="text-sm text-muted-foreground">PDF, DOC, DOCX, TXT (Max 10MB)</span>
            </div>

            {!jdFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <input
                  type="file"
                  id="jd-upload"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="jd-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <FaUpload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        Drop your Job Description here, or <span className="text-primary hover:underline">browse</span>
                      </p>
                      <p className="text-sm text-muted-foreground">Supports: PDF, DOC, DOCX, TXT</p>
                    </div>
                  </div>
                </label>
              </div>
            ) : (
              <FileUploadItem fileName={jdFile.name} fileSize={jdFile.size} onRemove={handleRemoveFile} />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/jobs"
              className="px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FaFileAlt className="w-4 h-4" />
                  <span>Create Job</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
