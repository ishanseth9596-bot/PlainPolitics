import express from "express";
import { body, param, validationResult } from "express-validator";
import Promise from "../models/Promise.js";
import { getDepolarisationAdvice } from "../services/gemini.js";

const router = express.Router();

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return false;
  }
  return true;
};

// GET /api/tracker/promises?candidateId=xxx
router.get("/promises", async (req, res, next) => {
  try {
    const { candidateId } = req.query;
    const filter = candidateId ? { candidateId } : {};
    const promises = await Promise.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v");
    res.json(promises);
  } catch (err) {
    next(err);
  }
});

// POST /api/tracker/promises/:id/vote
router.post(
  "/promises/:id/vote",
  [
    param("id").isMongoId(),
    body("vote").isIn(["up", "down"]),
  ],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      const update =
        req.body.vote === "up"
          ? { $inc: { upvotes: 1 } }
          : { $inc: { downvotes: 1 } };
      const promise = await Promise.findByIdAndUpdate(req.params.id, update, {
        new: true,
      });
      if (!promise) return res.status(404).json({ error: "Promise not found." });
      res.json(promise);
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/tracker/promises/:id/status
router.patch(
  "/promises/:id/status",
  [
    param("id").isMongoId(),
    body("status").isIn(["pending", "in_progress", "fulfilled", "broken"]),
  ],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      const promise = await Promise.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      if (!promise) return res.status(404).json({ error: "Promise not found." });
      res.json(promise);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/tracker/depolarise
router.post(
  "/depolarise",
  [body("concern").isString().notEmpty().isLength({ max: 300 })],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      const advice = await getDepolarisationAdvice(req.body.concern);
      res.json({ advice });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/tracker/promises  (admin: seed promises from winning manifesto)
router.post(
  "/promises",
  [
    body("candidateId").isMongoId(),
    body("title").isString().notEmpty(),
  ],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      const promise = new Promise(req.body);
      await promise.save();
      res.status(201).json(promise);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
