import express from "express";
import { body, validationResult } from "express-validator";
import { askGemini } from "../services/gemini.js";

const router = express.Router();

const SYSTEM_INSTRUCTION = `
You are PlainPolitics AI, a non-partisan civic assistant. You help citizens understand elections, voting rights, and civic processes.
You do NOT share opinions on parties, candidates, or election outcomes.
Always ground your answers in facts and direct users to official sources where possible.
Keep answers short, clear, and jargon-free.
`;

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return false;
  }
  return true;
};

// POST /api/ai/ask  – general civic Q&A
router.post(
  "/ask",
  [body("question").isString().notEmpty().isLength({ max: 500 })],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      const answer = await askGemini(req.body.question, SYSTEM_INSTRUCTION);
      res.json({ question: req.body.question, answer });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
