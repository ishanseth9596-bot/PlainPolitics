import { errorResponse } from "../utils/responseHelper.js";

/**
 * Global error handling middleware.
 * Formats all unhandled errors into the standardized response envelope.
 */
// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack);

  const statusCode = err.status || 500;
  const code = err.code || (statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "API_ERROR");
  const message = err.message || "An internal server error occurred.";

  errorResponse(res, statusCode, code, message, process.env.NODE_ENV === "development" ? err.stack : null);
};

export default globalErrorHandler;
