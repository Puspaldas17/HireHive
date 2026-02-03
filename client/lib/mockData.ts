import { User, JobApplication, Resume, AnalyticsStats } from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "john@example.com",
    name: "John Doe",
    password: "password123", // Mock password
  },
  {
    id: "user-2",
    email: "jane@example.com",
    name: "Jane Smith",
    password: "password456", // Mock password
  },
];

export const mockJobApplications: JobApplication[] = [
  {
    id: "app-1",
    userId: "user-1",
    company: "Google",
    jobRole: "Senior Frontend Engineer",
    status: "Interview",
    applicationDate: new Date("2024-12-15"),
    lastUpdated: new Date("2025-01-15"),
    notes: "Second round interview scheduled for Jan 20",
    salary: "$180,000 - $220,000",
    jobUrl: "https://google.com/careers/job/123",
    interviewDate: new Date("2025-01-20"),
  },
  {
    id: "app-2",
    userId: "user-1",
    company: "Microsoft",
    jobRole: "Full Stack Developer",
    status: "Applied",
    applicationDate: new Date("2025-01-10"),
    lastUpdated: new Date("2025-01-10"),
    notes: "Application submitted through LinkedIn",
    salary: "$150,000 - $200,000",
    jobUrl: "https://microsoft.com/careers/job/456",
  },
  {
    id: "app-3",
    userId: "user-1",
    company: "Apple",
    jobRole: "iOS Developer",
    status: "Offer",
    applicationDate: new Date("2024-11-20"),
    lastUpdated: new Date("2025-01-08"),
    notes: "Offer received! Negotiating start date",
    salary: "$170,000 - $210,000",
    jobUrl: "https://apple.com/careers/job/789",
  },
  {
    id: "app-4",
    userId: "user-1",
    company: "Amazon",
    jobRole: "Backend Engineer",
    status: "Rejected",
    applicationDate: new Date("2024-12-01"),
    lastUpdated: new Date("2025-01-05"),
    notes: "Rejected due to experience requirements",
  },
  {
    id: "app-5",
    userId: "user-1",
    company: "Meta",
    jobRole: "React Engineer",
    status: "OnHold",
    applicationDate: new Date("2024-12-20"),
    lastUpdated: new Date("2025-01-12"),
    notes: "Waiting for budget approval from hiring manager",
  },
  {
    id: "app-6",
    userId: "user-1",
    company: "Netflix",
    jobRole: "Platform Engineer",
    status: "Applied",
    applicationDate: new Date("2025-01-08"),
    lastUpdated: new Date("2025-01-08"),
    notes: "Recently applied, no response yet",
    salary: "$200,000 - $250,000",
    jobUrl: "https://netflix.com/careers/job/012",
  },
  {
    id: "app-7",
    userId: "user-1",
    company: "Stripe",
    jobRole: "Senior React Developer",
    status: "Interview",
    applicationDate: new Date("2024-12-10"),
    lastUpdated: new Date("2025-01-14"),
    notes: "Technical interview passed, now on final round",
    salary: "$160,000 - $220,000",
    jobUrl: "https://stripe.com/careers/job/345",
    interviewDate: new Date("2025-01-25"),
  },
  {
    id: "app-8",
    userId: "user-1",
    company: "Airbnb",
    jobRole: "Full Stack Engineer",
    status: "Applied",
    applicationDate: new Date("2025-01-05"),
    lastUpdated: new Date("2025-01-05"),
    notes: "Applied through company website",
    salary: "$155,000 - $195,000",
    jobUrl: "https://airbnb.com/careers/job/678",
  },
];

export const mockResumes: Resume[] = [
  {
    id: "resume-1",
    userId: "user-1",
    fileName: "John_Doe_Resume_2025.pdf",
    fileSize: 245000,
    uploadedAt: new Date("2024-12-01"),
  },
  {
    id: "resume-2",
    userId: "user-1",
    fileName: "John_Doe_Resume_Tech.pdf",
    fileSize: 198000,
    uploadedAt: new Date("2025-01-10"),
  },
];

export function getAnalyticsStats(userId: string): AnalyticsStats {
  const userApps = mockJobApplications.filter((app) => app.userId === userId);

  const byStatus = {
    Applied: userApps.filter((a) => a.status === "Applied").length,
    Interview: userApps.filter((a) => a.status === "Interview").length,
    Offer: userApps.filter((a) => a.status === "Offer").length,
    Rejected: userApps.filter((a) => a.status === "Rejected").length,
    OnHold: userApps.filter((a) => a.status === "OnHold").length,
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
    const count = userApps.filter((app) => {
      const appMonth = new Date(app.applicationDate);
      return (
        appMonth.getMonth() === date.getMonth() &&
        appMonth.getFullYear() === date.getFullYear()
      );
    }).length;
    monthlyTrends.push({ month, count });
  }

  return {
    totalApplications: userApps.length,
    byStatus,
    monthlyTrends,
  };
}
