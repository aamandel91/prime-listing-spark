import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { useTrackingCodes } from "./hooks/useTrackingCodes";

// Tracking codes component
function TrackingCodesLoader() {
  useTrackingCodes();
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <TrackingCodesLoader />
      <App />
    </HelmetProvider>
  </StrictMode>
);
