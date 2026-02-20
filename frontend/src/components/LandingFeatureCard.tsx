const colorVariants = {
  destructive: "from-destructive to-destructive/50",
  primary: "from-primary to-primary/50",
  "chart-3": "from-chart-3 to-chart-3/50",
} as const;

export const LandingFeatureCard = ({
  title,
  description,
  color,
  icon,
}: {
  title: string;
  description: string;
  color: keyof typeof colorVariants;
  icon: React.ReactNode; //Kiểu ReactNode để chấp nhận bất kỳ phần tử React nào, bao gồm SVG
}) => {
  return (
    <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:border-primary/50">
      <div
        className={`w-14 h-14 bg-gradient-to-br ${colorVariants[color]} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};
