import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { MapPin, RefreshCw } from "lucide-react";
import { updateUserLocation } from "@/services/environmentalDataService";
import { toast } from "sonner";
import { api } from "@/services/authService"; // Changed from '@/services/api' to correct import

interface LocationUpdateProps {
  onLocationUpdated?: () => void;
  refreshProfile?: () => void;
}

const LocationUpdate: React.FC<LocationUpdateProps> = ({
  onLocationUpdated,
  refreshProfile
}) => {
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Get user's current location from profile on component mount
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await api.get("/user");
        const defaultLocation = response.data.defaultLocation;

        if (
          defaultLocation &&
          defaultLocation.latitude &&
          defaultLocation.longitude
        ) {
          setLatitude(defaultLocation.latitude.toString());
          setLongitude(defaultLocation.longitude.toString());
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    fetchUserLocation();
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setIsGettingLocation(false);
        toast.success("Current location fetched successfully");
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error(`Error getting location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      toast.error("Please provide both latitude and longitude");
      return;
    }

    try {
      setIsLoading(true);

      const parsedLatitude = parseFloat(latitude);
      const parsedLongitude = parseFloat(longitude);

      if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
        throw new Error("Latitude and longitude must be valid numbers");
      }

      const locationData = {
        latitude: parsedLatitude,
        longitude: parsedLongitude
      };

      await updateUserLocation(locationData);

      // Call the callbacks if provided
      if (onLocationUpdated) {
        onLocationUpdated();
      }

      toast.success("Location updated successfully!");
    } catch (error: any) {
      console.error("Failed to update location:", error);
      toast.error(
        error.message || "Failed to update location. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-plant" />
          Farm Location
        </CardTitle>
        <CardDescription>
          Update your farm location to get more accurate environmental data and
          disease predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                placeholder="e.g. 0.3321"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="e.g. 32.5705"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleGetCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Use Current Location
                </>
              )}
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-plant hover:bg-plant-dark"
              disabled={isLoading || !latitude || !longitude}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Farm Location"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LocationUpdate;
