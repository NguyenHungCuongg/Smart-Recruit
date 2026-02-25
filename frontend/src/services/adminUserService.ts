import apiClient from "./apiClient";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "RECRUITER";
  active: boolean;
  createdAt: string;
  lastLogin: string | null;
  jobCount: number;
}

const adminUserService = {
  getAll: async (): Promise<AdminUser[]> => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },
};

export default adminUserService;
