# 🗳️ PlainPolitics — Civic Survival Assistant

> **Hackathon Submission** | MERN Stack + Gemini AI + Google Maps

PlainPolitics is an intelligent, dynamic web application that protects citizens through all three phases of the election lifecycle. It is specifically designed to meet **all strict hackathon constraints**.

---

## 🎯 Hackathon Constraints Checklist
✅ **Repository Size < 10 MB:** Entire codebase is optimized, highly modular, and uses vanilla CSS (no heavy Tailwind packages) to stay incredibly lightweight (~200KB).
✅ **Single Branch:** Development and deployment exist strictly on the `main` branch.
✅ **Smart, Dynamic Assistant:** Deep Google Gemini AI integration provides contextual RAG analysis for manifestos, SOS guidance, and community de-polarisation.
✅ **Google Services Integration:** Leverages Gemini (AI features), Google Maps API (Smart Routing & GPS Incident Logging), and Google Translate (Multi-lingual accessibility).
✅ **Security:** Bulletproofed with `helmet`, `express-rate-limit`, and `express-mongo-sanitize` (preventing NoSQL injection).
✅ **Testing:** Implemented native Node.js testing (`node:test`) to validate critical backend functionality without bloating the repository.

---

## 🚀 Key Features

### 🔐 Security & Access
- **Simulated OTP Login** — Realistic, secure phone-number authentication flow protecting sensitive features.
- **Role-based Access** — Anonymous browsing for public information (News, Manifestos); verified access required for incident reporting and subscriptions.

### Phase 1 — The Informer (Pre-Election)
- **Live Election News** — Dynamic news feed with premium image integration and SMS subscription capabilities.
- **"Am I Ready?" Checker** — Verify registration with a link to the official ECI portal.
- **AI Manifesto Summariser** — Side-by-side candidate comparison powered by Gemini.
- **Myth-Buster Engine** — Fact-check trending election claims instantly.
- **Civic AI Q&A** — Non-partisan answers to any voting question.

### Phase 2 — The Reporter (Election Day)
- **AI CCTV Surveillance** — Live booth monitoring interface simulating AI detection of altercations with auto-dispatch logic to Police/Ambulance.
- **SOS Dashboard** — One-tap guidance for stolen votes, machine breakdowns, and intimidation.
- **GPS Incident Logger** — Log incidents with exact coordinates via Google Maps.
- **Smart Booth Routing** — Live crowd data + Google Maps booth finder.

### Phase 3 — The Tracker (Post-Election)
- **Promise Tracker** — Community upvote/downvote dashboard for candidate promises.
- **Zen Mode** — Block speculation; get notified only when results are certified.
- **De-Polarisation Guide** — AI advice for rebuilding community after divisive elections.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini API (`@google-cloud/vertexai`) |
| Maps | Google Maps JS API |
| Security | Helmet, express-rate-limit, express-mongo-sanitize |
| Testing | Node.js Native Test Runner (`node:test`) |

---

## ⚙️ Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key ([get one](https://aistudio.google.com/))
- Google Maps API key ([get one](https://console.cloud.google.com/))

### 1. Clone & install

```bash
git clone https://github.com/ishanseth9596-bot/PlainPolitics.git
cd PlainPolitics

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MONGO_URI and GEMINI_API_KEY

# Client
cp client/.env.example client/.env
# Edit client/.env with your VITE_MAPS_API_KEY
```

### 3. Run Application

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Run Tests
```bash
cd server && npm test
```

---

## 🔐 Security Practices

- **NoSQL Injection Prevention:** Enforced via `express-mongo-sanitize`.
- **DDoS Protection:** Rate limiting configured to 100 requests / 15 minutes per IP.
- **HTTP Hardening:** Security headers set via `helmet`.
- **Privacy First:** No PII stored permanently. Phone numbers used only for session verification.

---

*Built with ❤️ for informed citizens everywhere.*
