import { FarmLocation, EnvironmentalData } from "@/types/location";

/**
 * Generates mock location data for the current user in development mode
 */
export const getMockFarmerLocation = (
  userId?: string,
  userData?: { firstName?: string; lastName?: string },
  envData?: EnvironmentalData
): FarmLocation => {
  return {
    id: userId || "user123",
    farmer: {
      firstName: userData?.firstName || "Test",
      lastName: userData?.lastName || "Farmer"
    },
    location: {
      latitude: 0.3321,
      longitude: 32.5705,
      district: "Kampala",
      name: "Development Farm"
    },
    isSelf: true,
    environmentalData: envData || {
      cri: 65,
      riskLevel: "Medium",
      blightType: "Early Blight",
      temperature: "24.5°C",
      humidity: "68%",
      rainfall: "2.1mm",
      soilMoisture: "55%"
    }
  };
};

/**
 * Generates mock nearby farm locations for development
 */
export const getMockNearbyFarmers = (userLocation: FarmLocation): FarmLocation[] => {
  return [
    {
      id: "farm1",
      farmer: { firstName: "Jane", lastName: "Doe" },
      location: {
        latitude: userLocation.location.latitude + 0.01,
        longitude: userLocation.location.longitude + 0.01,
        district: "Kampala",
        name: "Nearby Farm 1"
      },
      isSelf: false,
      environmentalData: {
        cri: 45,
        riskLevel: "Low",
        blightType: "Healthy",
        temperature: "26°C",
        humidity: "65%",
        rainfall: "1.5mm",
        soilMoisture: "42%"
      }
    },
    {
      id: "farm2",
      farmer: { firstName: "John", lastName: "Smith" },
      location: {
        latitude: userLocation.location.latitude - 0.01,
        longitude: userLocation.location.longitude - 0.01,
        district: "Kampala",
        name: "Nearby Farm 2"
      },
      isSelf: false,
      environmentalData: {
        cri: 75,
        riskLevel: "High",
        blightType: "Late Blight",
        temperature: "22°C",
        humidity: "82%",
        rainfall: "3.7mm",
        soilMoisture: "78%"
      }
    }
  ];
};

/**
 * Generates mock environmental data for development
 */
export const getMockEnvironmentalData = (): EnvironmentalData => {
  return {
    date: new Date().toISOString(),
    cri: 65,
    riskLevel: "Medium",
    blightType: "Early Blight",
    currentConditions: {
      temperature: "25.5°C",
      humidity: "68%",
      rainfall: "2.1mm",
      soilMoisture: "55%"
    },
    percentageChanges: {
      daily: {
        temperature: "+1.5%",
        humidity: "-3.2%",
        rainfall: "+0.8mm",
        soilMoisture: "+5.0%",
        cri: "+2.3"
      },
      weekly: {
        temperature: "+3.7%",
        humidity: "-8.5%",
        rainfall: "+12.4mm",
        soilMoisture: "+7.2%",
        cri: "+8.1"
      }
    }
  };
};
