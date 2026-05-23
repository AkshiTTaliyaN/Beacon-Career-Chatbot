import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./screens/Dashboard.jsx";

function renderApp() {
  const path = window.location.pathname || '/';
  const root = createRoot(document.getElementById("root"));

  if (path === '/dashboard' || path.startsWith('/dashboard')) {
    root.render(
      <StrictMode>
        <Dashboard />
      </StrictMode>
    );
  } else {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

// Initial render
renderApp();

// Re-render when history navigation occurs (pushState/popstate)
window.addEventListener('popstate', renderApp);
