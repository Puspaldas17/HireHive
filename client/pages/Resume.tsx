import { useState, useEffect, useCallback } from "react";
import { Layout } from "../components/Layout";
import { ResumeUpload } from "../components/ResumeUpload";
import { ResumeList } from "../components/ResumeList";
import { useAuth } from "../hooks/useAuth";
import { getResumes, uploadResume, deleteResume } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { Resume } from "../lib/types";
import { Loader } from "lucide-react";

export default function ResumePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Load resumes
  useEffect(() => {
    const loadResumes = async () => {
      if (!user) return;
      try {
        const data = await getResumes(user.id);
        setResumes(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load resumes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResumes();
  }, [user, toast]);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload a resume",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      try {
        const newResume = await uploadResume(user.id, file);
        setResumes((prev) => [...prev, newResume]);
        toast({
          title: "Success",
          description: "Resume uploaded successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload resume. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [user, toast],
  );

  const handleDelete = useCallback(
    async (resumeId: string) => {
      if (!user) return;

      try {
        const success = await deleteResume(user.id, resumeId);
        if (success) {
          setResumes((prev) => prev.filter((r) => r.id !== resumeId));
          toast({
            title: "Success",
            description: "Resume deleted successfully",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete resume",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete resume",
          variant: "destructive",
        });
      }
    },
    [user, toast],
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Resume Management
        </h1>
        <p className="text-muted-foreground mb-8">
          Upload and manage your resumes
        </p>

        <div className="grid gap-6 max-w-4xl">
          {/* Upload Section */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Upload New Resume
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              You can upload multiple versions of your resume. Supported
              formats: PDF, DOC, DOCX, TXT
            </p>
            <ResumeUpload onUpload={handleUpload} isLoading={isUploading} />
          </div>

          {/* Resumes List Section */}
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Your Resumes ({resumes.length})
            </h2>
            <ResumeList
              resumes={resumes}
              onDelete={handleDelete}
              isLoading={isUploading}
            />
          </div>

          {/* Usage Tips */}
          <div className="rounded-lg border border-border bg-blue-50 dark:bg-blue-950 p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Tips for Resume Management
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>
                • Keep multiple versions for different roles (e.g., Senior Role,
                Junior Role, Internship)
              </li>
              <li>• Update your resume regularly with new accomplishments</li>
              <li>
                • You can associate different resumes with different job
                applications
              </li>
              <li>• Download your resumes anytime to send to recruiters</li>
              <li>• Keep file sizes under 5MB for optimal compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
