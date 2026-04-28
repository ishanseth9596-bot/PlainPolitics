import { NavLink } from "react-router-dom";
import { useEffect } from "react";

const links = [
  { to: "/",         label: "Home"     },
  { to: "/news",     label: "News"     },
  { to: "/informer", label: "Phase 1 — Inform"  },
  { to: "/reporter", label: "Phase 2 — Report"  },
  { to: "/tracker",  label: "Phase 3 — Track"   },
];

export default function Navbar() {
  useEffect(() => {
    // Only load the script if it hasn't been loaded yet
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,bn,te,mr,ta,ur,gu,kn,or,ml",
            // Omitting the layout option produces a clean <select> dropdown
            // which is styled beautifully via our index.css custom tokens.
          },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">
          🗳️ PlainPolitics
        </NavLink>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
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
          {/* Translation Widget Container */}
          <div id="google_translate_element" style={{ display: "flex", alignItems: "center" }}></div>
        </div>
      </div>
    </nav>
  );
}
