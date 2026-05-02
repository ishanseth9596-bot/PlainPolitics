import express from "express";
import { body, validationResult } from "express-validator";
import { askGemini } from "../services/gemini.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { promptInjectionGuard } from "../middleware/promptInjectionGuard.js";
import { analyzeCivicIntent } from "../services/language.js";
import { logQueryToBigQuery } from "../services/analytics.js";

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
    errorResponse(res, 422, "VALIDATION_ERROR", "Invalid request parameters.", errors.array());
    return false;
  }
  return true;
};

/**
 * POST /api/ai/ask
 * @summary Ask a civic question to Gemini AI
 * @param {string} question - The user's question (max 500 chars)
 * @returns {object} Standardized response with answer
 */
router.post(
  "/ask",
  [
    body("question").isString().notEmpty().isLength({ max: 500 }),
    promptInjectionGuard
  ],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      const { question } = req.body;

      // 1. Preprocess with Natural Language API (Enriched Context)
      const intent = await analyzeCivicIntent(question);
      
      // 2. Query Gemini with enriched prompt
      const enrichedPrompt = `User question: ${question}\nDetected Entities: ${intent.entities?.join(", ") || "None"}`;
      const answer = await askGemini(enrichedPrompt, SYSTEM_INSTRUCTION);

      // 3. Log to BigQuery for analytics (fire and forget)
      logQueryToBigQuery(question, intent.entities);

      successResponse(res, { question, answer, intent });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
