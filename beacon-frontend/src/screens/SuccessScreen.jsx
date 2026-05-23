import { useEffect } from "react";

export default function SuccessScreen() {
  useEffect(() => {
    // Immediately redirect to the Dashboard after onboarding completes.
    // Using location.href ensures a navigation to /dashboard so the app root will render Dashboard.
    window.location.href = '/dashboard';
  }, []);

  return null;
}
