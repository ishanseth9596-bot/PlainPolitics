import { useState } from "react";
import Spinner from "./Spinner";

const STEPS = [
  { 
    step: "01", 
    title: "Understand Your Eligibility", 
    descPreview: "First things first, let's make sure you're ready to vote! You need to be an Indian citizen, at least 18 years old by January 1st of the year the voter list is revised.", 
    when: "Ongoing",
    why: "This is the first step to ensure you are eligible to become a voter in India.",
    tip: "The qualifying date of January 1st means if you turn 18 on or before that date, you can register in that year's revision.",
    link: null
  },
  { 
    step: "02", 
    title: "Gather Your Documents", 
    descPreview: "Gathering your documents beforehand is like preparing your ingredients before cooking – it makes the whole process much smoother and faster!", 
    when: "Before applying",
    why: "Valid Identity and Address proof (like Aadhaar, PAN, Passport) are mandatory for verification.",
    tip: "Ensure your documents are clear and readable before uploading. Blurry photos often lead to rejection.",
    link: null
  },
  { 
    step: "03", 
    title: "Register to Vote (Fill Form 6)", 
    descPreview: "This is the most exciting and important step – officially becoming a voter! As a first-timer, you'll fill out 'Form 6'. The easiest way to do this is online.", 
    when: "Anytime",
    why: "This legally adds your name to the electoral roll so you can cast your vote.",
    tip: "Use the Voter Helpline App or the official NVSP portal for the fastest processing.",
    link: { text: "Go to Voter Portal 🔗", url: "https://voters.eci.gov.in/" } 
  },
  { 
    step: "04", 
    title: "Field Verification (BLO Visit)", 
    descPreview: "A Booth Level Officer (BLO) will visit your registered address to verify the details you submitted.", 
    when: "1-2 weeks after applying",
    why: "Ensures that the address and identity provided are genuine to prevent fraudulent voting.",
    tip: "Keep your original documents handy to show the BLO when they visit.",
    link: null
  },
  { 
    step: "05", 
    title: "EPIC Card Generation", 
    descPreview: "Success! Your Voter ID (EPIC card) is generated and will be delivered via Speed Post to your address.", 
    when: "3-4 weeks after verification",
    why: "Your EPIC card is your official proof of being a registered voter.",
    tip: "You can download the digital version (e-EPIC) from the portal as soon as it's generated, even before the physical card arrives.",
    link: { text: "Track Application 🔗", url: "https://voters.eci.gov.in/" } 
  },
];

const HELP_DESK = [
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

export default function VoterRegistrationHub() {
  const [refNumber, setRefNumber] = useState("");
  const [trackingStatus, setTrackingStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  // New State for the enhanced Stepper
  const [expandedStep, setExpandedStep] = useState(0); 
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (idx) => {
    setExpandedStep(expandedStep === idx ? null : idx);
  };

  const markStepDone = (idx, e) => {
    e.stopPropagation();
    const newSet = new Set(completedSteps);
    newSet.add(idx);
    setCompletedSteps(newSet);
    // Auto expand next step
    if (idx + 1 < STEPS.length) {
      setExpandedStep(idx + 1);
    } else {
      setExpandedStep(null);
    }
  };

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

  return (
    <div className="card fade-in" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "#111" }}>
          Voter ID Registration Hub
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: "4px" }}>
          Apply for your EPIC card and track your application
        </p>
      </div>

      {/* Embedded Video Guide (Registration) */}
      <div style={{ marginBottom: "var(--space-6)", borderRadius: "var(--radius-lg)", overflow: "hidden", position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}>
        <iframe
          src="https://www.youtube.com/embed/XGJQNKFYqYI"
          title="How to Register to Vote"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>
      <div style={{ marginBottom: "var(--space-7)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-4)", color: "#111" }}>
          Step-by-Step Registration Guide
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", position: "relative" }}>
          {/* Vertical Line */}
          <div style={{ position: "absolute", left: "9px", top: "24px", bottom: "40px", width: "2px", background: "rgba(0,0,0,0.08)", zIndex: 0 }}></div>
          
          {STEPS.map((s, idx) => {
            const isExpanded = expandedStep === idx;
            const isCompleted = completedSteps.has(idx);
            return (
              <div key={idx} style={{ display: "flex", gap: "24px", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                {/* Custom circle dot */}
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  border: `4px solid ${isCompleted ? 'var(--clr-success)' : '#111'}`,
                  background: isCompleted ? 'rgba(16,185,129,0.15)' : '#fff',
                  boxShadow: isCompleted ? '0 0 8px rgba(16,185,129,0.3)' : 'var(--shadow-sm)',
                  flexShrink: 0,
                  marginTop: "20px"
                }}></div>

                <div 
                  style={{ 
                    flex: 1, background: "#fff", border: "1px solid rgba(0,0,0,0.06)", 
                    borderRadius: "12px", overflow: "hidden", transition: "all 0.3s ease"
                  }}
                >
                  {/* Header (clickable) */}
                  <div 
                    onClick={() => toggleStep(idx)}
                    style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ color: "#111", fontWeight: "bold", fontFamily: "monospace", fontSize: "1.1rem" }}>{s.step}</span>
                      <h4 style={{ fontWeight: 700, color: "#111", fontSize: "1.1rem", margin: 0 }}>{s.title}</h4>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {isCompleted && (
                        <span style={{ color: "var(--clr-success)", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.1)", padding: "4px 8px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ fontSize: "0.9rem" }}>⬡</span> Verified
                        </span>
                      )}
                      <span style={{ color: "#6b7280", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>▼</span>
                    </div>
                  </div>
                  
                  {/* Body */}
                  {isExpanded ? (
                    <div className="fade-in" style={{ padding: "0 16px 16px 16px" }}>
                      <p style={{ color: "#374151", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>{s.descPreview}</p>
                      
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "8px", fontSize: "0.9rem" }}>
                        <span style={{ color: "#6b7280", fontSize: "1.1rem" }}>🕒</span>
                        <span style={{ color: "#374151" }}><strong>When:</strong> {s.when}</span>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>
                        <span style={{ color: "#d97706", fontSize: "1.1rem" }}>💡</span>
                        <span style={{ color: "#374151" }}><strong>Why it matters:</strong> {s.why}</span>
                      </div>
                      
                      <div style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "12px", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "20px" }}>
                        <span style={{ color: "#d97706", fontSize: "1.2rem", marginTop: "-2px" }}>⚠️</span>
                        <span style={{ color: "#92400e", fontSize: "0.85rem", lineHeight: 1.5 }}><strong>Tip:</strong> {s.tip}</span>
                      </div>
                      
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        {!isCompleted && (
                          <button 
                            onClick={(e) => markStepDone(idx, e)}
                            style={{ background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.1)", color: "#374151", padding: "8px 16px", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease" }}
                            onMouseOver={(e) => { e.currentTarget.style.background = "#e5e7eb"; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}
                          >
                            <span style={{ color: "#6b7280" }}>✓</span> Mark as done
                          </button>
                        )}
                        {s.link && (
                          <a href={s.link.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: "0.85rem", padding: "8px 16px" }}>
                            {s.link.text}
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "0 16px 16px 50px" }}>
                       <p style={{ color: "#6b7280", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
                         {s.descPreview}
                       </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tracking Feature ── */}
      <div style={{ marginBottom: "var(--space-7)", background: "#f3f4f6", padding: "var(--space-5)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(0,0,0,0.08)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-3)", color: "#111" }}>
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
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-3)", color: "#111" }}>
            Help Desk
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {HELP_DESK.map((item, idx) => (
              <div key={idx} style={{ background: "#fff", borderRadius: "var(--radius-md)", border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <button 
                  onClick={() => toggleAccordion(idx)}
                  style={{ width: "100%", textAlign: "left", padding: "var(--space-3)", fontWeight: 600, color: "#111", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  {item.problem}
                  <span style={{ fontSize: "1.2rem", color: "#111" }}>{openAccordion === idx ? "−" : "+"}</span>
                </button>
                {openAccordion === idx && (
                  <div className="fade-in" style={{ padding: "0 var(--space-3) var(--space-3)", color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.6 }}>
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
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, marginBottom: "var(--space-3)", color: "#111" }}>
              Fees & Transparency
            </h3>
            <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "#111" }}>Service</th>
                    <th style={{ padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)", color: "#111" }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.04)", color: "#374151" }}>New Voter ID Registration</td>
                    <td style={{ padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.04)", fontWeight: 700, color: "var(--clr-success)" }}>FREE</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 16px", color: "#374151" }}>Corrections (Form 8)</td>
                    <td style={{ padding: "10px 16px", fontWeight: 700, color: "var(--clr-success)" }}>FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "var(--space-2)", fontSize: "0.8rem", color: "#dc2626", background: "#fee2e2", padding: "8px", borderRadius: "var(--radius-sm)", border: "1px solid #fecaca" }}>
              <strong>Note:</strong> Voter ID registration is strictly FREE for all citizens regardless of Caste (General/OBC/SC/ST). Do not pay touts.
            </p>
          </div>

          <div style={{ background: "#d1fae5", padding: "var(--space-4)", borderRadius: "var(--radius-md)", border: "1px solid #a7f3d0", textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#065f46", marginBottom: "8px" }}>Official Support</h3>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "8px" }}>National Voter Helpline Number:</p>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#111", letterSpacing: "2px" }}>1950</div>
          </div>
        </div>
      </div>
    </div>
  );
}
