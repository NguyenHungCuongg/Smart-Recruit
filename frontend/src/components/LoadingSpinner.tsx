interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className = "" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-primary ${sizeClasses[size]} ${className}`}
      style={{
        borderTopColor: size === "lg" ? "transparent" : undefined,
      }}
    />
  );
};
