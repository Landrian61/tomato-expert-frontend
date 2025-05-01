import axios from 'axios';

// Determine which URL to use based on environment
const isDevelopment = import.meta.env.MODE === 'development';
const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_API_URL_DEVELOPMENT 
  : import.meta.env.VITE_API_URL_PRODUCTION;

console.log('Environment:', import.meta.env.MODE);
console.log('Using API URL:', API_BASE_URL);

// Create an axios instance with common configuration
export const api = axios.create({
  baseURL: 'http://localhost:5000',  // Remove '/api' from here if it exists
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('authData');
    
    if (authData) {
      try {
        const { accessToken } = JSON.parse(authData);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error('Error parsing auth data', error);
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors with token refresh logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshResult = await axios.post(`${API_BASE_URL}/refresh-token`, {}, {
          withCredentials: true
        });
        
        if (refreshResult.data?.accessToken) {
          // Update token in localStorage
          const authData = localStorage.getItem('authData');
          if (authData) {
            const parsed = JSON.parse(authData);
            parsed.accessToken = refreshResult.data.accessToken;
            localStorage.setItem('authData', JSON.stringify(parsed));
          }
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshResult.data.accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If token refresh fails, clear auth data and redirect to login
        localStorage.removeItem('authData');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Export additional API helpers
export const apiHelpers = {
  /**
   * Test an API endpoint and log the result
   */
  testEndpoint: async (endpoint: string) => {
    console.log(`Testing endpoint: ${endpoint}`);
    try {
      const result = await api.get(endpoint);
      console.log('API Test Success:', result.data);
      return result.data;
    } catch (error) {
      console.error('API Test Failed:', error);
      throw error;
    }
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).testApiEndpoint = apiHelpers.testEndpoint;
}
