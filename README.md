# 🗳️ PlainPolitics — Civic Survival Assistant

> **Hackathon Project** | MERN Stack + Gemini AI + Google Maps

PlainPolitics is an intelligent, dynamic web application that protects citizens through all three phases of the election lifecycle.

---

## 🚀 Features

### Phase 1 — The Informer (Pre-Election)
- **"Am I Ready?" Checker** — Verify registration with a link to the official ECI portal
- **AI Manifesto Summariser** — Side-by-side candidate comparison powered by Gemini
- **Myth-Buster Engine** — Fact-check trending election claims instantly
- **Civic AI Q&A** — Non-partisan answers to any voting question

### Phase 2 — The Reporter (Election Day)
- **SOS Dashboard** — One-tap guidance for stolen votes, machine breakdowns, and intimidation
- **GPS Incident Logger** — Log incidents with coordinates via Google Maps
- **Smart Booth Routing** — Live crowd data + Google Maps booth finder
- **Crowdsource Check-Ins** — Share and view real-time booth wait times

### Phase 3 — The Tracker (Post-Election)
- **Promise Tracker** — Community upvote/downvote dashboard for candidate promises
- **Zen Mode** — Block speculation; get notified only when results are certified
- **De-Polarisation Guide** — AI advice for rebuilding community after divisive elections

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini API |
| Maps | Google Maps JS API |
| Security | Helmet, express-rate-limit, express-validator |

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

### 3. Run in development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔐 Security Practices

- No Aadhaar / SSN stored in plain text — used only as a query key, discarded immediately
- All API keys stored in `.env` — never committed to source control
- HTTP security headers via `helmet`
- Rate limiting: 100 requests / 15 minutes per IP
- Input validation on all POST endpoints via `express-validator`
- CORS restricted to frontend origin only

---

## 📁 Repository Structure

```
PlainPolitics/
├── client/          # React (Vite) frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
├── server/          # Node.js + Express backend
│   ├── models/
│   ├── routes/
│   └── services/
└── README.md
```

---

## 🏆 Google Services Used

1. **Gemini API** — Manifesto summarisation, myth-busting, SOS guidance, de-polarisation
2. **Google Maps JS API** — Booth locator, GPS incident logging
3. **Google Calendar API** — Deadline reminders (integration-ready via Calendar API)

---

## Branch

`main` — single branch as per hackathon requirements.

---

*Built with ❤️ for informed citizens everywhere.*
