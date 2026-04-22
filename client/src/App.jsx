import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIProvider } from "./context/AIContext";
import Navbar  from "./components/Navbar";
import Home    from "./pages/Home";
import Informer from "./pages/Informer";
import Reporter from "./pages/Reporter";
import Tracker  from "./pages/Tracker";

export default function App() {
  return (
    <AIProvider>
      <BrowserRouter>
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
          color: "#475569",
          fontSize: "0.8rem",
        }}>
          <div className="container">
            <p>🗳️ <strong style={{ color: "#64748b" }}>PlainPolitics</strong> — Built for informed citizens. Powered by Gemini AI & Google Maps.</p>
            <p style={{ marginTop: 4 }}>Non-partisan · No PII stored · Open source</p>
          </div>
        </footer>
      </BrowserRouter>
    </AIProvider>
  );
}
