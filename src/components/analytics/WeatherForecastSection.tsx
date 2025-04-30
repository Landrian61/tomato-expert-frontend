import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/services/authService";
import { toast } from "sonner";
import {
  Cloud,
  CloudRain,
  Sun,
  Droplets,
  Thermometer,
  AlertTriangle,
  Info
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ForecastDay {
  date: string;
  day: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: number;
  rainChance: number;
  rainfall: number;
  description: string;
  icon: string;
  predictedCRI: number;
  blightRisk: {
    level: "Low" | "Medium" | "High" | "Critical";
    type: "Early Blight" | "Late Blight" | "Healthy";
  };
}

const WeatherForecastSection: React.FC = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      // Call the backend API to get forecast data
      const response = await api.get("/environmental/forecast");
  
      if (response.data && response.data.forecast && response.data.forecast.length > 0) {
        // Process data to ensure correct formatting
        const formattedForecast = response.data.forecast.map(day => ({
          ...day,
          // Ensure temperature values have proper formatting
          temperature: {
            min: typeof day.temperature.min === 'number' ? day.temperature.min : parseFloat(day.temperature.min),
            max: typeof day.temperature.max === 'number' ? day.temperature.max : parseFloat(day.temperature.max),
            avg: typeof day.temperature.avg === 'number' ? day.temperature.avg : parseFloat(day.temperature.avg)
          },
          // Ensure humidity is a number
          humidity: typeof day.humidity === 'number' ? day.humidity : parseFloat(day.humidity),
          // Ensure rain values are numbers
          rainChance: typeof day.rainChance === 'number' ? day.rainChance : parseFloat(day.rainChance),
          rainfall: typeof day.rainfall === 'number' ? day.rainfall : parseFloat(day.rainfall),
        }));
        
        setForecast(formattedForecast);
        
        // Show warning if using mock data
        if (response.data.source === "mock") {
          toast.warning("Using demo forecast data. Weather API unavailable.");
        }
        
        setError(null);
      } else {
        setError("No forecast data available. Please check your farm location settings.");
        toast.error("Failed to retrieve forecast data");
      }
    } catch (error: any) {
      console.error("Error fetching forecast:", error);
      
      const errorMessage = error.response?.status === 400
        ? "Your farm location is not set. Please update your profile."
        : error.response?.status === 503
        ? "Weather forecast service is temporarily unavailable."
        : error.response?.data?.message || "Failed to load forecast data";
        
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Icon component for weather conditions
  const WeatherIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case "Sun":
      case "01d":
      case "01n":
        return <Sun className="h-6 w-6 text-amber-500" />;
      case "Cloud":
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return <Cloud className="h-6 w-6 text-gray-400" />;
      case "CloudRain":
      case "09d":
      case "09n":
      case "10d":
      case "10n":
      case "11d":
      case "11n":
        return <CloudRain className="h-6 w-6 text-blue-400" />;
      default:
        return <Cloud className="h-6 w-6 text-gray-400" />;
    }
  };

  // Risk badge component
  const RiskBadge = ({ level, type }: { level: string; type: string }) => {
    let bgColor = "";

    switch (level) {
      case "Critical":
        bgColor = "bg-red-100 text-red-800";
        break;
      case "High":
        bgColor = "bg-orange-100 text-orange-800";
        break;
      case "Medium":
        bgColor = "bg-amber-100 text-amber-800";
        break;
      default:
        bgColor = "bg-green-100 text-green-800";
    }

    return (
      <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${bgColor}`}>
        {level} {type !== "Healthy" ? type : ""} Risk
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-medium">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-medium">5-Day Forecast</h3>
        <Card className="p-4">
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <AlertTriangle className="h-8 w-8 text-warning" />
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchForecast}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (forecast.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-medium">5-Day Forecast</h3>
        <Card className="p-4">
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <Info className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm">No forecast data available.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchForecast}
              className="mt-2"
            >
              Refresh
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">5-Day Forecast</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchForecast}
          className="flex items-center gap-1 h-7 text-xs"
        >
          <Info className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </Button>
      </div>

      <div
        className={`grid ${
          isMobile ? "grid-cols-2 gap-2" : "grid-cols-5 gap-3"
        }`}
      >
        {forecast.map((day, index) => (
          <Card
            key={index}
            className={`${index === 0 ? "border-primary" : ""} p-0`}
          >
            <CardHeader className="pb-1.5 pt-2 px-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm">{day.day}</CardTitle>
                  <CardDescription className="text-[10px]">
                    {day.date}
                  </CardDescription>
                </div>
                <WeatherIcon icon={day.icon} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 px-2 pb-2">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">
                    Temp
                  </span>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-tomato" />
                    <span className="text-xs font-medium">
                      {day.temperature.min.toFixed(1)}° -{" "}
                      {day.temperature.max.toFixed(1)}°C
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    Humidity
                  </span>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-medium">{day.humidity}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    Rain
                  </span>
                  <div className="flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-400" />
                    <span className="text-xs font-medium">
                      {day.rainChance}%
                    </span>
                  </div>
                </div>

                {day.rainfall > 0 && (
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      Amount
                    </span>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium">
                        {day.rainfall.toFixed(1)}mm
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-1 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">CRI</span>
                  <span className="text-xs font-medium">
                    {day.predictedCRI}
                  </span>
                </div>
                <div className="flex justify-center mt-1">
                  <RiskBadge
                    level={day.blightRisk.level}
                    type={day.blightRisk.type}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            Forecast Reliability Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Weather forecasts and blight risk predictions are estimates based on
            current data and models. Accuracy decreases for dates further in the
            future. Always monitor your crops regularly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherForecastSection;
