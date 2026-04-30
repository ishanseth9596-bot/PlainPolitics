import test from "node:test";
import assert from "node:assert";
import { askGemini, summariseManifesto, factCheck, getSosGuidance } from "../services/gemini.js";

// Mocking process.env
process.env.GEMINI_API_KEY = "mock-key";

// Setup mock fetch
globalThis.mockFetch = async (url, options) => {
  return {
    ok: true,
    json: async () => ({
      candidates: [{ content: { parts: [{ text: "Mocked Gemini Response" }] } }]
    }),
    text: async () => "Mocked Gemini Response"
  };
};

test("askGemini returns mocked response", async (t) => {
  const response = await askGemini("Hello?");
  assert.strictEqual(response, "Mocked Gemini Response");
});

test("summariseManifesto generates prompt correctly", async (t) => {
  const mockCandidate = {
    name: "John Doe",
    party: "Civic Party",
    manifesto: [
      { category: "Health", promise: "More hospitals", detail: "Build 10 new ones" }
    ]
  };
  
  const response = await summariseManifesto(mockCandidate);
  assert.strictEqual(response, "Mocked Gemini Response");
});

test("getSosGuidance returns guidance for known types", async (t) => {
  const guidance = await getSosGuidance("stolen_vote");
  assert.strictEqual(guidance, "Mocked Gemini Response");
});

test("factCheck requests fact check for claim", async (t) => {
  const claim = "Voting is on Sunday";
  const result = await factCheck(claim);
  assert.strictEqual(result, "Mocked Gemini Response");
});
