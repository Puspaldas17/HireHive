import { useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { createJobApplication } from "../lib/api";
import { useToast } from "../hooks/use-toast";
import { JobStatus } from "../lib/types";

const jobStatusOptions: JobStatus[] = ["Applied", "Interview", "Offer", "Rejected", "OnHold"];

const applicationSchema = z.object({
  company: z.string().min(1, "Company name is required").min(2, "Company name must be at least 2 characters"),
  jobRole: z.string().min(1, "Job role is required").min(2, "Job role must be at least 2 characters"),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected", "OnHold"], {
    errorMap: () => ({ message: "Status is required" }),
  }),
  applicationDate: z.string().min(1, "Application date is required"),
  interviewDate: z.string().optional(),
  salary: z.string().optional(),
  jobUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function NewApplication() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: "Applied",
      applicationDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = useCallback(
    async (data: ApplicationFormData) => {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create an application",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      try {
        await createJobApplication(user.id, {
          company: data.company,
          jobRole: data.jobRole,
          status: data.status,
          applicationDate: new Date(data.applicationDate),
          lastUpdated: new Date(),
          notes: data.notes || "",
          salary: data.salary || undefined,
          jobUrl: data.jobUrl || undefined,
          interviewDate: data.interviewDate ? new Date(data.interviewDate) : undefined,
        });

        toast({
          title: "Success",
          description: "Application created successfully!",
        });

        navigate("/dashboard");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create application. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, navigate, toast]
  );

  return (
    <Layout>
      <div className="mb-8">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Application</h1>
        <p className="text-muted-foreground mb-8">
          Create a new job application entry and track your progress
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
                onValueChange={(value) => setValue("status", value as JobStatus)}
              >
                <SelectTrigger id="status" className={errors.status ? "border-red-500" : ""}>
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
              <p className="text-xs text-muted-foreground">Optional - enter the salary range if available</p>
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
              <p className="text-xs text-muted-foreground">Optional - link to the job posting</p>
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
              <p className="text-xs text-muted-foreground">Optional - add any important details or reminders</p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating..." : "Create Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
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
