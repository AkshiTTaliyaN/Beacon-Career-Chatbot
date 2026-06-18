// ─── FROZEN — Re-enable when mail IDs are available ───────────────────────────
// To restore: un-comment everything below, remove this comment block,
// and restore the LoginScreen import + STEP.LOGIN case in App.jsx.
// ──────────────────────────────────────────────────────────────────────────────

// import { useState } from "react";
// import Layout from "../components/Layout";
// import AnimatedQuestionCard from "../components/onboarding/AnimatedQuestionCard";
// import { isValidEmail } from "../utils/validation";
// import { requestOtp } from "../api/client";

// export default function LoginScreen({ onSuccess }) {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const trimmed = email.trim();

//     if (!isValidEmail(trimmed)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       await requestOtp(trimmed);
//       onSuccess(trimmed);
//     } catch (err) {
//       setError(err.message || "We couldn't send your code. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Layout
//       step={0}
//       totalSteps={9}
//       title="Hey — let's find your path"
//       subtitle="Free career guidance built around who you actually are."
//     >
//       <form onSubmit={handleSubmit} className="form onboard-form">
//         <AnimatedQuestionCard question="📧 What's the best email to reach you?">
//           <label className="field">
//             <input
//               type="email"
//               autoComplete="email"
//               placeholder="e.g. aryan.sharma@gmail.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//             />
//             {error && <p className="field-error">{error}</p>}
//           </label>
//         </AnimatedQuestionCard>

//         <button
//           type="submit"
//           className="btn btn-primary"
//           disabled={loading}
//         >
//           {loading ? "Sending code…" : "Continue →"}
//         </button>
//       </form>
//     </Layout>
//   );
// }

// Temporary stub export so App.jsx doesn't break if import is accidentally un-commented
export default function LoginScreen() { return null; }
