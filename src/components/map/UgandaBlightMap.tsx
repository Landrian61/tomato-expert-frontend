import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "@/services/apiService"; // Updated import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Leaf, CloudRain, Thermometer, Droplets } from "lucide-react";
import { LatLngExpression, PathOptions } from "leaflet";
import { FarmLocation } from "@/types/location";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

// Create a separate map setup component to avoid TypeScript issues
const MapSetup: React.FC<{ center: LatLngExpression; zoom: number }> = ({
  center,
  zoom
}) => {
  const map = useMap();

  // Set view on component mount
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const UgandaBlightMap: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMarkers, setShowMarkers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalFarms: 0,
    earlyBlightCount: 0,
    lateBlightCount: 0,
    highRiskCount: 0
  });

  const mapCenter: LatLngExpression = [1.3733, 32.2903]; // Uganda center

  // After map loads
  useEffect(() => {
    // Delay marker rendering to improve initial load time
    const timer = setTimeout(() => {
      setShowMarkers(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchFarmLocations = async () => {
      try {
        setLoading(true);

        // Use public endpoint if on landing page or not authenticated
        const endpoint =
          isLandingPage || !isAuthenticated
            ? "/map/public-farm-locations"
            : "/map/farm-locations";

        // Handle potential errors for public access
        try {
          const response = await api.get(endpoint);
          setFarmLocations(response.data.locations);

          // Calculate stats from the data
          const totalFarms = response.data.locations.length;
          const earlyBlightFarms = response.data.locations.filter(
            (farm: FarmLocation) =>
              farm.environmentalData?.blightType === "Early Blight"
          ).length;
          const lateBlightFarms = response.data.locations.filter(
            (farm: FarmLocation) =>
              farm.environmentalData?.blightType === "Late Blight"
          ).length;
          const highRiskFarms = response.data.locations.filter(
            (farm: FarmLocation) =>
              farm.environmentalData &&
              ["High", "Critical"].includes(farm.environmentalData.riskLevel)
          ).length;

          setStats({
            totalFarms,
            earlyBlightCount: earlyBlightFarms,
            lateBlightCount: lateBlightFarms,
            highRiskCount: highRiskFarms
          });
        } catch (apiError: any) {
          console.error(`Error fetching from ${endpoint}:`, apiError);

          // If public endpoint fails, try using a sample dataset for the landing page
          if (isLandingPage || !isAuthenticated) {
            console.log("Using sample data for public display");
            // Sample data for demonstration
            const sampleData = generateSampleFarmLocations();
            setFarmLocations(sampleData);

            // Calculate stats from sample data
            const totalFarms = sampleData.length;
            const earlyBlightFarms = sampleData.filter(
              (farm) => farm.environmentalData?.blightType === "Early Blight"
            ).length;
            const lateBlightFarms = sampleData.filter(
              (farm) => farm.environmentalData?.blightType === "Late Blight"
            ).length;
            const highRiskFarms = sampleData.filter(
              (farm) =>
                farm.environmentalData &&
                ["High", "Critical"].includes(farm.environmentalData.riskLevel)
            ).length;

            setStats({
              totalFarms,
              earlyBlightCount: earlyBlightFarms,
              lateBlightCount: lateBlightFarms,
              highRiskCount: highRiskFarms
            });
          } else if (
            apiError.response?.status === 401 ||
            apiError.response?.status === 403
          ) {
            // If authenticated endpoint fails with auth error, try public endpoint
            try {
              const publicResponse = await api.get(
                "/api/map/public-farm-locations"
              );
              setFarmLocations(publicResponse.data.locations);

              // Calculate stats from the data
              const totalFarms = publicResponse.data.locations.length;
              const earlyBlightFarms = publicResponse.data.locations.filter(
                (farm: FarmLocation) =>
                  farm.environmentalData?.blightType === "Early Blight"
              ).length;
              const lateBlightFarms = publicResponse.data.locations.filter(
                (farm: FarmLocation) =>
                  farm.environmentalData?.blightType === "Late Blight"
              ).length;
              const highRiskFarms = publicResponse.data.locations.filter(
                (farm: FarmLocation) =>
                  farm.environmentalData &&
                  ["High", "Critical"].includes(
                    farm.environmentalData.riskLevel
                  )
              ).length;

              setStats({
                totalFarms,
                earlyBlightCount: earlyBlightFarms,
                lateBlightCount: lateBlightFarms,
                highRiskCount: highRiskFarms
              });
            } catch (fallbackError) {
              throw fallbackError;
            }
          } else {
            throw apiError;
          }
        }
      } catch (err: any) {
        console.error("Error fetching farm locations:", err);
        setError(err.message || "Failed to load farm locations");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmLocations();
  }, [isAuthenticated, isLandingPage]);

  // Helper function to generate sample farm location data for fallback
  const generateSampleFarmLocations = (): FarmLocation[] => {
    // Uganda region centers
    const regions = [
      { lat: 0.3476, lng: 32.5825, name: "Central" }, // Kampala
      { lat: 1.7122, lng: 33.6119, name: "Eastern" }, // Soroti
      { lat: -0.6167, lng: 30.65, name: "Western" }, // Mbarara
      { lat: 2.7747, lng: 32.2992, name: "Northern" } // Gulu
    ];

    const farmLocations: FarmLocation[] = [];

    // Generate 20 sample farms across Uganda regions
    for (let i = 0; i < 20; i++) {
      const region = regions[i % regions.length];
      // Add some randomness to location
      const latitude = region.lat + (Math.random() - 0.5) * 0.5;
      const longitude = region.lng + (Math.random() - 0.5) * 0.5;

      // Properly typed arrays to match the expected string literal types
      const riskLevels: Array<"Low" | "Medium" | "High" | "Critical"> = [
        "Low",
        "Medium",
        "High",
        "Critical"
      ];
      const blightTypes: Array<"Healthy" | "Early Blight" | "Late Blight"> = [
        "Healthy",
        "Early Blight",
        "Late Blight"
      ];

      const riskIndex = Math.floor(Math.random() * riskLevels.length);
      const blightIndex = Math.floor(Math.random() * blightTypes.length);
      const cri = 20 + Math.floor(Math.random() * 80); // 20-100

      farmLocations.push({
        id: `sample-${i}`,
        farmer: {
          firstName: `Farmer`,
          lastName: `${i + 1}`
        },
        location: {
          latitude,
          longitude,
          district: region.name,
          name: `Sample Farm ${i + 1}`
        },
        isSelf: false,
        environmentalData: {
          cri,
          riskLevel: riskLevels[riskIndex],
          blightType: blightTypes[blightIndex],
          temperature: 20 + Math.floor(Math.random() * 10),
          humidity: 50 + Math.floor(Math.random() * 40),
          rainfall: Math.floor(Math.random() * 5 * 10) / 10,
          soilMoisture: 30 + Math.floor(Math.random() * 50)
        }
      });
    }

    return farmLocations;
  };

  const getMarkerColor = (data: FarmLocation["environmentalData"]) => {
    if (!data) return "#CCCCCC"; // Default gray for missing data

    const { blightType } = data;

    // Simplified color scheme that matches the legend
    if (blightType === "Early Blight") {
      return "#FF8C00";
    }

    if (blightType === "Late Blight") {
      return "#9370DB";
    }

    return "#32CD32"; // Healthy
  };

  const getMarkerSize = (riskLevel: string) => {
    switch (riskLevel) {
      case "Critical":
        return 12;
      case "High":
        return 10;
      case "Medium":
        return 8;
      default:
        return 6;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tomato Blight Risk Map</CardTitle>
          <CardDescription>
            Loading farm locations across Uganda...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] rounded-md overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tomato Blight Risk Map</CardTitle>
          <CardDescription className="text-red-500">
            Error: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-plant" />
          Tomato Blight Risk Map
        </CardTitle>
        <CardDescription>
          Monitoring {stats.totalFarms} farms across Uganda
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Early Blight: {stats.earlyBlightCount} farms
          </Badge>
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Late Blight: {stats.lateBlightCount} farms
          </Badge>
          <Badge variant="outline" className="bg-red-100 text-red-800">
            High Risk Areas: {stats.highRiskCount} farms
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px] rounded-md overflow-hidden border">
          <MapContainer
            {...({ center: mapCenter, zoom: 7 } as any)}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {showMarkers &&
              farmLocations.map((farm) => {
                const markerOptions: PathOptions = {
                  fillColor: getMarkerColor(farm.environmentalData || null),
                  color: "#fff",
                  weight: 1,
                  fillOpacity: 0.8,
                  radius: getMarkerSize(
                    farm.environmentalData?.riskLevel || "Low"
                  )
                };

                return (
                  <CircleMarker
                    key={farm.id}
                    center={
                      [
                        farm.location.latitude,
                        farm.location.longitude
                      ] as LatLngExpression
                    }
                    pathOptions={markerOptions}
                  >
                    <Tooltip>
                      {farm.farmer
                        ? `${farm.farmer.firstName} ${farm.farmer.lastName}`
                        : "Farm"}
                      {farm.location.district
                        ? ` - ${farm.location.district}`
                        : ""}
                      <br />
                      {farm.environmentalData?.blightType || "Unknown"} (
                      {farm.environmentalData?.riskLevel || "Unknown"} Risk)
                    </Tooltip>
                    <Popup>
                      <div className="p-1">
                        <h3 className="font-semibold">
                          {farm.farmer
                            ? `${farm.farmer.firstName} ${farm.farmer.lastName}`
                            : "Farm Location"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {farm.location.name || ""},{" "}
                          {farm.location.district || "Unknown"}
                        </p>

                        {farm.environmentalData ? (
                          <>
                            <div className="mt-2 p-2 rounded bg-gray-50">
                              <div className="flex items-center justify-between text-sm">
                                <span
                                  className={`font-medium ${
                                    farm.environmentalData.riskLevel ===
                                      "High" ||
                                    farm.environmentalData.riskLevel ===
                                      "Critical"
                                      ? "text-red-600"
                                      : "text-amber-600"
                                  }`}
                                >
                                  {farm.environmentalData.blightType}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs ${
                                    farm.environmentalData.riskLevel ===
                                    "Critical"
                                      ? "bg-red-100 text-red-800"
                                      : farm.environmentalData.riskLevel ===
                                        "High"
                                      ? "bg-orange-100 text-orange-800"
                                      : farm.environmentalData.riskLevel ===
                                        "Medium"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {farm.environmentalData.riskLevel} Risk (CRI:{" "}
                                  {farm.environmentalData.cri.toFixed(1)})
                                </span>
                              </div>
                            </div>

                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <Thermometer className="h-3 w-3" />
                                <span>
                                  {farm.environmentalData.temperature}°C
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Droplets className="h-3 w-3" />
                                <span>{farm.environmentalData.humidity}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CloudRain className="h-3 w-3" />
                                <span>{farm.environmentalData.rainfall}mm</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Droplets className="h-3 w-3" />
                                <span>
                                  Soil: {farm.environmentalData.soilMoisture}%
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="mt-2 p-2 rounded bg-gray-50">
                            <p className="text-sm text-gray-600">
                              No environmental data available
                            </p>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
          </MapContainer>
        </div>

        <div className="text-xs text-gray-500 mt-1">
          &copy;{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          contributors
        </div>

        <div className="flex flex-wrap justify-between mt-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: "#FF8C00" }}
            ></span>
            <span>Early Blight Risk</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: "#9370DB" }}
            ></span>
            <span>Late Blight Risk</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ backgroundColor: "#32CD32" }}
            ></span>
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-4 h-4 rounded-full inline-block border border-white"
              style={{ backgroundColor: "rgba(255,0,0,0.7)" }}
            ></span>
            <span>Critical Risk</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UgandaBlightMap;
