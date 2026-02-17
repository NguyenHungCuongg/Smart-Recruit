import { AboutValueCard } from "../components/AboutValueCard";

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary to-accent/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">About Smart Recruit</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to make hiring smarter, faster, and more fair through the power of artificial
            intelligence
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-20">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Mission</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Smart Recruit was founded with a simple belief: hiring shouldn't be a guessing game. Too many talented
                  individuals are overlooked, and too many companies struggle to find the right fit.
                </p>
                <p>
                  We leverage state-of-the-art machine learning to analyze candidates objectively, considering skills,
                  experience, education, and job requirements. Our platform removes unconscious bias and provides
                  transparent, data-driven insights that help recruiters make better decisions.
                </p>
                <p>
                  By automating the initial screening process, we free up recruiters to focus on what truly matters:
                  building relationships with top candidates and creating exceptional hiring experiences.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-card border border-border rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { value: "98%", label: "Accuracy Rate" },
                    { value: "10x", label: "Faster Hiring" },
                    { value: "500+", label: "Companies" },
                    { value: "50K+", label: "Candidates" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-secondary/50 rounded-2xl">
                      <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-40 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-20">
            <div className="order-2 lg:order-1">
              <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">What We Believe</h3>
                <ul className="space-y-4">
                  {[
                    "Hiring decisions should be data-driven, not gut-driven",
                    "Everyone deserves a fair chance to showcase their skills",
                    "Technology should augment human judgment, not replace it",
                    "Transparency builds trust between recruiters and candidates",
                    "Speed matters, but quality matters more",
                  ].map((belief, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-muted-foreground">{belief}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Vision</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  We envision a future where every hiring decision is backed by intelligent insights, where bias is
                  minimized, and where the best candidates always rise to the top—regardless of background, geography,
                  or network.
                </p>
                <p>
                  Smart Recruit is not just a tool; it's a movement toward fairer, faster, and more effective hiring.
                  We're building the infrastructure that will power the next generation of talent acquisition.
                </p>
                <p>Join us in transforming how the world hires.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-20">
            <AboutValueCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Innovation"
              description="We constantly push the boundaries of what AI can do for recruitment, staying ahead of industry trends."
            />
            <AboutValueCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
              title="Integrity"
              description="We believe in transparent AI. Every score is explainable, every ranking is auditable."
            />
            <AboutValueCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              title="Empowerment"
              description="We empower recruiters with tools that enhance their expertise, not replace their judgment."
            />
          </div>
        </div>
      </section>
    </div>
  );
};
