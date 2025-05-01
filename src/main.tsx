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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      registration.addEventListener('updatefound', () => {
        if (registration.installing) {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update notification
              const notification = document.createElement('div');
              notification.className = 'fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg z-50';
              notification.innerHTML = `
                <p class="font-medium">App update available!</p>
                <p class="text-sm text-gray-600 mb-2">Refresh to get the latest version</p>
                <button id="update-app" class="bg-green-600 text-white px-4 py-1 rounded text-sm">
                  Update
                </button>
              `;
              document.body.appendChild(notification);
              
              document.getElementById('update-app')?.addEventListener('click', () => {
                window.location.reload();
              });
            }
          });
        }
      });
    });
  });
}
