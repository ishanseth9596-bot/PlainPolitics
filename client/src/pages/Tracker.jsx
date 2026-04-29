import { useState, useEffect } from "react";
import { getPromises, voteOnPromise, getDepolarisationAdvice } from "../services/api";
import Spinner from "../components/Spinner";
import AIBox from "../components/AIBox";

// ── Demo promises (fallback when DB not connected) ─────────────────────────
const DEMO_PROMISES = [
  { _id: "p1", title: "Free Wi-Fi in 100 public spaces",  category: "Technology",     status: "in_progress", upvotes: 142, downvotes: 23 },
  { _id: "p2", title: "Build 5 new primary health centres", category: "Health",       status: "pending",     upvotes: 98,  downvotes: 12 },
  { _id: "p3", title: "Plant 1 million trees",             category: "Environment",   status: "fulfilled",   upvotes: 312, downvotes: 8  },
  { _id: "p4", title: "Reduce water tariffs by 20%",       category: "Utilities",     status: "broken",      upvotes: 34,  downvotes: 89 },
  { _id: "p5", title: "Open 50 new public libraries",      category: "Education",     status: "pending",     upvotes: 76,  downvotes: 15 },
  { _id: "p6", title: "Zero-fare city buses on Sundays",   category: "Transport",     status: "in_progress", upvotes: 204, downvotes: 31 },
];

const STATUS_META = {
  pending:     { label: "Pending",     cls: "status-pending"     },
  in_progress: { label: "In Progress", cls: "status-in_progress" },
  fulfilled:   { label: "Fulfilled ✅", cls: "status-fulfilled"   },
  broken:      { label: "Broken ❌",   cls: "status-broken"      },
};

// ── Promise Card ───────────────────────────────────────────────────────────
function PromiseCard({ promise: init }) {
  const [promise, setPromise] = useState(init);
  const [voting, setVoting]   = useState(false);

  const total = promise.upvotes + promise.downvotes || 1;
  const pct   = Math.round((promise.upvotes / total) * 100);
  const meta  = STATUS_META[promise.status] || STATUS_META.pending;

  const handleVote = async (vote) => {
    setVoting(true);
    try {
      const { data } = await voteOnPromise(promise._id, vote);
      setPromise(data);
    } catch {
      // Optimistic update locally
      setPromise((p) => ({
        ...p,
        upvotes:   vote === "up"   ? p.upvotes + 1   : p.upvotes,
        downvotes: vote === "down" ? p.downvotes + 1 : p.downvotes,
      }));
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="card fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "0.7rem", background: "rgba(79,142,247,0.15)", color: "var(--clr-primary)", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 600 }}>
            {promise.category}
          </span>
          <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "#111", marginTop: 6 }}>
            {promise.title}
          </h4>
        </div>
        <span className={`status-chip ${meta.cls}`}>{meta.label}</span>
      </div>

      <div className="vote-bar">
        <button
          id={`vote-up-${promise._id}`}
          className="vote-btn up"
          onClick={() => handleVote("up")}
          disabled={voting}
          aria-label="Upvote — Promise kept"
        >
          👍 {promise.upvotes}
        </button>
        <div className="vote-bar__track">
          <div className="vote-bar__fill" style={{ width: `${pct}%` }} />
        </div>
        <button
          id={`vote-down-${promise._id}`}
          className="vote-btn down"
          onClick={() => handleVote("down")}
          disabled={voting}
          aria-label="Downvote — Promise broken"
        >
          👎 {promise.downvotes}
        </button>
      </div>
      <p style={{ fontSize: "0.7rem", color: "#64748b", marginTop: 6, textAlign: "center" }}>
        Community approval: {pct}% ({total} votes)
      </p>
    </div>
  );
}

// ── Promise Tracker ────────────────────────────────────────────────────────
function PromiseTracker() {
  const [promises, setPromises] = useState(DEMO_PROMISES);
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getPromises();
        if (data.length > 0) setPromises(data);
      } catch {
        // Keep demo data
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = filter === "all" ? promises : promises.filter((p) => p.status === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
        {["all", "pending", "in_progress", "fulfilled", "broken"].map((f) => (
          <button
            key={f}
            id={`filter-${f}`}
            className={`btn ${filter === f ? "btn-primary" : "btn-outline"}`}
            style={{ fontSize: "0.8rem", padding: "8px 16px" }}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Promises" : STATUS_META[f]?.label}
          </button>
        ))}
      </div>
      {loading && <Spinner />}
      <div className="grid-2">
        {filtered.map((p) => <PromiseCard key={p._id} promise={p} />)}
      </div>
    </div>
  );
}

// ── Zen Mode ───────────────────────────────────────────────────────────────
function ZenMode() {
  const [zen, setZen] = useState(() => localStorage.getItem("zenMode") === "true");
  const [breath, setBreath] = useState("Breathe In...");

  useEffect(() => {
    if (!zen) return;
    const interval = setInterval(() => {
      setBreath(prev => prev === "Breathe In..." ? "Hold..." : prev === "Hold..." ? "Breathe Out..." : "Breathe In...");
    }, 4000);
    return () => clearInterval(interval);
  }, [zen]);

  const toggle = () => {
    const isAuth = localStorage.getItem("plainpolitics_auth");
    if (!isAuth) {
      window.location.href = "/login";
      return;
    }
    const next = !zen;
    setZen(next);
    localStorage.setItem("zenMode", String(next));
  };

  return (
    <div>
      <div className="zen-banner">
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 4 }}>
            🧘 Zen Mode {zen ? "— Active" : ""}
          </h3>
          <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            Block all election speculation. Get notified <em>only</em> when official results are certified.
          </p>
        </div>
        <label className="toggle" htmlFor="zen-toggle" aria-label="Toggle Zen Mode">
          <input id="zen-toggle" type="checkbox" checked={zen} onChange={toggle} />
          <span className="toggle__slider" />
        </label>
      </div>

      {zen ? (
        <div className="fade-in" style={{ textAlign: "center", padding: "var(--space-8) var(--space-5)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "var(--space-4)", transition: "transform 4s ease-in-out", transform: breath === "Breathe In..." ? "scale(1.2)" : breath === "Breathe Out..." ? "scale(0.8)" : "scale(1)" }}>🌿</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: 8, color: "var(--clr-primary)" }}>
            {breath}
          </h3>
          <p style={{ color: "#6b7280", maxWidth: 480, marginInline: "auto", lineHeight: 1.8, marginTop: "var(--space-4)" }}>
            All speculation and noise is blocked. Take a breath. We'll send you one notification
            when the <strong style={{ color: "#111" }}>official, certified result</strong> is announced.
            Until then, step outside, call a friend, or make a cup of tea. 🍵
          </p>
        </div>
      ) : (
        <div style={{ marginTop: "var(--space-5)" }}>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
            Post-election media burnout is real. Toggle Zen Mode above to protect your mental health.
          </p>
          <div className="grid-3">
            {[
              { emoji: "📵", tip: "Block all exit poll speculation and social media noise." },
              { emoji: "🔔", tip: "Get one clean notification when official results are confirmed." },
              { emoji: "🤝", tip: "Redirect your energy to community action, not arguments." },
            ].map(({ emoji, tip }) => (
              <div key={tip} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>{emoji}</div>
                <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── De-Polarisation Guide ──────────────────────────────────────────────────
function DepolGuide() {
  const [concern, setConcern] = useState("");
  const [advice, setAdvice]   = useState(null);
  const [loading, setLoading] = useState(false);

  const samples = [
    "My family voted differently and we argued badly.",
    "I feel hopeless after my candidate lost.",
    "My neighbour and I aren't talking since the result.",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!concern.trim()) return;
    setLoading(true);
    setAdvice(null);
    try {
      const { data } = await getDepolarisationAdvice(concern);
      setAdvice(data.advice);
    } catch {
      setAdvice("1. Focus on one local issue you both care about — a broken street light, a park that needs cleaning.\n2. Share a meal or tea, and agree to only talk about your neighbourhood for one hour.\n3. Remember: the person across the table is your neighbour first, a voter second.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
        🤝 De-Polarisation Guide
      </h3>
      <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        Election season can strain friendships and families. Tell us your concern — AI will suggest practical ways to reconnect.
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
        {samples.map((s) => (
          <button
            key={s}
            className="btn btn-outline"
            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
            onClick={() => setConcern(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <textarea
          id="depol-concern"
          className="input"
          placeholder="Describe your situation…"
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          required
        />
        <button id="depol-submit" type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={loading}>
          {loading ? "Thinking…" : "💬 Get Advice"}
        </button>
      </form>
      {loading && <Spinner size={28} />}
      {advice && <AIBox text={advice} label="🌱 Community Advice" />}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Tracker() {
  const [activeTab, setActiveTab] = useState("promises");

  const tabs = [
    { id: "promises", label: "📊 Promise Tracker" },
    { id: "zen",      label: "🧘 Zen Mode"         },
    { id: "depol",    label: "🤝 De-Polarise"       },
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="phase-header">
          <span className="phase-badge badge-tracker">Phase 3</span>
          <div>
            <h2>The Tracker</h2>
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Post-Election — Hold them accountable.</p>
          </div>
        </div>

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`tracker-tab-${t.id}`}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "promises" && <PromiseTracker />}
        {activeTab === "zen"      && <ZenMode />}
        {activeTab === "depol"    && <DepolGuide />}
      </div>
    </div>
  );
}
