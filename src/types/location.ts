/**
 * Shared types for location-related data
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface FarmLocation {
  id: string;
  farmer: {
    firstName: string;
    lastName: string;
  };
  location: {
    latitude: number;
    longitude: number;
    district?: string;
    name?: string;
  };
  isSelf: boolean;
  environmentalData?: EnvironmentalData;
}

export interface EnvironmentalData {
  cri: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  blightType?: 'Healthy' | 'Early Blight' | 'Late Blight';
  temperature?: number | string;
  humidity?: number | string;
  rainfall?: number | string;
  soilMoisture?: number | string;
  date?: string;
  percentageChanges?: {
    daily?: {
      temperature?: number | string;
      humidity?: number | string;
      rainfall?: number | string;
      soilMoisture?: number | string;
      cri?: number | string;
    };
    weekly?: {
      temperature?: number | string;
      humidity?: number | string;
      rainfall?: number | string;
      soilMoisture?: number | string;
      cri?: number | string;
    };
  };
  currentConditions?: {
    temperature: string;
    humidity: string;
    rainfall: string;
    soilMoisture: string;
  };
}
