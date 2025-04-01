import { api } from './authService';

export interface EnvironmentalData {
  date: string;
  currentConditions: {
    temperature: string;
    humidity: string;
    rainfall: string;
    soilMoisture: string;
  };
  cri: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  percentageChanges: {
    daily: {
      temperature?: string;
      humidity?: string;
      soilMoisture?: string;
    };
    weekly: {
      temperature?: string;
      humidity?: string;
      soilMoisture?: string;
    };
    monthly: {
      temperature?: string;
      humidity?: string;
      soilMoisture?: string;
    };
  };
}

export interface CRIHistoryData {
  history: Array<{
    _id: string;
    date: string;
    riskLevel: string;
    cri: number;
  }>;
  trend: {
    averageChange: number;
    direction: 'increasing' | 'decreasing' | 'stable';
  };
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
}

/**
 * Fetches the latest environmental data from the API
 * @returns Environmental data with percentage changes
 */
export const getLatestEnvironmentalData = async (): Promise<EnvironmentalData> => {
  // Define possible API paths to try
  const possiblePaths = [
    '/environmental/latest',
    '/environmental-data/latest',
    '/weather/latest'
  ];

  let lastError: any = null;

  // Check if we're working offline or in a development environment
  // We'll use the mock data more readily in these cases
  const isOfflineMode = localStorage.getItem('offlineMode') === 'true';
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isOfflineMode) {
    console.log('🔌 Operating in offline mode - using mock data');
    return getMockEnvironmentalData();
  }

  // Try each path until one works
  for (const path of possiblePaths) {
    try {
      if (isDevelopment) console.log(`🔄 Trying to fetch from: ${path}`);
      const response = await api.get(path, {
        timeout: 5000, // Add a reasonable timeout
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (isDevelopment) console.log(`✅ Success with path: ${path}`);
      return response.data;
    } catch (error: any) {
      const errorMsg = error.response ?
        `Status: ${error.response.status} - ${error.response.statusText}` :
        error.message;

      if (isDevelopment) console.error(`❌ Error with path ${path}: ${errorMsg}`);

      if (error.response && error.response.status === 401) {
        console.warn('🔑 Authentication required - user may need to log in');
      }

      lastError = error;
      // Continue to next path
    }
  }

  if (isDevelopment) {
    console.error('❌ All API paths failed. Using fallback data.');
    console.error('Last error:', lastError?.message || 'Unknown error');

    // Add a button to run the test function if in development
    console.log('%c You can run window.testEnvironmentalApi() to debug connection issues',
      'background: #333; color: white; padding: 4px; border-radius: 4px');
  }

  return getMockEnvironmentalData();
};

/**
 * Provides mock environmental data when API is unavailable
 * @returns Mock environmental data
 */
const getMockEnvironmentalData = (): EnvironmentalData => {
  console.log('📊 Using mock environmental data');

  // Generate slightly different mock data each time
  const variation = Math.random() * 5 - 2.5; // Random variation between -2.5 and 2.5
  const timestamp = new Date().toISOString();

  return {
    date: timestamp,
    currentConditions: {
      temperature: `${(24.2 + variation).toFixed(1)}°C`,
      humidity: `${Math.round(70 + variation)}%`,
      rainfall: `${(0.6 + variation / 10).toFixed(1)}mm`,
      soilMoisture: `${Math.round(48 + variation)}%`
    },
    cri: Math.max(0, Math.min(100, 60.64 + variation)),
    riskLevel: "Medium",
    percentageChanges: {
      daily: {
        temperature: variation > 0 ? `+${variation.toFixed(1)}%` : `${variation.toFixed(1)}%`,
        humidity: variation < 0 ? `+${(-variation).toFixed(1)}%` : `${(-variation).toFixed(1)}%`,
        soilMoisture: variation > 0 ? `+${(variation * 1.5).toFixed(1)}%` : `${(variation * 1.5).toFixed(1)}%`
      },
      weekly: {},
      monthly: {}
    }
  };
};

/**
 * Fetches CRI history for the specified period
 * @param period - The time period for CRI history ('day', 'week', 'month', or 'year')
 * @returns CRI history data with trend analysis
 */
export const getCRIHistory = async (period: 'day' | 'week' | 'month' | 'year'): Promise<CRIHistoryData> => {
  // Define possible API paths to try
  const possiblePaths = [
    `/environmental/cri-history`,
    `/environmental-data/cri-history`,
    `/weather/cri-history`
  ];

  let lastError: any = null;

  // Try each path until one works
  for (const path of possiblePaths) {
    try {
      console.log(`Trying to fetch CRI history from: ${path}?period=${period}`);
      const response = await api.get(`${path}?period=${period}`);
      console.log(`Success with CRI history path: ${path}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error with CRI history path ${path}:`, error.message);
      lastError = error;
      // Continue to next path
    }
  }

  console.error('All CRI history API paths failed. Using fallback data.');

  // Generate mock data if all API requests fail
  const today = new Date();
  const mockHistory = [];

  // Generate days of mock data based on the period
  const days = period === 'day' ? 1 : period === 'week' ? 7 : period === 'month' ? 30 : 365;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Create some variation in CRI values centered around 50 (healthy)
    let cri = 50 + Math.sin(i * 0.5) * 15;
    cri = Math.round(cri * 100) / 100;

    // Determine risk level based on CRI
    let riskLevel;
    if (cri >= 45 && cri <= 55) {
      riskLevel = "Healthy";
    } else if (cri > 55) {
      riskLevel = "Late Blight Risk";
    } else {
      riskLevel = "Early Blight Risk";
    }

    mockHistory.push({
      _id: `mock-${i}`,
      date: date.toISOString(),
      riskLevel,
      cri
    });
  }

  return {
    history: mockHistory,
    trend: {
      averageChange: 1.2,
      direction: 'stable'
    }
  };
};

/**
 * Updates the user's location coordinates
 * @param location - The location coordinates to update
 * @returns A confirmation message and the updated coordinates
 */
export const updateUserLocation = async (location: LocationUpdate) => {
  // Define possible API paths to try
  const possiblePaths = [
    '/environmental/update-location',
    '/environmental-data/update-location',
    '/weather/update-location'
  ];

  let lastError: any = null;

  // Try each path until one works
  for (const path of possiblePaths) {
    try {
      console.log(`Trying to update location using: ${path}`);
      const response = await api.post(path, location);
      console.log(`Success with update location path: ${path}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error with update location path ${path}:`, error.message);
      lastError = error;
      // Continue to next path
    }
  }

  console.error('All update location API paths failed.');
  // Re-throw the last error
  throw new Error('Failed to update location: ' + (lastError?.message || 'Unknown error'));
};

/**
 * Manually triggers a refresh of environmental data
 * @returns The newly refreshed data
 */
export const refreshEnvironmentalData = async () => {
  // Define possible API paths to try
  const possiblePaths = [
    '/environmental/refresh',
    '/environmental-data/refresh',
    '/weather/refresh'
  ];

  let lastError: any = null;

  // Try each path until one works
  for (const path of possiblePaths) {
    try {
      console.log(`Trying to refresh data using: ${path}`);
      const response = await api.post(path);
      console.log(`Success with refresh path: ${path}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error with refresh path ${path}:`, error.message);
      lastError = error;
      // Continue to next path
    }
  }

  console.error('All refresh API paths failed.');
  // Re-throw the last error
  throw new Error('Failed to refresh environmental data: ' + (lastError?.message || 'Unknown error'));
};

/**
 * Formats environmental data for display in the UI
 * @param data - The raw environmental data
 * @returns Formatted data for UI components
 */
export const formatEnvironmentalDataForUI = (data: EnvironmentalData) => {
  // Maps the API response to the format expected by UI components

  // Helper function to determine trend type based on percentage
  const determineTrend = (changeStr: string | undefined): 'up' | 'down' | 'stable' => {
    if (!changeStr) return 'stable';
    const value = parseFloat(changeStr);
    if (Math.abs(value) < 0.5) return 'stable'; // Consider very small changes as stable
    return value > 0 ? 'up' : 'down';
  };

  const roundPercentage = (value: string | undefined): string | undefined => {
    if (value === undefined) return undefined;
    const num = parseFloat(value);
    if (isNaN(num)) return value; // Return original if not a valid number
    return num.toFixed(1) + '%';
  };

  return {
    temperature: {
      value: data.currentConditions.temperature,
      change: roundPercentage(data.percentageChanges.daily.temperature) || '0%',
      trend: determineTrend(data.percentageChanges.daily.temperature)
    },
    humidity: {
      value: data.currentConditions.humidity,
      change: roundPercentage(data.percentageChanges.daily.humidity) || '0%',
      trend: determineTrend(data.percentageChanges.daily.humidity)
    },
    soilMoisture: {
      value: data.currentConditions.soilMoisture,
      change: roundPercentage(data.percentageChanges.daily.soilMoisture) || '0%',
      trend: determineTrend(data.percentageChanges.daily.soilMoisture)
    }
  };
};

/**
 * Formats CRI history data for chart display
 * @param data - The raw CRI history data
 * @returns Formatted data for chart components
 */
export const formatCRIHistoryForChart = (data: CRIHistoryData) => {
  return data.history.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: item.cri
  }));
};