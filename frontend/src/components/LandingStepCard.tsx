export const LandingStepCard = ({
  step,
  title,
  description,
  icon,
  isLast = false,
}: {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLast?: boolean;
}) => {
  return (
    <div className="relative">
      <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-xl transition-all hover:-translate-y-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-5xl font-bold text-primary">{step}</span>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
      )}
    </div>
  );
};
