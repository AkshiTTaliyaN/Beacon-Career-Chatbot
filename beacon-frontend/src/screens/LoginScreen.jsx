import { useState } from "react";
import Layout from "../components/Layout";
import AnimatedQuestionCard from "../components/onboarding/AnimatedQuestionCard";
import { isValidEmail } from "../utils/validation";
import { loginWithEmail } from "../api/client";
import BilingualText from "../components/BilingualText";

export default function LoginScreen({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = email.trim();

    if (!isValidEmail(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginWithEmail(trimmed);
      onSuccess(data);
    } catch (err) {
      setError(err.message || "We couldn't log you in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout
      step={0}
      totalSteps={9}
      title="Hey, let's find your path"
      subtitle="Free career guidance built around who you actually are."
    >
      <form onSubmit={handleSubmit} className="form onboard-form">
        <AnimatedQuestionCard question="📧 What's the best email to reach you?">
          <label className="field">
            <input
              type="email"
              autoComplete="email"
              placeholder="e.g. aryan.sharma@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                border: "1.5px solid #dce4f5",
                background: "#ffffff",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
            />
            {error && <p className="field-error" style={{ color: "#ff006e", fontSize: "0.8rem", marginTop: "6px" }}>{error}</p>}
          </label>
        </AnimatedQuestionCard>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
            disabled={loading}
            style={{
              padding: "0.8rem 1.5rem",
              borderRadius: "10px",
              border: "1.5px solid #dce4f5",
              background: "#ffffff",
              color: "#2c5492",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← <BilingualText text="Back" />
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              flex: 1,
              padding: "0.8rem 1.5rem",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #00d4ff, #8b5cf6)",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,212,255,0.25)",
            }}
          >
            {loading ? <BilingualText text="Logging in…" /> : <BilingualText text="Continue →" />}
          </button>
        </div>
      </form>
    </Layout>
  );
}
