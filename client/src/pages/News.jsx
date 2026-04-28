import { useState } from "react";

export default function News() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    const isAuth = localStorage.getItem("plainpolitics_auth");
    if (!isAuth) {
      window.location.href = "/login";
      return;
    }
    setSubscribed(true);
  };

  const MOCK_NEWS = [
    { 
      id: 1,
      time: "10 mins ago", 
      title: "Election Commission announces final phase polling dates across 8 states", 
      tag: "Official",
      image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&q=80",
      link: "https://eci.gov.in"
    },
    { 
      id: 2,
      time: "1 hour ago", 
      title: "Voter turnout crosses record 65% in the capital district by mid-day", 
      tag: "Live",
      image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=80",
      link: "#"
    },
    { 
      id: 3,
      time: "3 hours ago", 
      title: "New security guidelines issued for EVM transport and storage", 
      tag: "Security",
      image: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=400&q=80",
      link: "#"
    },
    { 
      id: 4,
      time: "5 hours ago", 
      title: "Dedicated helpline launched for specially-abled and senior citizens", 
      tag: "Accessibility",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&q=80",
      link: "#"
    },
  ];

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: "var(--space-6)", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, marginBottom: "var(--space-3)", color: "#f8fafc" }}>
            📰 Election News Update
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 600, marginInline: "auto" }}>
            Stay informed with verified, non-partisan updates from the Election Commission and top news outlets. No noise, just the facts.
          </p>
        </div>

        <div className="card fade-in" style={{ borderColor: "rgba(16,185,129,0.3)", maxWidth: 800, marginInline: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
            {MOCK_NEWS.map((news) => (
              <div key={news.id} style={{ 
                padding: "var(--space-3)", 
                background: "var(--clr-surface-2)", 
                borderRadius: "var(--radius-md)", 
                border: "1px solid rgba(255,255,255,0.05)", 
                display: "flex", 
                gap: 16,
                alignItems: "flex-start" 
              }}>
                <img 
                  src={news.image} 
                  alt="News thumbnail" 
                  style={{ width: 100, height: 80, objectFit: "cover", borderRadius: "var(--radius-sm)", flexShrink: 0 }}
                />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <p style={{ color: "#e5e7eb", fontWeight: 600, fontSize: "1.05rem", margin: 0, lineHeight: 1.3 }}>{news.title}</p>
                      <span style={{ fontSize: "0.75rem", background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "4px 12px", borderRadius: "var(--radius-full)", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>
                        {news.tag}
                      </span>
                    </div>
                    <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>{news.time}</p>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "var(--clr-primary)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      Read Article <span style={{ fontSize: "1.1em" }}>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: "var(--space-5)", background: "rgba(59,130,246,0.1)", borderRadius: "var(--radius-md)", border: "1px solid rgba(59,130,246,0.2)", textAlign: "center" }}>
            <h4 style={{ color: "#bfdbfe", marginBottom: 8, fontSize: "1.1rem" }}>Want SMS Alerts?</h4>
            <p style={{ color: "#93c5fd", fontSize: "0.9rem", marginBottom: "var(--space-4)" }}>
              Get critical election news sent directly to your verified phone number.
            </p>
            <button 
              onClick={handleSubscribe} 
              className="btn btn-primary" 
              style={{ padding: "12px 24px", fontSize: "0.95rem" }}
              disabled={subscribed}
            >
              {subscribed ? "✅ Subscribed to SMS Alerts" : "📱 Subscribe to Live News"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
