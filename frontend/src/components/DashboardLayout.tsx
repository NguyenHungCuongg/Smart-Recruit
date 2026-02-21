import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../hooks/useDarkMode";
import { Logo } from "./Logo";
import {
  FaChartLine,
  FaPeopleGroup,
  FaChartPie,
  FaBriefcase,
  FaChartSimple,
  FaUser,
  FaArrowRightFromBracket,
  FaBars,
} from "react-icons/fa6";
import { GrSun, GrMoon } from "react-icons/gr";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { isDark, toggleDark } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <FaChartPie className="w-5 h-5" /> },
    { path: "/jobs", label: "Jobs", icon: <FaBriefcase className="w-5 h-5" /> },
    { path: "/candidates", label: "Candidates", icon: <FaPeopleGroup className="w-5 h-5" /> },
    { path: "/evaluations", label: "Evaluations", icon: <FaChartLine className="w-5 h-5" /> },
  ];

  const adminNavItems = [
    { path: "/admin/users", label: "User Management", icon: <FaUser className="w-5 h-5" /> },
    { path: "/admin/analytics", label: "Analytics", icon: <FaChartSimple className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } fixed left-0 top-0 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          {isSidebarOpen ? (
            <Link to="/dashboard" className="flex items-center space-x-3">
              <Logo size="sm" />
              {isSidebarOpen && <span className="text-xl font-bold text-foreground">Smart Recruit</span>}
            </Link>
          ) : null}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}

          {user?.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-2">
                {isSidebarOpen && <p className="text-xs font-semibold text-muted-foreground px-4">ADMIN</p>}
              </div>
              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-4 py-3 bg-secondary rounded-lg">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
              {user?.fullName.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            )}
          </div>
          {isSidebarOpen ? (
            <>
              <button
                onClick={toggleDark}
                className="w-full mt-2 px-4 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors flex items-center justify-center space-x-2"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <>
                    <GrSun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <GrMoon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FaArrowRightFromBracket className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleDark}
                className="w-full mt-2 p-3 text-foreground hover:bg-secondary rounded-lg transition-colors flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <GrSun className="w-5 h-5 text-foreground" />
                ) : (
                  <GrMoon className="w-5 h-5 text-foreground" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="w-full mt-2 p-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Logout"
              >
                <FaArrowRightFromBracket className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 min-h-screen`}>
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
};
