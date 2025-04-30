/**
 * Mock location data for development and testing
 */

export const getMockFarmerLocation = (userId: string | undefined) => {
  return {
    id: userId || 'user123',
    farmer: {
      firstName: 'Test',
      lastName: 'Farmer'
    },
    location: {
      latitude: 0.3321,
      longitude: 32.5705,
      district: 'Kampala',
      name: 'Development Farm'
    },
    isSelf: true,
    environmentalData: {
      cri: 65,
      riskLevel: 'Medium',
      blightType: 'Early Blight',
      temperature: 26,
      humidity: 75,
      rainfall: 2.5,
      soilMoisture: 60
    }
  };
};

export const getMockNearbyFarmers = () => {
  return [
    {
      id: 'farmer1',
      farmer: {
        firstName: 'John',
        lastName: 'Doe'
      },
      location: {
        latitude: 0.3421,
        longitude: 32.5805,
        district: 'Kampala',
        name: 'Neighbor Farm 1'
      },
      isSelf: false,
      environmentalData: {
        cri: 45,
        riskLevel: 'Low',
        blightType: 'Healthy',
        temperature: 25,
        humidity: 65,
        rainfall: 1.5,
        soilMoisture: 50
      }
    },
    {
      id: 'farmer2',
      farmer: {
        firstName: 'Jane',
        lastName: 'Smith'
      },
      location: {
        latitude: 0.3221,
        longitude: 32.5605,
        district: 'Kampala',
        name: 'Neighbor Farm 2'
      },
      isSelf: false,
      environmentalData: {
        cri: 78,
        riskLevel: 'High',
        blightType: 'Late Blight',
        temperature: 22,
        humidity: 85,
        rainfall: 4.2,
        soilMoisture: 75
      }
    }
  ];
};
