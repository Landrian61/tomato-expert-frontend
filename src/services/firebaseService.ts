import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Firebase configuration - use exact values from your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyBSrftxeGYsXLJOEVXYoF7gVid-3TSWPM8",
  authDomain: "tomato-expert.firebaseapp.com",
  projectId: "tomato-expert",
  storageBucket: "tomato-expert.appspot.com",
  messagingSenderId: "4382717475",
  appId: "1:4382717475:web:114e3de9e3d40da0002396",
  measurementId: "G-2JK3SP68BW"
};

// Initialize Firebase app - do this only once
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized with project:', firebaseConfig.projectId);

// Messaging instance (lazy initialized)
let messaging: any = null;

/**
 * Initialize Firebase Messaging
 * @returns A Promise that resolves to the messaging instance
 */
export const initializeMessaging = async () => {
  try {
    if (!messaging) {
      const isFCMSupported = await isSupported();
      if (!isFCMSupported) {
        throw new Error('Firebase Cloud Messaging is not supported in this browser');
      }
      messaging = getMessaging(app);
      console.log('Firebase messaging initialized');
    }
    return messaging;
  } catch (error) {
    console.error('Error initializing Firebase Messaging:', error);
    throw error;
  }
};

/**
 * Get FCM token for the current device
 * @returns Promise with the FCM token
 */
export const getFCMToken = async (): Promise<string> => {
  try {
    console.log('Getting FCM token...');
    
    const messaging = await initializeMessaging();
    
    // Try to get an existing token from local storage first
    const existingToken = localStorage.getItem('fcmToken');
    if (existingToken) {
      console.log('Using existing FCM token from localStorage');
      return existingToken;
    }

    // Get service worker registration
    let registration;
    try {
      // Check for existing service worker
      registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      
      if (!registration) {
        console.log('No firebase messaging SW found, registering new one');
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        // Wait for it to be ready
        if (registration.installing) {
          console.log('Waiting for service worker to install...');
          await new Promise<void>((resolve) => {
            const installingWorker = registration.installing;
            installingWorker?.addEventListener('statechange', (e) => {
              if ((e.target as ServiceWorker)?.state === 'activated') {
                console.log('Service worker activated and ready');
                resolve();
              }
            });
          });
        }
      } else {
        console.log('Using existing firebase-messaging-sw.js service worker');
      }
    } catch (swError) {
      console.error('Error with service worker:', swError);
      throw new Error('Failed to register service worker for notifications');
    }

    // Use the VAPID key from Firebase project (this should match the key from Firebase Console)
    const vapidKey = "BJAnC4jSU81DBcLGUvxi-Jq8yJr4HfHraJqjIWqFoDEynJITn4BQeEyrW51M4bD9e0XXxtUF1IKubtDhLA3VaZo";
    
    console.log('Requesting FCM token with VAPID key (first few chars):', vapidKey.substring(0, 10) + '...');
    
    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
      // Save token to localStorage
      localStorage.setItem('fcmToken', currentToken);
      console.log('FCM token obtained:', currentToken.substring(0, 10) + '...');
      return currentToken;
    } else {
      console.error('No FCM token received from Firebase');
      throw new Error('No registration token available');
    }
  } catch (error: any) {
    console.error('Error getting FCM token:', error);
    // Add more detailed error info
    if (error.code && error.message) {
      console.error(`FCM Error Code: ${error.code}, Message: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Set up message handler for foreground notifications
 * @param callback Function to call when a message is received
 */
export const onMessageListener = (callback: (payload: any) => void) => {
  initializeMessaging().then((messagingInstance) => {
    onMessage(messagingInstance, (payload) => {
      console.log('Foreground message received:', payload);
      callback(payload);
    });
  }).catch(error => {
    console.error('Error setting up message listener:', error);
  });
};

/**
 * Check if Firebase Cloud Messaging is supported in this browser
 */
export const isFCMSupported = async (): Promise<boolean> => {
  try {
    return await isSupported();
  } catch (error) {
    console.error('Error checking FCM support:', error);
    return false;
  }
};
