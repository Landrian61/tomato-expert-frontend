import axios from 'axios';
import { isFCMSupported } from './firebaseService';
import { api } from './apiService';

// Determine which URL to use based on environment
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_API_URL_DEVELOPMENT 
  : import.meta.env.VITE_API_URL_PRODUCTION;

// Get auth header with more reliable token retrieval
const getAuthHeader = () => {
  try {
    // Get from authData in localStorage (primary method)
    const authData = JSON.parse(localStorage.getItem('authData') || 'null');
    
    if (authData?.accessToken) {
      return {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`
        }
      };
    }
    
    // Legacy fallback
    const token = localStorage.getItem('token');
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
    
    return {};
  } catch (error) {
    console.error('Error getting auth header:', error);
    return {};
  }
};

/**
 * Check if Push API is supported in the browser
 */
export const isPushSupported = async (): Promise<boolean> => {
  return await isFCMSupported();
};

/**
 * Request push notification permission
 * @returns Promise with the permission status
 */
export const requestNotificationPermission = async () => {
  try {
    // First check if we already have permission to avoid prompting unnecessarily
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission === 'denied') {
      console.warn('Notification permission was previously denied');
      return false;
    }
    
    // Request permission
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Get current push notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  return Notification.permission;
};

/**
 * Register service worker for push notifications
 */
export const registerServiceWorker = async () => {
  // Skip in development mode
  if (import.meta.env.DEV) {
    console.log('Skipping push notification setup in development');
    return null;
  }
  
  try {
    // Register Firebase messaging service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service worker registered successfully', registration);
    
    // Wait for the service worker to be ready
    if (registration.installing) {
      console.log('Service worker installing');
      await new Promise<void>((resolve) => {
        registration.installing?.addEventListener('statechange', (e) => {
          console.log('Service worker state change:', (e.target as ServiceWorker).state);
          if ((e.target as ServiceWorker).state === 'activated') {
            console.log('Service worker activated');
            resolve();
          }
        });
      });
    }
    
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    throw error;
  }
};

/**
 * Subscribe to push notifications
 * @returns Promise with the FCM token
 */
export const subscribeToPushNotifications = async () => {
  try {
    // Check browser support
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported in this browser');
      return false;
    }
    
    // Get permission
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return false;
    }
    
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;
    console.log('Service worker ready for push subscription');
    
    // Get server's public key
    const response = await api.get('/notifications/vapid-key');
    const vapidPublicKey = response.data.publicKey;
    
    if (!vapidPublicKey) {
      console.error('No VAPID public key available');
      return false;
    }
    
    // Convert the key to a format the browser needs
    const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
    
    // Check for existing subscription first
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Using existing push subscription');
      await registerSubscriptionWithServer(existingSubscription);
      return true;
    }
    
    // Create new subscription
    console.log('Creating new push subscription');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });
    
    // Register with your server
    await registerSubscriptionWithServer(subscription);
    return true;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return false;
  }
};

// Helper function for VAPID key conversion
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerSubscriptionWithServer(subscription) {
  const response = await api.post('/notifications/register-device', {
    subscription: subscription.toJSON()
  });
  return response.data;
}
/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('fcmToken');
    
    if (!token) {
      // Already unsubscribed
      return true;
    }
    
    // Notify the server
    try {
      await axios.delete(
        `${API_BASE_URL}/notifications/unregister-device`,
        { 
          headers: { 
            ...getAuthHeader().headers 
          },
          data: { deviceToken: token }
        }
      );
    } catch (serverError) {
      console.error('Error notifying server about unsubscription:', serverError);
      // Continue anyway since we'll still delete the token locally
    }
    
    // Remove token from local storage
    localStorage.removeItem('fcmToken');
    
    return true;
  } catch (error) {
    console.error('Error in unsubscribeFromPushNotifications:', error);
    throw error;
  }
};