import { Link } from "react-router-dom";
import { GrSun, GrMoon } from "react-icons/gr";
import { useDarkMode } from "../hooks/useDarkMode";
import { Logo } from "./Logo";

export const Navbar = () => {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="sm" />
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
              className="p-2 rounded-lg bg-secondary hover:bg-primary transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <GrSun className="w-5 h-5 text-foreground" /> : <GrMoon className="w-5 h-5 text-foreground" />}
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
