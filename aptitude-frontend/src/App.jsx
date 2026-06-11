import { useEffect, useRef, useState } from "react";
import LandingPage from "./pages/LandingPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import "./App.css";

const BEACON_API = "http://127.0.0.1:8000";

export default function App() {
  const [page, setPage] = useState("landing");
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const beaconToken = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [origin, setOrigin] = useState("http://localhost:5173");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("beacon_token");
    const passedOrigin = params.get("origin");

    if (passedOrigin) setOrigin(passedOrigin);
    if (!token) return;

    beaconToken.current = token;
    fetch(`${BEACON_API}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Profile request failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data?.name) return;
        const streamDisplayMap = {
          pcm: "PCM",
          pcb: "PCB",
          pcmb: "PCM/PCB",
          comm: "Commerce",
          arts: "Humanities",
          none: "none",
        };
        setProfileData({
          name: data.name,
          class_level: data.current_class ? `Class ${data.current_class}` : "",
          stream: streamDisplayMap[data.stream] || "",
        });
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleStartTest = () => setPage("test");

  async function writeScoresBack(scoreList) {
    if (!beaconToken.current) return;

    try {
      const scores = {};
      scoreList.forEach(({ code, score }) => {
        scores[code] = score;
      });
      await fetch(`${BEACON_API}/profile/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${beaconToken.current}`,
        },
        body: JSON.stringify({ riasec_scores: scores }),
      });
    } catch {
      // Result rendering should not be blocked by a background profile update.
    }
  }

  const handleSubmit = async (data) => {
    setFormData(data);

    try {
      const res = await fetch("http://127.0.0.1:8001/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Submission failed with status ${res.status}`);

      const json = await res.json();
      if (json.scores) await writeScoresBack(json.scores);

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
      const res = await fetch("http://127.0.0.1:8001/api/download-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`PDF request failed with status ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Beacon_Report_${formData.name.replace(/\s+/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
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
      {page === "test" && (
        <TestPage
          onSubmit={handleSubmit}
          onBack={() => setPage("landing")}
          profileData={profileData}
        />
      )}
      {page === "result" && result && (
        <ResultPage
          result={result}
          beaconOrigin={origin}
          onDownloadPDF={handleDownloadPDF}
          onRetake={handleRetake}
        />
      )}
    </div>
  );
}
