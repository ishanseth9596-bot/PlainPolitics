/**
 * Standardized API response envelope helper.
 */
export const sendResponse = (res, statusCode, success, data = null, error = null, meta = {}) => {
  return res.status(statusCode).json({
    success,
    data,
    error: error ? {
      code: error.code || "UNKNOWN_ERROR",
      message: error.message || "An unexpected error occurred",
      details: error.details || null
    } : null,
    meta: {
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "1.0.0",
      requestId: res.getHeader("x-request-id") || "none",
      ...meta
    }
  });
};

export const successResponse = (res, data, statusCode = 200, meta = {}) => {
  return sendResponse(res, statusCode, true, data, null, meta);
};

export const errorResponse = (res, statusCode, code, message, details = null, meta = {}) => {
  return sendResponse(res, statusCode, false, null, { code, message, details }, meta);
};
