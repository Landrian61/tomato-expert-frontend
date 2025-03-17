import { updateUserPhoto } from './authService';

/**
 * Process an image file for upload
 * @param file - The image file to process
 * @returns Base64 encoded image data
 */
const processImageForUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check file type
    if (!file.type.match('image.*')) {
      reject(new Error('Please select an image file'));
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image size should not exceed 5MB'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    // Read file as base64 data URL
    reader.readAsDataURL(file);
  });
};

/**
 * Upload a profile image to the server
 * @param file - The image file to upload
 * @returns Upload result with new profile photo URL
 */
const uploadProfileImage = async (file: File) => {
  try {
    // Process image file to base64
    const imageData = await processImageForUpload(file);
    
    // Upload using authService
    const result = await updateUserPhoto(imageData);
    
    return result;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

/**
 * Upload a diagnosis image
 * @param file - The image file to upload
 * @param metadata - Additional metadata for the image
 * @returns Upload result
 */
const uploadDiagnosisImage = async (file: File, metadata?: Record<string, any>) => {
  try {
    // Process image file to base64
    const imageData = await processImageForUpload(file);
    
    // TODO: Implement diagnosis image upload API once it's ready
    console.log('Diagnosis image would be uploaded with metadata:', metadata);
    
    // Return a placeholder for now
    return {
      url: imageData,
      message: 'Image processed successfully'
    };
  } catch (error) {
    console.error('Error uploading diagnosis image:', error);
    throw error;
  }
};

/**
 * Get placeholder image when offline or loading
 * @returns URL to placeholder image
 */
const getPlaceholderImage = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlMWUxZTEiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZiIgZmlsbD0iIzg4OCI+VXNlcjwvdGV4dD48L3N2Zz4=';
};

export {
  processImageForUpload,
  uploadProfileImage,
  uploadDiagnosisImage,
  getPlaceholderImage
};