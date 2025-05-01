import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { toast } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker for PWA functionality
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log("App can now work offline");
  },
  onUpdate: (registration) => {
    // Show a toast notification to the user about the update
    toast.info("App update available", {
      description: "Reload the page to see the latest version",
      action: {
        label: "Reload",
        onClick: () => {
          if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
          window.location.reload();
        }
      }
    });
  },
  onOffline: () => {
    toast.warning("You are offline", {
      description: "Some features may be limited"
    });
  },
  onOnline: () => {
    toast.success("You are back online");
  }
});