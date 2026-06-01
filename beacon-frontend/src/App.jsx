import { useState, useEffect } from "react";
import "./App.css";
import { INITIAL_FORM } from "./constants/formOptions";
import { DEMO_MODE } from "./config";
import { getMyProfile } from "./api/client";
import LoginScreen from "./screens/LoginScreen";
import OTPScreen from "./screens/OTPScreen";
import BasicInfoScreen from "./screens/BasicInfoScreen";
import SubjectRatings from "./screens/SubjectRatings";
import SubjectDeepDive from "./screens/SubjectDeepDive";
import AcademicsScreen from "./screens/AcademicsScreen";
import WorkStyle from "./screens/WorkStyle";
import GoalsScreen from "./screens/GoalsScreen";
import Dashboard from "./screens/Dashboard";
import ChatScreen from "./screens/ChatScreen";
import ReportPage from "./screens/ReportPage";
import CareerLibrary from "./screens/CareerLibrary";
import ExamExplorer from "./screens/ExamExplorer";

const STEP = {
  LOGIN: "login",
  OTP: "otp",
  BASIC: "basic",
  SUBJECT_RATINGS: "subject_ratings",
  SUBJECT_DEEP_DIVE: "subject_deep_dive",
  ACADEMICS: "academics",
  WORK_STYLE: "work_style",
  GOALS: "goals",
  SUCCESS: "success",
};

export default function App() {
  const [step, setStep] = useState(STEP.LOGIN);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [booting, setBooting] = useState(true);
  const [path, setPath] = useState(window.location.pathname);

  // Listen for URL changes (pushState + popstate from Dashboard navigation)
  useEffect(() => {
    function onPathChange() {
      setPath(window.location.pathname);
    }
    window.addEventListener("popstate", onPathChange);
    return () => window.removeEventListener("popstate", onPathChange);
  }, []);

  // Restore session on boot
  useEffect(() => {
    async function restoreSession() {
      if (DEMO_MODE) {
        setBooting(false);
        return;
      }
      try {
        const profile = await getMyProfile();
        if (profile?.is_complete) {
          // Store the user's name so Dashboard can show it
          if (profile.name) {
            localStorage.setItem("userName", profile.name);
          }
          // Mark as returning — they already completed onboarding before
          localStorage.setItem("beaconReturning", "1");
          setStep(STEP.SUCCESS);
        }
      } catch {
        /* ignore — user will log in again */
      } finally {
        setBooting(false);
      }
    }
    restoreSession();
  }, []);

  // ─── Path-based routing (takes priority over step-based flow) ───
  if (path === "/dashboard" || path === "/recommendations") return <Dashboard userName={localStorage.getItem("userName") || ""} />;
  if (path === "/chat") return <ChatScreen />;
  if (path === "/report") return <ReportPage />;
  if (path === "/careers") return <CareerLibrary />;
  if (path === "/exams") return <ExamExplorer />;

  // ─── Step-based onboarding flow ───

  function handleLoginSuccess(addr) {
    setEmail(addr);
    setStep(STEP.OTP);
  }

  function handleOtpSuccess(data) {
    if (data.profile_complete) {
      if (data.name) localStorage.setItem("userName", data.name);
      // They already completed onboarding before → mark as returning
      localStorage.setItem("beaconReturning", "1");
      setStep(STEP.SUCCESS);
    } else {
      // Fresh user starting onboarding — clear any stale returning flag
      localStorage.removeItem("beaconReturning");
      setStep(STEP.BASIC);
    }
  }

  function handleProfileComplete() {
    // Store the user's name for the dashboard greeting
    if (form.name) {
      localStorage.setItem("userName", form.name);
    }
    // Do NOT set beaconReturning here — this is a brand-new user
    // finishing onboarding for the first time.
    // Navigate to dashboard
    window.history.pushState({}, "", "/dashboard");
    setPath("/dashboard");
  }

  if (booting) {
    return (
      <div className="layout">
        <main className="main">
          <p className="center muted">Loading…</p>
        </main>
      </div>
    );
  }

  // If session was restored and profile is complete, go to dashboard
  if (step === STEP.SUCCESS) {
    window.history.replaceState({}, "", "/dashboard");
    return <Dashboard userName={localStorage.getItem("userName") || ""} />;
  }

  switch (step) {
    case STEP.LOGIN:
      return <LoginScreen onSuccess={handleLoginSuccess} />;
    case STEP.OTP:
      return (
        <OTPScreen
          email={email}
          onSuccess={handleOtpSuccess}
          onBack={() => setStep(STEP.LOGIN)}
        />
      );
    case STEP.BASIC:
      return (
        <BasicInfoScreen
          form={form}
          setForm={setForm}
          onNext={() => setStep(STEP.SUBJECT_RATINGS)}
          onBack={() => setStep(STEP.OTP)}
        />
      );
    case STEP.SUBJECT_RATINGS:
      return (
        <SubjectRatings
          form={form}
          setForm={setForm}
          onNext={() => setStep(STEP.SUBJECT_DEEP_DIVE)}
          onBack={() => setStep(STEP.BASIC)}
        />
      );
    case STEP.SUBJECT_DEEP_DIVE:
      return (
        <SubjectDeepDive
          form={form}
          setForm={setForm}
          onNext={() => setStep(STEP.WORK_STYLE)}
          onBack={() => setStep(STEP.SUBJECT_RATINGS)}
        />
      );
    case STEP.WORK_STYLE:
      return (
        <WorkStyle
          form={form}
          setForm={setForm}
          onNext={() => setStep(STEP.ACADEMICS)}
          onBack={() => setStep(STEP.SUBJECT_DEEP_DIVE)}
        />
      );
    case STEP.ACADEMICS:
      return (
        <AcademicsScreen
          form={form}
          setForm={setForm}
          onNext={() => setStep(STEP.GOALS)}
          onBack={() => setStep(STEP.WORK_STYLE)}
        />
      );
    case STEP.GOALS:
      return (
        <GoalsScreen
          form={form}
          setForm={setForm}
          onSuccess={handleProfileComplete}
          onBack={() => setStep(STEP.WORK_STYLE)}
        />
      );
    default:
      return <LoginScreen onSuccess={handleLoginSuccess} />;
  }
}