import React, { useState, useEffect } from "react";
import { api } from "@/services/apiService";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LocationUpdate: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    district: "",
    farmName: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const fetchUserLocation = async () => {
    try {
      const response = await api.get("/api/user");
      setLocation({
        latitude: response.data.defaultLocation.latitude || "",
        longitude: response.data.defaultLocation.longitude || "",
        district: response.data.district || "",
        farmName: response.data.farmName || ""
      });
    } catch (error: any) {
      console.error("Error fetching user location:", error);
      setError(error.message || "Failed to fetch user location");
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const handleUpdateLocation = async () => {
    try {
      setLoading(true);
      await api.put("/api/user/location", location);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating location:", error);
      setError(error.message || "Failed to update location");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Update Farm Location</CardTitle>
        <CardDescription>
          Please provide accurate details about your farm location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              name="latitude"
              value={location.latitude}
              onChange={handleChange}
              placeholder="Enter latitude"
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              name="longitude"
              value={location.longitude}
              onChange={handleChange}
              placeholder="Enter longitude"
            />
          </div>
          <div>
            <Label htmlFor="district">District</Label>
            <Input
              id="district"
              name="district"
              value={location.district}
              onChange={handleChange}
              placeholder="Enter district"
            />
          </div>
          <div>
            <Label htmlFor="farmName">Farm Name</Label>
            <Input
              id="farmName"
              name="farmName"
              value={location.farmName}
              onChange={handleChange}
              placeholder="Enter farm name"
            />
          </div>
          <Button
            onClick={handleUpdateLocation}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Location"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationUpdate;
