import { VertexAI } from "@google-cloud/vertexai";
import fetch from "node-fetch";

// ── Choose backend: Vertex AI (Cloud Run) or REST API key (local dev) ──────
const useVertexAI =
  Boolean(process.env.GOOGLE_CLOUD_PROJECT) &&
  !process.env.GEMINI_API_KEY;

// ── Vertex AI client (Application Default Credentials via service account) ──
let generativeModel;

if (useVertexAI) {
  const vertexAI = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
  });
  generativeModel = vertexAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: {
      parts: [{ text: "You are a neutral, non-partisan civic assistant for PlainPolitics. Your goal is to help citizens understand their voting rights, registration processes, and election procedures. Stay strictly factual, avoid endorsing any party or candidate, and cite official guidelines where possible." }]
    },
    generationConfig: {
      temperature: 0.2,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });
}

// ── Gemini REST (local dev with API key) ────────────────────────────────────
const GEMINI_REST_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

async function callGeminiRest(prompt, systemInstruction) {
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };
  if (systemInstruction) {
    body.system_instruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(
    `${GEMINI_REST_URL}?key=${process.env.GEMINI_API_KEY}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );
  if (!res.ok) throw new Error(`Gemini REST error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";
}

// ── Vertex AI call ──────────────────────────────────────────────────────────
async function callVertexAI(prompt, systemInstruction) {
  const request = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };
  if (systemInstruction) {
    request.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  const result = await generativeModel.generateContent(request);
  const response = await result.response;
  return response.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";
}

// ── Public API ──────────────────────────────────────────────────────────────
/**
 * Send a prompt to Gemini and return the text response.
 * Automatically uses Vertex AI on Cloud Run, REST API key locally.
 */
export const askGemini = async (prompt, systemInstruction = "") => {
  // Try Vertex AI first if configured
  if (useVertexAI) {
    try {
      return await callVertexAI(prompt, systemInstruction);
    } catch (err) {
      console.warn("⚠️ Vertex AI failed, falling back to REST API:", err.message);
      // Fall through to REST fallback
    }
  }

  // Fallback to REST API key
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Set GEMINI_API_KEY (local) or ensure Vertex AI is enabled (Cloud Run).");
  }
  return callGeminiRest(prompt, systemInstruction);
};

/** Summarise a candidate manifesto into bullet points. */
export const summariseManifesto = (candidate) => {
  const promises = candidate.manifesto
    .map((p) => `- [${p.category}] ${p.promise}: ${p.detail}`)
    .join("\n");

  return askGemini(`
You are a non-partisan civic assistant. Summarise the following election manifesto in simple, jargon-free English for a first-time voter.
Format: short paragraph followed by 5 clear bullet points.

Candidate: ${candidate.name} (${candidate.party})
Manifesto:
${promises}
`);
};

/** Fact-check a claim using Gemini. */
export const factCheck = (claim) =>
  askGemini(`
You are a fact-checking assistant. A voter is asking whether the following claim about an election is true or false.
Answer with: VERDICT: TRUE / FALSE / UNVERIFIED, then 2-3 sentences explaining why. Stay strictly factual.

Claim: "${claim}"
`);

/** Generate contextual SOS guidance. */
export const getSosGuidance = (type) => {
  const guides = {
    stolen_vote: `Explain to a panicking voter that their vote may have been fraudulently cast. Give them 3 clear, numbered steps:
1. Ask for a Tendered Ballot.
2. Who to speak to at the booth.
3. How to file a formal complaint afterward.
Keep it calm and under 100 words.`,
    machine_breakdown: `Explain to a voter the voting machine is broken. Give them 3 numbered steps:
1. Alert the Presiding Officer.
2. Wait for the backup process.
3. Their rights during the wait.
Keep it calm and under 100 words.`,
    intimidation: `Explain to a voter they are being intimidated at a polling booth. Give them 3 numbered steps:
1. Stay calm and do not engage.
2. Find a Neutral Observer inside.
3. Log the incident with GPS and report it.
Keep it calm and under 100 words.`,
  };
  return askGemini(guides[type] || "Provide general election day guidance.");
};

/** Generate de-polarisation advice. */
export const getDepolarisationAdvice = (concern) =>
  askGemini(`
You are a community peacebuilding advisor. A voter says: "${concern}".
Give them 3 short, actionable tips to rebuild community relationships after a divisive election.
Focus on shared local goals, not national politics. Keep it warm and under 150 words.
`);
