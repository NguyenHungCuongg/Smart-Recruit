import { FaTrash, FaFileWord, FaFilePdf, FaFile } from "react-icons/fa";

interface FileUploadItemProps {
  fileName: string;
  fileSize: number;
  onRemove: () => void;
}

export const FileUploadItem = ({ fileName, fileSize, onRemove }: FileUploadItemProps) => {
  const getFileIcon = (name: string) => {
    if (name.endsWith(".pdf")) return <FaFilePdf className="w-6 h-6 text-red-500" />;
    if (name.endsWith(".doc") || name.endsWith(".docx")) return <FaFileWord className="w-6 h-6 text-blue-500" />;
    return <FaFile className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="border border-border rounded-lg p-3 flex items-center justify-between hover:bg-secondary/30 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          {getFileIcon(fileName)}
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{fileName}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
};
