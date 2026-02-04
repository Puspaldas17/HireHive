import { z } from "zod";

// Job Status
export const JobStatusSchema = z.enum([
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
  "OnHold",
]);

// User Schemas
export const UserSignupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Job Application Schemas
export const JobApplicationSchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  jobRole: z
    .string()
    .min(1, "Job role is required")
    .min(2, "Job role must be at least 2 characters")
    .max(100, "Job role must be less than 100 characters"),
  status: JobStatusSchema,
  applicationDate: z.coerce
    .date()
    .refine(
      (date) => date <= new Date(),
      "Application date cannot be in the future",
    ),
  lastUpdated: z.coerce.date(),
  notes: z
    .string()
    .max(5000, "Notes must be less than 5000 characters")
    .optional()
    .default(""),
  salary: z
    .string()
    .max(100, "Salary must be less than 100 characters")
    .optional(),
  jobUrl: z
    .string()
    .url("Please enter a valid URL")
    .max(500, "URL must be less than 500 characters")
    .optional(),
  resumeId: z.string().optional(),
  interviewDate: z.coerce.date().optional(),
});

// Resume Schemas
export const ResumeSchema = z.object({
  fileName: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name must be less than 255 characters"),
  fileSize: z
    .number()
    .positive("File size must be positive")
    .max(5 * 1024 * 1024, "File size must be less than 5MB"),
  uploadedAt: z.coerce.date(),
});

// Note Schemas
export const NoteSchema = z.object({
  content: z
    .string()
    .min(1, "Note content is required")
    .max(2000, "Note must be less than 2000 characters"),
  type: z.enum(["general", "interview", "followup"]),
});

// Search and Filter Schemas
export const SearchQuerySchema = z.object({
  query: z
    .string()
    .max(100, "Search query must be less than 100 characters")
    .optional(),
});

export const FilterQuerySchema = z.object({
  status: JobStatusSchema.optional(),
  company: z
    .string()
    .max(100, "Company filter must be less than 100 characters")
    .optional(),
  jobRole: z
    .string()
    .max(100, "Job role filter must be less than 100 characters")
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minSalary: z.number().positive().optional(),
  maxSalary: z.number().positive().optional(),
  hasInterview: z.boolean().optional(),
  hasResume: z.boolean().optional(),
  hasNotes: z.boolean().optional(),
});

// Types exported from schemas
export type UserSignup = z.infer<typeof UserSignupSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type JobApplication = z.infer<typeof JobApplicationSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type FilterQuery = z.infer<typeof FilterQuerySchema>;
