import express from "express";
import { body, validationResult } from "express-validator";
import Candidate from "../models/Candidate.js";
import { summariseManifesto, factCheck } from "../services/gemini.js";

const router = express.Router();

// ── Validation helper ─────────────────────────────────────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return false;
  }
  return true;
};

// GET /api/informer/candidates
router.get("/candidates", async (req, res, next) => {
  try {
    const { constituency } = req.query;
    const filter = constituency ? { constituency } : {};
    const candidates = await Candidate.find(filter).select("-__v");
    res.json(candidates);
  } catch (err) {
    next(err);
  }
});

// GET /api/informer/candidates/:id
router.get("/candidates/:id", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id).select("-__v");
    if (!candidate) return res.status(404).json({ error: "Candidate not found." });
    res.json(candidate);
  } catch (err) {
    next(err);
  }
});

// POST /api/informer/candidates/:id/summarise
router.post("/candidates/:id/summarise", async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: "Candidate not found." });
    const summary = await summariseManifesto(candidate);
    res.json({ candidateId: candidate._id, name: candidate.name, summary });
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
      res.json({ claim: req.body.claim, result });
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
