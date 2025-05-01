import { api } from './authService';

// Type definitions
export interface DiagnosisResult {
  id: string;
  condition: string;
  confidence: number;
  recommendation: string;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  coordinates?: { latitude: number; longitude: number };
  environmentalDataId?: string;
  environmentalData?: {
    cri: number;
    riskLevel: string;
    temperature: string;
    humidity: string;
    rainfall: string;
    soilMoisture: string;
    date?: string; // Add date if it's in the response
  };
  signsAndSymptoms?: string; // ADD THIS LINE
}

export interface DiagnosisHistoryResponse {
  diagnoses: DiagnosisResult[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
  };
}

export interface ValidationResponse {
  message: string;
  validationId: string;
  imageUrl: string;
}

/**
 * Formats the verbose recommendation text for better readability.
 * @param recommendation - The raw recommendation string.
 * @returns Formatted recommendation with HTML-like structure.
 */
export const formatRecommendation = (recommendation: string): string => {
  if (!recommendation) {
    return '';
  }

  // Replace newline characters with <br> for line breaks
  let formattedRecommendation = recommendation.replace(/\n/g, '<br>');

  // Identify sections based on the asterisk at the beginning of lines
  formattedRecommendation = formattedRecommendation.replace(/\* \*\*/g, '<b>'); // Bold main points
  formattedRecommendation = formattedRecommendation.replace(/\*\*/g, '</b>');

  // Format bullet points
  formattedRecommendation = formattedRecommendation.replace(/\* /g, '&bull; ');

  return formattedRecommendation;
};

/**
 * Validate an image before diagnosis
 * @param imageData - Base64 encoded image data
 * @param coordinates - Optional GPS coordinates
 * @returns Validation result with validation ID
 */
export const validatePlantImage = async (
  imageData: string,
  coordinates?: { latitude: number; longitude: number }
): Promise<ValidationResponse> => {
  try {
    // Make sure the image data is properly formatted
    const formattedImageData = imageData.startsWith('data:')
      ? imageData
      : `data:image/jpeg;base64,${imageData}`;

    console.log('Sending image validation request to API');

    const response = await api.post('/api/diagnosis/validate', {
      image: formattedImageData,
      coordinates
    });

    return response.data;
  } catch (error) {
    console.error('Error during image validation:', error);
    throw error;
  }
};

/**
 * Submit a validated image for plant diagnosis
 * @param validationId - ID from the validation step
 * @returns Diagnosis result
 */
export const diagnosePlant = async (validationId: string) => {
  try {
    console.log('Sending diagnosis request to API with validation ID:', validationId);

    const response = await api.post('/api/diagnosis/diagnose', {
      validationId
    });

    return response.data;
  } catch (error) {
    console.error('Error during plant diagnosis:', error);
    throw error;
  }
};

/**
 * Get diagnosis history with pagination
 * @param limit - Number of items per page
 * @param skip - Number of items to skip
 * @returns Paginated diagnosis history
 */
export const getDiagnosisHistory = async (limit = 10, skip = 0): Promise<DiagnosisHistoryResponse> => {
  try {
    const response = await api.get(`/api/diagnosis/history?limit=${limit}&skip=${skip}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnosis history:', error);
    throw error;
  }
};

/**
 * Get a specific diagnosis by ID
 * @param id - Diagnosis ID
 * @returns Detailed diagnosis information
 */
export const getDiagnosisById = async (id: string): Promise<DiagnosisResult> => {
  try {
    // Add debug logging
    console.log('getDiagnosisById called with ID:', id);

    // Validate ID before making request
    if (!id || id === 'undefined') {
      console.error('Invalid diagnosis ID:', id);
      throw new Error('Invalid diagnosis ID');
    }

    // Check if ID matches MongoDB ObjectId pattern (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error('Invalid diagnosis ID format:', id);
      throw new Error('Invalid diagnosis ID format');
    }

    console.log('Fetching diagnosis details for ID:', id);

    // The path should match how routes are mounted in the backend
    // Since routes are mounted at '/api/diagnosis', we just need '/diagnosis/:id'
    const response = await api.get(`/api/diagnosis/${id}`);

    // Log the response data structure
    console.log('Response received:', !!response.data);
    console.log('Response has id property:', 'id' in (response.data || {}));

    // If response.data has _id but not id, transform it
    if (response.data && response.data._id && !response.data.id) {
      console.log('Transforming _id to id in response data');
      response.data.id = response.data._id;
    }

    const diagnosisResult = response.data as DiagnosisResult; // Explicitly cast the response data

    // Round temperature and humidity if environmentalData exists
    if (diagnosisResult.environmentalData) {
      const temperature = parseFloat(diagnosisResult.environmentalData.temperature);
      const humidity = parseFloat(diagnosisResult.environmentalData.humidity);

      if (!isNaN(temperature)) {
        diagnosisResult.environmentalData.temperature = temperature.toFixed(1);
      }
      if (!isNaN(humidity)) {
        diagnosisResult.environmentalData.humidity = humidity.toFixed(1);
      }
    }

    return diagnosisResult;
  } catch (error: any) {
    console.error('Error fetching diagnosis details:', error);

    // Log more details about network errors
    if (error.response) {
      console.error('Server responded with error:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server');
    }

    throw error;
  }
};