import { JobApplication, Resume, AnalyticsStats, JobStatus, Note, Activity } from "./types";
import { mockJobApplications, mockResumes, getAnalyticsStats } from "./mockData";

// Local storage keys
const APPLICATIONS_STORAGE_KEY = "jobtrack_applications";
const RESUMES_STORAGE_KEY = "jobtrack_resumes";

// Initialize localStorage with mock data on first load
function initializeStorage() {
  if (!localStorage.getItem(APPLICATIONS_STORAGE_KEY)) {
    localStorage.setItem(
      APPLICATIONS_STORAGE_KEY,
      JSON.stringify(mockJobApplications)
    );
  }
  if (!localStorage.getItem(RESUMES_STORAGE_KEY)) {
    localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(mockResumes));
  }
}

// Get all applications for a user
export async function getJobApplications(
  userId: string
): Promise<JobApplication[]> {
  initializeStorage();
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const applications = stored ? JSON.parse(stored) : mockJobApplications;
  return applications
    .filter((app: JobApplication) => app.userId === userId)
    .map((app: JobApplication) => ({
      ...app,
      applicationDate: new Date(app.applicationDate),
      lastUpdated: new Date(app.lastUpdated),
      interviewDate: app.interviewDate ? new Date(app.interviewDate) : undefined,
      statusHistory: app.statusHistory?.map((entry: any) => ({
        ...entry,
        changedAt: new Date(entry.changedAt),
      })),
      notesList: app.notesList?.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
      })),
      activities: app.activities?.map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp),
      })),
    }));
}

// Get a single application
export async function getJobApplication(
  userId: string,
  applicationId: string
): Promise<JobApplication | null> {
  const apps = await getJobApplications(userId);
  const app = apps.find((a) => a.id === applicationId);
  return app || null;
}

// Create a new application
export async function createJobApplication(
  userId: string,
  data: Omit<JobApplication, "id" | "userId">
): Promise<JobApplication> {
  initializeStorage();
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const applications = stored ? JSON.parse(stored) : mockJobApplications;

  const now = new Date();
  const newApplication: JobApplication = {
    ...data,
    id: `app-${Date.now()}`,
    userId,
    applicationDate: new Date(data.applicationDate),
    lastUpdated: now,
    interviewDate: data.interviewDate
      ? new Date(data.interviewDate)
      : undefined,
    // Initialize new fields
    statusHistory: [{ status: data.status, changedAt: now }],
    notesList: [],
    activities: [
      {
        id: `act-${Date.now()}`,
        type: 'application_created',
        timestamp: now,
        description: 'Application submitted',
      },
    ],
  };

  applications.push(newApplication);
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));

  return newApplication;
}

// Update an application
export async function updateJobApplication(
  userId: string,
  applicationId: string,
  data: Partial<JobApplication>
): Promise<JobApplication | null> {
  initializeStorage();
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const applications = stored ? JSON.parse(stored) : mockJobApplications;

  const index = applications.findIndex(
    (app: JobApplication) => app.id === applicationId && app.userId === userId
  );

  if (index === -1) return null;

  const oldApplication = applications[index];
  const now = new Date();

  // Handle status change tracking
  let statusHistory = oldApplication.statusHistory || [{ status: oldApplication.status, changedAt: oldApplication.applicationDate }];
  let activities = oldApplication.activities || [];

  if (data.status && data.status !== oldApplication.status) {
    statusHistory = [
      ...statusHistory,
      { status: data.status, changedAt: now },
    ];
    activities = [
      ...activities,
      {
        id: `act-${Date.now()}`,
        type: 'status_change' as const,
        timestamp: now,
        description: `Status changed to ${data.status}`,
        metadata: { from: oldApplication.status, to: data.status },
      },
    ];
  }

  const updated = {
    ...oldApplication,
    ...data,
    id: applicationId, // Ensure ID doesn't change
    userId, // Ensure userId doesn't change
    lastUpdated: now,
    applicationDate: new Date(data.applicationDate || oldApplication.applicationDate),
    interviewDate: data.interviewDate ? new Date(data.interviewDate) : oldApplication.interviewDate,
    statusHistory,
    activities,
  };

  applications[index] = updated;
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));

  return updated;
}

// Delete an application
export async function deleteJobApplication(
  userId: string,
  applicationId: string
): Promise<boolean> {
  initializeStorage();
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const applications = stored ? JSON.parse(stored) : mockJobApplications;

  const index = applications.findIndex(
    (app: JobApplication) => app.id === applicationId && app.userId === userId
  );

  if (index === -1) return false;

  applications.splice(index, 1);
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));

  return true;
}

// Update application status
export async function updateApplicationStatus(
  userId: string,
  applicationId: string,
  status: JobStatus
): Promise<JobApplication | null> {
  return updateJobApplication(userId, applicationId, { status });
}

// Get all resumes for a user
export async function getResumes(userId: string): Promise<Resume[]> {
  initializeStorage();
  const stored = localStorage.getItem(RESUMES_STORAGE_KEY);
  const resumes = stored ? JSON.parse(stored) : mockResumes;
  return resumes
    .filter((resume: Resume) => resume.userId === userId)
    .map((resume: Resume) => ({
      ...resume,
      uploadedAt: new Date(resume.uploadedAt),
    }));
}

// Upload a resume
export async function uploadResume(
  userId: string,
  file: File
): Promise<Resume> {
  initializeStorage();
  const stored = localStorage.getItem(RESUMES_STORAGE_KEY);
  const resumes = stored ? JSON.parse(stored) : mockResumes;

  // Convert file to base64
  const reader = new FileReader();
  const fileData = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const newResume: Resume = {
    id: `resume-${Date.now()}`,
    userId,
    fileName: file.name,
    fileSize: file.size,
    uploadedAt: new Date(),
    fileData,
  };

  resumes.push(newResume);
  localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));

  return newResume;
}

// Delete a resume
export async function deleteResume(
  userId: string,
  resumeId: string
): Promise<boolean> {
  initializeStorage();
  const stored = localStorage.getItem(RESUMES_STORAGE_KEY);
  const resumes = stored ? JSON.parse(stored) : mockResumes;

  const index = resumes.findIndex(
    (resume: Resume) => resume.id === resumeId && resume.userId === userId
  );

  if (index === -1) return false;

  resumes.splice(index, 1);
  localStorage.setItem(RESUMES_STORAGE_KEY, JSON.stringify(resumes));

  return true;
}

// Get analytics stats for a user
export async function getAnalytics(userId: string): Promise<AnalyticsStats> {
  const apps = await getJobApplications(userId);
  const byStatus = {
    Applied: apps.filter((a) => a.status === "Applied").length,
    Interview: apps.filter((a) => a.status === "Interview").length,
    Offer: apps.filter((a) => a.status === "Offer").length,
    Rejected: apps.filter((a) => a.status === "Rejected").length,
    OnHold: apps.filter((a) => a.status === "OnHold").length,
  };

  // Generate monthly trends for the past 6 months
  const monthlyTrends = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    const count = apps.filter((app) => {
      const appMonth = app.applicationDate;
      return (
        appMonth.getMonth() === date.getMonth() &&
        appMonth.getFullYear() === date.getFullYear()
      );
    }).length;
    monthlyTrends.push({ month, count });
  }

  // Calculate this month's applications
  const thisMonth = apps.filter((app) => {
    const appMonth = app.applicationDate;
    return (
      appMonth.getMonth() === now.getMonth() &&
      appMonth.getFullYear() === now.getFullYear()
    );
  }).length;

  // Calculate success rate (offers/total)
  const successRate = apps.length > 0 ? Math.round((byStatus.Offer / apps.length) * 100) : 0;

  // Calculate average days to first interview
  const appsWithInterviews = apps.filter((a) => a.interviewDate);
  const avgDaysToInterview = appsWithInterviews.length > 0
    ? Math.round(
        appsWithInterviews.reduce((sum, app) => {
          const daysToInterview = Math.floor(
            (app.interviewDate!.getTime() - app.applicationDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + daysToInterview;
        }, 0) / appsWithInterviews.length
      )
    : 0;

  return {
    totalApplications: apps.length,
    byStatus,
    monthlyTrends,
    thisMonth,
    successRate,
    avgDaysToInterview,
  };
}

// Add a note to an application
export async function addNoteToApplication(
  userId: string,
  applicationId: string,
  content: string,
  type: Note['type'] = 'general'
): Promise<JobApplication | null> {
  initializeStorage();
  const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const applications = stored ? JSON.parse(stored) : mockJobApplications;

  const index = applications.findIndex(
    (app: JobApplication) => app.id === applicationId && app.userId === userId
  );

  if (index === -1) return null;

  const now = new Date();
  const newNote: Note = {
    id: `note-${Date.now()}`,
    content,
    type,
    createdAt: now,
  };

  const notesList = applications[index].notesList || [];
  const activities = applications[index].activities || [];

  const updated = {
    ...applications[index],
    notesList: [...notesList, newNote],
    activities: [
      ...activities,
      {
        id: `act-${Date.now()}`,
        type: 'note_added' as const,
        timestamp: now,
        description: `${type === 'interview' ? 'Interview note' : type === 'followup' ? 'Follow-up' : 'Note'} added`,
      },
    ],
    lastUpdated: now,
  };

  applications[index] = updated;
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));

  return updated;
}
