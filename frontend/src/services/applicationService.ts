import apiClient from "./apiClient";

export interface Application {
  id: string;
  jobId: string;
  cvId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  cvFileName: string;
  status: "PENDING" | "EVALUATED" | "REJECTED";
  appliedAt: string;
  updatedAt: string;
  score?: number;
}

export interface ApplicationCreateRequest {
  jobId: string;
  cvId: string;
}

const applicationService = {
  create: async (data: ApplicationCreateRequest): Promise<Application> => {
    const response = await apiClient.post("/job-applications", data);
    return response.data;
  },

  getByJobId: async (jobId: string): Promise<Application[]> => {
    const response = await apiClient.get(`/job-applications/job/${jobId}`);
    return response.data;
  },

  getByCandidateId: async (candidateId: string): Promise<Application[]> => {
    const response = await apiClient.get(`/job-applications/candidate/${candidateId}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/job-applications/${id}`);
  },
};

export default applicationService;
