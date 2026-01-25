import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";
import {
  registerServiceWorker,
  forceDataRefresh,
  setupNetworkListeners,
} from "./utils/pwa";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register Service Worker for PWA
registerServiceWorker().then(() => {
  // Force data refresh when app starts (if online)
  forceDataRefresh();

  // Setup network listeners
  setupNetworkListeners(
    () => {
      console.log("[App] Back online - refreshing data...");
      forceDataRefresh();
    },
    () => {
      console.log("[App] Went offline - using cached data");
    },
  );
});
