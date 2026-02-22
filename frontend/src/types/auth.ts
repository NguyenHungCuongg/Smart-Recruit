export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "RECRUITER" | "ADMIN";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
