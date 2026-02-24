import apiClient from "./apiClient";

export interface JobRequirements {
  skills: string[];
  minExperience: number | null;
  education: string | null;
  seniority: string | null;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  status: "OPEN" | "ACTIVE" | "CLOSED";
  jdFilePath: string;
  description?: string;
  requirements?: JobRequirements;
  createdAt: string;
  updatedAt: string;
  recruiterId: string;
}

export interface JobCreateRequest {
  title: string;
  department: string;
  location: string;
  status: string;
  jdFile: File;
}

export interface JobUpdateRequest {
  title: string;
  department: string;
  location: string;
  status: string;
}

const jobService = {
  getAll: async (): Promise<Job[]> => {
    const response = await apiClient.get("/jobs");
    return response.data;
  },

  getById: async (id: string): Promise<Job> => {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  create: async (data: JobCreateRequest): Promise<Job> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("department", data.department);
    formData.append("location", data.location);
    formData.append("status", data.status);
    formData.append("jdFile", data.jdFile);

    const response = await apiClient.post("/jobs", formData);
    return response.data;
  },

  update: async (id: string, data: JobUpdateRequest): Promise<Job> => {
    const response = await apiClient.put(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/jobs/${id}`);
  },
};

export default jobService;
