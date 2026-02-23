import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Landing } from "./pages/Landing";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { Dashboard } from "./pages/Dashboard";
import { Jobs } from "./pages/Jobs";
import { JobDetail } from "./pages/JobDetail";
import { Candidates } from "./pages/Candidates";
import { CandidateDetail } from "./pages/CandidateDetail";
import { Evaluations } from "./pages/Evaluations";
import { EvaluationDetail } from "./pages/EvaluationDetail";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminAnalytics } from "./pages/AdminAnalytics";
import { JobNew } from "./pages/JobNew";
import { CandidateNew } from "./pages/CandidateNew";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  useDarkMode();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Toaster toastOptions={{ style: { fontFamily: "var(--font-sans)", color: "var(--sidebar-ring)" } }} />

        <Routes>
          {/* Public Marketing Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Landing />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
                <Footer />
              </>
            }
          />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Jobs Routes */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/new" element={<JobNew />} />
            <Route path="/jobs/:id" element={<JobDetail />} />

            {/* Candidates Routes */}
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/new" element={<CandidateNew />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />

            {/* Evaluations Routes */}
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/evaluations/:id" element={<EvaluationDetail />} />

            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
