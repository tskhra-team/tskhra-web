import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileDropzone } from "./dropzone";
import { FileList } from "./file-list";

interface FileUploadProps {
  value?: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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

    // Validate each file
    const validFiles: File[] = [];
    for (const file of incomingFiles) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File "${file.name}" is too large. Maximum size is 5MB`, {
          position: "top-center",
        });
        continue;
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error(`File "${file.name}" has invalid type. Only JPEG, PNG and WebP images are allowed`, {
          position: "top-center",
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    const updatedFiles = [...value, ...validFiles];
    onChange(updatedFiles);

    validFiles.forEach((file) => {
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
