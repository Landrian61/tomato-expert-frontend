
import axios from 'axios';
import { openDB } from 'idb';

// Base API URL
// In development, we use the relative URL which will be proxied by Vite
// In production, we use the full URL
const API_URL = import.meta.env.DEV 
  ? '/api' 
  : 'https://tomato-expert-backend.onrender.com/api';

// Types
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
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

    // If error is 403 (token expired) and we haven't retried yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshToken();
        
        if (refreshResponse.accessToken) {
          // Update token in request and retry
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout and redirect
        await logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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

const login = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post<AuthResponse>('/login', credentials);
    
    if (response.data.accessToken) {
      const authData = {
        accessToken: response.data.accessToken,
        user: response.data.user,
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

const refreshToken = async () => {
  try {
    // Try to get refresh token from cookie (handled by browser)
    const response = await api.post('/refresh-token');
    
    if (response.data.accessToken) {
      // Update access token in storage
      const authData = JSON.parse(localStorage.getItem('authData') || 'null') || await getAuthFromIDB();
      
      if (authData) {
        authData.accessToken = response.data.accessToken;
        localStorage.setItem('authData', JSON.stringify(authData));
        await saveAuthToIDB(authData);
      }
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
  api
};
