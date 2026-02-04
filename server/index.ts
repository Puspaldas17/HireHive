import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { applicationRouter } from "./routes/applications";
import { resumeRouter } from "./routes/resumes";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use("/api/auth", authRouter);
  app.use("/api/applications", applicationRouter);
  app.use("/api/resumes", resumeRouter);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // app.get("/api/demo", handleDemo);

  return app;
}
