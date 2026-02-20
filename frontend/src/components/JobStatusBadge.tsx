interface JobStatusBadgeProps {
  status: string;
}

export const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "ACTIVE":
        return "bg-primary/10 text-primary border-primary/20";
      case "CLOSED":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-secondary text-secondary-foreground border-border";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>{status}</span>
  );
};
