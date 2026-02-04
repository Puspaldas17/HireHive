import { Router } from "express";
import { prisma } from "../db";
import { z } from "zod";

const router = Router();

// GET all by userId
router.get("/", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ message: "userId required" });

  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
  });

  res.json(resumes);
});

// CREATE (Upload)
router.post("/", async (req, res) => {
  try {
    const { userId, fileName, fileSize, fileData } = req.body;
    
    // Basic validation
    if (!userId || !fileName || !fileSize || !fileData) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        fileName,
        fileSize,
        fileData,
      },
    });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.resume.delete({ where: { id } });
  res.json({ success: true });
});

export const resumeRouter = router;
