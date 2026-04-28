import { useState } from "react";
import Spinner from "./Spinner";

export default function VoterRegistrationHub() {
  const [refNumber, setRefNumber] = useState("");
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleTrackStatus = (e) => {
    e.preventDefault();
    if (!refNumber.trim()) return;
    
    setLoading(true);
    setTrackingStatus(null);
    
    // Simulate API connection
    setTimeout(() => {
      // Mock logic for simulation
      const statuses = ["Submitted", "BLO Appointed", "Field Verified", "Accepted", "Rejected"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setTrackingStatus(`Status for ${refNumber}: ${randomStatus}`);
      setLoading(false);
    }, 1500);
  };

  const toggleAccordion = (idx) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  const steps = [
    { step: "1", title: "Prepare Documents", desc: "Gather valid Identity & Address proof (e.g., Aadhaar, PAN, Passport).", link: null },
    { step: "2", title: "Fill Form 6", desc: "Submit Form 6 on the official NVSP/Voter Service Portal to register as a new voter.", link: { text: "Go to Voter Portal 🔗", url: "https://voters.eci.gov.in/" } },
    { step: "3", title: "Upload Media", desc: "Upload clear passport photos and supporting documents.", link: null },
    { step: "4", title: "Field Verification", desc: "A Booth Level Officer (BLO) will visit to verify your details.", link: null },
    { step: "5", title: "EPIC Card Generation", desc: "Your Voter ID is generated and delivered to your registered address.", link: { text: "Track Application 🔗", url: "https://voters.eci.gov.in/" } },
  ];

  const helpDesk = [
    { 
      problem: "1. Name missing from the roll despite having a card.", 
      solution: "Verify status on the NVSP portal 1 month early and keep a screenshot of the registration.",
      link: { text: "Search in Electoral Roll 🔗", url: "https://electoralsearch.eci.gov.in/" }
    },
    { 
      problem: "2. Data typos/errors on the Voter ID.", 
      solution: "Fill Form 8 on the NVSP portal for corrections.",
      link: { text: "Apply for Correction (Form 8) 🔗", url: "https://voters.eci.gov.in/" }
    },
    { 
      problem: "3. Moved to a new city or address changed.", 
      solution: "You cannot vote at your old address if you've permanently moved. Submit Form 8 to shift your residence within or outside your constituency.",
      link: { text: "Apply for Shifting (Form 8) 🔗", url: "https://voters.eci.gov.in/" }
    },
    { 
      problem: "4. Voter ID is lost, damaged, or stolen.", 
      solution: "You do not need to register again. You can apply for a duplicate replacement EPIC card using Form 8.",
      link: { text: "Request Replacement EPIC 🔗", url: "https://voters.eci.gov.in/" }
    }
  ];

  return (
    <div className="card fade-in" style={{ borderColor: "rgba(139, 92, 246, 0.3)", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "#f3f4f6" }}>
          Voter ID Registration Hub
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginTop: "4px" }}>
          Apply for your EPIC card and track your application
        </p>
      </div>

      {/* ── Vertical Stepper ── */}
      <div style={{ marginBottom: "var(--space-7)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-4)", color: "#e5e7eb" }}>
          Step-by-Step Registration Guide
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", position: "relative" }}>
          {/* Vertical Line */}
          <div style={{ position: "absolute", left: "24px", top: "10px", bottom: "10px", width: "2px", background: "rgba(255,255,255,0.1)", zIndex: 0 }}></div>
          
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "var(--space-4)", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
              <div style={{
                width: "50px", height: "50px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--clr-primary), var(--clr-accent))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "800", color: "#fff", fontSize: "1.2rem",
                boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)", flexShrink: 0
              }}>
                {s.step}
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", padding: "var(--space-3) var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.05)", width: "100%" }}>
                <h4 style={{ fontWeight: 700, color: "#e5e7eb", marginBottom: "4px" }}>{s.title}</h4>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.5 }}>{s.desc}</p>
                {s.link && (
                  <a href={s.link.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ marginTop: "12px", fontSize: "0.8rem", padding: "6px 12px", display: "inline-block" }}>
                    {s.link.text}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tracking Feature ── */}
      <div style={{ marginBottom: "var(--space-7)", background: "rgba(59, 130, 246, 0.05)", padding: "var(--space-5)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-3)", color: "#e5e7eb" }}>
          Track Application Status
        </h3>
        <form onSubmit={handleTrackStatus} style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
          <input
            className="input"
            style={{ flex: 1, minWidth: "250px" }}
            placeholder="Enter Application Reference Number"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Tracking..." : "Track Status"}
          </button>
        </form>
        {loading && <div style={{ marginTop: "var(--space-4)" }}><Spinner /></div>}
        {trackingStatus && (
          <div className="fade-in ai-box" style={{ marginTop: "var(--space-4)" }}>
            <p style={{ color: "var(--clr-success)", fontWeight: 700 }}>{trackingStatus}</p>
          </div>
        )}
      </div>

      <div className="grid-2">
        {/* ── Help Desk Accordion ── */}
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-3)", color: "#e5e7eb" }}>
            Help Desk
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {helpDesk.map((item, idx) => (
              <div key={idx} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <button 
                  onClick={() => toggleAccordion(idx)}
                  style={{ width: "100%", textAlign: "left", padding: "var(--space-3)", fontWeight: 600, color: "#f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  {item.problem}
                  <span style={{ fontSize: "1.2rem", color: "var(--clr-primary)" }}>{openAccordion === idx ? "−" : "+"}</span>
                </button>
                {openAccordion === idx && (
                  <div className="fade-in" style={{ padding: "0 var(--space-3) var(--space-3)", color: "#9ca3af", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    <strong style={{ color: "var(--clr-success)" }}>Solution:</strong> {item.solution}
                    {item.link && (
                      <div style={{ marginTop: "12px" }}>
                        <a href={item.link.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                          {item.link.text}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Fees & Support ── */}
        <div>
          <div style={{ marginBottom: "var(--space-5)" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-3)", color: "#e5e7eb" }}>
              Fees & Transparency
            </h3>
            <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.05)" }}>
                    <th style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#f3f4f6" }}>Service</th>
                    <th style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#f3f4f6" }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#9ca3af" }}>New Voter ID Registration</td>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontWeight: 700, color: "var(--clr-success)" }}>FREE</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 16px", color: "#9ca3af" }}>Corrections (Form 8)</td>
                    <td style={{ padding: "10px 16px", fontWeight: 700, color: "var(--clr-success)" }}>FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "var(--space-2)", fontSize: "0.8rem", color: "#fca5a5", background: "rgba(239, 68, 68, 0.1)", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <strong>Note:</strong> Voter ID registration is strictly FREE for all citizens regardless of Caste (General/OBC/SC/ST). Do not pay touts.
            </p>
          </div>

          <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.2)", textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#34d399", marginBottom: "8px" }}>Official Support</h3>
            <p style={{ color: "#9ca3af", fontSize: "0.9rem", marginBottom: "8px" }}>National Voter Helpline Number:</p>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", letterSpacing: "2px" }}>1950</div>
          </div>
        </div>
      </div>
    </div>
  );
}
