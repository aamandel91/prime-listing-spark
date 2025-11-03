import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { reportWebVitals } from "./utils/performanceMonitoring";

// Report Core Web Vitals to console (in production, send to analytics)
reportWebVitals((metric) => {
  // Log metrics in development
  if (import.meta.env.DEV) {
    console.log(`${metric.name}:`, metric.value);
  }
  
  // In production, send to your analytics service
  // Example: gtag('event', metric.name, { value: metric.value });
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
