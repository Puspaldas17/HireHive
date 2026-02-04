export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  role?: "user" | "recruiter" | "admin";
  companyName?: string; // Optional for recruiters on signup
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  location?: string;
  userId: string;
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  skills: string;
  salary?: string;
  type: string;
  location?: string;
  remote: boolean;
  status: "OPEN" | "CLOSED";
  postedAt: Date;
  updatedAt: Date;
  companyId: string;
  company?: Company;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  fileData?: string; // Optional if we don't always load full blob
}

export interface JobApplication {
  id: string;
  userId: string;
  company: string; // Legacy string for external apps
  jobRole: string;
  status: JobStatus;
  applicationDate: Date;
  lastUpdated: Date;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  interviewDate?: Date;
  statusHistory?: StatusHistory[];
  notesList?: Note[];
  activities?: Activity[];
}

export interface StatusHistory {
  status: string;
  changedAt: Date;
}

export interface Note {
  id: string;
  content: string;
  type: "general" | "interview" | "followup";
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: string;
  timestamp: Date;
  description: string;
  metadata?: any;
}

export type JobStatus =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "OnHold";

export interface AnalyticsStats {
  totalApplications: number;
  byStatus: Record<string, number>;
  monthlyTrends: { month: string; count: number }[];
  thisMonth: number;
  successRate: number;
  avgDaysToInterview: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string, role?: "user" | "recruiter", companyName?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
