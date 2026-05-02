import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import mongoSanitize from "express-mongo-sanitize";
import fs from "fs";

import informerRoutes from "./routes/informer.js";
import reporterRoutes from "./routes/reporter.js";
import trackerRoutes from "./routes/tracker.js";
import aiRoutes from "./routes/ai.js";
import analyticsRoutes from "./routes/analytics.js";
import feedbackRoutes from "./routes/feedback.js";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { errorResponse } from "./utils/responseHelper.js";
import crypto from "crypto";

// __dirname equivalent for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Add unique Request ID to every request
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", requestId);
  next();
});

// ── Security middleware ────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for demo to allow Maps/Translate/Fonts
    crossOriginEmbedderPolicy: false,
  })
);

// In production (Cloud Run) the React build is served from the same origin,
// so CORS is only needed for local development.
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize()); // Prevent NoSQL Injection attacks

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ 
    status: "ok", 
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString() 
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/informer", informerRoutes);
app.use("/api/reporter", reporterRoutes);
app.use("/api/tracker", trackerRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/feedback", feedbackRoutes);

// ── Serve React build (production / Cloud Run) ───────────────────────────────
let clientBuild = path.join(__dirname, "../client/dist");

// Robust check for index.html location in different environments
if (!fs.existsSync(path.join(clientBuild, "index.html"))) {
  // Try flat structure (Docker)
  clientBuild = path.join(__dirname, "./client/dist");
}

if (!fs.existsSync(path.join(clientBuild, "index.html"))) {
  // Last resort: current working directory
  clientBuild = path.join(process.cwd(), "client/dist");
}

app.use(express.static(clientBuild));
// React Router catch-all — must come AFTER all API routes
app.get("*", (req, res) =>
  res.sendFile(path.join(clientBuild, "index.html"), (err) => {
    // Fall back to JSON 404 if no build exists (local dev)
    if (err) {
      errorResponse(res, 404, "ROUTE_NOT_FOUND", "The requested page or API route does not exist.");
    }
  })
);

// ── Global error handler ──────────────────────────────────────────────────────
app.use(globalErrorHandler);

// ── Database + start ──────────────────────────────────────────────────────────
export const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB connected successfully");
    } else {
      console.warn("⚠️  MONGO_URI not set – RUNNING IN DEMO MODE (Local Data Only)");
    }
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.warn("⚠️  Falling back to DEMO MODE...");
  }

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server active on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    if (mongoose.connection.readyState !== 1) {
      console.log("🛠️  Mode: DEMO (No database connection)");
    }
  });
  return server;
};

// Only start automatically if run directly
if (process.argv[1] && (process.argv[1].endsWith("index.js") || process.argv[1].endsWith("server"))) {
  start();
}

export default app;
