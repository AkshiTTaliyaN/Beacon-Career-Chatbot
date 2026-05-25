import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "test" | "result"
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleStartTest = () => setPage("test");

  const handleSubmit = async (data) => {
    setFormData(data);
    try {
      const res = await fetch("http://localhost:8001/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (json.scores && Array.isArray(json.scores)) {
        const realisticScore = json.scores.find((item) => item.code === 'R')?.score ?? 0;
        const investigativeScore = json.scores.find((item) => item.code === 'I')?.score ?? 0;
        const artisticScore = json.scores.find((item) => item.code === 'A')?.score ?? 0;
        const socialScore = json.scores.find((item) => item.code === 'S')?.score ?? 0;
        const enterprisingScore = json.scores.find((item) => item.code === 'E')?.score ?? 0;
        const conventionalScore = json.scores.find((item) => item.code === 'C')?.score ?? 0;

        const scores = {
          R: realisticScore,
          I: investigativeScore,
          A: artisticScore,
          S: socialScore,
          E: enterprisingScore,
          C: conventionalScore,
        };

        const params = new URLSearchParams(scores);
        window.location.href = `http://localhost:5173/report?${params.toString()}`;
        return;
      }

      setResult(json);
      setPage("result");
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