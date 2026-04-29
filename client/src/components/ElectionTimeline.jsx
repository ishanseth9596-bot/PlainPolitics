import { useState } from "react";

const timelineData = [
  {
    title: "Voter Registration",
    badge: "Crucial Step",
    desc: "Citizens enroll their names in the electoral roll. You must be 18+ to register.",
  },
  {
    title: "Notification of Election",
    badge: "Official Start",
    desc: "The Election Commission officially announces the election dates and schedule.",
  },
  {
    title: "Candidate Nomination",
    badge: "Candidate Phase",
    desc: "Political parties and independent candidates file their nomination papers.",
  },
  {
    title: "Scrutiny & Withdrawal",
    badge: "Finalizing Candidates",
    desc: "Nomination papers are verified. Candidates have a window to withdraw their names.",
  },
  {
    title: "Campaign Period",
    badge: "Model Code Applies",
    desc: "Candidates campaign to win voters. The Model Code of Conduct is strictly enforced.",
  },
  {
    title: "Polling Day",
    badge: "Action Day",
    desc: "Registered voters cast their votes at designated polling booths.",
  },
  {
    title: "Counting of Votes",
    badge: "Results",
    desc: "Electronic Voting Machines (EVMs) are unsealed and votes are counted under strict supervision.",
  },
  {
    title: "Declaration of Result",
    badge: "Conclusion",
    desc: "The final election results are officially announced and winning candidates are declared.",
  },
];

export default function ElectionTimeline() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  
  // Represents the actual ongoing period in real life (e.g., 2 = Candidate Nomination)
  const currentPeriodIndex = 2; 

  return (
    <div className="card fade-in" style={{ borderColor: "rgba(59, 130, 246, 0.3)", maxWidth: "800px", margin: "0 auto" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, marginBottom: "8px", color: "#111" }}>
        Election Process Timeline
      </h3>
      <p style={{ color: "#6b7280", marginBottom: "var(--space-6)" }}>
        Click a step to expand details about how an election unfolds.
      </p>

      <div style={{ position: "relative", marginLeft: "12px", paddingBottom: "12px" }}>
        {/* Vertical Line */}
        <div style={{ 
          position: "absolute", left: "11px", top: "24px", bottom: "24px", width: "2px", 
          background: "rgba(59, 130, 246, 0.3)", zIndex: 0 
        }} />

        {timelineData.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const isCurrentPeriod = currentPeriodIndex === idx;
          const isLast = idx === timelineData.length - 1;

          return (
            <div key={idx} style={{ display: "flex", gap: "var(--space-4)", marginBottom: isLast ? 0 : "var(--space-3)", position: "relative", zIndex: 1 }}>
              {/* Timeline Node */}
              <div 
                style={{ 
                  width: "24px", height: "24px", borderRadius: "50%", marginTop: "16px",
                  background: isCurrentPeriod ? "var(--clr-primary)" : "var(--clr-bg)",
                  border: `2px solid ${isCurrentPeriod ? "var(--clr-primary)" : "rgba(59, 130, 246, 0.5)"}`,
                  boxShadow: isCurrentPeriod ? "0 0 10px rgba(59, 130, 246, 0.6)" : "none",
                  flexShrink: 0, transition: "all 0.3s ease",
                  position: "relative"
                }} 
              />

              {/* Content Card */}
              <div 
                onClick={() => setExpandedIndex(idx)}
                style={{ 
                  flex: 1, cursor: "pointer",
                  background: isExpanded ? "rgba(59, 130, 246, 0.05)" : "#fff",
                  border: `1px solid ${isExpanded ? "rgba(59, 130, 246, 0.3)" : "rgba(0,0,0,0.06)"}`,                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-3) var(--space-4)",
                  transition: "all 0.3s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                  <h4 style={{ fontWeight: 700, color: isExpanded ? "#111" : "#374151", fontSize: "1.05rem", margin: 0 }}>
                    {item.title}
                  </h4>
                  <span style={{ 
                    fontSize: "0.75rem", padding: "4px 10px", borderRadius: "var(--radius-sm)", 
                    background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", 
                    fontWeight: 600, whiteSpace: "nowrap"
                  }}>
                    {item.badge}
                  </span>
                </div>

                {isExpanded && (
                  <div className="fade-in" style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px dashed rgba(0,0,0,0.1)" }}>
                    <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
