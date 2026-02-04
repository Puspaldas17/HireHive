import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [".pdf", ".doc", ".docx", ".txt"];

export function ResumeUpload({
  onUpload,
  isLoading = false,
}: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileSelect = async (file: File) => {
    setError("");

    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValidType = ALLOWED_TYPES.some((type) => fileName.endsWith(type));
    if (!isValidType) {
      setError(`Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      await onUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Failed to upload resume");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/50 hover:border-primary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-3"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">
              Drop your resume here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF, DOC, DOCX, or TXT files up to 5MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-3 rounded">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="mt-3 text-center text-sm text-muted-foreground">
          Uploading...
        </div>
      )}
    </div>
  );
}
