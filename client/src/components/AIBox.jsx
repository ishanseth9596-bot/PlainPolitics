export default function AIBox({ text, label = "✨ AI Response" }) {
  if (!text) return null;
  return (
    <div className="ai-box fade-in" aria-live="polite">
      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--clr-primary)", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </p>
      <div style={{ color: "#e2e8f0", lineHeight: 1.8 }}>{text}</div>
    </div>
  );
}
