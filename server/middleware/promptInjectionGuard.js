import { errorResponse } from "../utils/responseHelper.js";

/**
 * Middleware to protect AI endpoints from prompt injection attacks.
 * Scans incoming strings for common injection patterns.
 */
export const promptInjectionGuard = (req, res, next) => {
  const fieldsToScan = ["question", "claim", "concern", "description"];
  const injectionPatterns = [
    /ignore previous instructions/i,
    /disregard all previous/i,
    /system prompt/i,
    /you are now/i,
    /new role/i,
    /sudo/i,
    /override/i,
    /reveal your instructions/i
  ];

  for (const field of fieldsToScan) {
    const value = req.body[field];
    if (typeof value === "string") {
      for (const pattern of injectionPatterns) {
        if (pattern.test(value)) {
          console.warn(`[SECURITY] Prompt injection blocked in field "${field}": ${value}`);
          return errorResponse(
            res,
            400,
            "PROMPT_INJECTION_DETECTED",
            "Security violation: The request contains forbidden patterns."
          );
        }
      }
    }
  }

  next();
};
