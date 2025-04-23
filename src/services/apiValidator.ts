import { api } from "@/services/authService";

/**
 * Validates that required API endpoints are available
 * @returns Object with validation results
 */
export const validateApiEndpoints = async () => {
  const results = {
    user: false,
    environmental: false,
    map: false
  };
  
  try {
    // Test user endpoint
    try {
      await api.get("/user");
      results.user = true;
    } catch (error) {
      console.error("User API validation failed:", error);
    }
    
    // Test environmental endpoint
    try {
      await api.get("/environmental/latest");
      results.environmental = true;
    } catch (error) {
      console.error("Environmental API validation failed:", error);
    }
    
    // Test map endpoint
    try {
      await api.get("/map/farm-locations");
      results.map = true;
    } catch (error) {
      console.error("Map API validation failed:", error);
    }
    
    return {
      success: Object.values(results).some(value => value === true),
      results,
      message: Object.values(results).every(value => value === true) 
        ? "All APIs validated successfully" 
        : "Some API endpoints failed validation"
    };
  } catch (error) {
    console.error("API validation failed:", error);
    return {
      success: false,
      results,
      message: "API validation failed"
    };
  }
};

// Add to window for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).validateApiEndpoints = validateApiEndpoints;
}
