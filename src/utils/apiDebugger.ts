import { api } from '../services/authService';

/**
 * Utility to test API endpoints
 * Can be accessed in browser console via window.testApiEndpoint
 */
export const testApiEndpoint = async (path: string, method: 'GET' | 'POST' = 'GET', data: any = null) => {
  console.log(`Testing API endpoint: ${method} ${path}`);
  try {
    let response;
    if (method === 'GET') {
      response = await api.get(path);
    } else {
      response = await api.post(path, data);
    }
    console.log('✅ Success! Response:', response.data);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('❌ Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      error
    });
    return { 
      success: false, 
      status: error.response?.status,
      message: error.response?.data?.message || error.message 
    };
  }
};

// Add to window object for browser console access
if (typeof window !== 'undefined') {
  (window as any).testApiEndpoint = testApiEndpoint;
  
  // Shorthand test functions
  (window as any).testLocationUpdate = (latitude = 0.3321, longitude = 32.5705) => {
    return testApiEndpoint('/environmental/location', 'POST', { latitude, longitude });
  };
}
