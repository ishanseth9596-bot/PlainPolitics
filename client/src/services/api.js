import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export default api;

// ── Informer ──────────────────────────────────────────────────────────────────
export const getCandidates = (constituency) =>
  api.get("/informer/candidates", { params: { constituency } });

export const getCandidate = (id) =>
  api.get(`/informer/candidates/${id}`);

export const summariseManifesto = (id) =>
  api.post(`/informer/candidates/${id}/summarise`);

export const factCheck = (claim) =>
  api.post("/informer/fact-check", { claim });

// ── AI General ────────────────────────────────────────────────────────────────
export const askAI = (question) =>
  api.post("/ai/ask", { question });

// ── Reporter ──────────────────────────────────────────────────────────────────
export const getSosGuidance = (type) =>
  api.post("/reporter/sos-guidance", { type });

export const logIncident = (data) =>
  api.post("/reporter/incidents", data);

export const submitCheckIn = (data) =>
  api.post("/reporter/checkin", data);

export const getBoothStatus = (boothId) =>
  api.get(`/reporter/booths/${boothId}/status`);

// ── Tracker ───────────────────────────────────────────────────────────────────
export const getPromises = (candidateId) =>
  api.get("/tracker/promises", { params: { candidateId } });

export const voteOnPromise = (id, vote) =>
  api.post(`/tracker/promises/${id}/vote`, { vote });

export const getDepolarisationAdvice = (concern) =>
  api.post("/tracker/depolarise", { concern });
