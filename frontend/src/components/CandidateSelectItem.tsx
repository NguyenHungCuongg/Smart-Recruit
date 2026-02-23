interface CandidateSelectItemProps {
  id: number;
  name: string;
  email: string;
  cvCount: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

export const CandidateSelectItem = ({ id, name, email, cvCount, isSelected, onSelect }: CandidateSelectItemProps) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-secondary/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {cvCount} CV{cvCount !== 1 ? "s" : ""} available
          </p>
        </div>
        {isSelected && (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-sm">✓</span>
          </div>
        )}
      </div>
    </div>
  );
};
