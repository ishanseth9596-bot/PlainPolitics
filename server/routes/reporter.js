import express from "express";
import { body, validationResult } from "express-validator";
import Incident from "../models/Incident.js";
import CheckIn from "../models/CheckIn.js";
import { getSosGuidance } from "../services/gemini.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import mongoose from "mongoose";

const router = express.Router();

const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorResponse(res, 422, "VALIDATION_ERROR", "Invalid input", errors.array());
    return false;
  }
  return true;
};

// POST /api/reporter/incidents  – log an SOS incident
router.post(
  "/incidents",
  [
    body("type").isIn(["stolen_vote", "machine_breakdown", "intimidation", "other"]),
    body("description").isString().notEmpty().isLength({ max: 500 }),
    body("location.lat").isFloat({ min: -90, max: 90 }),
    body("location.lng").isFloat({ min: -180, max: 180 }),
  ],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      let incident = null;
      if (mongoose.connection.readyState === 1) {
        incident = new Incident(req.body);
        await incident.save();
      }
      // Get AI guidance for this incident type
      const guidance = await getSosGuidance(req.body.type);
      successResponse(res, { incident, guidance }, 201);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/reporter/incidents  – get recent incidents (no PII)
router.get("/incidents", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return successResponse(res, []);
    }
    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("type location.lat location.lng boothId resolved createdAt");
    successResponse(res, incidents);
  } catch (err) {
    next(err);
  }
});

// POST /api/reporter/sos-guidance  – quick guidance without logging
router.post(
  "/sos-guidance",
  [body("type").isIn(["stolen_vote", "machine_breakdown", "intimidation"])],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
    const guidance = await getSosGuidance(req.body.type);
    successResponse(res, { type: req.body.type, guidance });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/reporter/checkin  – crowdsource booth wait time
router.post(
  "/checkin",
  [
    body("boothId").isString().notEmpty(),
    body("waitTime").isInt({ min: 0, max: 300 }),
    body("crowdLevel").isIn(["low", "medium", "high"]),
  ],
  async (req, res, next) => {
    if (!validate(req, res)) return;
    try {
      let checkIn = null;
      if (mongoose.connection.readyState === 1) {
        checkIn = new CheckIn(req.body);
        await checkIn.save();
      }
      successResponse(res, checkIn, 201);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/reporter/booths/:boothId/status  – avg wait + crowd level
router.get("/booths/:boothId/status", async (req, res, next) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const checkIns = await CheckIn.find({
      boothId: req.params.boothId,
      createdAt: { $gte: oneHourAgo },
    });

    if (!checkIns.length) {
      return res.json({ boothId: req.params.boothId, status: "no_data" });
    }

    const avgWait = Math.round(
      checkIns.reduce((s, c) => s + c.waitTime, 0) / checkIns.length
    );
    const latestCrowd = checkIns[checkIns.length - 1].crowdLevel;

    res.json({
      boothId: req.params.boothId,
      avgWaitMinutes: avgWait,
      crowdLevel: latestCrowd,
      checkIns: checkIns.length,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
