import { Upload } from "lucide-react";
import React, { type RefObject } from "react";

interface FileDropzoneProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleBoxClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  // ИЗМЕНЕНО: принимаем файлы напрямую
  handleFileSelect: (files: FileList | null) => void;
}

export function FileDropzone({
  fileInputRef,
  handleBoxClick,
  handleDragOver,
  handleDrop,
  handleFileSelect,
}: FileDropzoneProps) {
  return (
    <div
      className="border-2 border-dashed h-80 border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
      onClick={handleBoxClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="mb-2 bg-muted rounded-full p-3">
        <Upload className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Drag and drop business photo
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        or,{" "}
        <span className="text-primary hover:text-primary/90 font-medium">
          click to browse
        </span>{" "}
        (4MB max)
      </p>
      <input
        type="file"
        id="fileUpload"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        // ИСПРАВЛЕНО: передаем e.target.files
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  );
}
