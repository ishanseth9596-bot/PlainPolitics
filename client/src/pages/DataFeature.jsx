import { useState } from "react";

export default function DataFeature() {
  const [location, setLocation] = useState("");
  const [isLocationSet, setIsLocationSet] = useState(false);
  const [registrationDone, setRegistrationDone] = useState(false);
  
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      setIsLocationSet(true);
    }
  };

  const glossaryTerms = [
    { term: "Affidavit (Form 26)", desc: "A mandatory self-declaration filed by every election candidate disclosing criminal records, assets, and liabilities." },
    { term: "BLO (Booth Level Officer)", desc: "A government official assigned to each polling booth to maintain the electoral roll and assist voters." },
    { term: "Constituency", desc: "A geographical unit whose voters elect one representative. India has 543 Lok Sabha constituencies." },
    { term: "Delimitation Commission", desc: "A statutory body constituted to redraw the boundaries of Lok Sabha and state assembly constituencies." },
    { term: "ECI — Election Commission of India", desc: "An autonomous constitutional authority responsible for administering election processes in India." },
    { term: "EPIC (Voter ID Card)", desc: "Electoral Photo Identity Card issued by ECI to registered voters serving as proof of identity." },
    { term: "EVM (Electronic Voting Machine)", desc: "A battery-operated, tamper-proof device used to record votes in Indian elections." },
    { term: "Indelible Ink", desc: "A purple-black ink applied to a voter's left index finger to prevent double voting." },
    { term: "Lok Sabha", desc: "The lower house of India's Parliament, also called the House of the People." },
    { term: "Model Code of Conduct (MCC)", desc: "A set of guidelines issued by ECI, effective from the date of election announcement." }
  ];

  const timelineEvents = [
    { date: "OCTOBER 15, 2024", title: "Registration Deadline", desc: "Last day to register to vote for the upcoming election." },
    { date: "NOVEMBER 5, 2024", title: "Election Day", desc: "Cast your vote at your assigned polling location." },
    { date: "NOVEMBER 8, 2024", title: "Result Declaration", desc: "Official election results are announced." }
  ];

  return (
    <div className="section" style={{ paddingBottom: "100px" }}>
      <div className="container">
        
        {/* Header */}
        <div className="fade-in" style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.05)", padding: "8px 20px", borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: "var(--space-4)" }}>
            <span style={{ fontSize: "1.2rem" }}>☑️</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "1px", color: "#e5e7eb" }}>DemocrAI</span>
            <span style={{ fontSize: "0.7rem", background: "rgba(139, 92, 246, 0.2)", color: "#c4b5fd", padding: "2px 8px", borderRadius: "var(--radius-full)", fontWeight: 800, marginLeft: "4px" }}>BETA</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, marginBottom: "var(--space-3)", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            Your <span className="gradient-text">Civic Journey</span> Starts Here
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Follow the guided roadmap below to ensure your voice is heard in the upcoming elections.
          </p>
        </div>

        {/* Location Section */}
        <div className="card fade-in" style={{ maxWidth: "600px", margin: "0 auto var(--space-8)", borderColor: "rgba(139, 92, 246, 0.3)", boxShadow: "var(--shadow-glow-purple)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "#f3f4f6", marginBottom: "8px" }}>
            Where are you located?
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "var(--space-4)" }}>
            Enter your address, city & state, or city & country.
          </p>
          <form onSubmit={handleLocationSubmit}>
            <div style={{ position: "relative", marginBottom: "var(--space-4)" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--clr-accent)" }}>📍</span>
              <input
                className="input"
                style={{ paddingLeft: "44px", fontSize: "1.05rem", background: "rgba(0,0,0,0.3)" }}
                placeholder="e.g. Chennai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            {isLocationSet && (
              <div className="fade-in" style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "var(--space-4)" }}>
                <span style={{ fontWeight: 800, color: "#e5e7eb" }}>IN</span>
                <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>Detected: <strong style={{ color: "#f3f4f6" }}>India</strong> — election types will adjust accordingly</span>
              </div>
            )}
            
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary" style={{ padding: "12px 32px" }}>
                Continue →
              </button>
            </div>
          </form>
        </div>

        {/* Process Stepper */}
        <div className="fade-in" style={{ marginBottom: "var(--space-9)" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", color: "#6b7280", textTransform: "uppercase", marginBottom: "var(--space-4)", textAlign: "center" }}>
            — Election Process —
          </p>
          
          <div style={{ display: "flex", gap: "var(--space-5)", overflowX: "auto", paddingBottom: "var(--space-4)", snapType: "x mandatory" }}>
            
            {/* Step 1 */}
            <div className="card" style={{ flex: "0 0 400px", scrollSnapAlign: "center", borderColor: registrationDone ? "rgba(16, 185, 129, 0.4)" : "rgba(255,255,255,0.2)", position: "relative" }}>
              {registrationDone && <div style={{ position: "absolute", top: "24px", right: "24px", color: "var(--clr-success)", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}><span style={{ fontSize: "1.2rem" }}>✓</span> Verified</div>}
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "var(--space-3)" }}>
                <div style={{ width: "32px", height: "32px", background: registrationDone ? "var(--clr-success)" : "#fff", color: registrationDone ? "#fff" : "#000", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", transition: "all var(--dur-med)" }}>
                  1
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: registrationDone ? "var(--clr-success)" : "#f3f4f6", transition: "color var(--dur-med)" }}>
                  Voter Registration
                </h3>
              </div>
              
              <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "var(--space-4)", minHeight: "60px" }}>
                Register as a voter at your local election office or online portal before the deadline.
              </p>
              
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "var(--radius-md)", borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: "var(--space-4)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "1px", color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Action</span>
                <p style={{ color: "#e5e7eb", fontSize: "0.9rem", fontWeight: 500 }}>
                  Visit the official voter registration portal and submit your ID proof and address details.
                </p>
              </div>
              
              <button 
                onClick={() => setRegistrationDone(!registrationDone)}
                className={registrationDone ? "btn btn-outline" : "btn btn-primary"} 
                style={{ width: "100%", background: registrationDone ? "transparent" : "#fff", color: registrationDone ? "#e5e7eb" : "#000", border: registrationDone ? "1px solid rgba(255,255,255,0.2)" : "none" }}
              >
                {registrationDone ? "UNDO" : "MARK AS DONE"}
              </button>
            </div>

            {/* Step 2 (Locked) */}
            <div className="card" style={{ flex: "0 0 400px", scrollSnapAlign: "center", opacity: registrationDone ? 1 : 0.5, borderColor: "rgba(255,255,255,0.05)", background: "rgba(10,10,12,0.4)", transition: "opacity var(--dur-med)" }}>
              <div style={{ position: "absolute", top: "24px", right: "24px", color: "#6b7280", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "1px" }}>
                {registrationDone ? "UNLOCKED" : "LOCKED 🔒"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "var(--space-3)" }}>
                <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.1)", color: "#9ca3af", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem" }}>
                  2
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#e5e7eb" }}>
                  Verification
                </h3>
              </div>
              
              <p style={{ color: "#9ca3af", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "var(--space-4)", minHeight: "60px" }}>
                Your registration is reviewed and verified by election authorities within 7-10 working days.
              </p>
              
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "var(--radius-md)", borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: "var(--space-4)" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "1px", color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Action</span>
                <p style={{ color: "#e5e7eb", fontSize: "0.9rem", fontWeight: 500 }}>
                  Check your registration status online using your reference number.
                </p>
              </div>
              
              <button className="btn btn-outline" disabled style={{ width: "100%", opacity: 0.5, cursor: "not-allowed" }}>
                AWAITING REGISTRATION
              </button>
            </div>
            
          </div>
        </div>

        {/* Timeline */}
        <div className="fade-in" style={{ marginBottom: "var(--space-9)", maxWidth: "800px", marginInline: "auto" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", color: "#6b7280", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
            — Timeline —
          </p>
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            {/* Vertical Line */}
            <div style={{ position: "absolute", left: "6px", top: "10px", bottom: "10px", width: "2px", background: "rgba(255,255,255,0.1)", zIndex: 0 }}></div>
            
            {timelineEvents.map((ev, i) => (
              <div key={i} style={{ position: "relative", zIndex: 1, marginBottom: i === timelineEvents.length - 1 ? 0 : "var(--space-5)" }}>
                <div style={{ position: "absolute", left: "-24px", top: "16px", width: "10px", height: "10px", borderRadius: "50%", background: "var(--clr-primary)", boxShadow: "0 0 10px var(--clr-primary-glow)", border: "2px solid #000" }}></div>
                <div className="card" style={{ padding: "var(--space-4)", background: "rgba(20,20,22,0.8)", borderColor: "rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#f3f4f6" }}>{ev.title}</h3>
                    <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", color: "#9ca3af", padding: "4px 12px", borderRadius: "var(--radius-full)", fontWeight: 700, letterSpacing: "1px" }}>{ev.date}</span>
                  </div>
                  <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div className="fade-in" style={{ maxWidth: "1000px", marginInline: "auto" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", color: "#6b7280", textTransform: "uppercase", marginBottom: "var(--space-4)" }}>
            — Electoral Dictionary —
          </p>
          <div className="grid-2">
            {glossaryTerms.map((g, i) => (
              <div key={i} className="card" style={{ padding: "var(--space-4)", background: "rgba(255,255,255,0.02)", borderLeft: "3px solid var(--clr-accent)", borderRadius: "0 var(--radius-md) var(--radius-md) 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "#c4b5fd" }}>{g.term}</h4>
                  <span style={{ color: "#6b7280", fontSize: "1.2rem" }}>›</span>
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
