import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users } from "lucide-react";
import { LatLngExpression, PathOptions } from "leaflet";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FarmLocation } from "@/types/location";

// Map setup component to handle center/zoom
const MapSetup: React.FC<{ center: LatLngExpression; zoom: number }> = ({
  center,
  zoom
}) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, zoom);

    // Add this to force a map resize after component mounts
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, zoom, map]);

  return null;
};

interface FarmerLocationMapProps {
  farmerLocation: FarmLocation | null;
  otherLocations: FarmLocation[];
  loading?: boolean;
}

const FarmerLocationMap: React.FC<FarmerLocationMapProps> = ({
  farmerLocation,
  otherLocations = [],
  loading = false
}) => {
  // Default map center if no location data is available
  const defaultCenter: LatLngExpression = [1.3733, 32.2903]; // Uganda center

  if (loading || !farmerLocation) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            Your Farm Location
          </CardTitle>
          <CardDescription className="text-xs">
            {loading
              ? "Loading your farm location..."
              : "Farm location not available"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="w-full h-[250px] sm:h-[350px]" />
        </CardContent>
      </Card>
    );
  }

  const farmerPosition: LatLngExpression = [
    farmerLocation.location.latitude,
    farmerLocation.location.longitude
  ];

  const getMarkerColor = (data: FarmLocation["environmentalData"]) => {
    const { blightType } = data;
    if (blightType === "Early Blight") return "#FF8C00";
    if (blightType === "Late Blight") return "#9370DB";
    return "#32CD32"; // Healthy
  };

  const getMarkerSize = (riskLevel: string) => {
    switch (riskLevel) {
      case "Critical":
        return 10;
      case "High":
        return 8;
      case "Medium":
        return 6;
      default:
        return 5;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-tomato" />
          Your Farm Location
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Users className="h-3 w-3" />
          <span>Showing you and {otherLocations.length} nearby farms</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[250px] sm:h-[350px] relative">
          {/* Add a key with unique value to force remount of MapContainer when location changes */}
          <MapContainer
            key={`map-${farmerLocation.location.latitude}-${farmerLocation.location.longitude}`}
            style={{ height: "100%", width: "100%" }}
            className="rounded-md overflow-hidden"   
          >
            <MapSetup center={farmerPosition} zoom={10} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Farmer's location with special styling */}
            <CircleMarker
              center={farmerPosition}
              pathOptions={{
                fillColor: getMarkerColor(farmerLocation.environmentalData),
                color: "#fff",
                weight: 2,
                fillOpacity: 0.8,
                radius:
                  getMarkerSize(farmerLocation.environmentalData.riskLevel) + 2
              }}
            >
              <Tooltip>
                <div className="text-xs font-bold">You</div>
              </Tooltip>
              <Popup>
                <div className="p-1 text-sm">
                  <h3 className="font-semibold text-base">Your Farm</h3>
                  <p className="text-xs text-gray-600">
                    {farmerLocation.location.name || "Main Location"}
                    {farmerLocation.location.district
                      ? `, ${farmerLocation.location.district}`
                      : ""}
                  </p>
                  <div className="mt-2 p-2 rounded bg-gray-50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">
                        {farmerLocation.environmentalData.blightType}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          farmerLocation.environmentalData.riskLevel ===
                          "Critical"
                            ? "bg-red-100 text-red-800"
                            : farmerLocation.environmentalData.riskLevel ===
                              "High"
                            ? "bg-orange-100 text-orange-800"
                            : farmerLocation.environmentalData.riskLevel ===
                              "Medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {farmerLocation.environmentalData.riskLevel} (CRI:{" "}
                        {farmerLocation.environmentalData.cri.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>

            {/* Other nearby farm locations */}
            {otherLocations.map((farm) => {
              const markerOptions: PathOptions = {
                fillColor: getMarkerColor(farm.environmentalData),
                color: "#fff",
                weight: 1,
                fillOpacity: 0.6,
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
                    <span className="text-xs">
                      {farm.farmer.firstName} {farm.farmer.lastName}
                    </span>
                  </Tooltip>
                  <Popup>
                    <div className="p-1 text-sm">
                      <h3 className="font-semibold text-xs">
                        {farm.farmer.firstName} {farm.farmer.lastName}
                      </h3>
                      <p className="text-[10px] text-gray-600">
                        {farm.location.name || "Unknown Location"}
                        {farm.location.district
                          ? `, ${farm.location.district}`
                          : ""}
                      </p>
                      <div className="mt-1 p-1.5 rounded bg-gray-50">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            farm.environmentalData.riskLevel === "Critical"
                              ? "bg-red-100 text-red-800"
                              : farm.environmentalData.riskLevel === "High"
                              ? "bg-orange-100 text-orange-800"
                              : farm.environmentalData.riskLevel === "Medium"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {farm.environmentalData.blightType} (
                          {farm.environmentalData.riskLevel})
                        </span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmerLocationMap;
