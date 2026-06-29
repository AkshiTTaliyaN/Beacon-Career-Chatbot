import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Dashboard from "./screens/Dashboard.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";

let root = null;

function renderApp() {
  const path = window.location.pathname || '/';
  if (!root) {
    root = createRoot(document.getElementById("root"));
  }

  if (path === '/dashboard' || path.startsWith('/dashboard')) {
    root.render(
      <StrictMode>
        <LanguageProvider>
          <Dashboard />
        </LanguageProvider>
      </StrictMode>
    );
  } else {
    root.render(
      <StrictMode>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </StrictMode>
    );
  }
}

// Initial render
renderApp();

// Re-render when history navigation occurs (pushState/popstate)
window.addEventListener('popstate', renderApp);
