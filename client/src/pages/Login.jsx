import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== "123456") {
      setError("Invalid OTP. For this demo, please use 123456.");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate API call to verify OTP
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("plainpolitics_auth", "true");
      navigate("/");
    }, 1000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-4)",
      background: "radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.15), transparent 60%)"
    }}>
      <div className="card fade-in" style={{
        maxWidth: 400,
        width: "100%",
        padding: "var(--space-6)",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(10, 13, 20, 0.8)",
        backdropFilter: "blur(16px)"
      }}>
        <div style={{ marginBottom: "var(--space-5)" }}>
          <div style={{
            width: 48, height: 48, background: "var(--clr-primary)", borderRadius: 12,
            display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc" }}>
            Secure Citizen Login
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: 8 }}>
            Verify your identity to access PlainPolitics.
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--clr-danger)", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", marginBottom: "var(--space-4)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginBottom: 6 }}>Mobile Number</label>
              <div style={{ display: "flex", alignItems: "center", background: "var(--clr-surface-2)", borderRadius: "var(--radius-md)", border: "1px solid var(--clr-border)", padding: "0 12px", focusWithin: { borderColor: "var(--clr-primary)" } }}>
                <span style={{ color: "#e2e8f0", fontSize: "0.95rem", paddingRight: 8, borderRight: "1px solid var(--clr-border)" }}>+91</span>
                <input
                  type="tel"
                  maxLength="10"
                  placeholder="Enter 10-digit number"
                  style={{ flex: 1, background: "transparent", border: "none", color: "#f8fafc", padding: "12px 8px", outline: "none", fontSize: "0.95rem" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }} disabled={loading}>
              {loading ? "Sending OTP..." : "Get OTP securely"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Enter OTP sent to +91 {phone}
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="123456"
                className="input"
                style={{ textAlign: "center", letterSpacing: "4px", fontSize: "1.2rem" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
              />
              <p style={{ fontSize: "0.75rem", color: "var(--clr-primary)", textAlign: "center", marginTop: 8 }}>
                Demo hint: Use 123456
              </p>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}>
              Change Number
            </button>
          </form>
        )}
        
        <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "var(--space-5)" }}>
          Your phone number is only used for session verification and is never stored permanently.
        </p>
      </div>
    </div>
  );
}
