import { Router } from "express";
import { prisma } from "../db";
import { z } from "zod";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// Schema for creating/updating a job
const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  skills: z.string(), // Comma separated string for now
  salary: z.string().optional(),
  type: z.string(), // Full-time, Part-time, etc.
  location: z.string().optional(),
  remote: z.boolean().default(false),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
});

// Middleware to ensure user is a recruiter
const requireRecruiter = (req: AuthRequest, res: any, next: any) => {
  if (req.user?.role !== "recruiter") {
    return res.status(403).json({ message: "Only recruiters can perform this action" });
  }
  next();
};

// CREATE Job
router.post("/", authenticateToken, requireRecruiter, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const data = jobSchema.parse(req.body);

    // Find the company owned by this recruiter
    // Assuming 1 recruiter = 1 company for now
    const company = await prisma.company.findFirst({
      where: { userId },
    });

    if (!company) {
      return res.status(404).json({ message: "Recruiter does not have a company profile" });
    }

    const job = await prisma.jobPost.create({
      data: {
        ...data,
        companyId: company.id,
      },
    });

    res.json(job);
  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Server error", error });
  }
});

// GET Public Jobs (Search & Filter)
router.get("/", async (req, res) => {
  try {
    const { search, type, location, remote } = req.query;

    const where: any = {
      status: "OPEN",
    };

    if (search) {
      where.OR = [
        { title: { contains: String(search) } }, // SQLite doesn't support mode: 'insensitive' easily in older Prisma versions, but usually fine
        { description: { contains: String(search) } },
        { skills: { contains: String(search) } },
      ];
    }

    if (type && type !== "All") {
      where.type = String(type);
    }

    if (location) {
      where.location = { contains: String(location) };
    }

    if (remote === "true") {
      where.remote = true;
    }

    const jobs = await prisma.jobPost.findMany({
      where,
      include: {
        company: {
          select: { name: true, logoUrl: true, location: true },
        },
      },
      orderBy: { postedAt: "desc" },
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET My Jobs (Manage)
router.get("/manage", authenticateToken, requireRecruiter, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const jobs = await prisma.jobPost.findMany({
      where: {
        company: {
          userId,
        },
      },
      orderBy: { postedAt: "desc" },
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET Single Job (Public-ish, but let's keep it simple)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await prisma.jobPost.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE Job
router.put("/:id", authenticateToken, requireRecruiter, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const data = jobSchema.partial().parse(req.body);

    const job = await prisma.jobPost.findUnique({ where: { id }, include: { company: true } });

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.company.userId !== userId) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    const updatedJob = await prisma.jobPost.update({
      where: { id },
      data,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE Job
router.delete("/:id", authenticateToken, requireRecruiter, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;
  
      const job = await prisma.jobPost.findUnique({ where: { id }, include: { company: true } });
  
      if (!job) return res.status(404).json({ message: "Job not found" });
      if (job.company.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this job" });
      }
  
      await prisma.jobPost.delete({ where: { id } });
  
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

export const jobRouter = router;
