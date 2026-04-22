import { NavLink } from "react-router-dom";

const links = [
  { to: "/",         label: "Home"     },
  { to: "/informer", label: "Phase 1 — Inform"  },
  { to: "/reporter", label: "Phase 2 — Report"  },
  { to: "/tracker",  label: "Phase 3 — Track"   },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">
          🗳️ PlainPolitics
        </NavLink>
        <ul className="navbar__links">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
