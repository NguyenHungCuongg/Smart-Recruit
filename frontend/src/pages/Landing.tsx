import { Link } from "react-router-dom";
import { LandingFeatureCard } from "../components/LandingFeatureCard";
import { LandingStepCard } from "../components/LandingStepCard";
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
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              }
            />
            {/* Feature 2 */}
            <LandingFeatureCard
              title="Lightning Fast"
              description="Process hundreds of applications in seconds. Our optimized pipeline reduces hiring time from weeks to days, helping you secure top talent before competitors."
              color="primary"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              }
            />

            {/* Feature 3 */}
            <LandingFeatureCard
              title="Transparent AI"
              description="Every match comes with a detailed breakdown of how scores were calculated, ensuring you understand the strengths and weaknesses of each candidate."
              color="chart-3"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              }
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
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              }
            />
            <LandingStepCard
              step="02"
              title="Upload CVs"
              description="Batch upload resumes in PDF, DOCX, or TXT format for instant parsing"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              }
            />
            <LandingStepCard
              step="03"
              title="AI Analysis"
              description="Our ML engine evaluates every candidate against your specific requirements"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              }
            />
            <LandingStepCard
              step="04"
              title="Review Rankings"
              description="Get ranked results with detailed scores and make data-driven hiring decisions"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              }
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
