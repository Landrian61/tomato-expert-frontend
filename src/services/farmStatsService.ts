import { api } from './authService';

export interface FarmStats {
  totalFarms: number;
  healthyFarms: number;
  atRiskFarms: number;
  criticalFarms: number;
  averageCRI: number;
  totalDiagnoses: number;
  recentAlerts: number;
  lastUpdated: string;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  rainfall: number;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

/**
 * Fetches farm statistics and overview data
 * @returns Farm statistics summary
 */
export const getFarmStats = async (): Promise<FarmStats> => {
  const possiblePaths = [
    '/dashboard/stats',
    '/farm/stats',
    '/analytics/overview'
  ];

  let lastError: Error | null = null;
  const isDevelopment = process.env.NODE_ENV === 'development';

  for (const path of possiblePaths) {
    try {
      if (isDevelopment) console.log(`🔄 Trying to fetch farm stats from: ${path}`);
      const response = await api.get(path, { timeout: 5000 });
      if (isDevelopment) console.log(`✅ Success with farm stats path: ${path}`);
      return response.data;
    } catch (error: unknown) {
      if (isDevelopment) console.error(`❌ Error with path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      lastError = error instanceof Error ? error : new Error('Unknown error');
    }
  }

  if (isDevelopment) {
    console.log('📊 Using mock farm statistics data');
  }

  // Return mock data if all API calls fail
  return getMockFarmStats();
};

/**
 * Fetches weather forecast for the next few days
 * @param days Number of days to forecast (default: 5)
 * @returns Weather forecast data
 */
export const getWeatherForecast = async (days: number = 5): Promise<WeatherForecast[]> => {
  const possiblePaths = [
    `/weather/forecast?days=${days}`,
    `/environmental/forecast?days=${days}`,
    `/dashboard/weather?days=${days}`
  ];

  let lastError: Error | null = null;
  const isDevelopment = process.env.NODE_ENV === 'development';

  for (const path of possiblePaths) {
    try {
      if (isDevelopment) console.log(`🔄 Trying to fetch weather forecast from: ${path}`);
      const response = await api.get(path, { timeout: 5000 });
      if (isDevelopment) console.log(`✅ Success with weather forecast path: ${path}`);
      return response.data;
    } catch (error: unknown) {
      if (isDevelopment) console.error(`❌ Error with path ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      lastError = error instanceof Error ? error : new Error('Unknown error');
    }
  }

  if (isDevelopment) {
    console.log('🌤️ Using mock weather forecast data');
  }

  // Return mock data if all API calls fail
  return getMockWeatherForecast(days);
};

/**
 * Provides mock farm statistics when API is unavailable
 */
const getMockFarmStats = (): FarmStats => {
  const variation = Math.random() * 10;
  
  return {
    totalFarms: Math.round(45 + variation),
    healthyFarms: Math.round(28 + variation * 0.6),
    atRiskFarms: Math.round(12 + variation * 0.3),
    criticalFarms: Math.round(5 + variation * 0.1),
    averageCRI: Number((52.3 + (variation - 5)).toFixed(1)),
    totalDiagnoses: Math.round(324 + variation * 8),
    recentAlerts: Math.round(3 + variation * 0.2),
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Provides mock weather forecast when API is unavailable
 */
const getMockWeatherForecast = (days: number): WeatherForecast[] => {
  const forecast: WeatherForecast[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    // Generate realistic weather variations
    const tempVariation = Math.sin(i * 0.5) * 3;
    const humidityVariation = Math.cos(i * 0.3) * 10;
    const rainfallChance = Math.random();
    
    const minTemp = Math.round(20 + tempVariation);
    const maxTemp = Math.round(28 + tempVariation);
    const humidity = Math.round(65 + humidityVariation);
    const rainfall = rainfallChance > 0.7 ? Number((Math.random() * 15).toFixed(1)) : 0;
    
    // Determine risk level based on conditions
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (humidity > 75 && rainfall > 5) {
      riskLevel = 'High';
    } else if (humidity > 65 || rainfall > 2) {
      riskLevel = 'Medium';
    }
    
    // Weather descriptions
    const descriptions = [
      'Partly cloudy',
      'Sunny',
      'Mostly cloudy',
      'Light rain',
      'Scattered showers',
      'Clear skies'
    ];
    
    let description = descriptions[Math.floor(Math.random() * descriptions.length)];
    if (rainfall > 0) {
      description = rainfall > 10 ? 'Heavy rain' : 'Light rain';
    }
    
    forecast.push({
      date: date.toISOString(),
      temperature: { min: minTemp, max: maxTemp },
      humidity,
      rainfall,
      description,
      riskLevel
    });
  }
  
  return forecast;
};

/**
 * Formats farm stats for display
 */
export const formatFarmStatsForUI = (stats: FarmStats) => {
  return {
    ...stats,
    riskPercentage: Math.round(((stats.atRiskFarms + stats.criticalFarms) / stats.totalFarms) * 100),
    healthyPercentage: Math.round((stats.healthyFarms / stats.totalFarms) * 100),
    lastUpdatedRelative: getRelativeTime(stats.lastUpdated)
  };
};

/**
 * Helper function to get relative time
 */
const getRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
  return `${Math.floor(diffMins / 1440)} days ago`;
};