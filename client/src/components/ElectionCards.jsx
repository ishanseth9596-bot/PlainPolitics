// ElectionCards.jsx — Clean Light Election Calendar Cards

const ELECTIONS = [
  {
    id: "tn-2026",
    type: "State Assembly",
    title: "Tamil Nadu Assembly Election 2026",
    subtitle: "234 constituencies in Tamil Nadu",
    status: "Upcoming",
    registrationDeadline: "March 2026",
    pollingDate: "April 2026",
    results: "May 2026",
    phases: 1,
    state: "Tamil Nadu",
  },
  {
    id: "kl-2026",
    type: "State Assembly",
    title: "Kerala Assembly Election 2026",
    subtitle: "140 constituencies in Kerala",
    status: "Upcoming",
    registrationDeadline: "March 2026",
    pollingDate: "April 2026",
    results: "May 2026",
    phases: 1,
    state: "Kerala",
  },
  {
    id: "wb-2026",
    type: "State Assembly",
    title: "West Bengal Assembly Election 2026",
    subtitle: "294 constituencies in West Bengal",
    status: "Upcoming",
    registrationDeadline: "February 2026",
    pollingDate: "March–April 2026",
    results: "May 2026",
    phases: 8,
    state: "West Bengal",
  },
  {
    id: "as-2026",
    type: "State Assembly",
    title: "Assam Assembly Election 2026",
    subtitle: "126 constituencies in Assam",
    status: "Upcoming",
    registrationDeadline: "February 2026",
    pollingDate: "March 2026",
    results: "April 2026",
    phases: 2,
    state: "Assam",
  },
  {
    id: "py-2026",
    type: "UT Assembly",
    title: "Puducherry Assembly Election 2026",
    subtitle: "30 constituencies in Puducherry",
    status: "Upcoming",
    registrationDeadline: "March 2026",
    pollingDate: "April 2026",
    results: "May 2026",
    phases: 1,
    state: "Puducherry",
  },
];

const STATUS_CONFIG = {
  Upcoming: { bg: "#fef3c7", color: "#92400e", border: "#fde68a", dot: "#d97706" },
  Ongoing:  { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd", dot: "#3b82f6" },
  Concluded:{ bg: "#d1fae5", color: "#065f46", border: "#a7f3d0", dot: "#059669" },
};

function DateBox({ icon, label, value }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 140,
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        padding: "14px 16px",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#6b7280",
          marginBottom: "6px",
          textTransform: "uppercase",
        }}
      >
        <span style={{ fontSize: "0.85rem" }}>{icon}</span>
        {label}
      </div>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "#111",
          fontFamily: "var(--font-display)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ElectionCard({ election }) {
  const sc = STATUS_CONFIG[election.status] || STATUS_CONFIG.Upcoming;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        padding: "28px 32px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* Left: Type badge + title */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>🏛️</span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              {election.type}
            </span>
            <span style={{ color: "#d1d5db", fontSize: "0.8rem" }}>|</span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              {election.phases} PHASE{election.phases > 1 ? "S" : ""}
            </span>
            <span style={{ color: "#d1d5db", fontSize: "0.8rem" }}>|</span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#111",
              }}
            >
              {election.state}
            </span>
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#111",
              lineHeight: 1.2,
              marginBottom: "6px",
            }}
          >
            {election.title}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            {election.subtitle}
          </p>
        </div>

        {/* Right: Status pill */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 16px",
            borderRadius: "9999px",
            background: sc.bg,
            color: sc.color,
            border: `1px solid ${sc.border}`,
            fontSize: "0.8rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: sc.dot,
              display: "inline-block",
            }}
          />
          {election.status}
        </span>
      </div>

      {/* Date boxes */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <DateBox icon="🕐" label="Registration Deadline" value={election.registrationDeadline} />
        <DateBox icon="📅" label="Polling Date" value={election.pollingDate} />
        <DateBox icon="📍" label="Results" value={election.results} />
      </div>
    </div>
  );
}

export default function ElectionCards() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            width: "4px",
            height: "28px",
            background: "#111",
            borderRadius: "4px",
          }}
        />
        <div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#111",
              marginBottom: "2px",
            }}
          >
            Upcoming Elections — 2026
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Scheduled state & UT assembly elections in India
          </p>
        </div>
      </div>

      {ELECTIONS.map((e) => (
        <ElectionCard key={e.id} election={e} />
      ))}
    </div>
  );
}
