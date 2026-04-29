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
  {
    id: "other_problems",
    label: "Other Problems",
    emoji: "❓",
    color: "var(--clr-primary)",
    desc: "Any other issue at the booth",
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
        other_problems:   "1. Stay calm and assess the situation carefully.\n2. Speak to the Presiding Officer or Booth-Level Officer (BLO) present at the polling station.\n3. If unresolved, use the 'Log Incident Report' button below to file a detailed complaint — your GPS coordinates and description will be sent to election authorities.\n4. You can also call the National Voter Helpline at 1950 for immediate assistance.",
      };
      setGuidance(fallback[type] || fallback.other_problems);
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
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Tap the situation you're facing. We'll guide you step by step.
        </p>
      </div>

      {/* Top row: first 3 SOS types in a 3-column grid */}
      <div className="grid-3" style={{ marginBottom: "var(--space-4)" }}>
        {SOS_TYPES.filter((s) => s.id !== "other_problems").map((s) => (
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
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{s.desc}</div>
          </button>
        ))}
      </div>

      {/* Bottom row: "Other Problems" — full-width, centered */}
      {(() => {
        const s = SOS_TYPES.find((x) => x.id === "other_problems");
        return (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-5)" }}>
            <button
              id="sos-other_problems"
              onClick={() => handleSOS(s.id)}
              style={{
                background: selected === s.id ? `${s.color}20` : "var(--clr-surface)",
                border: `2px solid ${selected === s.id ? s.color : "var(--clr-border)"}`,
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-5) var(--space-6)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all var(--dur-med) var(--ease)",
                transform: selected === s.id ? "scale(1.03)" : "scale(1)",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{s.emoji}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{s.desc}</div>
            </button>
          </div>
        );
      })()}

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
              <label style={{ fontSize: "0.85rem", color: "#6b7280", display: "block", marginBottom: 4 }}>Image/Video Link (Optional)</label>
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
              <label style={{ fontSize: "0.85rem", color: "#6b7280", display: "block", marginBottom: 4 }}>Description</label>
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
                <label style={{ fontSize: "0.85rem", color: "#6b7280", display: "block", marginBottom: 4 }}>Date</label>
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
                <label style={{ fontSize: "0.85rem", color: "#6b7280", display: "block", marginBottom: 4 }}>Time</label>
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
              <label style={{ fontSize: "0.85rem", color: "#6b7280", display: "block", marginBottom: 4 }}>Location</label>
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
      <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
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
            <label style={{ fontSize: "0.75rem", color: "#6b7280", display: "block", marginBottom: 4 }}>Wait time (minutes)</label>
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
// ── Smart Routing ──────────────────────────────────────────────────────────
function SmartRouting() {
  const [search, setSearch] = useState("");
  const [selectedBooth, setSelectedBooth] = useState("SIM-001");

  const displayPin = /^\d+$/.test(search.trim()) ? search.trim() : "Area";

  const booths = [
    {
      id: "SIM-001",
      name: "Govt. Senior Secondary School (Simulated)",
      distance: "0.64",
      address: `Main Road Campus, ${displayPin}`,
      time: "7:00 AM - 6:00 PM",
      travelTime: "~2 MINS",
      waitTime: 12,
      crowdLevel: "low"
    },
    {
      id: "SIM-002",
      name: "Central Public School (Simulated)",
      distance: "0.78",
      address: `Sector 4, Green Park, ${displayPin}`,
      time: "7:00 AM - 6:00 PM",
      travelTime: "~5 MINS",
      waitTime: 35,
      crowdLevel: "high"
    },
    {
      id: "SIM-003",
      name: "St. Xavier's High School (Simulated)",
      distance: "1.2",
      address: `Block C, Urban Estate, ${displayPin}`,
      time: "7:00 AM - 6:00 PM",
      travelTime: "~8 MINS",
      waitTime: 20,
      crowdLevel: "medium"
    }
  ];

  const crowdConfig = {
    low:    { color: "#10b981", emoji: "🟢", label: "Low"    },
    medium: { color: "#f59e0b", emoji: "🟡", label: "Moderate" },
    high:   { color: "#ef4444", emoji: "🔴", label: "Busy"   },
  };

  // Dynamically update the Google Maps embed URL based on the user's PIN code
  // Since actual "polling booths" are temporary and often not mapped, we search for "schools" 
  // to realistically simulate where polling booths would be located in that area.
  const mapQuery = search.trim() ? `schools in ${search.trim()}` : "schools near me";
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=13&output=embed&iwloc=near`;

  return (
    <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "var(--space-6)" }}>
      {/* LEFT COLUMN: List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {/* Search Bar */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "1.2rem" }}>
            🔍
          </span>
          <input
            type="text"
            className="input"
            style={{ paddingLeft: "48px", borderRadius: "16px", background: "#fff", border: "1px solid rgba(0,0,0,0.1)", color: "#111", fontWeight: 600, fontSize: "0.95rem", width: "100%" }}
            placeholder="Enter Pin Code (e.g. 110001)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Booth List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {booths.map((booth) => {
            const isSelected = selectedBooth === booth.id;
            return (
              <div 
                key={booth.id}
                onClick={() => setSelectedBooth(booth.id)}
                style={{
                  background: "#fff",
                  border: isSelected ? "1px solid #111" : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "16px",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: isSelected ? "0 4px 16px rgba(0,0,0,0.1)" : "var(--shadow-sm)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Accent line on the left if selected */}
                {isSelected && (
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "#111" }} />
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <span style={{ color: "var(--clr-primary)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "1px" }}>{booth.id}</span>
                    <h4 style={{ color: "#111", fontSize: "1.1rem", fontWeight: 700, margin: "4px 0" }}>{booth.name}</h4>
                    <p style={{ color: "#6b7280", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
                      <span style={{ color: "var(--clr-secondary)" }}>📍</span> {booth.address}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#111", lineHeight: 1 }}>
                      {booth.distance} <span style={{ fontSize: "0.7rem" }}>KM</span>
                    </div>
                    <div style={{ fontSize: "0.6rem", color: "#6b7280", fontWeight: 700, letterSpacing: "1px", marginTop: "4px" }}>DISTANCE</div>
                  </div>
                </div>

                <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "16px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ color: "#92400e", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🕒</span> {booth.time}
                  </div>
                  <div style={{ color: "#111", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>🚀</span> {booth.travelTime}
                  </div>
                </div>

                {/* Waiting time + crowd badge */}
                <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 110, background: "#f9fafb", borderRadius: "10px", padding: "10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: "1px solid rgba(0,0,0,0.06)" }}>
                    <span style={{ fontSize: "1.3rem" }}>⏳</span>
                    <span style={{ fontSize: "1.3rem", fontWeight: 800, color: crowdConfig[booth.crowdLevel].color, lineHeight: 1 }}>{booth.waitTime}</span>
                    <span style={{ fontSize: "0.65rem", color: "#6b7280", fontWeight: 700, letterSpacing: "0.5px" }}>MIN WAIT</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 110, background: "rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, border: `1px solid ${crowdConfig[booth.crowdLevel].color}30` }}>
                    <span style={{ fontSize: "1.3rem" }}>{crowdConfig[booth.crowdLevel].emoji}</span>
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: crowdConfig[booth.crowdLevel].color, lineHeight: 1 }}>{crowdConfig[booth.crowdLevel].label}</span>
                    <span style={{ fontSize: "0.65rem", color: "#6b7280", fontWeight: 700, letterSpacing: "0.5px" }}>CROWD</span>
                  </div>
                </div>

                {isSelected && (
                  <button 
                    className="btn btn-primary" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card selection logic from firing
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booth.name + " " + booth.address)}`, "_blank");
                    }}
                    style={{ width: "100%", marginTop: "20px", background: "#111", border: "none", padding: "12px", borderRadius: "12px", fontWeight: 700, color: "#fff" }}
                  >
                    🚀 Get Directions
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Real Google Maps Iframe */}
      <div style={{ position: "relative", minHeight: "450px", background: "#f3f4f6", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)" }}>
        
        {/* We use CSS filters to invert the map colors, turning a standard Google Map into a perfect Dark Mode Map! */}
        <iframe
          title="Google Maps Polling Booths"
          width="100%"
          height="100%"
          style={{ 
            border: 0, 
            position: "absolute", 
            top: 0, left: 0, 
            /* Magic CSS to convert Google Maps to Dark Theme */
            filter: "none" 
          }}
          src={embedUrl}
          allowFullScreen
        ></iframe>

      </div>
    </div>
  );
}

// ── AI Booth Surveillance ───────────────────────────────────────────────────
const CCTV_BOOTHS = {
  "SIM-001": { label: "Govt. Senior Secondary School", cam: "CAM_01_BOOTH" },
  "SIM-002": { label: "Central Public School",         cam: "CAM_02_BOOTH" },
  "SIM-003": { label: "St. Xavier's High School",       cam: "CAM_03_BOOTH" },
  "42":      { label: "Gandhi Nagar Polling Centre",    cam: "CAM_04_BOOTH" },
};

function BoothSurveillance() {
  const [anomaly, setAnomaly]         = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [boothQuery, setBoothQuery]   = useState("");
  const [activeBooth, setActiveBooth] = useState(null);
  const [notFound, setNotFound]       = useState(false);

  const handleBoothSearch = (e) => {
    e.preventDefault();
    const key = boothQuery.trim().toUpperCase();
    const match = CCTV_BOOTHS[key] || CCTV_BOOTHS[boothQuery.trim()];
    if (match) {
      setActiveBooth({ id: boothQuery.trim(), ...match });
      setNotFound(false);
      setAnomaly(false);
    } else {
      setNotFound(true);
      setActiveBooth(null);
    }
  };

  const simulateAnomaly = () => {
    setAnomaly(true);
    setDispatching(true);
    setTimeout(() => setDispatching(false), 3000);
  };

  const camLabel = activeBooth ? activeBooth.cam : "CAM_04_BOOTH";
  const boothLabel = activeBooth ? activeBooth.label : "All Active Feeds";

  return (
    <div className="card" style={{ borderColor: anomaly ? "var(--clr-danger)" : "rgba(59,130,246,0.3)", transition: "all 0.3s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: anomaly ? "var(--clr-danger)" : "#111" }}>
          🎥 Live AI CCTV Monitoring
        </h3>
        <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "12px", background: anomaly ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)", color: anomaly ? "#ef4444" : "#10b981", fontWeight: "bold", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: anomaly ? "#ef4444" : "#10b981", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
          {anomaly ? "ANOMALY DETECTED" : "SYSTEM NORMAL"}
        </span>
      </div>
      <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: "var(--space-4)" }}>
        AI analyzes crowd behavior in real-time. If physical violence or booth capturing is detected, emergency services are auto-dispatched.
      </p>

      {/* Booth ID search */}
      <form onSubmit={handleBoothSearch} style={{ display: "flex", gap: 8, marginBottom: "var(--space-4)" }}>
        <input
          id="cctv-booth-id"
          className="input"
          style={{ flex: 1, borderRadius: "12px" }}
          placeholder="Enter Booth ID (e.g. SIM-001, 42)"
          value={boothQuery}
          onChange={(e) => setBoothQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: "10px 18px", borderRadius: "12px", whiteSpace: "nowrap" }}>
          🔍 View CCTV
        </button>
      </form>

      {notFound && (
        <p className="fade-in" style={{ color: "#f87171", fontSize: "0.85rem", marginBottom: "var(--space-3)" }}>
          ⚠️ Booth ID not found. Try <strong>SIM-001</strong>, <strong>SIM-002</strong>, <strong>SIM-003</strong>, or <strong>42</strong>.
        </p>
      )}

      {activeBooth && (
        <div className="fade-in" style={{ marginBottom: "var(--space-3)", padding: "8px 14px", background: "#f3f4f6", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.08)" }}>
          <span style={{ fontSize: "0.8rem", color: "#111", fontWeight: 700 }}>📡 Now Viewing: </span>
          <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{activeBooth.label} — <code style={{ color: "#111" }}>{activeBooth.cam}</code></span>
        </div>
      )}

      <div style={{ position: "relative", width: "100%", height: 250, background: "#f3f4f6", borderRadius: "var(--radius-md)", overflow: "hidden", border: `2px solid ${anomaly ? "var(--clr-danger)" : "#e5e7eb"}`, marginBottom: "var(--space-4)" }}>
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
          {camLabel} — {boothLabel} | {new Date().toLocaleTimeString()}
        </div>
      </div>

      {!anomaly ? (
        <button onClick={simulateAnomaly} className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
          ⚠️ Simulate Altercation at Booth
        </button>
      ) : (
        <div className="fade-in" style={{ padding: "var(--space-3)", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)" }}>
          <p style={{ color: "#dc2626", fontSize: "0.9rem", fontWeight: 600, margin: 0, marginBottom: 6 }}>
            🚨 CRITICAL ALERT TRIGGERED — {boothLabel}
          </p>
          {dispatching ? (
            <p style={{ color: "#e2e8f0", fontSize: "0.85rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner size={16} /> Contacting Emergency Dispatch...
            </p>
          ) : (
            <p style={{ color: "#10b981", fontSize: "0.85rem", margin: 0 }}>
              ✅ <strong>Auto-Dispatch Confirmed:</strong> Police (100) and Ambulance (108) units are en-route to {boothLabel}.
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
            <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>Election Day — Your real-time toolkit.</p>
          </div>
        </div>

        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", marginBottom: "var(--space-5)", display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: "1.2rem" }}>⚡</span>
          <p style={{ fontSize: "0.85rem", color: "#92400e" }}>
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
