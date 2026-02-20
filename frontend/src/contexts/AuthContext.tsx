import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { type User } from "../types/auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra localStorage xem người dùng đã đăng nhập chưa
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mô phỏng API call với delay (sau này sẽ thay bằng API thực tế sau)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser: User = {
      id: 1,
      email,
      fullName: email === "admin@smartrecruit.com" ? "Admin User" : "Recruiter User",
      role: email === "admin@smartrecruit.com" ? "ADMIN" : "RECRUITER",
    };

    const mockToken = "mock-jwt-token-" + Date.now();

    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", mockToken);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
