import { useState, useRef, useEffect } from "react";
import { factCheck, summariseManifesto } from "../services/api";
import Spinner from "../components/Spinner";
import AIBox from "../components/AIBox";
import VoterRegistrationHub from "../components/VoterRegistrationHub";
import ElectionTimeline from "../components/ElectionTimeline";
import ElectionCards from "../components/ElectionCards";

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
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setStatus(null);
    
    // Simulate a network request to check registration
    setTimeout(() => {
      // Mock logic: If the name length is even, they are registered, else they are not.
      // This gives the user dynamic feedback without needing a real backend DB connection for the demo.
      if (name.trim().length % 2 === 0) {
        setStatus("found");
      } else {
        setStatus("not_found");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="card" style={{ borderColor: "rgba(79,142,247,0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
        ✅ "Am I Ready?" Registration Checker
      </h3>
      <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        Verify your voter registration status before polling day.
      </p>
      <form onSubmit={handleCheck} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input
          id="reg-name"
          className="input"
          style={{ flex: 1, minWidth: 200 }}
          placeholder="Enter your EPIC Number (Voter ID)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button id="reg-check-btn" type="submit" className="btn btn-primary" style={{ padding: "12px 20px" }} disabled={loading}>
          {loading ? "Checking..." : "Check Status"}
        </button>
      </form>
      
      {status === "found" && (
        <div className="fade-in" style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: "rgba(16,185,129,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16,185,129,0.3)" }}>
          <p style={{ color: "#10b981", fontWeight: 600 }}>✅ Registration Found (पंजीकरण मिल गया)</p>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: 4 }}>
            EPIC No: <strong style={{ color: "#111" }}>{name}</strong><br />
            Status: <strong style={{ color: "#10b981" }}>Active Voter (सक्रिय मतदाता)</strong><br />
            📸 <strong>Tip:</strong> Screenshot this page to prove your status at the polling booth.
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: 12, flexWrap: "wrap" }}>
            <a
              href="https://electoralsearch.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              id="eci-link"
              className="btn btn-outline"
              style={{ fontSize: "0.85rem", padding: "8px 16px" }}
            >
              🔗 Verify on Official ECI Portal
            </a>
            <a
              href="https://electoralsearch.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: "0.85rem", padding: "8px 16px" }}
            >
              🔗 आधिकारिक ECI पोर्टल पर सत्यापित करें
            </a>
          </div>
        </div>
      )}

      {status === "not_found" && (
        <div className="fade-in" style={{ marginTop: "var(--space-4)", padding: "var(--space-4)", background: "rgba(239,68,68,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <p style={{ color: "#ef4444", fontWeight: 600 }}>❌ Registration Not Found (पंजीकरण नहीं मिला)</p>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: 4 }}>
            We couldn't find a registration matching the EPIC number <strong style={{ color: "#111" }}>{name}</strong>.<br />
            Please double-check the spelling or verify directly on the official portal.
          </p>
          
          <div style={{ marginTop: "16px", background: "#f9fafb", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#dc2626", fontSize: "0.85rem", fontWeight: 700, marginBottom: "8px" }}>Why might this happen? (Your vote is not ready if:)</p>
            <ul style={{ color: "#374151", fontSize: "0.8rem", marginLeft: "20px", lineHeight: 1.6 }}>
              <li><strong>Typo in EPIC Number:</strong> Double-check the exact alphanumeric code on your Voter ID card.</li>
              <li><strong>Not Registered Yet:</strong> Having an Aadhaar or PAN does not mean you can vote. You must apply for a Voter ID (Form 6).</li>
              <li><strong>Name Deleted:</strong> Your name may have been struck off during recent electoral roll revisions.</li>
              <li><strong>Shifted Residence:</strong> You may be registered in a different constituency if you recently moved.</li>
            </ul>
          </div>

          <a
            href="https://electoralsearch.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            id="eci-link-not-found"
            className="btn btn-outline"
            style={{ marginTop: 16, fontSize: "0.85rem", padding: "8px 16px", display: "inline-block" }}
          >
            🔗 Search officially by EPIC No.
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
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#111" }}>
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
            <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>{p.promise}</span>
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
    } catch (err) {
      console.error("Myth-buster API error:", err);
      setResult("⚠️ Unable to reach the fact-check AI right now. Make sure the server is running and the Gemini API key is valid, then try again.");
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
      <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
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
          <p style={{ color: "#374151", lineHeight: 1.8 }}>{result}</p>
        </div>
      )}
    </div>
  );
}



// ── Voting Guide ───────────────────────────────────────────────────────────
function VotingGuide() {
  const steps = [
    {
      title: "Step 1: Identity Verification",
      icon: "🪪",
      desc: "Approach the first polling officer at the entrance. Present your identity proof (Voter ID/EPIC card or other approved documents). The officer will verify your name against the official electoral roll."
    },
    {
      title: "Step 2: Finger Marking & Signing",
      icon: "👆",
      desc: "The second officer will apply indelible ink on your left forefinger, record your details in the register (Form 17A), and provide you with a signed voter slip."
    },
    {
      title: "Step 3: Casting Your Vote (EVM)",
      icon: "🗳️",
      desc: "Hand your voter slip to the third officer and proceed to the voting compartment. Locate the Electronic Voting Machine (EVM). Press the blue button next to the candidate/symbol of your choice."
    },
    {
      title: "Step 4: VVPAT Verification",
      icon: "🧾",
      desc: "After voting, check the VVPAT machine window. A paper slip will appear for 7 seconds showing your chosen candidate's serial number, name, and symbol before dropping into the box."
    }
  ];

  return (
    <div className="card fade-in" style={{ borderColor: "rgba(59,130,246,0.3)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, marginBottom: "var(--space-2)", textAlign: "center", color: "#111" }}>
        Official Voting Procedure
      </h3>
      <p style={{ color: "#6b7280", textAlign: "center", marginBottom: "var(--space-6)" }}>
        A Step-by-Step Guide for Citizens
      </p>

      {/* Embedded Video Guide */}
      <div style={{ marginBottom: "var(--space-6)", borderRadius: "var(--radius-lg)", overflow: "hidden", position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}>
        <iframe
          src="https://www.youtube.com/embed/XGJQNKFYqYI?rel=0&modestbranding=1"
          title="Official ECI Voting Procedure"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <a 
          href="https://www.youtube.com/watch?v=XGJQNKFYqYI" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: "0.85rem", color: "#111", textDecoration: "underline", fontWeight: 600 }}
        >
          📺 Video not loading? Click to watch official guide on YouTube
        </a>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {steps.map((step, i) => (
          <div key={i} style={{ 
            display: "flex", gap: "var(--space-4)", alignItems: "flex-start",
            padding: "var(--space-5)", background: "#f9fafb", 
            borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)"
          }}>
            <div style={{ 
              fontSize: "2rem", background: "#fff", 
              width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "var(--radius-md)", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0,
              boxShadow: "var(--shadow-sm)"
            }}>
              {step.icon}
            </div>
            <div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#111", marginBottom: 6 }}>
                {step.title}
              </h4>
              <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "var(--space-6)", padding: "var(--space-4)", background: "rgba(239, 68, 68, 0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.2)", textAlign: "center" }}>
        <p style={{ color: "#dc2626", fontSize: "0.9rem", fontWeight: 600 }}>
          🔒 Protect the secrecy of your vote. Mobile phones are strictly prohibited inside the voting booth.
        </p>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Informer() {
  const [activeTab, setActiveTab] = useState("timeline");

  const tabs = [
    { id: "timeline",   label: "⏱️ Timeline" },
    { id: "elections",  label: "🗳️ Elections" },
    { id: "registration",label: "📝 Voter ID Hub" },
    { id: "ready",      label: "✅ Am I Ready?" },
    { id: "candidates", label: "📋 Candidates"  },
    { id: "guide",      label: "📘 Voting Guide" },
    { id: "mythbuster", label: "🔍 Myth-Buster" },

  ];

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: "var(--space-7)" }}>
          <span className="phase-badge badge-informer" style={{ marginBottom: "var(--space-3)", display: "inline-flex" }}>Phase 1</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>The Informer</h2>
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Pre-Election — Know before you go.</p>
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
        {activeTab === "guide"      && <VotingGuide />}
        {activeTab === "registration" && <VoterRegistrationHub />}
        {activeTab === "elections"  && <ElectionCards />}
        {activeTab === "candidates" && (
          <div className="grid-2">
            {DEMO_CANDIDATES.map((c) => <CandidateCard key={c._id} candidate={c} />)}
          </div>
        )}
        {activeTab === "mythbuster" && <MythBuster />}

        {activeTab === "timeline"   && <ElectionTimeline />}
      </div>
    </div>
  );
}
