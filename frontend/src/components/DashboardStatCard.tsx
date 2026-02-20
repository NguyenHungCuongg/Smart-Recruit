interface DashboardStatCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

export const DashboardStatCard = ({ label, value, change, trend, icon }: DashboardStatCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">{icon}</div>
        <span className={`text-sm font-semibold ${trend === "up" ? "text-chart-1" : "text-destructive"}`}>
          {change}
        </span>
      </div>
      <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
