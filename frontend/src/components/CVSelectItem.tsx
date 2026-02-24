import { FaFile } from "react-icons/fa6";

interface CVSelectItemProps {
  id: string;
  fileName: string;
  uploadedAt: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const CVSelectItem = ({ id, fileName, uploadedAt, isSelected, onSelect }: CVSelectItemProps) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-secondary/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-foreground text-sm">
            <FaFile className="inline mr-2" /> {fileName}
          </p>
          <p className="text-xs text-muted-foreground">Uploaded: {uploadedAt}</p>
        </div>
        {isSelected && (
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-xs">✓</span>
          </div>
        )}
      </div>
    </div>
  );
};
