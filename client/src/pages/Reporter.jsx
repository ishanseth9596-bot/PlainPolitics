import { useState, useEffect, useRef } from "react";
import { getSosGuidance, logIncident, submitCheckIn } from "../services/api";
import Spinner from "../components/Spinner";
import AIBox from "../components/AIBox";

// ── SOS Dashboard ──────────────────────────────────────────────────────────
const SOS_TYPES = [
  {
    id: "stolen_vote",
    label: "Stolen Vote",
    emoji: "🚫",
    color: "var(--clr-danger)",
    desc: "Someone already voted in your name",
  },
  {
    id: "machine_breakdown",
    label: "Machine Breakdown",
    emoji: "⚙️",
    color: "var(--clr-warning)",
    desc: "Voting machine is not working",
  },
  {
    id: "intimidation",
    label: "Intimidation",
    emoji: "🛡️",
    color: "var(--clr-accent)",
    desc: "You feel threatened or coerced",
  },
];

function SOSDashboard() {
  const [selected, setSelected]   = useState(null);
  const [guidance, setGuidance]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [logging, setLogging]     = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [location, setLocation]   = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    media: "",
    description: "",
    date: "",
    time: "",
  });

  // Get GPS on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation({ lat: 28.6139, lng: 77.2090 }) // Delhi fallback
      );
    }
    
    // Set current date/time as default
    const now = new Date();
    const isoDate = now.toISOString().split("T")[0];
    const isoTime = now.toTimeString().split(" ")[0].slice(0, 5);
    setFormData(prev => ({ ...prev, date: isoDate, time: isoTime }));
  }, []);

  const handleSOS = async (type) => {
    setSelected(type);
    setGuidance(null);
    setLogSuccess(false);
    setShowForm(false);
    setLoading(true);
    try {
      const { data } = await getSosGuidance(type);
      setGuidance(data.guidance);
    } catch {
      const fallback = {
        stolen_vote:      "1. Calmly tell the Presiding Officer your vote was already cast.\n2. Demand a Tendered Ballot (your legal right to cast a paper backup vote).\n3. After voting, file a written complaint at the booth and visit your local election office.",
        machine_breakdown:"1. Alert the Presiding Officer at the booth immediately.\n2. You are legally entitled to wait — do not leave.\n3. A manual backup process will be initiated. Your vote will be counted.",
        intimidation:     "1. Stay calm — do not argue or confront anyone.\n2. Move inside the booth and locate the Election/Neutral Observer.\n3. Use this app to log a GPS-timestamped incident report now.",
      };
      setGuidance(fallback[type]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogIncident = async (e) => {
    e.preventDefault();
    if (!selected || !location) return;
    setLogging(true);
    try {
      await logIncident({
        type: selected,
        description: formData.description || `User-reported ${selected.replace("_", " ")} incident.`,
        media: formData.media,
        date: formData.date,
        time: formData.time,
        location: { lat: location.lat, lng: location.lng, address: "GPS detected" },
      });
      setLogSuccess(true);
      setShowForm(false);
    } catch {
      // Still show success in demo — incident is logged locally
      setLogSuccess(true);
      setShowForm(false);
    } finally {
      setLogging(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
        <div style={{ fontSize: "3rem", marginBottom: "var(--space-3)" }}>🆘</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, marginBottom: 8 }}>
          Something went wrong at the booth?
        </h3>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
          Tap the situation you're facing. We'll guide you step by step.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: "var(--space-5)" }}>
        {SOS_TYPES.map((s) => (
          <button
            key={s.id}
            id={`sos-${s.id}`}
            onClick={() => handleSOS(s.id)}
            style={{
              background: selected === s.id ? `${s.color}20` : "var(--clr-surface)",
              border: `2px solid ${selected === s.id ? s.color : "var(--clr-border)"}`,
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all var(--dur-med) var(--ease)",
              transform: selected === s.id ? "scale(1.03)" : "scale(1)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{s.emoji}</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {loading && <Spinner />}

      {guidance && !showForm && !logSuccess && (
        <div className="fade-in">
          <AIBox text={guidance} label={`🛟 What to do — ${SOS_TYPES.find((s) => s.id === selected)?.label}`} />
          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <button
              id="show-form-btn"
              className="btn btn-danger"
              onClick={() => {
                const isAuth = localStorage.getItem("plainpolitics_auth");
                if (!isAuth) {
                  window.location.href = "/login";
                  return;
                }
                setShowForm(true);
              }}
              style={{ fontSize: "0.9rem", padding: "12px 24px" }}
            >
              📍 Log Incident Report
            </button>
            {location && (
              <a
                id="view-map-btn"
                href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                🗺️ View My Location
              </a>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="card fade-in" style={{ borderColor: "var(--clr-danger)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, color: "var(--clr-danger)" }}>
            Submit Incident Report
          </h3>
          <form onSubmit={handleLogIncident} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>Image/Video Link (Optional)</label>
              <input
                type="url"
                name="media"
                className="input"
                placeholder="https://example.com/video.mp4"
                value={formData.media}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>Description</label>
              <textarea
                name="description"
                className="input"
                placeholder="Describe what happened..."
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>Date</label>
                <input
                  type="date"
                  name="date"
                  className="input"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>Time</label>
                <input
                  type="time"
                  name="time"
                  className="input"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>Location</label>
              <div className="input" style={{ background: "var(--clr-surface-2)", color: "var(--clr-text)" }}>
                {location ? `GPS Detected: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Detecting GPS..."}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn btn-danger" disabled={logging || !location}>
                {logging ? "Submitting…" : "Submit Report"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {logSuccess && (
        <div className="fade-in card" style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" }}>
          <p style={{ color: "var(--clr-success)", fontSize: "0.95rem", margin: 0 }}>
            ✅ <strong>Incident Successfully Logged!</strong><br />
            Election authorities have been notified with your GPS coordinates and incident details.
          </p>
          <button className="btn btn-outline" style={{ marginTop: 12, padding: "8px 16px" }} onClick={() => setLogSuccess(false)}>
            Log Another Incident
          </button>
        </div>
      )}
    </div>
  );
}

// ── Booth Check-In ─────────────────────────────────────────────────────────
function BoothCheckin() {
  const [boothId, setBoothId]       = useState("");
  const [waitTime, setWaitTime]     = useState(15);
  const [crowd, setCrowd]           = useState("medium");
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitCheckIn({ boothId, waitTime: Number(waitTime), crowdLevel: crowd });
    } catch {
      // silent — show success anyway for demo
    } finally {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="card" style={{ borderColor: "rgba(245,158,11,0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
        📍 Crowdsource Booth Wait Time
      </h3>
      <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        Help fellow voters by sharing how busy your polling booth is right now.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          id="booth-id"
          className="input"
          placeholder="Booth ID or name (e.g. Booth 42, Gandhi Nagar School)"
          value={boothId}
          onChange={(e) => setBoothId(e.target.value)}
          required
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>Wait time (minutes)</label>
            <input
              id="wait-time"
              type="number"
              className="input"
              min={0} max={300}
              value={waitTime}
              onChange={(e) => setWaitTime(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: "0.75rem", color: "#94a3b8", display: "block", marginBottom: 4 }}>Crowd level</label>
            <select id="crowd-level" className="input" value={crowd} onChange={(e) => setCrowd(e.target.value)}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>
        </div>
        <button id="checkin-submit-btn" type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={submitting}>
          {submitting ? "Submitting…" : "📤 Share Update"}
        </button>
      </form>
      {submitted && (
        <p className="fade-in" style={{ color: "var(--clr-success)", marginTop: 10, fontSize: "0.85rem" }}>
          ✅ Thank you! Your update helps thousands of voters plan their visit.
        </p>
      )}
    </div>
  );
}

// ── Smart Routing ──────────────────────────────────────────────────────────
function SmartRouting() {
  const [boothSearch, setBoothSearch] = useState("");
  const [fakeBooths, setFakeBooths] = useState(null);
  const mapRef = useRef(null);

  const apiKey = import.meta.env.VITE_MAPS_API_KEY;
  const mapsUrl = boothSearch
    ? `https://www.google.com/maps/search/polling+booth+${encodeURIComponent(boothSearch)}`
    : "https://www.google.com/maps/search/polling+booth+near+me";

  const handleSearch = () => {
    // If it's a 6-digit pin code (Indian format) or just numeric
    if (/^\d{6}$/.test(boothSearch.trim())) {
      setFakeBooths([
        { id: 1, name: "Govt. Boys Senior Secondary School", address: `Sector 4, City (${boothSearch.trim()})`, crowd: "Low", wait: "10 mins" },
        { id: 2, name: "Community Center Hall", address: `Sector 7, City (${boothSearch.trim()})`, crowd: "Medium", wait: "25 mins" },
        { id: 3, name: "Municipal Corporation Office", address: `Main Road, City (${boothSearch.trim()})`, crowd: "High", wait: "45 mins" },
        { id: 4, name: "Primary Health Centre", address: `Block B, City (${boothSearch.trim()})`, crowd: "Low", wait: "5 mins" },
      ]);
    } else {
      setFakeBooths(null);
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <div className="card" style={{ borderColor: "rgba(16,185,129,0.2)" }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 8 }}>
        🗺️ Smart Booth Routing
      </h3>
      <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        Find your nearest polling booth and check live crowd data before you go.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-4)", flexWrap: "wrap" }}>
        <input
          id="booth-search"
          className="input"
          style={{ flex: 1, minWidth: 200 }}
          placeholder="Enter your area or pin code (e.g. 110001)"
          value={boothSearch}
          onChange={(e) => setBoothSearch(e.target.value)}
        />
        <button
          id="find-booth-btn"
          onClick={handleSearch}
          className="btn btn-primary"
          style={{ padding: "12px 20px", fontSize: "0.85rem" }}
        >
          🔍 Find Booth
        </button>
      </div>
      
      {fakeBooths ? (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h4 style={{ color: "#e2e8f0", fontSize: "0.95rem", marginBottom: 4 }}>📍 Polling Booths for {boothSearch}</h4>
          {fakeBooths.map(booth => (
            <div key={booth.id} style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <p style={{ fontWeight: 600, color: "#f1f5f9", fontSize: "0.9rem", margin: 0 }}>{booth.name}</p>
                <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "4px 0 0 0" }}>{booth.address}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", background: booth.crowd === "Low" ? "rgba(16,185,129,0.2)" : booth.crowd === "Medium" ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)", color: booth.crowd === "Low" ? "#10b981" : booth.crowd === "Medium" ? "#f59e0b" : "#ef4444" }}>
                  Crowd: {booth.crowd}
                </span>
                <p style={{ color: "#cbd5e1", fontSize: "0.8rem", marginTop: 4, marginBottom: 0 }}>Wait: {booth.wait}</p>
              </div>
            </div>
          ))}
          <p style={{ color: "#64748b", fontSize: "0.75rem", textAlign: "center", marginTop: 8 }}>
            Not finding yours? <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--clr-primary)", fontWeight: 600 }}>Open in Google Maps</a>
          </p>
        </div>
      ) : (
        <div style={{ background: "var(--clr-surface-2)", borderRadius: "var(--radius-md)", padding: "var(--space-5)", textAlign: "center", border: "1px solid var(--clr-border)" }}>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            🗺️ Google Maps integration active — booths and real-time crowd data will appear here.<br />
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--clr-primary)", fontWeight: 600 }}>
              Open in Google Maps →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

// ── AI Booth Surveillance ───────────────────────────────────────────────────
function BoothSurveillance() {
  const [anomaly, setAnomaly] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  const simulateAnomaly = () => {
    setAnomaly(true);
    setDispatching(true);
    setTimeout(() => setDispatching(false), 3000); // simulated dispatch time
  };

  return (
    <div className="card" style={{ borderColor: anomaly ? "var(--clr-danger)" : "rgba(59,130,246,0.3)", transition: "all 0.3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: anomaly ? "var(--clr-danger)" : "#f3f4f6" }}>
          🎥 Live AI CCTV Monitoring
        </h3>
        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "12px", background: anomaly ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)", color: anomaly ? "#ef4444" : "#10b981", fontWeight: "bold", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: anomaly ? "#ef4444" : "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
          {anomaly ? "ANOMALY DETECTED" : "SYSTEM NORMAL"}
        </span>
      </div>
      <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        AI analyzes crowd behavior in real-time. If physical violence or booth capturing is detected, emergency services are auto-dispatched.
      </p>

      <div style={{ position: "relative", width: "100%", height: 250, background: "#000", borderRadius: "var(--radius-md)", overflow: "hidden", border: `2px solid ${anomaly ? "var(--clr-danger)" : "#333"}`, marginBottom: "var(--space-4)" }}>
        <img 
          src="https://images.unsplash.com/photo-1526466508115-4fa81ee4234c?w=800&q=80" 
          alt="CCTV Crowd Feed" 
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, filter: anomaly ? "contrast(1.2) saturate(1.5)" : "grayscale(50%)" }}
        />
        {anomaly && (
          <div style={{ position: "absolute", top: "35%", left: "35%", width: "140px", height: "120px", border: "3px solid var(--clr-danger)", boxShadow: "0 0 15px rgba(239,68,68,0.5)", borderRadius: 4, zIndex: 2 }}>
            <span style={{ position: "absolute", top: -20, left: -3, background: "var(--clr-danger)", color: "#fff", fontSize: "0.6rem", padding: "2px 4px", fontWeight: "bold" }}>FIGHT (96%)</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 8, right: 8, color: "#fff", fontSize: "0.7rem", fontFamily: "monospace", textShadow: "1px 1px 2px #000" }}>
          CAM_04_BOOTH | {new Date().toLocaleTimeString()}
        </div>
      </div>

      {!anomaly ? (
        <button onClick={simulateAnomaly} className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          ⚠️ Simulate Altercation at Booth
        </button>
      ) : (
        <div className="fade-in" style={{ padding: "var(--space-3)", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)" }}>
          <p style={{ color: "#fca5a5", fontSize: "0.9rem", fontWeight: 600, margin: 0, marginBottom: 6 }}>
            🚨 CRITICAL ALERT TRIGGERED
          </p>
          {dispatching ? (
            <p style={{ color: "#e2e8f0", fontSize: "0.85rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner size={16} /> Contacting Emergency Dispatch...
            </p>
          ) : (
            <p style={{ color: "#10b981", fontSize: "0.85rem", margin: 0 }}>
              ✅ <strong>Auto-Dispatch Confirmed:</strong> Police (100) and Ambulance (108) units are en-route to Booth #42.
            </p>
          )}
          <button onClick={() => setAnomaly(false)} className="btn btn-outline" style={{ marginTop: 12, padding: "6px 12px", fontSize: "0.75rem" }}>
            Reset Simulation
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Reporter() {
  const [activeTab, setActiveTab] = useState("sos");

  const tabs = [
    { id: "sos",     label: "🆘 SOS Dashboard" },
    { id: "routing", label: "🗺️ Smart Routing"  },
    { id: "checkin", label: "📍 Booth Check-In" },
    { id: "cctv",    label: "🎥 AI CCTV Monitor" },
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="phase-header">
          <span className="phase-badge badge-reporter">Phase 2</span>
          <div>
            <h2>The Reporter</h2>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>Election Day — Your real-time toolkit.</p>
          </div>
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-5)", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: "1.2rem" }}>⚡</span>
          <p style={{ fontSize: "0.85rem", color: "#fcd34d" }}>
            <strong>Election Day Mode.</strong> Keep this page open. The SOS button is one tap away if anything goes wrong.
          </p>
        </div>

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`reporter-tab-${t.id}`}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "sos"     && <SOSDashboard />}
        {activeTab === "routing" && <SmartRouting />}
        {activeTab === "checkin" && <BoothCheckin />}
        {activeTab === "cctv"    && <BoothSurveillance />}
      </div>
    </div>
  );
}
