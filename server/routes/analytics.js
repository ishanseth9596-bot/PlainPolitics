import express from "express";
import { getTrendingTopics } from "../services/analytics.js";
import { successResponse } from "../utils/responseHelper.js";

const router = express.Router();

/**
 * GET /api/analytics/trending
 * @summary Get top trending civic topics from BigQuery
 */
router.get("/trending", async (req, res, next) => {
  try {
    const topics = await getTrendingTopics();
    successResponse(res, topics);
  } catch (err) {
    next(err);
  }
});

export default router;
