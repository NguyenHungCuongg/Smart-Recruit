export const AboutValueCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
