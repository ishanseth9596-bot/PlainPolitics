# 🗳️ PlainPolitics — Civic Survival Assistant

> **Google Hackathon Submission** | MERN Stack + Google Gemini AI + Google Maps

PlainPolitics is an intelligent, dynamic civic assistant designed to empower and protect citizens through the entire election lifecycle. It provides real-time, non-partisan guidance using state-of-the-art Google services.

---

## 🎯 Submission Overview

### 🏷️ Chosen Vertical
**Civic Engagement & Democratic Transparency**
*Focusing on the persona of an "Informed Voter" and "Civic Guardian" to navigate election complexities safely.*

### 📂 Repository Requirements
- ✅ **Size:** < 10 MB (highly optimized codebase, vanilla CSS for minimal footprint).
- ✅ **Branching:** Single branch (`main`) implementation.
- ✅ **Public:** Repository is public as required.

---

## 🧠 Approach and Logic

### The Three-Phase Lifecycle
The solution is logically structured around the three distinct stages of an election to provide context-aware assistance:

1.  **Phase 1: The Informer (Pre-Election)**
    *   **Logic:** Reduce information asymmetry.
    *   **Features:** AI Manifesto Summarizer, Myth-Buster Engine, "Am I Ready?" registration checker.
    *   **Google Service:** Gemini AI (REST) for objective analysis of political documents.

2.  **Phase 2: The Reporter (Election Day)**
    *   **Logic:** Proactive safety and real-time navigation.
    *   **Features:** AI CCTV Monitoring (simulation), SOS Guidance, GPS Incident Logging, Smart Booth Routing.
    *   **Google Services:** Google Maps API for spatial awareness and Vertex AI for emergency guidance.

3.  **Phase 3: The Tracker (Post-Election)**
    *   **Logic:** Accountability and social cohesion.
    *   **Features:** Promise Tracker (upvote/downvote), Zen Mode (media blackout), De-Polarisation Guide.
    *   **Google Service:** Gemini AI for sentiment-aware community peacebuilding advice.

---

## 🛠️ How the Solution Works

### 1. Smart Assistant (Gemini AI)
The core "brain" of PlainPolitics uses **Google Gemini 2.5 Flash-Lite**.
- **Manifesto Summarization:** Converts 100+ page documents into 5 jargon-free bullet points.
- **Fact-Checking:** Uses the LLM's knowledge base to verify claims against known facts.
- **Contextual Guidance:** Provides specific, actionable steps for election-day issues (e.g., "What if my vote was stolen?").

### 2. Spatial Intelligence (Google Maps)
- **Incident Mapping:** Users log polling booth incidents with exact GPS coordinates.
- **Smart Routing:** Integrates crowd-density simulation with Google Maps navigation to find the most efficient path to the booth.

### 3. Security & Reliability
- **Backend Hardening:** Uses `helmet` for secure headers, `express-rate-limit` for DDoS protection, and `express-mongo-sanitize` to prevent NoSQL injection.
- **Demo Mode:** Implements a robust fallback mechanism that allows the application to function with mock data if a MongoDB connection is unavailable, ensuring high availability during evaluations.

---

## 📋 Assumptions Made

1.  **API Tiers:** Assumed use of the **Gemini Free Tier**. The code is optimized for `gemini-2.5-flash-lite` to avoid quota errors (429) common with heavier models.
2.  **Connectivity:** Assumes standard internet connectivity. However, the app includes "Demo Mode" for data-sensitive features to ensure the UI never breaks.
3.  **Non-Partisanship:** Assumes the AI should stay strictly neutral. System instructions explicitly forbid endorsing candidates or parties.

---

## ⚙️ Setup & Installation

### 1. Clone & Install
```bash
git clone https://github.com/ishanseth9596-bot/PlainPolitics.git
cd PlainPolitics

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Environment Configuration
Create a `.env` file in the `server` directory:
```env
GEMINI_API_KEY=your_google_ai_key
PORT=5000
MONGO_URI=your_mongodb_uri (optional, falls back to Demo Mode)
```

### 3. Run Locally
```bash
# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Client
cd client && npm run dev
```
Visit: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Validation & Testing
PlainPolitics includes a native test suite to validate logical decision-making:
```bash
cd server && npm test
```
*Validated features: API route integrity, AI prompt construction, and data sanitization.*

---

## ♿ Accessibility & Design
- **Inclusive Design:** High-contrast color palette with `1.2rem` base font size for readability.
- **Multi-lingual:** Integrated Google Translate support for diverse regional languages.
- **Lightweight:** Entire client build is < 500KB for fast loading on low-bandwidth connections.

---
*Built for the Google Hackathon — Empowering Democracy with AI.*

