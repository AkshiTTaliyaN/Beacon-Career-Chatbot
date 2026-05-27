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
import WorkStyle from "./screens/WorkStyle";
import AcademicsScreen from "./screens/AcademicsScreen";
import GoalsScreen from "./screens/GoalsScreen";
import SuccessScreen from "./screens/SuccessScreen";
import ReportPage from "./screens/ReportPage";
import CareerLibrary from "./screens/CareerLibrary";
import ExamExplorer from "./screens/ExamExplorer";

const STEP = {
  LOGIN: "login",
  OTP: "otp",
  BASIC: "basic",
  SUBJECT_RATINGS: "subject_ratings",
  SUBJECT_DEEP_DIVE: "subject_deep_dive",
  WORK_STYLE: "work_style",
  ACADEMICS: "academics",
  GOALS: "goals",
  SUCCESS: "success",
};

export default function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'
  if (path === '/report') return <ReportPage />
  if (path === '/careers') return <CareerLibrary />
  if (path === '/exams') return <ExamExplorer />
  const [step, setStep] = useState(STEP.LOGIN);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (DEMO_MODE) {
        setBooting(false);
        return;
      }
      try {
        const profile = await getMyProfile();
        if (profile?.is_complete) {
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

  function handleLoginSuccess(addr) {
    setEmail(addr);
    setStep(STEP.OTP);
  }

  function handleOtpSuccess(data) {
    if (data.profile_complete) {
      setStep(STEP.SUCCESS);
    } else {
      setStep(STEP.BASIC);
    }
  }

  function handleLaunchChatbot() {
    // After onboarding completion, route user to the Dashboard page
    window.history.pushState({}, '', '/dashboard');
    // Trigger a navigation event so the app root can react if needed
    window.dispatchEvent(new PopStateEvent('popstate'));
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
        <SubjectRatings form={form} setForm={setForm} onNext={() => setStep(STEP.SUBJECT_DEEP_DIVE)} onBack={() => setStep(STEP.BASIC)} />
      );
    case STEP.SUBJECT_DEEP_DIVE:
      return (
        <SubjectDeepDive form={form} setForm={setForm} onNext={() => setStep(STEP.WORK_STYLE)} onBack={() => setStep(STEP.SUBJECT_RATINGS)} />
      );
    case STEP.WORK_STYLE:
      return (
        <WorkStyle form={form} setForm={setForm} onNext={() => setStep(STEP.ACADEMICS)} onBack={() => setStep(STEP.SUBJECT_DEEP_DIVE)} />
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
          onSuccess={() => setStep(STEP.SUCCESS)}
          onBack={() => setStep(STEP.ACADEMICS)}
        />
      );
    case STEP.SUCCESS:
      return <SuccessScreen onLaunchChatbot={handleLaunchChatbot} />;
    default:
      return <LoginScreen onSuccess={handleLoginSuccess} />;
  }
}
