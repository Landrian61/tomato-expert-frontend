import axios from 'axios';
import { openDB } from 'idb';

// Base API URL
// In development, we use the local backend URL
// In production, we use the deployed URL
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://tomato-expert-backend.onrender.com/api';

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

// Configure axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor for adding token
api.interceptors.request.use(
  async (config) => {
    // Don't add auth header for refresh token or login/register endpoints
    if (
      config.url === '/refresh-token' ||
      config.url === '/login' ||
      config.url === '/register' ||
      config.url === '/verify-email' ||
      config.url === '/resend-verification'
    ) {
      return config;
    }

    // Try to get token from localStorage first, then IndexedDB
    let authData = JSON.parse(localStorage.getItem('authData') || 'null');
    if (!authData) {
      authData = await getAuthFromIDB();
    }

    if (authData?.accessToken) {
      config.headers.Authorization = `Bearer ${authData.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt token refresh if we get a 401 error (Unauthorized) 
    // and we haven't already tried refreshing for this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Attempting to refresh token...');
        const refreshResponse = await axios.post(
          `${API_URL}/refresh-token`, 
          {}, 
          { withCredentials: true }
        );
        
        if (refreshResponse.data.accessToken) {
          // Update token in localStorage and IndexedDB
          const authData = JSON.parse(localStorage.getItem('authData') || 'null') || await getAuthFromIDB();
          if (authData) {
            authData.accessToken = refreshResponse.data.accessToken;
            localStorage.setItem('authData', JSON.stringify(authData));
            await saveAuthToIDB(authData);
          }
          
          // Update token in the original request and retry
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // If refresh fails due to invalid refresh token (403),
        // proceed with limited functionality - don't force logout
        if (refreshError.response?.status !== 403) {
          // For other errors, logout the user
          await logout();
          // Allow the app to continue in a limited state
          // Only redirect to login for serious auth issues
          if (window.location.pathname.includes('/dashboard')) {
            window.location.href = '/login';
          }
        }
      }
    }

    // If the error is 403 on the refresh token endpoint, 
    // continue without forcing a logout
    if (error.config?.url === '/refresh-token' && error.response?.status === 403) {
      console.warn('Refresh token expired or invalid. Limited functionality available.');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Updated refreshToken function
const refreshToken = async () => {
  try {
    // Use a direct axios call instead of the api instance to avoid interceptor loops
    const response = await axios.post(
      `${API_URL}/refresh-token`, 
      {}, 
      { withCredentials: true }
    );
    
    if (response.data.accessToken) {
      // Update access token in storage
      const authData = JSON.parse(localStorage.getItem('authData') || 'null') || await getAuthFromIDB();
      
      if (authData) {
        authData.accessToken = response.data.accessToken;
        // Also update user info if provided by the server
        if (response.data.user) {
          authData.user = response.data.user;
          // Update remember me preference if present
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
        // Instead of failing, return the current token when offline
        // This allows the PWA to continue functioning in offline mode
        return { 
          accessToken: authData.accessToken,
          user: authData.user,
          offlineMode: true 
        };
      }
    }
    
    // For 403 errors (forbidden/expired), we'll return null token but not force logout
    // For other errors, also return null but log the specific error
    return { 
      accessToken: null,
      offlineMode: !navigator.onLine 
    };
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
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Clear auth data even if API call fails
    localStorage.removeItem('authData');
    await clearAuthFromIDB();
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
    throw error;
  }
};

const updateUserPhoto = async (imageData: string) => {
  try {
    const response = await api.put('/user/photo', { image: imageData });
    
    // Update profile photo in storage
    const authData = JSON.parse(localStorage.getItem('authData') || 'null') || await getAuthFromIDB();
    
    if (authData && response.data.profilePhoto) {
      authData.user.profilePhoto = response.data.profilePhoto;
      localStorage.setItem('authData', JSON.stringify(authData));
      await saveAuthToIDB(authData);
    }
    
    return response.data;
  } catch (error) {
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
  clearAuthFromIDB  // Add this export
};