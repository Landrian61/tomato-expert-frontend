// Give the service worker access to Firebase Messaging.
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyBSrftxeGYsXLJOEVXYoF7gVid-3TSWPM8",
  authDomain: "tomato-expert.firebaseapp.com",
  projectId: "tomato-expert",
  storageBucket: "tomato-expert.appspot.com",
  messagingSenderId: "4382717475",
  appId: "1:4382717475:web:114e3de9e3d40da0002396"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Log when SW is installed and activated
self.addEventListener("install", (event) => {
  console.log("Firebase Messaging SW installed");
  self.skipWaiting(); // Activate SW immediately
});

self.addEventListener("activate", (event) => {
  console.log("Firebase Messaging SW activated");
  event.waitUntil(clients.claim()); // Take control immediately
});

// Handle background messages with enhanced user experience
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification?.title || "Tomato Expert";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: "/android-chrome-192x192.png",
    badge: "/favicon.ico",
    data: payload.data || {},
    tag: payload.data?.notificationId || "general",
    renotify: true,
    vibrate: [200, 100, 200],
    actions:
      payload.data?.action === "diagnose"
        ? [
            {
              action: "diagnose",
              title: "Diagnose Now"
            }
          ]
        : [
            {
              action: "view",
              title: "View Details"
            }
          ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events with improved navigation
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  // Check if a button was clicked
  if (event.action === "diagnose") {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((clientList) => {
        // If a window client is already open, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client && "navigate" in client) {
            return client
              .focus()
              .then((focusedClient) => focusedClient.navigate("/diagnosis"));
          }
        }
        // If no window client is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow("/diagnosis");
        }
      })
    );
    return;
  }

  // Extract data from the notification
  const notificationData = event.notification.data;
  let url = "/";

  // Priority handling for blight notifications
  if (notificationData.type === "blight") {
    url = "/diagnosis"; // Always send to diagnosis page for blight alerts
  }
  // Determine URL based on notification type
  else if (notificationData.type === "diagnosis") {
    url = `/diagnosis/${notificationData.diagnosisId || ""}`;
  } else if (notificationData.type === "weather") {
    url = "/insights";
  } else if (notificationData.type === "tip") {
    url = "/tips";
  }

  // If custom URL is provided, use that
  if (notificationData.url) {
    url = notificationData.url;
  }

  // Open the appropriate URL
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then((clientList) => {
        // If a window client is already open, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client && "navigate" in client) {
            return client
              .focus()
              .then((focusedClient) => focusedClient.navigate(url));
          }
        }
        // If no window client is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

console.log("Firebase Messaging Service Worker loaded");
