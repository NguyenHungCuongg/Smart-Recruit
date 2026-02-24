import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../components/DashboardLayout";
import { FileUploadItem } from "../components/FileUploadItem";
import { FaArrowLeft, FaUpload, FaUserPlus, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import candidateService from "../services/candidateService";

interface CVFile {
  id: string;
  file: File;
}

export const CandidateNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => validateAndAddFile(file));
  };

  const validateAndAddFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error(`${file.name}: Please upload PDF, DOC, DOCX, or TXT file only`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast.error(`${file.name}: File size must be less than 10MB`);
      return;
    }

    // Check for duplicate file names
    const isDuplicate = cvFiles.some((cvFile) => cvFile.file.name === file.name);
    if (isDuplicate) {
      toast.error(`${file.name}: File already added`);
      return;
    }

    const newCVFile: CVFile = {
      id: `${Date.now()}-${Math.random()}`,
      file,
    };

    setCvFiles((prev) => [...prev, newCVFile]);
    toast.success(`${file.name} added successfully`);
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
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => validateAndAddFile(file));
  };

  const handleRemoveFile = (id: string) => {
    const file = cvFiles.find((cv) => cv.id === id);
    setCvFiles((prev) => prev.filter((cv) => cv.id !== id));
    if (file) {
      toast.success(`${file.file.name} removed`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Candidate name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (cvFiles.length === 0) {
      toast.error("Please upload at least one CV");
      return;
    }

    try {
      setSubmitting(true);

      // First, create the candidate
      const candidate = await candidateService.create({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
      });

      // Then upload all CVs for this candidate
      await Promise.all(cvFiles.map((cvFile) => candidateService.uploadCV(candidate.id, cvFile.file)));

      toast.success(`Candidate added with ${cvFiles.length} CV(s)!`);
      navigate(`/candidates/${candidate.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add candidate";
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
            to="/candidates"
            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Add New Candidate</h1>
            <p className="text-muted-foreground">Add a new candidate with their CV(s)</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Candidate Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g., john.doe@email.com"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number <span className="text-muted-foreground">(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1 234 567 8900"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>
          </div>

          {/* CV Upload */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                CV/Resume <span className="text-destructive">*</span>
              </h2>
              <span className="text-sm text-muted-foreground">PDF, DOC, DOCX, TXT (Max 10MB each)</span>
            </div>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }`}
            >
              <input
                type="file"
                id="cv-upload"
                accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <FaUpload className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-foreground mb-1">
                      Drop CV files here, or <span className="text-primary hover:underline">browse</span>
                    </p>
                    <p className="text-sm text-muted-foreground">You can upload multiple CVs for the same candidate</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Uploaded Files List */}
            {cvFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Uploaded CVs ({cvFiles.length})</h3>
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors">
                      <FaPlus className="w-3 h-3" />
                      <span>Add More</span>
                    </div>
                  </label>
                </div>
                <div className="space-y-2">
                  {cvFiles.map((cvFile) => (
                    <FileUploadItem
                      key={cvFile.id}
                      fileName={cvFile.file.name}
                      fileSize={cvFile.file.size}
                      onRemove={() => handleRemoveFile(cvFile.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/candidates"
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
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <FaUserPlus className="w-4 h-4" />
                  <span>Add Candidate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};
