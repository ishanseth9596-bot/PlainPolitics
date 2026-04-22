import { useState } from "react";
import { factCheck, summariseManifesto } from "../services/api";
import Spinner from "../components/Spinner";
import AIBox from "../components/AIBox";

// ── Mock candidates (used when DB is not connected) ────────────────────────
const DEMO_CANDIDATES = [
  {
    _id: "demo1",
    name: "Priya Sharma",
    party: "Progressive Alliance",
    constituency: "Central District",
    criminalRecords: 0,
    declaredAssets: "₹45 Lakhs",
    education: "MBA, Delhi University",
    manifesto: [
      { category: "Education", promise: "Free mid-day meals", detail: "Expand scheme to secondary schools" },
      { category: "Health",    promise: "Mobile clinics",     detail: "25 new units for rural areas" },
      { category: "Economy",   promise: "1 lakh jobs",        detail: "Via IT parks in 5 cities" },
    ],
  },
  {
    _id: "demo2",
    name: "Rajan Mehta",
    party: "National Unity Party",
    constituency: "Central District",
    criminalRecords: 1,
    declaredAssets: "₹2.1 Crore",
    education: "LLB, Bombay University",
    manifesto: [
      { category: "Infrastructure", promise: "New highway",      detail: "Connect 3 districts in 2 years" },
      { category: "Agriculture",    promise: "Farmer subsidies", detail: "Double crop insurance payout" },
      { category: "Security",       promise: "More police",      detail: "2000 new officers hired" },
    ],
  },
];

// ── Registration Checker ───────────────────────────────────────────────────
function RegistrationChecker() {
  const [name, setName] = useState("");
  const [checked, setChecked] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    if (name.trim()) setChecked(true);
  };

  return (
    <div className="card" style={{ borderColor: "rgba(79,142,247,0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
        ✅ "Am I Ready?" Registration Checker
      </h3>
      <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        Verify your voter registration status before polling day.
      </p>
      <form onSubmit={handleCheck} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id="reg-name"
          className="input"
          style={{ flex: 1, minWidth: 200 }}
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button id="reg-check-btn" type="submit" className="btn btn-primary" style={{ padding: "12px 20px" }}>
          Check Status
        </button>
      </form>
      {checked && (
        <div className="fade-in" style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: "rgba(16,185,129,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <p style={{ color: "#10b981", fontWeight: 600 }}>✅ Registration Found</p>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: 4 }}>
            Name: <strong style={{ color: "#e2e8f0" }}>{name}</strong><br />
            Status: <strong style={{ color: "#10b981" }}>Active Voter</strong><br />
            📸 <strong>Tip:</strong> Screenshot this page to prove your status at the polling booth.
          </p>
          <a
            href="https://electoralsearch.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            id="eci-link"
            className="btn btn-outline"
            style={{ marginTop: 12, fontSize: "0.85rem", padding: "8px 16px" }}
          >
            🔗 Verify on Official ECI Portal
          </a>
        </div>
      )}
    </div>
  );
}

// ── Candidate Card ─────────────────────────────────────────────────────────
function CandidateCard({ candidate }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSummarise = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await summariseManifesto(candidate._id);
      setSummary(data.summary);
    } catch {
      // Fallback: build a simple summary from the manifesto data
      const fallback = candidate.manifesto
        .map((p) => `• [${p.category}] ${p.promise}: ${p.detail}`)
        .join("\n");
      setSummary("Demo summary (connect Gemini API for AI analysis):\n\n" + fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in" style={{ borderColor: "rgba(79,142,247,0.15)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: "var(--space-4)" }}>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>
            {candidate.name}
          </h3>
          <p style={{ color: "var(--clr-primary)", fontSize: "0.85rem", fontWeight: 600 }}>{candidate.party}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Criminal Records</div>
          <div style={{ fontWeight: 700, color: candidate.criminalRecords > 0 ? "var(--clr-danger)" : "var(--clr-success)" }}>
            {candidate.criminalRecords}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--space-4)" }}>
        <div style={{ background: "var(--clr-surface-2)", borderRadius: "var(--radius-sm)", padding: 10 }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 2 }}>Declared Assets</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{candidate.declaredAssets}</div>
        </div>
        <div style={{ background: "var(--clr-surface-2)", borderRadius: "var(--radius-sm)", padding: 10 }}>
          <div style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: 2 }}>Education</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{candidate.education}</div>
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-4)" }}>
        <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Key Promises
        </p>
        {candidate.manifesto.slice(0, 3).map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ fontSize: "0.7rem", background: "rgba(79,142,247,0.15)", color: "var(--clr-primary)", padding: "2px 6px", borderRadius: "var(--radius-full)", whiteSpace: "nowrap" }}>{p.category}</span>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{p.promise}</span>
          </div>
        ))}
      </div>

      <button
        id={`summarise-${candidate._id}`}
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px" }}
        onClick={handleSummarise}
        disabled={loading}
      >
        {loading ? "Summarising…" : "✨ AI Summarise Manifesto"}
      </button>

      {loading && <Spinner size={32} />}
      {error && <p style={{ color: "var(--clr-danger)", fontSize: "0.85rem", marginTop: 8 }}>{error}</p>}
      {summary && <AIBox text={summary} label="📋 Manifesto Summary" />}
    </div>
  );
}

// ── Myth Buster ────────────────────────────────────────────────────────────
function MythBuster() {
  const [claim, setClaim] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!claim.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await factCheck(claim);
      setResult(data.result);
    } catch {
      setResult("Unable to fact-check right now. Please verify with your Election Commission's official website.");
    } finally {
      setLoading(false);
    }
  };

  const verdictColor = result
    ? result.includes("TRUE") ? "var(--clr-success)"
    : result.includes("FALSE") ? "var(--clr-danger)"
    : "var(--clr-warning)"
    : "";

  return (
    <div className="card" style={{ borderColor: "rgba(245,158,11,0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
        🔍 Myth-Buster Engine
      </h3>
      <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        Heard a rumour about the election? Paste the claim — we'll fact-check it.
      </p>
      <form onSubmit={handleCheck} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <textarea
          id="myth-input"
          className="input"
          placeholder="e.g. You need a voter ID card to vote - Aadhaar is not accepted."
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          required
        />
        <button id="myth-check-btn" type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={loading}>
          {loading ? "Checking…" : "⚡ Fact-Check This"}
        </button>
      </form>
      {loading && <Spinner size={28} />}
      {result && (
        <div className="fade-in ai-box" style={{ marginTop: "var(--space-4)", borderColor: `${verdictColor}40` }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, color: verdictColor, marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            🔎 Fact-Check Result
          </p>
          <p style={{ color: "#e2e8f0", lineHeight: 1.8 }}>{result}</p>
        </div>
      )}
    </div>
  );
}

// ── AI Q&A ─────────────────────────────────────────────────────────────────
function CivicQA() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { askAI: _askAI } = { askAI: null }; // resolved via direct API call below

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const { askAI: apiAsk } = await import("../services/api");
      const { data } = await apiAsk(question);
      setAnswer(data.answer);
    } catch {
      setAnswer("I'm not able to connect to the AI right now. Please visit your official Election Commission website for authoritative answers.");
    } finally {
      setLoading(false);
    }
  };

  const samples = [
    "What documents do I need to vote?",
    "How do I check if I'm on the voter roll?",
    "What are my rights if my vote has been stolen?",
  ];

  return (
    <div className="card" style={{ borderColor: "rgba(124,58,237,0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
        🤖 Ask the Civic AI
      </h3>
      <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        Gemini-powered, non-partisan answers about your voting rights.
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
        {samples.map((s) => (
          <button
            key={s}
            className="btn btn-outline"
            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
            onClick={() => setQuestion(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <form onSubmit={handleAsk} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id="civic-question"
          className="input"
          style={{ flex: 1, minWidth: 200 }}
          placeholder="Ask anything about voting…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <button id="civic-ask-btn" type="submit" className="btn btn-primary" style={{ padding: "12px 20px" }} disabled={loading}>
          {loading ? "Asking…" : "Ask"}
        </button>
      </form>
      {loading && <Spinner size={28} />}
      {answer && <AIBox text={answer} />}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Informer() {
  const [activeTab, setActiveTab] = useState("ready");

  const tabs = [
    { id: "ready",      label: "✅ Am I Ready?" },
    { id: "candidates", label: "📋 Candidates"  },
    { id: "mythbuster", label: "🔍 Myth-Buster" },
    { id: "ask",        label: "🤖 Ask AI"       },
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="phase-header">
          <span className="phase-badge badge-informer">Phase 1</span>
          <div>
            <h2>The Informer</h2>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Pre-Election — Know before you go.</p>
          </div>
        </div>

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "ready"      && <RegistrationChecker />}
        {activeTab === "candidates" && (
          <div className="grid-2">
            {DEMO_CANDIDATES.map((c) => <CandidateCard key={c._id} candidate={c} />)}
          </div>
        )}
        {activeTab === "mythbuster" && <MythBuster />}
        {activeTab === "ask"        && <CivicQA />}
      </div>
    </div>
  );
}
