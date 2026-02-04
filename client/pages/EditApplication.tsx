import { useCallback, useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  getJobApplication,
  updateJobApplication,
  getResumes,
} from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { JobStatus, JobApplication, Resume } from "../lib/types";

const jobStatusOptions: JobStatus[] = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "OnHold",
];

const applicationSchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  jobRole: z
    .string()
    .min(1, "Job role is required")
    .min(2, "Job role must be at least 2 characters"),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected", "OnHold"], {
    errorMap: () => ({ message: "Status is required" }),
  }),
  applicationDate: z.string().min(1, "Application date is required"),
  interviewDate: z.string().optional(),
  salary: z.string().optional(),
  jobUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  notes: z.string().optional(),
  resumeId: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function EditApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const selectedStatus = watch("status");
  const selectedResume = watch("resumeId");

  // Load application data and resumes
  useEffect(() => {
    const loadData = async () => {
      if (!user || !id) {
        toast({
          title: "Error",
          description: "You must be logged in to edit an application",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      try {
        const [app, userResumes] = await Promise.all([
          getJobApplication(user.id, id),
          getResumes(user.id),
        ]);

        if (!app) {
          toast({
            title: "Error",
            description: "Application not found",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        setApplication(app);
        setResumes(userResumes);

        // Pre-populate form
        reset({
          company: app.company,
          jobRole: app.jobRole,
          status: app.status,
          applicationDate: app.applicationDate.toISOString().split("T")[0],
          interviewDate: app.interviewDate?.toISOString().split("T")[0],
          salary: app.salary || "",
          jobUrl: app.jobUrl || "",
          notes: app.notes || "",
          resumeId: app.resumeId || "",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load application",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, id, navigate, toast, reset]);

  const onSubmit = useCallback(
    async (data: ApplicationFormData) => {
      if (!user || !id || !application) {
        toast({
          title: "Error",
          description: "Missing required information",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        await updateJobApplication(user.id, id, {
          company: data.company,
          jobRole: data.jobRole,
          status: data.status,
          applicationDate: new Date(data.applicationDate),
          notes: data.notes || "",
          salary: data.salary || undefined,
          jobUrl: data.jobUrl || undefined,
          interviewDate: data.interviewDate
            ? new Date(data.interviewDate)
            : undefined,
          resumeId: data.resumeId || undefined,
        });

        toast({
          title: "Success",
          description: "Application updated successfully!",
        });

        navigate(`/application/${id}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update application. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, id, application, navigate, toast],
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
      <div className="mb-8">
        <Link to={`/application/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Application
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Edit Application
        </h1>
        <p className="text-muted-foreground mb-8">
          Update your job application details
        </p>

        <div className="rounded-lg border border-border bg-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                placeholder="e.g., Google, Microsoft, Apple"
                {...register("company")}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.company.message}
                </p>
              )}
            </div>

            {/* Job Role */}
            <div className="space-y-2">
              <Label htmlFor="jobRole">Job Role *</Label>
              <Input
                id="jobRole"
                placeholder="e.g., Senior Frontend Engineer"
                {...register("jobRole")}
                className={errors.jobRole ? "border-red-500" : ""}
              />
              {errors.jobRole && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.jobRole.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setValue("status", value as JobStatus)
                }
              >
                <SelectTrigger
                  id="status"
                  className={errors.status ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {jobStatusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Application Date */}
            <div className="space-y-2">
              <Label htmlFor="applicationDate">Application Date *</Label>
              <Input
                id="applicationDate"
                type="date"
                {...register("applicationDate")}
                className={errors.applicationDate ? "border-red-500" : ""}
              />
              {errors.applicationDate && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.applicationDate.message}
                </p>
              )}
            </div>

            {/* Interview Date (conditionally shown for Interview/Offer status) */}
            {(selectedStatus === "Interview" || selectedStatus === "Offer") && (
              <div className="space-y-2">
                <Label htmlFor="interviewDate">Interview Date</Label>
                <Input
                  id="interviewDate"
                  type="date"
                  {...register("interviewDate")}
                />
                {errors.interviewDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.interviewDate.message}
                  </p>
                )}
              </div>
            )}

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g., $150,000 - $200,000"
                {...register("salary")}
              />
              <p className="text-xs text-muted-foreground">
                Optional - enter the salary range if available
              </p>
            </div>

            {/* Job URL */}
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job Posting URL</Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="e.g., https://example.com/careers/job/123"
                {...register("jobUrl")}
                className={errors.jobUrl ? "border-red-500" : ""}
              />
              {errors.jobUrl && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.jobUrl.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional - link to the job posting
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this application..."
                {...register("notes")}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Optional - add any important details or reminders
              </p>
            </div>

            {/* Resume Selection */}
            {resumes.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="resumeId">Select Resume (Optional)</Label>
                <Select
                  value={selectedResume || ""}
                  onValueChange={(value) =>
                    setValue("resumeId", value || undefined)
                  }
                >
                  <SelectTrigger id="resumeId">
                    <SelectValue placeholder="Select a resume (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Resume</SelectItem>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Optional - attach a resume to this application
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/application/${id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
