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
import { FarmLocation } from "@/types/location"; // Import shared type

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
  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalFarms: 0,
    earlyBlightCount: 0,
    lateBlightCount: 0,
    highRiskCount: 0
  });

  const mapCenter: LatLngExpression = [1.3733, 32.2903]; // Uganda center

  useEffect(() => {
    const fetchFarmLocations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/map/farm-locations");
        setFarmLocations(response.data.locations);

        const totalFarms = response.data.locations.length;
        const earlyBlightFarms = response.data.locations.filter(
          (farm: FarmLocation) =>
            farm.environmentalData.blightType === "Early Blight"
        ).length;
        const lateBlightFarms = response.data.locations.filter(
          (farm: FarmLocation) =>
            farm.environmentalData.blightType === "Late Blight"
        ).length;
        const highRiskFarms = response.data.locations.filter(
          (farm: FarmLocation) =>
            ["High", "Critical"].includes(farm.environmentalData.riskLevel)
        ).length;

        setStats({
          totalFarms,
          earlyBlightCount: earlyBlightFarms,
          lateBlightCount: lateBlightFarms,
          highRiskCount: highRiskFarms
        });
      } catch (err: any) {
        console.error("Error fetching farm locations:", err);
        setError(err.message || "Failed to load farm locations");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmLocations();
  }, []);

  const getMarkerColor = (data: FarmLocation["environmentalData"]) => {
    const { riskLevel, blightType } = data;

    // Simplified color scheme that matches the legend
    if (blightType === "Early Blight") {
      return "#FF8C00"; // Match the legend color for Early Blight
    }

    if (blightType === "Late Blight") {
      return "#9370DB"; // Match the legend color for Late Blight
    }

    return "#32CD32"; // Healthy - match the legend color
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
          <MapContainer style={{ height: "100%", width: "100%" }}>
            <MapSetup center={mapCenter} zoom={7} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {farmLocations.map((farm) => {
              const markerOptions: PathOptions = {
                fillColor: getMarkerColor(farm.environmentalData),
                color: "#fff",
                weight: 1,
                fillOpacity: 0.8,
                radius: getMarkerSize(farm.environmentalData.riskLevel)
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
                    {farm.farmer.firstName} {farm.farmer.lastName}
                    {farm.location.district
                      ? ` - ${farm.location.district}`
                      : ""}
                    <br />
                    {farm.environmentalData.blightType} (
                    {farm.environmentalData.riskLevel} Risk)
                  </Tooltip>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-semibold">
                        {farm.farmer.firstName} {farm.farmer.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {farm.location.name}, {farm.location.district}
                      </p>

                      <div className="mt-2 p-2 rounded bg-gray-50">
                        <div className="flex items-center justify-between text-sm">
                          <span
                            className={`font-medium ${
                              farm.environmentalData.riskLevel === "High" ||
                              farm.environmentalData.riskLevel === "Critical"
                                ? "text-red-600"
                                : "text-amber-600"
                            }`}
                          >
                            {farm.environmentalData.blightType}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              farm.environmentalData.riskLevel === "Critical"
                                ? "bg-red-100 text-red-800"
                                : farm.environmentalData.riskLevel === "High"
                                ? "bg-orange-100 text-orange-800"
                                : farm.environmentalData.riskLevel === "Medium"
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
                          <span>{farm.environmentalData.temperature}°C</span>
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
