import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { z } from "zod";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["user", "recruiter", "admin"]).optional(), // Default "user"
  companyName: z.string().optional(),
}).refine(data => {
  if (data.role === 'recruiter' && !data.companyName) return false;
  return true;
}, {
  message: "Company name is required for recruiters",
  path: ["companyName"]
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role, companyName } = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use transaction to create user and optionally company
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { 
          email, 
          name, 
          password: hashedPassword,
          role: role || "user"
        },
      });

      if (role === 'recruiter' && companyName) {
        await tx.company.create({
          data: {
            name: companyName,
            userId: user.id
          }
        });
      }

      return user;
    });

    const token = jwt.sign({ userId: result.id, role: result.role }, JWT_SECRET, { expiresIn: "7d" });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = result;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    res.status(400).json({ message: "Invalid input or server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Me (Protected)
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export const authRouter = router;
