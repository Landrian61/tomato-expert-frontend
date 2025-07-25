import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle
} from "lucide-react";

interface WeatherDay {
  date: string;
  day: string;
  high: number;
  low: number;
  humidity: number;
  precipitation: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy";
  blightRisk: "low" | "medium" | "high";
}

interface WeatherForecastWidgetProps {
  days?: WeatherDay[];
}

const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({
  days = mockWeatherData
}) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case "stormy":
        return <CloudSnow className="h-6 w-6 text-gray-700" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-plant text-white">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-warning-dark text-white">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-tomato text-white">High Risk</Badge>;
      default:
        return <Badge>{risk}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wind className="h-5 w-5 text-blue-500" />
          5-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {days.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              {/* Date and Day */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{day.day}</p>
                <p className="text-xs text-muted-foreground">{day.date}</p>
              </div>

              {/* Weather Icon */}
              <div className="flex-shrink-0 mx-3">
                {getWeatherIcon(day.condition)}
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-1 min-w-0">
                <Thermometer className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm font-medium">{day.high}°</span>
                <span className="text-xs text-muted-foreground">/{day.low}°</span>
              </div>

              {/* Humidity and Precipitation */}
              <div className="flex items-center gap-2 ml-3">
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span className="text-xs">{day.humidity}%</span>
                </div>
                {day.precipitation > 0 && (
                  <div className="flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-600" />
                    <span className="text-xs">{day.precipitation}mm</span>
                  </div>
                )}
              </div>

              {/* Blight Risk */}
              <div className="ml-3">
                {getRiskBadge(day.blightRisk)}
              </div>
            </div>
          ))}
        </div>

        {/* Weather Alert */}
        <div className="mt-4 p-3 bg-warning-light/10 border border-warning-light rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning-dark mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-dark">
                Weather Alert
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                High humidity and precipitation expected tomorrow. Monitor plants
                closely for early blight symptoms.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for development/testing
const mockWeatherData: WeatherDay[] = [
  {
    date: "Jan 25",
    day: "Today",
    high: 28,
    low: 19,
    humidity: 72,
    precipitation: 0,
    condition: "sunny",
    blightRisk: "low"
  },
  {
    date: "Jan 26",
    day: "Tomorrow",
    high: 26,
    low: 18,
    humidity: 85,
    precipitation: 2.3,
    condition: "rainy",
    blightRisk: "high"
  },
  {
    date: "Jan 27",
    day: "Sun",
    high: 24,
    low: 17,
    humidity: 78,
    precipitation: 1.2,
    condition: "cloudy",
    blightRisk: "medium"
  },
  {
    date: "Jan 28",
    day: "Mon",
    high: 27,
    low: 20,
    humidity: 68,
    precipitation: 0,
    condition: "sunny",
    blightRisk: "low"
  },
  {
    date: "Jan 29",
    day: "Tue",
    high: 29,
    low: 21,
    humidity: 65,
    precipitation: 0,
    condition: "sunny",
    blightRisk: "low"
  }
];

export default WeatherForecastWidget;