export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected" | "OnHold";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this would never be in the client
  role?: 'user' | 'admin'; // NEW
  theme?: 'light' | 'dark'; // NEW
  createdAt?: Date; // NEW
}

export interface StatusHistoryEntry {
  status: JobStatus;
  changedAt: Date;
}

export interface Note {
  id: string;
  content: string;
  type: 'general' | 'interview' | 'followup';
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'status_change' | 'note_added' | 'interview_scheduled' | 'application_created';
  timestamp: Date;
  description: string;
  metadata?: Record<string, any>;
}

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  jobRole: string;
  status: JobStatus;
  applicationDate: Date;
  lastUpdated: Date;
  notes: string;
  salary?: string;
  jobUrl?: string;
  resumeId?: string;
  interviewDate?: Date;
  // NEW FIELDS
  statusHistory?: StatusHistoryEntry[];
  notesList?: Note[];
  activities?: Activity[];
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  fileData?: string; // Base64 encoded file data for storage
}

export interface AnalyticsStats {
  totalApplications: number;
  byStatus: Record<JobStatus, number>;
  monthlyTrends: Array<{
    month: string;
    count: number;
  }>;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
