import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ResumeListProps {
  resumes: Resume[];
  onDelete: (resumeId: string) => Promise<void>;
  isLoading?: boolean;
}

export function ResumeList({
  resumes,
  onDelete,
  isLoading = false,
}: ResumeListProps) {
  const handleDownload = (resume: Resume) => {
    if (resume.fileData) {
      const link = document.createElement("a");
      link.href = resume.fileData;
      link.download = resume.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileSizeInMB = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  if (!resumes || resumes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">No resumes uploaded yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a resume to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="p-2 bg-primary/10 rounded">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {resume.fileName}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{getFileSizeInMB(resume.fileSize)} MB</span>
                <span>•</span>
                <span>Uploaded {formatDate(resume.uploadedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(resume)}
              title="Download resume"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(resume.id)}
              disabled={isLoading}
              className="text-destructive hover:text-destructive/90"
              title="Delete resume"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
