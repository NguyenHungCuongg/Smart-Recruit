import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingSectionProps {
  message?: string;
  className?: string;
}

export const LoadingSection = ({ message, className = "py-12" }: LoadingSectionProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <LoadingSpinner size="md" />
      {message && <p className="text-muted-foreground mt-4">{message}</p>}
    </div>
  );
};
