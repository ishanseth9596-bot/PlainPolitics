import { useState, useRef, useEffect } from "react";
import Spinner from "../components/Spinner";
import { askAI } from "../services/api";

export default function AskAI() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setMessages((prev) => [...prev, { role: "user", content: userQ }]);
    setQuestion("");
    setLoading(true);

    try {
      const { data: response } = await askAI(userQ);
      setMessages((prev) => [...prev, { role: "ai", content: response.data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "I'm not able to connect to the AI right now. Please visit your official Election Commission website for authoritative answers." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (s) => {
    setQuestion(s);
  };

  const samples = [
    "What documents do I need to vote?",
    "How do I check if I'm on the voter roll?",
    "What are my rights if my vote has been stolen?",
    "How does the EVM machine work?",
    "Can I vote with just Aadhaar card?",
    "What is NOTA and when should I use it?",
  ];

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <span className="phase-badge badge-informer" style={{ marginBottom: "var(--space-3)", display: "inline-flex" }}>Civic AI Assistant</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px", color: "#111" }}>
            🤖 Ask AI Anything
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.95rem", maxWidth: 560, marginInline: "auto" }}>
            Gemini-powered, non-partisan answers about your voting rights, deadlines, and procedures.
          </p>
        </div>

        <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: "550px" }}>
          {/* Chat History Window */}
          <div
            style={{
              flex: 1, overflowY: "auto", marginBottom: "var(--space-4)", paddingRight: "8px",
              display: "flex", flexDirection: "column", gap: "12px",
              border: "1px solid rgba(0,0,0,0.06)", borderRadius: "var(--radius-md)", padding: "16px",
              background: "#f9fafb", maxHeight: "400px"
            }}
            className="chat-window"
          >
            {messages.length === 0 ? (
              <div style={{ margin: "auto", textAlign: "center", color: "#6b7280", fontSize: "0.9rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🤖</div>
                <p style={{ fontWeight: 600, color: "#111", marginBottom: 4 }}>Welcome to PlainPolitics AI</p>
                <p>Ask any question about voting, elections, or your civic rights.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className="fade-in"
                  style={{
                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: msg.role === "user" ? "#111" : "#fff",
                    border: msg.role === "user" ? "none" : "1px solid rgba(0,0,0,0.08)",
                    color: msg.role === "user" ? "#fff" : "#374151",
                    fontSize: "0.95rem", lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    boxShadow: msg.role === "user" ? "0 4px 10px rgba(0,0,0,0.15)" : "var(--shadow-sm)"
                  }}
                >
                  {msg.role === "ai" && <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>✨ Civic AI</div>}
                  {msg.content}
                </div>
              ))
            )}
            {loading && (
              <div className="fade-in" style={{ alignSelf: "flex-start", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "#fff", border: "1px solid rgba(0,0,0,0.06)" }}>
                <Spinner size={24} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Sample Questions */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
            {samples.map((s) => (
              <button
                key={s}
                className="btn btn-outline"
                style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                onClick={() => handleSampleClick(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleAsk} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              id="civic-question"
              className="input"
              style={{ flex: 1, minWidth: 200 }}
              placeholder="Ask anything about voting…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <button id="civic-ask-btn" type="submit" className="btn btn-primary" style={{ padding: "12px 24px" }} disabled={loading}>
              {loading ? "Asking…" : "Send 🚀"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
