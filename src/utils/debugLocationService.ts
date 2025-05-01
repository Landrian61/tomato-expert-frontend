import { api } from "@/services/authService";

/**
 * Debug utility for location issues
 */
export const debugLocationService = {
  // Test and fix location data
  async diagnoseAndFixLocation() {
    console.group("🔍 Location Diagnostics");
    console.log("Starting location diagnostics...");
    
    let locationFound = false;
    let currentLocation = null;
    
    // Step 1: Check if location exists in profile
    try {
      console.log("Step 1: Checking profile for location data");
      const profileResponse = await api.get("/api/user");
      
      if (
        profileResponse.data?.defaultLocation?.latitude &&
        profileResponse.data?.defaultLocation?.longitude
      ) {
        console.log("✅ Location found in profile:", profileResponse.data.defaultLocation);
        currentLocation = profileResponse.data.defaultLocation;
        locationFound = true;
      } else {
        console.log("❌ No location in profile");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
    
    // Step 2: Check the location endpoints
    try {
      console.log("Step 2: Testing direct location endpoint");
      const locationResponse = await api.get("/api/map/my-location");
      
      if (locationResponse.data?.location) {
        console.log("✅ Location endpoint working:", locationResponse.data.location);
        if (!locationFound) {
          currentLocation = {
            latitude: locationResponse.data.location.latitude,
            longitude: locationResponse.data.location.longitude
          };
          locationFound = true;
        }
      } else {
        console.log("❌ Location endpoint returned no location data");
      }
    } catch (error) {
      console.error("Location endpoint failed:", error);
    }
    
    // Step 3: Check the farm locations endpoint
    try {
      console.log("Step 3: Testing farm locations endpoint");
      const locationsResponse = await api.get("/api/map/farm-locations");
      
      const selfLocation = locationsResponse.data?.locations?.find(
        (loc: any) => loc.isSelf === true
      );
      
      if (selfLocation) {
        console.log("✅ Found self location in farm locations:", selfLocation);
        if (!locationFound) {
          currentLocation = {
            latitude: selfLocation.location.latitude,
            longitude: selfLocation.location.longitude
          };
          locationFound = true;
        }
      } else {
        console.log("❌ No self location in farm locations response");
      }
    } catch (error) {
      console.error("Farm locations endpoint failed:", error);
    }
    
    // Step 4: If location is found but not properly saved, fix it
    if (locationFound && currentLocation) {
      console.log("Step 4: Location found, ensuring it's saved properly");
      
      try {
        console.log("Updating location using environmental endpoint");
        await api.post("/api/environmental/location", currentLocation);
        console.log("✅ Updated location via environmental endpoint");
      } catch (error) {
        console.error("Failed to update via environmental endpoint:", error);
        
        try {
          console.log("Trying user update endpoint as fallback");
          await api.put("/api/user/update", { defaultLocation: currentLocation });
          console.log("✅ Updated location via user update endpoint");
        } catch (fallbackError) {
          console.error("Failed to update via user endpoint:", fallbackError);
          
          try {
            console.log("Trying dedicated user location endpoint as last resort");
            await api.post("/api/user/location", currentLocation);
            console.log("✅ Updated location via dedicated location endpoint");
          } catch (lastError) {
            console.error("All location update methods failed:", lastError);
          }
        }
      }
      
      // Verify the update worked
      try {
        console.log("Verifying location update");
        const profileResponse = await api.get("/api/user");
        
        if (
          profileResponse.data?.defaultLocation?.latitude &&
          profileResponse.data?.defaultLocation?.longitude
        ) {
          console.log("✅ Location verified in profile:", profileResponse.data.defaultLocation);
        } else {
          console.log("❌ Location still not in profile after updates");
        }
      } catch (error) {
        console.error("Failed to verify location update:", error);
      }
    } else {
      console.log("❌ No location data found to fix");
    }
    
    console.log("Location diagnostics completed.");
    console.groupEnd();
    
    return {
      locationFound,
      location: currentLocation,
      fixAttempted: locationFound
    };
  },
  
  // Set a default location for testing
  async setDefaultTestLocation() {
    const testLocation = {
      latitude: 0.3321,
      longitude: 32.5705
    };
    
    console.log("Setting default test location:", testLocation);
    
    try {
      // Try all possible endpoints
      try {
        await api.post("/api/environmental/location", testLocation);
        console.log("✅ Updated via environmental endpoint");
      } catch (error) {
        console.error("Environmental endpoint failed:", error);
      }
      
      try {
        await api.put("/api/user/update", { defaultLocation: testLocation });
        console.log("✅ Updated via user update endpoint");
      } catch (error) {
        console.error("User update endpoint failed:", error);
      }
      
      try {
        await api.post("/api/user/location", testLocation);
        console.log("✅ Updated via dedicated location endpoint");
      } catch (error) {
        console.error("Dedicated endpoint failed:", error);
      }
      
      return { success: true, location: testLocation };
    } catch (error) {
      console.error("Failed to set default location:", error);
      return { success: false, error };
    }
  }
};

// Add to window for console access
if (typeof window !== 'undefined') {
  (window as any).fixMyLocation = debugLocationService.diagnoseAndFixLocation;
  (window as any).setTestLocation = debugLocationService.setDefaultTestLocation;
}
