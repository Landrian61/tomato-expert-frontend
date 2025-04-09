import axios from 'axios';

// Base API URL - matching the pattern from notificationService.ts
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://tomato-expert-backend.onrender.com/api';

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
export const isPushSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

/**
 * Request push notification permission
 * @returns Promise with the permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser');
  }
  
  return await Notification.requestPermission();
};

/**
 * Get current push notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!isPushSupported()) {
    return 'denied';
  }
  
  return Notification.permission;
};

/**
 * Register service worker for push notifications
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  if (!isPushSupported()) {
    throw new Error('Service workers are not supported in this browser');
  }
  
  try {
    // Check if service worker is already registered and active
    if (navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.ready;
      return registration;
    }
    
    // Otherwise register a new service worker
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    
    // Wait for the service worker to be ready
    if (registration.installing) {
      await new Promise<void>((resolve) => {
        registration.installing?.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'activated') {
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
 * @returns Promise with the push subscription
 */
export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Get VAPID public key from backend
    const response = await axios.get(`${API_URL}/notifications/vapid-key`);
    const { vapidPublicKey } = response.data;
    
    if (!vapidPublicKey) {
      console.error('No VAPID public key returned from server');
      return null;
    }
    
    // Check for an existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    // Unsubscribe from any existing subscription to ensure a clean state
    if (subscription) {
      await subscription.unsubscribe();
    }
    
    // Create a new subscription
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
      
      // Send the subscription to the server
      await axios.post(
        `${API_URL}/notifications/register-device`,
        { deviceToken: JSON.stringify(subscription) },
        getAuthHeader()
      );
      
      return subscription;
    } catch (error) {
      console.error('Error creating push subscription:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in subscribeToPushNotifications:', error);
    return null;
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Already unsubscribed
      return true;
    }
    
    try {
      // Store the endpoint before unsubscribing
      const endpoint = subscription.endpoint;
      const subscriptionJson = JSON.stringify(subscription);
      
      // Unsubscribe first to avoid the message channel closing error
      const success = await subscription.unsubscribe();
      
      if (success) {
        // Then notify the server
        try {
          await axios.delete(
            `${API_URL}/notifications/unregister-device`,
            { 
              headers: { 
                ...getAuthHeader().headers 
              },
              data: { deviceToken: subscriptionJson }
            }
          );
        } catch (serverError) {
          console.error('Error notifying server about unsubscription:', serverError);
          // Continue anyway since we've already unsubscribed locally
        }
      }
      
      return success;
    } catch (unsubError) {
      console.error('Error during unsubscribe operation:', unsubError);
      
      // If we get a "message channel closed" error, consider it a success
      // This is a known issue with some browsers
      if (unsubError.message?.includes('message channel closed')) {
        return true;
      }
      
      return false;
    }
  } catch (error) {
    console.error('Error in unsubscribeFromPushNotifications:', error);
    return false;
  }
};

/**
 * Convert base64 to Uint8Array
 * (required for applicationServerKey)
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
} 