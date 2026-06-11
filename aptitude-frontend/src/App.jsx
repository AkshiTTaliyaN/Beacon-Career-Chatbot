import { useState, useEffect, useRef } from "react";
import LandingPage from "./pages/LandingPage";
import TestPage from "./pages/TestPage";
// import ResultPage from "./pages/ResultPage"; // kept intact — bypass active, revert by uncommenting
import "./App.css";

const BEACON_API = "http://127.0.0.1:8000";

export default function App() {
  const [page, setPage] = useState("landing"); // "landing" | "test"  ("result" bypassed — redirect active)
  // const [result, setResult] = useState(null);   // unused while bypass is active
  // const [formData, setFormData] = useState(null); // unused while bypass is active

  // Capture beacon JWT from URL params (passed by beacon-frontend Dashboard)
  const beaconToken = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [origin, setOrigin] = useState("http://localhost:5173");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("beacon_token");
    const passedOrigin = params.get("origin");
    if (passedOrigin) {
      setOrigin(passedOrigin);
    }
    if (token) {
      beaconToken.current = token;
      // Fetch profile info from beacon-backend
      fetch(`${BEACON_API}/profile/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          const streamDisplayMap = {
            "pcm": "PCM",
            "pcb": "PCB",
            "comm": "Commerce",
            "arts": "Humanities",
            "none": "none"
          };
          setProfileData({
            name: data.name,
            class_level: data.current_class ? `Class ${data.current_class}` : "",
            stream: streamDisplayMap[data.stream] || ""
          });
        }
      })
      .catch(err => console.error("Error fetching profile:", err));
    }
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
    // setFormData(data); // unused while bypass is active
    try {
      const res = await fetch("http://127.0.0.1:8001/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      // ── BYPASS: redirect to beacon-frontend/report instead of local ResultPage ──
      // To revert: comment out the redirect block below and uncomment the two lines after it
      if (json.scores) {
        await writeScoresBack(json.scores);
        // Build URL params: pass each RIASEC score so beacon ReportPage can show
        // results immediately (Option B — works even without a beacon_token)
        const params = new URLSearchParams();
        json.scores.forEach(({ code, score }) => params.set(code, score));
        params.set("scores_written", "1");
        window.location.href = `${origin}/dashboard?${params.toString()}`;
        return;
      }
      // ── END BYPASS ──

      // Original result page routing (commented out — remove comments to revert):
      // setResult(json);
      // setPage("result");

    } catch (err) {
      console.error("Submission error:", err);
      alert("Could not connect to the server. Make sure the backend is running on port 8001.");
    }
  };

  // handleDownloadPDF and handleRetake kept below — unused while bypass is active.
  // Remove the comment markers to revert to local ResultPage.
  /*
  const handleDownloadPDF = async () => {
    if (!formData) return;
    try {
      const res = await fetch("http://127.0.0.1:8001/api/download-pdf", {
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
  */

  return (
    <div className="app">
      {page === "landing" && <LandingPage onStart={handleStartTest} />}
      {page === "test" && <TestPage onSubmit={handleSubmit} onBack={() => setPage("landing")} profileData={profileData} />}
      {/* ResultPage route bypassed — redirect to beacon-frontend/report is active.
          To revert: uncomment below and restore setResult/setPage in handleSubmit above.
      {page === "result" && result && (
        <ResultPage result={result} onDownloadPDF={handleDownloadPDF} onRetake={handleRetake} />
      )} */}
    </div>
  );
}