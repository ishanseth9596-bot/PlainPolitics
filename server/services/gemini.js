import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Send a prompt to Gemini and return the text response.
 * @param {string} prompt
 * @param {string} systemInstruction - Optional grounding instruction
 * @returns {Promise<string>}
 */
export const askGemini = async (prompt, systemInstruction = "") => {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

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

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";
};

/**
 * Summarise a candidate manifesto into bullet points.
 * @param {object} candidate
 */
export const summariseManifesto = (candidate) => {
  const promises = candidate.manifesto
    .map((p) => `- [${p.category}] ${p.promise}: ${p.detail}`)
    .join("\n");

  const prompt = `
You are a non-partisan civic assistant. Summarise the following election manifesto in simple, jargon-free English for a first-time voter.
Format your output as a short paragraph followed by 5 clear bullet points.

Candidate: ${candidate.name} (${candidate.party})
Manifesto:
${promises}
`;
  return askGemini(prompt);
};

/**
 * Fact-check a claim using Gemini's knowledge.
 * @param {string} claim
 */
export const factCheck = (claim) => {
  const prompt = `
You are a fact-checking assistant. A voter is asking whether the following claim about an election is true or false.
Answer with: VERDICT: TRUE / FALSE / UNVERIFIED, then 2–3 sentences explaining why. Stay strictly factual.

Claim: "${claim}"
`;
  return askGemini(prompt);
};

/**
 * Generate contextual SOS guidance based on incident type.
 * @param {"stolen_vote"|"machine_breakdown"|"intimidation"} type
 */
export const getSosGuidance = (type) => {
  const guides = {
    stolen_vote: `
Explain to a panicking voter that their vote may have been fraudulently cast. Give them 3 clear, numbered steps:
1. Ask for a Tendered Ballot (a paper backup vote).
2. Who to speak to at the booth.
3. How to file a formal complaint afterward.
Keep it calm and under 100 words.`,
    machine_breakdown: `
Explain to a voter that the voting machine is broken. Give them 3 numbered steps:
1. Alert the Presiding Officer.
2. Wait for the backup process.
3. Their rights during the wait.
Keep it calm and under 100 words.`,
    intimidation: `
Explain to a voter that they are being intimidated at a polling booth. Give them 3 numbered steps:
1. Stay calm and do not engage.
2. Find a Neutral Observer or Election Observer inside.
3. Log the incident with GPS and report it.
Keep it calm and under 100 words.`,
  };

  const prompt = guides[type] || "Provide general election day guidance.";
  return askGemini(prompt);
};

/**
 * Generate de-polarisation advice.
 * @param {string} concern - User's specific concern
 */
export const getDepolarisationAdvice = (concern) => {
  const prompt = `
You are a community peacebuilding advisor. A voter says: "${concern}".
Give them 3 short, actionable tips to rebuild community relationships after a divisive election.
Focus on shared local goals, not national politics. Keep it warm and under 150 words.
`;
  return askGemini(prompt);
};
