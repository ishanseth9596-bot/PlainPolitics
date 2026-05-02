# Project Structure

```text
PlainPolitics/
├── .github/                   # CI/CD Workflows
├── client/                    # React (Vite) Frontend
│   ├── src/
│   │   ├── components/        # UI Components (Maps, Timelines)
│   │   ├── hooks/             # Custom React Hooks (AI, Topics, Translate)
│   │   ├── pages/             # Informer, Reporter, Tracker views
│   │   ├── services/          # API client (Axios)
│   │   └── context/           # React Context for global state
│   └── public/                # Static assets
├── server/                    # Node.js (Express) Backend
│   ├── routes/                # API Endpoints (AI, Analytics, Feedback)
│   ├── services/              # Business Logic (Gemini, BigQuery, NL API)
│   ├── models/                # Mongoose Schema definitions
│   ├── middleware/            # Security & Error Handling (Guard, Global Handler)
│   ├── test/                  # Jest Test Suite (Regression & Integration)
│   ├── utils/                 # Helpers (Standardized Response Envelope)
│   └── index.js               # Server Entry Point
├── Dockerfile                 # Containerization for Cloud Run
├── cloudbuild.yaml            # Google Cloud Build Pipeline
├── CONTRIBUTING.md            # Standards & Template Docs
└── README.md                  # Main Judge-Facing Documentation
```
