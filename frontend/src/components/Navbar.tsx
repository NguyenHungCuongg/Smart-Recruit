import { Link } from "react-router-dom";
import { useDarkMode } from "../hooks/useDarkMode";
import { Logo } from "../components/Logo";

export const Navbar = () => {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold text-foreground">Smart Recruit</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Get Started Button */}
            <Link
              to="/login"
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center space-x-6 mt-4 pt-4 border-t border-border">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};
