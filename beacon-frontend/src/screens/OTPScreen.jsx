import { useState } from "react";
import Layout from "../components/Layout";
import AnimatedQuestionCard from "../components/onboarding/AnimatedQuestionCard";
import OTPInput from "../components/OTPInput";
import { DEMO_MODE } from "../config";
import { requestOtp, verifyOtp } from "../api/client";

export default function OTPScreen({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      onSuccess(data);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendMsg("");
    setError("");
    try {
      await requestOtp(email);
      setResendMsg("New code sent — check your inbox.");
    } catch (err) {
      setError(err.message || "Could not resend OTP");
    }
  }

  return (
    <Layout
      step={1}
      totalSteps={9}
      title="Check your inbox"
      subtitle={
        DEMO_MODE
          ? `Demo: any 6-digit code works. We'd email ${email} in production.`
          : `Pop in the 6-digit code we sent to ${email}.`
      }
    >
      <form onSubmit={handleVerify} className="form onboard-form">
        <AnimatedQuestionCard
          question="🔐 Enter your 6-digit code"
          className="otp-section"
        >
          <OTPInput value={otp} onChange={setOtp} disabled={loading} />
        </AnimatedQuestionCard>

        {error && <p className="field-error center">{error}</p>}
        {resendMsg && <p className="field-hint center success">{resendMsg}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading || otp.length !== 6}>
          {loading ? "Verifying…" : "Verify & continue →"}
        </button>

        <p className="center muted">
          Didn&apos;t get it?{" "}
          <button type="button" className="link-btn" onClick={handleResend}>
            Send again
          </button>
        </p>

        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Different email
        </button>
      </form>
    </Layout>
  );
}
