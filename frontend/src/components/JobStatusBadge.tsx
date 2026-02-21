interface JobStatusBadgeProps {
  status: string;
}

export const JobStatusBadge = ({ status }: JobStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-status-open/10 text-status-open border-status-open/20";
      case "ACTIVE":
        return "bg-status-active/10 text-status-active border-status-active/20";
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
