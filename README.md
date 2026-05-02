# 🗳️ PlainPolitics — AI-Driven Civic Guardian

> **Google Hackathon Submission** | MERN + Gemini + Vertex AI + BigQuery + NL API

PlainPolitics is a state-of-the-art civic survival assistant designed to empower citizens through the complexities of the election lifecycle. By leveraging Google’s most advanced AI and data services, it transforms dense political noise into actionable, safe, and non-partisan guidance.

---

## 🎯 What PlainPolitics Solves

In modern democracies, voters face a dual crisis: **information overload** and **civic friction**. Political manifestos are hundreds of pages long, purposely dense and jargon-heavy, making it nearly impossible for the average citizen to perform meaningful comparisons. Simultaneously, election day often presents physical and psychological barriers—from long queues and intimidation to "stolen votes"—that discourage participation. PlainPolitics solves this by acting as a personalized, AI-driven filter and navigator that protects the democratic process.

By providing real-time, context-aware assistance, PlainPolitics bridges the gap between civic duty and daily life. It doesn't just inform; it proactively guards. Whether verifying a viral claim during a media blackout or finding the safest path to a polling booth during an incident, PlainPolitics ensures that every citizen has a high-fidelity "Civic Guardian" in their pocket, reducing the friction of democracy to a single, intuitive interface.

## ☁️ Google Services — Why Each One Is Essential

- **Gemini 2.5 Flash-Lite** → Core reasoning engine for manifesto summarization and de-polarization advice → *Essential for distilling high-volume text without context loss; removal would revert the app to static, non-intelligent FAQs.*
- **Vertex AI** → Enterprise-grade endpoint for high-priority SOS guidance → *Provides the reliability and specialized safety tuning needed for emergency civic scenarios; removal would compromise the quality of critical legal guidance.*
- **BigQuery** → Real-time analytics engine for tracking trending civic concerns → *Powers the "Trending Topics" dashboard; without it, we lose the ability to detect and respond to community-wide misinformation spikes.*
- **Natural Language API** → Preprocessing engine for user queries (entity/sentiment extraction) → *Enriches Gemini prompts with structured context; without it, AI responses would be generic and less factually grounded.*
- **Cloud Functions** → Asynchronous processing for user feedback and event logs → *Handles the feedback pipeline without blocking the main request; removal would lag the user experience during high-traffic election days.*
- **Maps Platform** → Spatial intelligence for booth routing and incident logging → *Provides the visual and navigational backbone; removal would make the "Reporter" module physically useless for voters.*
- **Cloud Run** → Auto-scaling serverless hosting for the MERN stack → *Ensures the app stays online during massive election-day traffic spikes; removal would lead to server crashes under load.*
- **Cloud Build** → CI/CD pipeline with automated security/testing gates → *Guarantees that every deployment meets the 80% test coverage threshold; removal would introduce regression risks.*

## 🏗️ Architecture Diagram

```text
User ──► React Frontend (Vite) ──► Express.js (GCP Cloud Run)
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            │                          ▼                          │
      [ NL API ] ──► [ Gemini 1.5/2.5 ] ──► [ BigQuery Analytics ]
          ▲                ▲                         │
      (Enrich)          (Reason)                  (Log)
            └──────────────────────────┬──────────────────────────┘
                                       ▼
                             Standardized Response
```

## 🛡️ Security Model
- **Prompt Injection Defense:** Custom middleware (regex + keyword) blocks "jailbreak" attempts on AI endpoints.
- **NoSQL Injection:** `express-mongo-sanitize` prevents malicious MongoDB query operators.
- **DDoS Mitigation:** Tiered rate limiting via `express-rate-limit`.
- **API Hardening:** `helmet` security headers and strict `express-validator` schemas.
- **Data Privacy:** PII-free incident logging (only coordinates and incident type are shared).

## 🧪 Testing Strategy
We maintain a rigorous testing culture using **Jest + Supertest**.
- **Regression Tests:** Catch invalid inputs, injection attempts, and 503 fallback scenarios.
- **Integration Tests:** Verify the full `NL API -> Gemini -> BigQuery` request flow with mocks.
- **Coverage Threshold:** Minimum **80%** lines/branches required to pass CI.
- **Run Tests:** `cd server && npm test`

## ♿ Accessibility Features
- **WCAG 2.1 Compliant:** High-contrast CSS variables and `1.2rem` base typography.
- **Semantic HTML:** Proper heading hierarchy (`H1`-`H4`) for screen reader navigation.
- **Aria-Labels:** Interactive components (booth cards, AI chat) include descriptive ARIA roles.
- **Focus States:** Visible, high-visibility focus rings for keyboard-only navigation.

## ⚙️ Setup in 3 Commands

```bash
# 1. Clone
git clone https://github.com/ishanseth9596-bot/PlainPolitics.git && cd PlainPolitics

# 2. Install (Both)
npm install && cd server && npm install

# 3. Start (Dev Mode)
npm run dev
```

## 🛠️ Demo Mode
PlainPolitics includes a **MongoDB "Demo Mode" fallback**. If a `MONGO_URI` is not provided or the connection fails, the system automatically detects this and serves high-fidelity mock data for all endpoints. This ensures judges can evaluate the UI, AI flows, and analytics even without a live database.

---
*Optimized for the Google Hackathon | Version 1.0.0*
