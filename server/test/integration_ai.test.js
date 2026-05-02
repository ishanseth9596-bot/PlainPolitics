import request from "supertest";
import app from "../index.js";
import * as geminiService from "../services/gemini.js";
import * as languageService from "../services/language.js";
import * as analyticsService from "../services/analytics.js";

// Mock the services
jest.mock("../services/gemini.js");
jest.mock("../services/language.js");
jest.mock("../services/analytics.js");

describe("Integration Test - POST /api/ai/ask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should preprocess with NL API, call Gemini, and log to BigQuery", async () => {
    // 1. Setup mocks
    languageService.analyzeCivicIntent.mockResolvedValue({
      entities: ["voter ID"],
      sentiment: "neutral"
    });
    geminiService.askGemini.mockResolvedValue("You need a valid ID to vote.");
    analyticsService.logQueryToBigQuery.mockResolvedValue(null);

    // 2. Execute request
    const res = await request(app)
      .post("/api/ai/ask")
      .send({ question: "What ID do I need?" });

    // 3. Verifications
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.answer).toBe("You need a valid ID to vote.");
    
    // Verify NL API was called
    expect(languageService.analyzeCivicIntent).toHaveBeenCalledWith("What ID do I need?");
    
    // Verify Gemini received enriched prompt
    expect(geminiService.askGemini).toHaveBeenCalledWith(
      expect.stringContaining("voter ID"),
      expect.any(String)
    );

    // Verify BigQuery logging was triggered
    expect(analyticsService.logQueryToBigQuery).toHaveBeenCalled();
    
    // Verify standard response envelope
    expect(res.body).toHaveProperty("meta");
    expect(res.body.meta).toHaveProperty("requestId");
  });
});
