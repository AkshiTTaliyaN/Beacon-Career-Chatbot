import { useState, useEffect, useRef } from "react";
import LandingPage from "./pages/LandingPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import "./App.css";

const BEACON_API = "http://localhost:8000";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "test" | "result"
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);

  // Capture beacon JWT from URL params (passed by beacon-frontend Dashboard)
  const beaconToken = useRef(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("beacon_token");
    if (token) beaconToken.current = token;
  }, []);

  const handleStartTest = () => setPage("test");

  /** Silent write-back: PATCH beacon-backend with RIASEC scores */
  async function writeScoresBack(scoreList) {
    if (!beaconToken.current) return;
    try {
      // scoreList is [{ category: "Realistic", code: "R", score: 72 }, ...]
      const scores = {};
      scoreList.forEach(({ code, score }) => { scores[code] = score; });
      await fetch(`${BEACON_API}/profile/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${beaconToken.current}`,
        },
        body: JSON.stringify({ riasec_scores: scores }),
      });
    } catch {
      // Silently ignore — this is a background write, never blocks the UI
    }
  }

  const handleSubmit = async (data) => {
    setFormData(data);
    try {
      const res = await fetch("http://localhost:8001/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setResult(json);
      setPage("result");
      // Write scores back to beacon-backend silently
      if (json.scores) {
        writeScoresBack(json.scores);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Could not connect to the server. Make sure the backend is running on port 8001.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!formData) return;
    try {
      const res = await fetch("http://localhost:8001/api/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Beacon_Report_${formData.name.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF download failed. Make sure the backend is running.");
    }
  };

  const handleRetake = () => {
    setResult(null);
    setFormData(null);
    setPage("landing");
  };

  return (
    <div className="app">
      {page === "landing" && <LandingPage onStart={handleStartTest} />}
      {page === "test" && <TestPage onSubmit={handleSubmit} onBack={() => setPage("landing")} />}
      {page === "result" && result && (
        <ResultPage result={result} onDownloadPDF={handleDownloadPDF} onRetake={handleRetake} />
      )}
    </div>
  );
}