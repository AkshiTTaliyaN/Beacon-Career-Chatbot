import { useEffect, useRef, useState } from "react";
import LandingPage from "./pages/LandingPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import "./App.css";
import "./styles/contrast.css";
import "./styles/readability.css";

const BEACON_API = import.meta.env.VITE_BEACON_API_URL || "http://127.0.0.1:8000";
const APTITUDE_API = import.meta.env.VITE_APTITUDE_API_URL || "http://127.0.0.1:8001";


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

  async function writeTestResultsBack(scoreList, hobbies, aptitudeScores) {
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
        body: JSON.stringify({
          riasec_scores: scores,
          hobbies: hobbies,
          aptitude_scores: aptitudeScores,
        }),
      });
    } catch {
      // Result rendering should not be blocked by a background profile update.
    }
  }

  const handleSubmit = async (data) => {
    const payload = {
      name: data.name,
      class_level: data.class_level,
      stream: data.stream,
      riasec_answers: data.riasec_answers ?? data.answers ?? [],
      hobbies: data.hobbies ?? [],
      aptitude_answers: data.aptitude_answers ?? [],
    };
    setFormData(payload);

    try {
  console.log("SUBMIT PAYLOAD", payload);

  const res = await fetch(`${APTITUDE_API}/api/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
      if (!res.ok) throw new Error(`Submission failed with status ${res.status}`);

      const json = await res.json();
      if (json.riasec_scores) {
        await writeTestResultsBack(
          json.riasec_scores,
          json.selected_hobbies || payload.hobbies,
          json.aptitude_scores
        );
      }

      setResult(json);
      setPage("result");
    } catch (err) {
      console.error("Submission error:", err);
      alert(`Could not connect to the server. Make sure the backend is running at ${APTITUDE_API}.`);
    }
  };

  const handleDownloadPDF = async () => {
    if (!formData) return;

    try {
      const res = await fetch(`${APTITUDE_API}/api/download-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error(`PDF request failed with status ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Career_Report_${formData.name.replace(/\s+/g, "_")}.pdf`;
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
