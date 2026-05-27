import { useState } from "react";
import Layout from "../components/Layout";
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
      setError("Enter all 6 digits");
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
      setResendMsg("A new code has been sent.");
    } catch (err) {
      setError(err.message || "Could not resend OTP");
    }
  }

  return (
    <Layout
      step={1}
      totalSteps={9}
      title="Verify OTP"
      subtitle={
        DEMO_MODE
          ? `Demo: any 6-digit code works. We sent a code to ${email} in production.`
          : `Enter the 6-digit code sent to ${email}`
      }
    >
      <form onSubmit={handleVerify} className="form">
        <OTPInput value={otp} onChange={setOtp} disabled={loading} />

        {error && <p className="field-error center">{error}</p>}
        {resendMsg && <p className="field-hint center success">{resendMsg}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading || otp.length !== 6}>
          {loading ? "Verifying…" : "Verify & continue"}
        </button>

        <p className="center muted">
          Didn&apos;t receive it?{" "}
          <button type="button" className="link-btn" onClick={handleResend}>
            Resend OTP
          </button>
        </p>

        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Change email
        </button>
      </form>
    </Layout>
  );
}
