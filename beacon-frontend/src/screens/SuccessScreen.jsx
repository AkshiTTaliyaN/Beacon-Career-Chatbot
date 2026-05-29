/**
 * SuccessScreen is no longer needed as a standalone component.
 * Profile completion now navigates directly to /dashboard via App.jsx's
 * handleProfileComplete(). This file is kept for backward compatibility
 * but should not be rendered.
 */
import { useEffect } from "react";

export default function SuccessScreen() {
  useEffect(() => {
    // Navigate to dashboard using pushState (no full page reload)
    window.history.pushState({}, "", "/dashboard");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return null;
}
