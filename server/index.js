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

// __dirname equivalent for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get("*", (_req, res) =>
  res.sendFile(path.join(clientBuild, "index.html"), (err) => {
    // Fall back to JSON 404 if no build exists (local dev)
    if (err) res.status(404).json({ error: "Route not found." });
  })
);

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error." });
});

// ── Database + start ──────────────────────────────────────────────────────────
const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB connected");
    } else {
      console.warn("⚠️  MONGO_URI not set – running without DB");
    }
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup error:", err.message);
    process.exit(1);
  }
};

start();
