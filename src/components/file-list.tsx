import { cn } from "@/lib/utils";
import { UploadedFileItem } from "./file-item";

interface FileListProps {
  uploadedFiles: File[];
  fileProgresses: Record<string, number>;
  removeFile: (index: number) => void;
}

export function FileList({
  uploadedFiles,
  fileProgresses,
  removeFile,
}: FileListProps) {
  if (uploadedFiles.length === 0) return null;

  return (
    <div className={cn("px-6 pb-5 space-y-3 mt-4")}>
      {uploadedFiles.map((file, index) => (
        <UploadedFileItem
          key={`${file.name}-${index}`}
          file={file}
          index={index}
          progress={fileProgresses[file.name] || 0}
          onRemove={removeFile}
        />
      ))}
    </div>
  );
}
