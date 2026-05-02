import express from "express";
import { body, validationResult } from "express-validator";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

const router = express.Router();

/**
 * POST /api/feedback
 * @summary Submit user feedback/event (simulates Pub/Sub + Cloud Functions pipeline)
 */
router.post(
  "/",
  [
    body("type").isString().notEmpty(),
    body("content").isString().notEmpty(),
    body("rating").optional().isInt({ min: 1, max: 5 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 422, "VALIDATION_ERROR", "Invalid feedback data.", errors.array());
    }

    try {
      // Simulate publishing to Pub/Sub
      console.log("[FEEDBACK] Event published to Pub/Sub:", req.body);
      
      // In a real scenario, a Cloud Function would trigger on this event
      successResponse(res, { message: "Feedback received and queued for processing." }, 202);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
