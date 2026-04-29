import { Link } from "react-router-dom";

const phases = [
  {
    id: "informer",
    badge: "Phase 1",
    badgeClass: "badge-informer",
    emoji: "📋",
    title: "The Informer",
    subtitle: "Pre-Election",
    desc: "Verify your registration, compare candidate manifestos with AI, and bust election myths before polling day.",
    color: "var(--clr-informer)",
    glow: "var(--shadow-glow-blue)",
    to: "/informer",
  },
  {
    id: "reporter",
    badge: "Phase 2",
    badgeClass: "badge-reporter",
    emoji: "🚨",
    title: "The Reporter",
    subtitle: "Election Day",
    desc: "Real-time booth routing, one-tap SOS dashboard for stolen votes, machine failures, and intimidation.",
    color: "var(--clr-reporter)",
    glow: "var(--shadow-glow-amber)",
    to: "/reporter",
  },
  {
    id: "tracker",
    badge: "Phase 3",
    badgeClass: "badge-tracker",
    emoji: "📊",
    title: "The Tracker",
    subtitle: "Post-Election",
    desc: "Hold winners accountable with the Promise Tracker, toggle Zen Mode for mental peace, and de-polarise.",
    color: "var(--clr-tracker)",
    glow: "var(--shadow-glow-green)",
    to: "/tracker",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="container">
          <p className="hero__eyebrow">Your Civic Survival Assistant</p>
          <h1 className="hero__title">
            Voting shouldn't be{" "}
            <span className="gradient-text">confusing.</span>
          </h1>
          <p className="hero__sub">
            PlainPolitics guides you through every stage of the election — from
            registration to results — with verified data and AI-powered clarity.
          </p>
          <div className="hero__cta">
            <Link to="/informer" id="cta-start" className="btn btn-primary">
              🚀 Get Started
            </Link>
            <Link to="/reporter" id="cta-sos" className="btn btn-outline">
              🆘 Election Day SOS
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
            <span className="phase-badge badge-informer" style={{ marginBottom: 12, display: "inline-flex" }}>Three Phases</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 700 }}>
              We protect you before, during,<br />and after the vote.
            </h2>
          </div>

          <div className="grid-3">
            {phases.map((p, i) => (
              <Link
                key={p.id}
                to={p.to}
                id={`phase-card-${p.id}`}
                className="card fade-in"
                style={{
                  animationDelay: `${i * 120}ms`,
                  borderColor: `${p.color}30`,
                  textDecoration: "none",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "var(--radius-md)",
                  background: `${p.color}18`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "1.8rem", marginBottom: "var(--space-4)",
                }}>
                  {p.emoji}
                </div>
                <span className={`phase-badge ${p.badgeClass}`} style={{ marginBottom: 8 }}>
                  {p.badge} · {p.subtitle}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: 8, color: "#111" }}>
                  {p.title}
                </h3>
                <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>{p.desc}</p>
                <div style={{ marginTop: "var(--space-4)", color: p.color, fontSize: "0.85rem", fontWeight: 600 }}>
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ background: "var(--clr-surface)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderTop: "1px solid var(--clr-border)", borderBottom: "1px solid var(--clr-border)", padding: "var(--space-6) 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-5)", textAlign: "center" }}>
            {[
              { stat: "3 Phases", label: "Full Election Lifecycle" },
              { stat: "Gemini AI", label: "Powered Fact Checking" },
              { stat: "Google Maps", label: "Live Booth Routing" },
              { stat: "Zero PII", label: "Stored in Plain Text" },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--clr-primary)", marginBottom: 4 }}>{stat}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Chat teaser ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>🤖</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: 8, color: "#111" }}>
              Ask the Civic AI anything
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "var(--space-5)" }}>
              Powered by Gemini. Non-partisan, fact-based answers about your voting rights, deadlines, and procedures.
            </p>
            <Link to="/informer" id="cta-ask-ai" className="btn btn-primary">
              💬 Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
