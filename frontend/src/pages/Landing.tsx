import { Link } from "react-router-dom";
import { LandingFeatureCard } from "../components/LandingFeatureCard";
import { LandingStepCard } from "../components/LandingStepCard";
import {
  FaFileCircleCheck,
  FaRobot,
  FaBoltLightning,
  FaPencil,
  FaUpload,
  FaChartSimple,
  FaRankingStar,
} from "react-icons/fa6";
import landingHeroRight from "../assets/landing-hero-right.png";

export const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-secondary to-accent/20 pt-10 pb-22">
        {/* Decorative Blur Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-foreground">100% AI-Powered</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Where Skills
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent/100">
                  Meet Roles
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Transform your recruitment process with AI-powered candidate analysis. Match the perfect talent to every
                job in seconds, not weeks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-center"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-secondary hover:bg-accent text-secondary-foreground font-semibold rounded-xl transition-all border border-border text-center"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-foreground">98%</div>
                  <div className="text-sm text-muted-foreground">Match Accuracy</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div>
                  <div className="text-3xl font-bold text-foreground">10x</div>
                  <div className="text-sm text-muted-foreground">Faster Hiring</div>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div>
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">Companies</div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-3xl opacity-20"></div>
              <div>
                <img src={landingHeroRight} alt="Smart Recruit Dashboard Mockup" className="relative" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why Choose Smart Recruit?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Leverage cutting-edge AI technology to revolutionize your hiring process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <LandingFeatureCard
              title="AI-Powered Matching"
              description="Our advanced machine learning algorithms analyze CVs and job descriptions to find the perfect match, considering skills, experience, education, and cultural fit."
              color="destructive"
              icon={<FaFileCircleCheck className="w-6 h-6 text-foreground" />}
            />
            {/* Feature 2 */}
            <LandingFeatureCard
              title="Lightning Fast"
              description="Process hundreds of applications in seconds. Our optimized pipeline reduces hiring time from weeks to days, helping you secure top talent before competitors."
              color="primary"
              icon={<FaBoltLightning className="w-6 h-6 text-foreground" />}
            />

            {/* Feature 3 */}
            <LandingFeatureCard
              title="Transparent AI"
              description="Every match comes with a detailed breakdown of how scores were calculated, ensuring you understand the strengths and weaknesses of each candidate."
              color="chart-3"
              icon={<FaRobot className="w-6 h-6 text-foreground" />}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get Started in 4 Simple Steps</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From job posting to candidate ranking in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <LandingStepCard
              step="01"
              title="Create Job Description"
              description="Define your ideal candidate with detailed requirements and must-have skills"
              icon={<FaPencil className="w-6 h-6 text-primary" />}
            />
            <LandingStepCard
              step="02"
              title="Upload CVs"
              description="Batch upload resumes in PDF, DOCX, or TXT format for instant parsing"
              icon={<FaUpload className="w-6 h-6 text-primary" />}
            />
            <LandingStepCard
              step="03"
              title="AI Analysis"
              description="Our ML engine evaluates every candidate against your specific requirements"
              icon={<FaChartSimple className="w-6 h-6 text-primary" />}
            />
            <LandingStepCard
              step="04"
              title="Review Rankings"
              description="Get ranked results with detailed scores and make data-driven hiring decisions"
              icon={<FaRankingStar className="w-6 h-6 text-primary" />}
              isLast
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Hiring?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join recruiters using Smart Recruit to rank CVs instantly and identify top-tier talent through AI-powered
            scoring.
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
          >
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
};
