import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileDropzone } from "./dropzone";
import { FileList } from "./file-list";

interface FileUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function FileUpload({
  value = [],
  onChange,
  maxFiles = 4,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileProgresses, setFileProgresses] = useState<Record<string, number>>(
    {},
  );

  const processFiles = (files: FileList | null) => {
    if (!files) return;

    const incomingFiles = Array.from(files);

    if (value.length + incomingFiles.length > maxFiles) {
      toast.warning(`You can add only ${maxFiles} photos here`, {
        position: "top-center",
      });
      return;
    }

    const updatedFiles = [...value, ...incomingFiles];
    onChange(updatedFiles);

    incomingFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
        }
        setFileProgresses((prev) => ({
          ...prev,
          [file.name]: Math.min(progress, 100),
        }));
      }, 200);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    const fileToRemove = value[indexToRemove];

    const updatedFiles = value.filter((_, index) => index !== indexToRemove);
    onChange(updatedFiles);

    const hasDuplicateName = updatedFiles.some(
      (f) => f.name === fileToRemove.name,
    );

    if (!hasDuplicateName) {
      setFileProgresses((prev) => {
        const newProgresses = { ...prev };
        delete newProgresses[fileToRemove.name];
        return newProgresses;
      });
    }
  };

  return (
    <div className="w-full">
      <FileDropzone
        fileInputRef={fileInputRef}
        handleBoxClick={() => fileInputRef.current?.click()}
        handleDragOver={(e) => e.preventDefault()}
        handleDrop={(e) => {
          e.preventDefault();
          processFiles(e.dataTransfer.files);
        }}
        handleFileSelect={processFiles}
      />

      <FileList
        uploadedFiles={value}
        fileProgresses={fileProgresses}
        removeFile={removeFile}
      />
    </div>
  );
}
