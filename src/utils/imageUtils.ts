// src/utils/imageUtils.ts

/**
 * Extracts GPS coordinates from image EXIF data if available
 * @param file - The image file to process
 * @returns Promise that resolves to coordinates object if found, null otherwise
 */
export const extractImageCoordinates = (file: File): Promise<{ latitude: number, longitude: number } | null> => {
  return new Promise((resolve) => {
    // Check if we have access to the FileReader API
    if (!window.FileReader) {
      console.log('FileReader API not supported');
      resolve(null);
      return;
    }
    
    // Try to extract EXIF data
    try {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        if (!e.target || !e.target.result) {
          resolve(null);
          return;
        }
        
        // This is a simplified version - real EXIF extraction would be more complex
        // For production, consider using a library like 'exif-js'
        // This implementation is just a placeholder that always returns null
        
        resolve(null);
      };
      
      reader.onerror = function() {
        console.log('Error reading file');
        resolve(null);
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log('Error extracting coordinates:', error);
      resolve(null);
    }
  });
};

/**
 * Compresses an image file by resizing and reducing quality
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels
 * @param quality - JPEG quality (0-1)
 * @returns Promise that resolves to compressed image as a File object
 */
export const compressImage = (file: File, maxWidth = 1024, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        // Create canvas and resize image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Unable to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create a new File from the blob
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

/**
 * Converts an image file to base64 string
 * @param file - The image file to convert
 * @returns Promise that resolves to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
};