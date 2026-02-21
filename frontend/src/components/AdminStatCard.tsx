import { type ReactNode } from "react";

interface AdminStatCardProps {
  label: string;
  value: number;
  change: string;
  icon: ReactNode;
}

export const AdminStatCard = ({ label, value, change, icon }: AdminStatCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-muted-foreground text-sm">{label}</p>
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">{icon}</div>
      </div>
      <p className="text-4xl font-bold text-foreground">{value}</p>
      <p className="text-muted-foreground text-xs mt-2">{change}</p>
    </div>
  );
};
