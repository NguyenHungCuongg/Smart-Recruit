import apiClient from "./apiClient";

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  recruiterId: string;
}

export interface CandidateRequest {
  fullName: string;
  email: string;
  phone?: string;
}

export interface CV {
  id: string;
  candidateId: string;
  filePath: string;
  fileName: string;
  uploadedAt: string;
  parsedText?: string;
}

export interface CVSummary {
  id: string;
  fileName: string;
  uploadedAt: string;
}

const candidateService = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await apiClient.get("/candidates");
    return response.data;
  },

  getById: async (id: string): Promise<Candidate> => {
    const response = await apiClient.get(`/candidates/${id}`);
    return response.data;
  },

  create: async (data: CandidateRequest): Promise<Candidate> => {
    const response = await apiClient.post("/candidates", data);
    return response.data;
  },

  update: async (id: string, data: CandidateRequest): Promise<Candidate> => {
    const response = await apiClient.put(`/candidates/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/candidates/${id}`);
  },

  uploadCV: async (candidateId: string, file: File): Promise<CV> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(`/candidates/${candidateId}/cvs`, formData);
    return response.data;
  },

  getCVs: async (candidateId: string): Promise<CVSummary[]> => {
    const response = await apiClient.get(`/candidates/${candidateId}/cvs`);
    return response.data;
  },

  getCV: async (candidateId: string, cvId: string): Promise<CV> => {
    const response = await apiClient.get(`/candidates/${candidateId}/cvs/${cvId}`);
    return response.data;
  },

  deleteCV: async (candidateId: string, cvId: string): Promise<void> => {
    await apiClient.delete(`/candidates/${candidateId}/cvs/${cvId}`);
  },
};

export default candidateService;
