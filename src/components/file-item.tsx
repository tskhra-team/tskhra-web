import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface UploadedFileItemProps {
  file: File;
  index: number;
  progress: number;
  onRemove: (index: number) => void;
}

export function UploadedFileItem({
  file,
  index,
  progress,
  onRemove,
}: UploadedFileItemProps) {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!imageUrl) return null;

  return (
    <div className="border border-border rounded-lg p-2 flex flex-col">
      <div className="flex items-center gap-2">
        <div className="w-16 h-14 bg-muted rounded-sm flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={imageUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-sm font-medium truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {Math.round(file.size / 1024)} KB
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:text-red-500"
              onClick={() => onRemove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-1.5 bg-muted rounded-full flex-1 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground w-7 text-right">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
