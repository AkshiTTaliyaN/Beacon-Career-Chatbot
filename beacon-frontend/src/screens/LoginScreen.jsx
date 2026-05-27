import { useState } from "react";
import Layout from "../components/Layout";
import { isValidEmail } from "../utils/validation";
import { requestOtp } from "../api/client";

export default function LoginScreen({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const trimmed = email.trim();
    if (!isValidEmail(trimmed)) {
      setError("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await requestOtp(trimmed);
      onSuccess(trimmed);
    } catch (err) {
      setError(err.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout step={0} totalSteps={9} title="Sign in" subtitle="Enter your email to receive a one-time password.">
      <form onSubmit={handleSubmit} className="form">
        <label className="field">
          <span className="field-label">Email address</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          {error && <p className="field-error">{error}</p>}
        </label>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending…" : "Send OTP"}
        </button>
      </form>
    </Layout>
  );
}
