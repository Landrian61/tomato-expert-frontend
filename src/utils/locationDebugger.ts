import { api } from "@/services/authService";
import { Coordinates } from "@/types/location";

/**
 * Utility to diagnose and fix location data issues
 */
export const locationDebugger = {
  /**
   * Diagnose location issues
   */
  async diagnoseLocation() {
    console.group("🔍 Location Diagnostics");
    
    // Check local storage
    try {
      const authData = localStorage.getItem("authData");
      if (authData) {
        const parsedData = JSON.parse(authData);
        if (parsedData.user?.defaultLocation) {
          console.log("✅ Location found in localStorage:", parsedData.user.defaultLocation);
        } else {
          console.log("❌ No location in localStorage");
        }
      } else {
        console.log("❌ No auth data in localStorage");
      }
    } catch (error) {
      console.error("Error checking localStorage:", error);
    }
    
    // Check user profile API
    try {
      const userResponse = await api.get("/user");
      if (userResponse.data?.defaultLocation) {
        console.log("✅ Location found in user profile:", userResponse.data.defaultLocation);
      } else {
        console.log("❌ No location in user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
    
    console.groupEnd();
    
    return "Location diagnosis complete. Check console for details.";
  },
  
  /**
   * Update location with test coordinates
   */
  async updateTestLocation() {
    const testLocation: Coordinates = {
      latitude: 0.3321,
      longitude: 32.5705
    };
    
    console.log("Setting test location:", testLocation);
    
    try {
      // Try updating through user profile first
      await api.put("/user/update", {
        defaultLocation: testLocation
      });
      
      console.log("✅ Location updated successfully");
      
      // Also update localStorage
      try {
        const authData = localStorage.getItem("authData");
        if (authData) {
          const parsedData = JSON.parse(authData);
          if (parsedData.user) {
            parsedData.user.defaultLocation = testLocation;
            localStorage.setItem("authData", JSON.stringify(parsedData));
            console.log("✅ localStorage updated");
          }
        }
      } catch (storageError) {
        console.error("Error updating localStorage:", storageError);
      }
      
      return "Location updated. Refresh page to see changes.";
    } catch (error) {
      console.error("Error updating location:", error);
      
      // Try environmental endpoint as fallback
      try {
        await api.post("/environmental/location", testLocation);
        console.log("✅ Location updated via environmental endpoint");
        return "Location updated via fallback method. Refresh page to see changes.";
      } catch (fallbackError) {
        console.error("Fallback update failed:", fallbackError);
        return "Failed to update location. See console for details.";
      }
    }
  }
};

// Add to window for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).diagnoseFarmLocation = locationDebugger.diagnoseLocation;
  (window as any).setTestFarmLocation = locationDebugger.updateTestLocation;
}
