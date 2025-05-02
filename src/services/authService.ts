import axios from 'axios';
import { openDB } from 'idb';
import { api } from './apiService'; // Update to import from central API service

// Base API URL
// In development, we use the local backend URL
// Determine which URL to use based on environment
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_API_URL_DEVELOPMENT 
  : import.meta.env.VITE_API_URL_PRODUCTION;

// Track refresh token attempts to prevent loops
let isRefreshing = false;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

// Add last refresh timestamp to prevent rapid consecutive refreshes
let lastRefreshTime = 0;
const MIN_REFRESH_INTERVAL = 10000; // 10 seconds  

// Types
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: UserData;
  message: string;
}

export interface VerificationResponse {
  message: string;
}

// Initialize IndexedDB for offline storage
const initDB = async () => {
  return openDB('tomatoExpertAuth', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('auth')) {
        db.createObjectStore('auth', { keyPath: 'id' });
      }
    },
  });
};

// Save auth data to IndexedDB for offline access
const saveAuthToIDB = async (authData: any) => {
  const db = await initDB();
  const tx = db.transaction('auth', 'readwrite');
  await tx.store.put({ id: 'currentUser', ...authData });
  await tx.done;
};

// Get auth data from IndexedDB
const getAuthFromIDB = async () => {
  try {
    const db = await initDB();
    return await db.get('auth', 'currentUser');
  } catch (error) {
    console.error('Error getting auth from IndexedDB:', error);
    return null;
  }
};

// Clear auth data from IndexedDB
const clearAuthFromIDB = async () => {
  try {
    const db = await initDB();
    await db.delete('auth', 'currentUser');
  } catch (error) {
    console.error('Error clearing auth from IndexedDB:', error);
  }
};

// Check if we're on the login or register page
const isAuthPage = () => {
  const path = window.location.pathname;
  return path.includes('/login') || 
         path.includes('/register') || 
         path.includes('/forgot-password') ||
         path.includes('/verify');
};

// Updated refreshToken function
const refreshToken = async () => {

  // Skip token refresh on auth pages
  if (isAuthPage()) {
    return { accessToken: null, skipRefresh: true };
  }
  
  // Check if refresh is already in progress
  if (isRefreshing) {
    console.log('Token refresh already in progress, skipping');
    return { accessToken: null, skipRefresh: true };
  }
  
  // Check if we've exceeded max refresh attempts
  if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
    console.warn('Maximum refresh attempts exceeded, forcing logout');
    await logout();
    return { accessToken: null, forceLogout: true };
  }

  // Prevent refreshing too frequently
  const now = Date.now();
  if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
    console.log('Refresh attempted too soon after previous refresh, skipping');
    return { accessToken: null, skipRefresh: true };
  }
  
  try {
    isRefreshing = true;
    refreshAttempts++;
    lastRefreshTime = now;

    // Use a direct axios call instead of the api instance to avoid interceptor loops
    const response = await axios.post(
      `${API_BASE_URL}/refresh-token`, 
      {}, 
      { withCredentials: true }
    );
    
    if (response.data.accessToken) {
      // Reset attempts counter on success
      refreshAttempts = 0;
      
      // Update access token in storage
      const authData = JSON.parse(localStorage.getItem('authData') || 'null') || await getAuthFromIDB();
      
      if (authData) {
        authData.accessToken = response.data.accessToken;
        // Also update user info if provided by the server
        if (response.data.user) {
          authData.user = response.data.user;
          if (typeof response.data.user.rememberMe === 'boolean') {
            authData.rememberMe = response.data.user.rememberMe;
          }
        }
        // Store the updated data
        localStorage.setItem('authData', JSON.stringify(authData));
        await saveAuthToIDB(authData);
      }
      
      return response.data;
    }
    
    return { accessToken: null };
  } catch (error) {
    console.error('Token refresh failed:', error);
    
    // Check if it's a network error (likely offline)
    if (error.message?.includes('Network Error') || !navigator.onLine) {
      console.warn('Network error during token refresh. Device may be offline.');
      
      // When offline, try to extend token life locally for PWA functionality
      const authData = JSON.parse(localStorage.getItem('authData') || 'null') || await getAuthFromIDB();
      if (authData?.accessToken) {
        return { 
          accessToken: authData.accessToken,
          user: authData.user,
          offlineMode: true 
        };
      }
    }

    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      // Force logout after maximum attempts
      await logout();
      return { accessToken: null, forceLogout: true };
    }
    
    // For other errors, also return null but log the specific error
    return { 
      accessToken: null,
      offlineMode: !navigator.onLine 
    };
  } finally {
    isRefreshing = false;
  }
};

// Auth Service Functions
const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verifyEmail = async (email: string, code: string) => {
  try {
    const response = await api.post('/verify-email', { email, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resendVerification = async (email: string) => {
  try {
    const response = await api.post('/resend-verification', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const login = async (credentials: { 
  email: string; 
  password: string; 
  rememberMe?: boolean 
}) => {
  try {
    // Reset refresh tracking on new login
    refreshAttempts = 0;
    isRefreshing = false;
    
    const response = await api.post<AuthResponse>('/login', credentials);
    
    if (response.data.accessToken) {
      const authData = {
        accessToken: response.data.accessToken,
        user: response.data.user,
        rememberMe: credentials.rememberMe || false,
      };
      
      // Save to both localStorage and IndexedDB
      localStorage.setItem('authData', JSON.stringify(authData));
      await saveAuthToIDB(authData);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  // Reset refresh tracking
  refreshAttempts = 0;
  isRefreshing = false;
  
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Clear auth data even if API call fails
    localStorage.removeItem('authData');
    await clearAuthFromIDB();
    
    // Redirect to login page if not already there
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
};

const getCurrentUser = async () => {
  try {
    // Try localStorage first
    let authData = JSON.parse(localStorage.getItem('authData') || 'null');
    
    // If not in localStorage, try IndexedDB
    if (!authData) {
      authData = await getAuthFromIDB();
    }
    
    return authData?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const getUserProfile = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

const updateUserPhoto = async (imageData: string) => {
  try {
    const response = await api.put('/user/photo', { image: imageData });
    return response.data;
  } catch (error) {
    console.error('Error updating user photo:', error);
    throw error;
  }
};

const isAuthenticated = async () => {
  // Try localStorage first
  let authData = JSON.parse(localStorage.getItem('authData') || 'null');
  
  // If not in localStorage, try IndexedDB
  if (!authData) {
    authData = await getAuthFromIDB();
  }
  
  return Boolean(authData?.accessToken);
};

const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verifyResetToken = async (email: string, code: string) => {
  try {
    const response = await api.post('/verify-reset-token', { email, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const response = await api.post('/reset-password', { email, code, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (password: string) => {
  try {
    const response = await api.post('/user/delete-account', { password });
    
    // Clear auth data upon successful deletion
    localStorage.removeItem('authData');
    await clearAuthFromIDB();
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  register,
  verifyEmail,
  resendVerification,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  getUserProfile,
  updateUserPhoto,
  isAuthenticated,
  api,
  clearAuthFromIDB,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  deleteAccount
};