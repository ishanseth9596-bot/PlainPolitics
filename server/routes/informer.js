import express from "express";
import { body, validationResult } from "express-validator";
import Candidate from "../models/Candidate.js";
import { summariseManifesto, factCheck } from "../services/gemini.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import mongoose from "mongoose";

const router = express.Router();

// ── Validation helper ─────────────────────────────────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorResponse(res, 422, "VALIDATION_ERROR", "Invalid input", errors.array());
    return false;
  }
  return true;
};

// GET /api/informer/candidates
router.get("/candidates", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return successResponse(res, []); // Return empty list in demo mode
    }
    const { constituency } = req.query;
    const filter = constituency ? { constituency } : {};
    const candidates = await Candidate.find(filter).select("-__v");
    successResponse(res, candidates);
  } catch (err) {
    next(err);
  }
});

// GET /api/informer/candidates/:id
router.get("/candidates/:id", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return errorResponse(res, 503, "DB_DISCONNECTED", "Running in demo mode without database.");
    }
    const candidate = await Candidate.findById(req.params.id).select("-__v");
    if (!candidate) return errorResponse(res, 404, "CANDIDATE_NOT_FOUND", "Candidate not found.");
    successResponse(res, candidate);
  } catch (err) {
    next(err);
  }
});

// POST /api/informer/candidates/:id/summarise
router.post("/candidates/:id/summarise", async (req, res, next) => {
  try {
    let candidate;
    if (mongoose.connection.readyState === 1) {
      candidate = await Candidate.findById(req.params.id);
    }
    
    // In demo mode, we might not have a candidate object, but we still want AI to work
    // if the frontend passes a known demo ID.
    if (!candidate && !req.params.id.startsWith("demo")) {
      return errorResponse(res, 404, "CANDIDATE_NOT_FOUND", "Candidate not found.");
    }

    const summary = await summariseManifesto(candidate || { name: "Demo Candidate", party: "Demo Party", manifesto: [] });
    successResponse(res, { candidateId: req.params.id, summary });
  } catch (err) {
    next(err);
  }
});

// POST /api/informer/fact-check
router.post(
  "/fact-check",
  [body("claim").isString().notEmpty().isLength({ max: 500 })],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
    const result = await factCheck(req.body.claim);
    successResponse(res, { claim: req.body.claim, result });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/informer/candidates  (seed/admin – not exposed to public UI)
router.post(
  "/candidates",
  [
    body("name").isString().notEmpty(),
    body("party").isString().notEmpty(),
    body("constituency").isString().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      const candidate = new Candidate(req.body);
      await candidate.save();
      res.status(201).json(candidate);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
