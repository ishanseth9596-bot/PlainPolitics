import { Link } from "react-router-dom";
import { SplineScene } from "@/components/ui/splite";

const phases = [
  {
    id: "informer",
    badge: "Phase 1",
    badgeClass: "badge-informer",
    emoji: "📋",
    title: "The Informer",
    subtitle: "Pre-Election",
    desc: "Verify your registration, compare candidate manifestos with AI, and bust election myths before polling day.",
    color: "#111",
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
    color: "#111",
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
    color: "#111",
    to: "/tracker",
  },
];

const journeySteps = [
  { 
    title: "01. Registration", 
    desc: "Get your Voter ID (EPIC) card ready. It's strictly free.", 
    icon: "📝", 
    action: "Register Now", 
    to: "/informer" 
  },
  { 
    title: "02. Verification", 
    desc: "Check if your name is on the roll before polling day.", 
    icon: "✅", 
    action: "Check Status", 
    to: "/informer" 
  },
  { 
    title: "03. Voting", 
    desc: "Find your booth and cast your vote securely on the EVM.", 
    icon: "🗳️", 
    action: "Find Booth", 
    to: "/reporter" 
  },
  { 
    title: "04. Results", 
    desc: "Track promises and hold your representatives accountable.", 
    icon: "📊", 
    action: "Track Impact", 
    to: "/tracker" 
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" style={{ textAlign: "left", alignItems: "flex-start" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)", flexWrap: "wrap" }}>
          {/* Left content */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            <span className="phase-badge badge-informer" style={{ marginBottom: "var(--space-4)", display: "inline-flex" }}>🚀 Built for #PromptWars by Hack2skill</span>
            <h1 className="hero__title" style={{ textAlign: "left" }}>
              Your Election Journey,<br />
              <span className="gradient-text">Simplified.</span>
            </h1>
            <p className="hero__sub" style={{ marginInline: "0", textAlign: "left" }}>
              PlainPolitics guides you through the entire election lifecycle — from registration to accountability — with Gemini AI and real-time civic data.
            </p>
            <div className="hero__cta" style={{ justifyContent: "flex-start" }}>
              <Link to="/informer" id="cta-start" className="btn btn-primary">
                🚀 Start Your Journey
              </Link>
              <Link to="/ask-ai" className="btn btn-outline">
                🤖 Ask AI a Question
              </Link>
            </div>
          </div>

          {/* Right content - The Bot */}
          <div style={{ flex: "1", minWidth: "300px", height: "500px", position: "relative" }}>
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ── Election Lifecycle (DemocrAI Inspiration) ── */}
      <section className="section" style={{ background: "#fff", borderTop: "1px solid var(--clr-border)", borderBottom: "1px solid var(--clr-border)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 800, color: "#111", marginBottom: 8 }}>
              Understand the Process
            </h2>
            <p style={{ color: "#6b7280", fontSize: "1rem" }}>We break down the election step-by-step.</p>
          </div>

          <div className="grid-2" style={{ gap: "var(--space-6)" }}>
             {journeySteps.map((step, i) => (
               <div key={i} className="fade-in" style={{ 
                 display: "flex", gap: "var(--space-4)", alignItems: "flex-start",
                 padding: "var(--space-5)", background: "#f9fafb", 
                 borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.06)",
                 animationDelay: `${i * 100}ms`
               }}>
                 <div style={{ 
                   fontSize: "1.8rem", background: "#fff", 
                   width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center",
                   borderRadius: "var(--radius-md)", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0,
                   boxShadow: "var(--shadow-sm)"
                 }}>
                   {step.icon}
                 </div>
                 <div>
                   <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "#111", marginBottom: 6 }}>
                     {step.title}
                   </h3>
                   <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 12 }}>
                     {step.desc}
                   </p>
                   <Link to={step.to} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#111", textDecoration: "underline" }}>
                     {step.action} →
                   </Link>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── Three Core Pillars ── */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-7)" }}>
            <span className="phase-badge badge-informer" style={{ marginBottom: 12, display: "inline-flex" }}>The Platform</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 700, color: "#111" }}>
              Three Pillars of Civic Action
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
                  borderColor: "rgba(0,0,0,0.08)",
                  textDecoration: "none",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "var(--radius-md)",
                  background: "#f3f4f6", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "1.8rem", marginBottom: "var(--space-4)",
                  border: "1px solid rgba(0,0,0,0.06)"
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
                <div style={{ marginTop: "var(--space-4)", color: "#111", fontSize: "0.85rem", fontWeight: 700 }}>
                  Enter {p.title} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built With ── */}
      <section style={{ background: "#f9fafb", borderTop: "1px solid var(--clr-border)", borderBottom: "1px solid var(--clr-border)", padding: "var(--space-6) 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--space-5)", textAlign: "center" }}>
            {[
              { stat: "React", label: "Frontend Excellence" },
              { stat: "Google Gemini", label: "Civic Intelligence" },
              { stat: "Google Cloud", label: "Scalable Deployment" },
              { stat: "Google Maps", label: "Strategic Routing" },
            ].map(({ stat, label }) => (
              <div key={stat}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#111", marginBottom: 4 }}>{stat}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Teaser ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card" style={{ textAlign: "center", border: "1px solid #111" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "var(--space-3)" }}>🤖</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: 8, color: "#111" }}>
              Have a complex question?
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "var(--space-5)" }}>
              Our non-partisan Civic AI (Gemini) is available 24/7 to explain registration, your rights, and polling procedures.
            </p>
            <Link to="/ask-ai" id="cta-ask-ai" className="btn btn-primary">
              💬 Ask PlainPolitics AI
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

