import axios from 'axios';

// Types 
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'weather' | 'blight' | 'tip' | 'diagnosis' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  data?: any;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
  metadata: {
    total: number;
    limit: number;
    skip: number;
  };
}

export interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  weatherAlerts: boolean;
  blightRiskAlerts: boolean;
  farmingTips: boolean;
  diagnosisResults: boolean;
}

export interface AppPermissions {
  camera: boolean;
  location: boolean;
  notifications: boolean;
  dataSync: boolean;
  analytics: boolean;
  offline: boolean;
}

// Base API URL - matching the pattern from authService.ts
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://tomato-expert-backend.onrender.com/api';

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
    
    // Legacy fallback (can be removed in future versions)
    const token = localStorage.getItem('token');
    if (token) {
      console.warn('Using legacy token format - please re-login to update auth format');
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
    
    console.warn('No authentication token found');
    return {};
  } catch (error) {
    console.error('Error getting auth header:', error);
    return {};
  }
};

// Get all notifications with optional filters
export const getNotifications = async (
  filters?: {
    read?: boolean;
    type?: string;
  },
  limit: number = 20,
  skip: number = 0
): Promise<NotificationResponse> => {
  try {
    let queryParams = `?limit=${limit}&skip=${skip}`;
    
    if (filters?.read !== undefined) {
      queryParams += `&read=${filters.read}`;
    }
    
    if (filters?.type) {
      queryParams += `&type=${filters.type}`;
    }
    
    const response = await axios.get(
      `${API_URL}/notifications${queryParams}`,
      getAuthHeader()
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<{ message: string; notification: Notification }> => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      getAuthHeader()
    );
    
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/read-all`,
      {},
      getAuthHeader()
    );
    
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Register device token for push notifications
export const registerDeviceToken = async (deviceToken: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/register-device`,
      { deviceToken },
      getAuthHeader()
    );
    
    return response.data;
  } catch (error) {
    console.error('Error registering device token:', error);
    throw error;
  }
};

// Update notification settings
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>
): Promise<{ message: string; settings: NotificationSettings }> => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/settings`,
      settings,
      getAuthHeader()
    );
    
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

// Request test tip (mainly for testing)
export const requestTestTip = async (): Promise<{ message: string }> => {
  try {
    // Check if token exists in authData (newer approach)
    const authData = JSON.parse(localStorage.getItem('authData') || 'null');
    if (!authData?.accessToken) {
      throw new Error('Authentication token is missing. Please log in again.');
    }
    
    console.log('Sending test tip request to:', `${API_URL}/notifications/test-tip`);
    
    const response = await axios.post(
      `${API_URL}/notifications/test-tip`,
      {},
      getAuthHeader()
    );
    
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      
      if (error.response.status === 403) {
        throw new Error('Not authorized to perform this action. Your session may have expired. Please try logging in again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
      throw new Error('No response received from server. Please check your network connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const response = await axios.get('/notifications/settings', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw error;
  }
}

export async function updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
  try {
    await axios.patch('/notifications/settings', settings, getAuthHeader());
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
}

export async function getAppPermissions(): Promise<AppPermissions> {
  try {
    const response = await axios.get('/user/permissions', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching app permissions:', error);
    throw error;
  }
}

export async function updateAppPermissions(permissions: Partial<AppPermissions>): Promise<void> {
  try {
    await axios.patch('/user/permissions', permissions, getAuthHeader());
  } catch (error) {
    console.error('Error updating app permissions:', error);
    throw error;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
} 