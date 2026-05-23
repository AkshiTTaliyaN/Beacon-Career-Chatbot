import Layout from "../components/Layout";
import { DEMO_MODE } from "../config";


export default function SuccessScreen({ onLaunchChatbot }) {
  return (
    <Layout
      step={5}
      totalSteps={6}
      title="You're all set!"
      subtitle="Your profile is saved. The career chatbot will use this when you connect it."
    >
      <div className="success-body">
        <div className="success-icon" aria-hidden>
          ✓
        </div>

        {/* Only shown in demo mode */}
        {DEMO_MODE && (
          <p className="muted">
            In demo mode, open the browser console (F12) to see the JSON
            payload that would be sent to the API.
          </p>
        )}

        <button type="button" className="btn btn-primary" onClick={onLaunchChatbot}>
          Launch career chatbot
        </button>
        <p className="field-hint center">
          Chatbot module coming soon — this button is a placeholder for your
          team&apos;s integration.
        </p>
      </div>
    </Layout>
  );
}