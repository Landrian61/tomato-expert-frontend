import axios from 'axios';
import { getFCMToken, isFCMSupported } from './firebaseService';

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
export const isPushSupported = async (): Promise<boolean> => {
  return await isFCMSupported();
};

/**
 * Request push notification permission
 * @returns Promise with the permission status
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!(await isPushSupported())) {
    throw new Error('Push notifications are not supported in this browser');
  }
  
  return await Notification.requestPermission();
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
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration> => {
  if (!(await isPushSupported())) {
    throw new Error('Service workers are not supported in this browser');
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
export const subscribeToPushNotifications = async (): Promise<string | null> => {
  try {
    console.log('Subscribing to push notifications...');
    
    // Register service worker first
    await registerServiceWorker();
    
    // Get FCM token
    const token = await getFCMToken();
    console.log('FCM token obtained:', token);
    
    if (!token) {
      console.error('No FCM token available');
      return null;
    }
    
    // Send token to the server
    console.log('Sending FCM token to server...');
    await axios.post(
      `${API_URL}/notifications/register-device`,
      { deviceToken: token },
      getAuthHeader()
    );
    console.log('FCM token sent to server');
    
    return token;
  } catch (error) {
    console.error('Error in subscribeToPushNotifications:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

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
        `${API_URL}/notifications/unregister-device`,
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