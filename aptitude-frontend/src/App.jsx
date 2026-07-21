import { useEffect, useRef, useState } from "react";
import LandingPage from "./pages/LandingPage";
import TestPage from "./pages/TestPage";
import ResultPage from "./pages/ResultPage";
import "./App.css";
import "./styles/contrast.css";
import "./styles/readability.css";

const BEACON_API = import.meta.env.VITE_BEACON_API_URL || "http://127.0.0.1:8000";
const APTITUDE_API = import.meta.env.VITE_APTITUDE_API_URL || "http://127.0.0.1:8001";

// ---------------------------------------------------------------------------
// APP MODE
// ---------------------------------------------------------------------------
// "portal"     -> launched from the Manzil portal. Beacon token, profile
//                 prefill, score write-back, dashboard links, chatbot nav.
// "standalone" -> a self-contained public assessment site. No auth, no beacon,
//                 no dashboard, no chatbot. The report lives in localStorage on
//                 the student's own device and nowhere else.
//
// Set VITE_APP_MODE=standalone in the standalone deployment's env vars.
// Anything else (or unset) means portal.
// ---------------------------------------------------------------------------
const IS_STANDALONE = import.meta.env.VITE_APP_MODE === "standalone";

// localStorage keys. Both are needed: `result` renders the report, `formData`
// is the raw answer payload the PDF endpoint re-scores from. Without formData,
// handleDownloadPDF early-returns and the PDF button silently does nothing on
// a restored report.
const LS_RESULT = "manzilReport";
const LS_FORMDATA = "manzilReportInput";
const LS_COMPLETED = "psychometricCompleted";

export default function App() {
  const [page, setPage] = useState("landing");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
  const beaconToken = useRef(null);
  const [profileData, setProfileData] = useState(null);
  const [origin, setOrigin] = useState("http://localhost:5173");

  // ── Restore a previously saved report (standalone only) ──────────────────
  // In portal mode the report belongs to the student's beacon profile, so we
  // deliberately do NOT restore from localStorage there.
  useEffect(() => {
    if (!IS_STANDALONE) return;
    try {
      const savedResult = localStorage.getItem(LS_RESULT);
      const savedInput = localStorage.getItem(LS_FORMDATA);
      if (savedResult && savedInput) {
        setResult(JSON.parse(savedResult));
        setFormData(JSON.parse(savedInput));
      }
    } catch {
      // Corrupt or unreadable storage should never block the landing page.
      localStorage.removeItem(LS_RESULT);
      localStorage.removeItem(LS_FORMDATA);
      localStorage.removeItem(LS_COMPLETED);
    }
  }, []);

  // ── Beacon handshake (portal only) ───────────────────────────────────────
  useEffect(() => {
    if (IS_STANDALONE) return;

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

  // Used by the "My Report" nav item. Only meaningful when a report exists.
  const handleViewReport = () => {
    if (result) setPage("result");
  };

  async function writeTestResultsBack(scoreList, hobbies, aptitudeScores) {
    if (IS_STANDALONE) return;
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
      ocean_answers: data.ocean_answers ?? [],
    };
    setFormData(payload);
    setSubmitting(true);

    try {
      // Only the aptitude scoring call gates the result screen. It is fast
      // (pure computation) and returns everything the report needs: RIASEC,
      // OCEAN, aptitude, and the RIASEC-based career matches.
      const res = await fetch(`${APTITUDE_API}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Submission failed with status ${res.status}`);

      const json = await res.json();

      // Persist so "My Report" survives a refresh or a return visit.
      // Device-local only. Nothing is uploaded by this.
      if (IS_STANDALONE) {
        try {
          localStorage.setItem(LS_RESULT, JSON.stringify(json));
          localStorage.setItem(LS_FORMDATA, JSON.stringify(payload));
        } catch {
          // Storage full or blocked (private browsing). The report still shows
          // for this session; it just will not survive a refresh.
        }
      }

      // Show the report immediately — do NOT wait on the two beacon-backend
      // round-trips below, which may cold-start and add tens of seconds.
      setResult(json);
      setPage("result");
      setSubmitting(false);

      // Portal mode only: write scores back to the student's profile and pull
      // Engine 1 smart recommendations. Runs in the background; when the smart
      // recs land, they enrich the already-visible report. Standalone has no
      // beacon backend, so it simply keeps the RIASEC matches from aptitude.
      if (!IS_STANDALONE && json.riasec_scores) {
        enrichWithBeacon(json, payload);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitting(false);
      alert(`Could not connect to the server. Make sure the backend is running at ${APTITUDE_API}.`);
    }
  };

  // Background (non-blocking) portal-mode work: profile write-back + Engine 1
  // smart recommendations. Never gates the result screen.
  const enrichWithBeacon = async (json, payload) => {
    try {
      await writeTestResultsBack(
        json.riasec_scores,
        json.selected_hobbies || payload.hobbies,
        json.aptitude_scores
      );
    } catch (e) {
      console.error("Failed to write test results back:", e);
    }

    if (beaconToken.current) {
      try {
        const smartRes = await fetch(`${BEACON_API}/recommendations/smart`, {
          headers: { Authorization: `Bearer ${beaconToken.current}` },
        });
        if (smartRes.ok) {
          const smartJson = await smartRes.json();
          if (smartJson.recommendations) {
            // Enrich the already-rendered report in place.
            setResult((prev) => (prev ? { ...prev, primary_careers: smartJson.recommendations } : prev));
          }
        }
      } catch (e) {
        console.error("Failed to fetch Engine 1 recommendations:", e);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!formData || !result) return;

    try {
      const pdfPayload = {
        ...formData,
        recommendations: result.primary_careers,
        // Tells the backend which closing CTA to print. A standalone student
        // has no dashboard to be sent to.
        app_mode: IS_STANDALONE ? "standalone" : "portal",
      };
      const res = await fetch(`${APTITUDE_API}/api/download-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pdfPayload),
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
    if (IS_STANDALONE) {
      try {
        localStorage.removeItem(LS_RESULT);
        localStorage.removeItem(LS_FORMDATA);
        localStorage.removeItem(LS_COMPLETED);
      } catch {
        // Nothing to do; a failed clear only leaves a stale report behind,
        // which the next submit overwrites anyway.
      }
    }
    setPage("landing");
  };

  return (
    <div className="app">
      {page === "landing" && (
        <LandingPage
          onStart={handleStartTest}
          standalone={IS_STANDALONE}
          hasReport={Boolean(result)}
          onViewReport={handleViewReport}
        />
      )}
      {page === "test" && (
        <TestPage
          onSubmit={handleSubmit}
          onBack={() => setPage("landing")}
          profileData={profileData}
          standalone={IS_STANDALONE}
          submitting={submitting}
        />
      )}

      {submitting && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(9, 16, 34, 0.55)", backdropFilter: "blur(3px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.1rem",
          }}
        >
          <div style={{
            width: 46, height: 46, borderRadius: "50%",
            border: "4px solid rgba(255,255,255,0.25)", borderTopColor: "#fff",
            animation: "apt-spin 0.9s linear infinite",
          }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem" }}>Scoring your answers…</div>
          <style>{`@keyframes apt-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {page === "result" && result && (
        <ResultPage
          result={result}
          beaconOrigin={origin}
          onDownloadPDF={handleDownloadPDF}
          onRetake={handleRetake}
          standalone={IS_STANDALONE}
        />
      )}
    </div>
  );
}