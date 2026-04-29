import { useState } from "react";
import AIBox from "./AIBox";

export default function EligibilityChecker() {
  const [currentStep, setCurrentStep] = useState(0);
  const [eligibilityStatus, setEligibilityStatus] = useState(null);

  const steps = [
    {
      title: "Citizenship",
      question: "Are you a citizen of India?",
      yes: "Yes, I am",
      no: "No",
    },
    {
      title: "Age",
      question: "Will you be 18 years or older on January 1st of the election year?",
      yes: "Yes, 18 or older",
      no: "No, under 18",
    },
    {
      title: "Residence",
      question: "Are you an ordinary resident of the polling area where you wish to enroll?",
      yes: "Yes",
      no: "No",
    },
    {
      title: "Disqualification",
      question: "Have you been disqualified from voting due to corrupt practices or offences?",
      yes: "Yes",
      no: "No",
      reverseLogic: true // "Yes" means disqualified
    }
  ];

  const handleAnswer = (answer) => {
    const isDisqualificationStep = steps[currentStep].reverseLogic;
    
    // Check if the answer makes them ineligible
    if ((!isDisqualificationStep && answer === "no") || (isDisqualificationStep && answer === "yes")) {
      setEligibilityStatus("ineligible");
      return;
    }

    // Move to next step or finish
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setEligibilityStatus("eligible");
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setEligibilityStatus(null);
  };

  return (
    <div className="card fade-in" style={{ borderColor: "rgba(245, 158, 11, 0.3)", maxWidth: 800, marginInline: "auto", marginBottom: "var(--space-6)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-5)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "#f8fafc" }}>
          ☑️ Check Your Eligibility
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>
          Find out if you are legally eligible to vote in India in under 30 seconds.
        </p>
      </div>

      {!eligibilityStatus ? (
        <div style={{ background: "var(--clr-surface-2)", padding: "var(--space-5)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3)", fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
            <span>Question {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep].title}</span>
          </div>
          
          <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, marginBottom: "var(--space-5)", overflow: "hidden" }}>
            <div style={{ width: `${((currentStep + 1) / steps.length) * 100}%`, height: "100%", background: "var(--clr-primary)", transition: "width 0.3s ease" }}></div>
          </div>

          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "var(--space-5)", textAlign: "center", minHeight: 60 }}>
            {steps[currentStep].question}
          </h3>

          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "center" }}>
            <button 
              className="btn btn-primary" 
              onClick={() => handleAnswer("yes")}
              style={{ flex: 1, maxWidth: 200, padding: "14px", justifyContent: "center" }}
            >
              {steps[currentStep].yes}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => handleAnswer("no")}
              style={{ flex: 1, maxWidth: 200, padding: "14px", justifyContent: "center" }}
            >
              {steps[currentStep].no}
            </button>
          </div>
        </div>
      ) : (
        <div className="fade-in" style={{ 
          padding: "var(--space-5)", 
          borderRadius: "var(--radius-lg)", 
          border: `1px solid ${eligibilityStatus === "eligible" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
          background: eligibilityStatus === "eligible" ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)",
          textAlign: "center"
        }}>
          {eligibilityStatus === "eligible" ? (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>🎉</div>
              <h3 style={{ fontSize: "1.4rem", color: "#10b981", marginBottom: "var(--space-3)" }}>You are eligible to vote!</h3>
              <p style={{ color: "#e2e8f0", marginBottom: "var(--space-5)", lineHeight: 1.6 }}>
                Based on your answers, you meet the legal requirements to be a voter in India.
              </p>
              <AIBox 
                label="💡 AI Next Steps" 
                text="Since you are eligible, your next step is to ensure you are registered on the electoral roll. Use the 'Am I Ready?' checker below or head to the Voter ID Hub to register for the first time." 
              />
            </>
          ) : (
            <>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>🛑</div>
              <h3 style={{ fontSize: "1.4rem", color: "#ef4444", marginBottom: "var(--space-3)" }}>Currently Ineligible</h3>
              <p style={{ color: "#e2e8f0", marginBottom: "var(--space-5)", lineHeight: 1.6 }}>
                Based on your answers, you currently do not meet the constitutional requirements to vote in Indian elections.
              </p>
              <div style={{ textAlign: "left", background: "rgba(0,0,0,0.2)", padding: "var(--space-4)", borderRadius: "var(--radius-md)" }}>
                <p style={{ color: "#fca5a5", fontSize: "0.9rem", fontWeight: 700, marginBottom: "8px" }}>Primary Eligibility Criteria (Article 326):</p>
                <ul style={{ color: "#cbd5e1", fontSize: "0.85rem", marginLeft: "20px", lineHeight: 1.6 }}>
                  <li>Must be a citizen of India.</li>
                  <li>Must be at least 18 years of age on the qualifying date (Jan 1st).</li>
                  <li>Must be an ordinary resident of the polling area.</li>
                  <li>Must not be disqualified under the Constitution or any law (e.g., unsoundness of mind, corrupt practices).</li>
                </ul>
              </div>
            </>
          )}

          <button onClick={reset} className="btn btn-outline" style={{ marginTop: "var(--space-5)", padding: "10px 20px" }}>
            ↻ Start Over
          </button>
        </div>
      )}
    </div>
  );
}
