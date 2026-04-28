import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AIProvider } from "./context/AIContext";
import Navbar  from "./components/Navbar";
import Home    from "./pages/Home";
import Informer from "./pages/Informer";
import Reporter from "./pages/Reporter";
import Tracker  from "./pages/Tracker";

function MainContent() {
  const location = useLocation();

  useEffect(() => {
    // UI Theme is now handled entirely via CSS for a more premium, modern feel.
    document.body.style.backgroundImage = '';
  }, [location.pathname]);


  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/informer" element={<Informer />} />
          <Route path="/reporter" element={<Reporter />} />
          <Route path="/tracker"  element={<Tracker />} />
        </Routes>
      </main>
      <footer style={{
        borderTop: "1px solid var(--clr-border)",
        padding: "var(--space-5) 0",
        textAlign: "center",
        color: "#9ca3af",
        fontSize: "0.8rem",
        background: "rgba(5, 5, 5, 0.8)",
        backdropFilter: "blur(12px)",
        position: "relative",
        zIndex: 10
      }}>
        <div className="container">
          <p>🗳️ <strong style={{ color: "#e5e7eb" }}>PlainPolitics</strong> — Built for informed citizens. Powered by Gemini AI & Google Maps.</p>
          <p style={{ marginTop: 4 }}>Non-partisan · No PII stored · Open source</p>
        </div>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <AIProvider>
      <BrowserRouter>
        <MainContent />
      </BrowserRouter>
    </AIProvider>
  );
}
