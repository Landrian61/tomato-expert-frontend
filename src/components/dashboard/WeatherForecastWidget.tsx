import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  Thermometer, 
  Droplets,
  Wind
} from "lucide-react";

interface WeatherData {
  date: string;
  temperature: {
    max: number;
    min: number;
  };
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  blightRisk: 'low' | 'medium' | 'high';
}

const WeatherForecastWidget = () => {
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<WeatherData[]>([]);

  useEffect(() => {
    fetchWeatherForecast();
  }, []);

  const fetchWeatherForecast = async () => {
    try {
      setLoading(true);
      // Simulate API call - in real implementation, this would call weather API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock 5-day forecast
      const mockForecast: WeatherData[] = Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        const temp = 20 + Math.random() * 15;
        const humidity = 50 + Math.random() * 40;
        const precipitation = Math.random() * 10;
        
        let condition: WeatherData['condition'] = 'sunny';
        if (precipitation > 7) condition = 'stormy';
        else if (precipitation > 3) condition = 'rainy';
        else if (humidity > 80) condition = 'cloudy';
        
        let blightRisk: WeatherData['blightRisk'] = 'low';
        if (humidity > 80 && temp > 20 && temp < 30) blightRisk = 'high';
        else if (humidity > 70 && temp > 15) blightRisk = 'medium';
        
        return {
          date: date.toISOString(),
          temperature: {
            max: Math.round(temp + 5),
            min: Math.round(temp - 5)
          },
          humidity: Math.round(humidity),
          precipitation: Math.round(precipitation * 10) / 10,
          windSpeed: Math.round((5 + Math.random() * 15) * 10) / 10,
          condition,
          blightRisk
        };
      });
      
      setForecast(mockForecast);
    } catch (error) {
      console.error("Failed to fetch weather forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case 'stormy':
        return <CloudSnow className="h-5 w-5 text-purple-500" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 text-xs">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 text-xs">High Risk</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Unknown</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">5-Day Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {forecast.map((day, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getWeatherIcon(day.condition)}
                  <div>
                    <p className="font-medium text-sm">{formatDate(day.date)}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Thermometer className="h-3 w-3" />
                        {day.temperature.min}°-{day.temperature.max}°C
                      </span>
                      <span className="flex items-center gap-1">
                        <Droplets className="h-3 w-3" />
                        {day.humidity}%
                      </span>
                      <span className="flex items-center gap-1">
                        <Wind className="h-3 w-3" />
                        {day.windSpeed} km/h
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getRiskBadge(day.blightRisk)}
                  {day.precipitation > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      {day.precipitation}mm rain
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherForecastWidget;