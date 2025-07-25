import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  RefreshCw,
  Calendar
} from 'lucide-react';
import { getWeatherForecast, WeatherForecast } from '@/services/farmStatsService';

const WeatherForecastWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherForecast(5);
      setForecast(data);
    } catch (err) {
      console.error('Error fetching weather forecast:', err);
      setError('Failed to load weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const getWeatherIcon = (description: string, rainfall: number) => {
    if (rainfall > 0) {
      return <CloudRain className="h-5 w-5 text-blue-500" />;
    }
    if (description.toLowerCase().includes('cloud')) {
      return <Cloud className="h-5 w-5 text-gray-500" />;
    }
    return <Sun className="h-5 w-5 text-yellow-500" />;
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return 'bg-tomato text-white';
      case 'Medium':
        return 'bg-warning-dark text-white';
      case 'Low':
        return 'bg-plant text-white';
      default:
        return 'bg-muted';
    }
  };

  const formatDate = (dateString: string, index: number) => {
    const date = new Date(dateString);
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-destructive text-sm mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchForecast}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Day Forecast
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchForecast}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getWeatherIcon(day.description, day.rainfall)}
                <div>
                  <p className="font-medium text-sm">
                    {formatDate(day.date, index)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {day.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Temperature */}
                <div className="flex items-center gap-1">
                  <Thermometer className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">
                    {day.temperature.max}°/{day.temperature.min}°
                  </span>
                </div>

                {/* Humidity */}
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span className="text-sm">{day.humidity}%</span>
                </div>

                {/* Rainfall */}
                {day.rainfall > 0 && (
                  <div className="flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-600" />
                    <span className="text-sm">{day.rainfall}mm</span>
                  </div>
                )}

                {/* Risk Level */}
                <Badge className={`text-xs ${getRiskBadgeColor(day.riskLevel)}`}>
                  {day.riskLevel}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-4 p-3 rounded-md bg-muted/30 border border-dashed">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">High risk days:</span>
            <span className="font-medium">
              {forecast.filter(day => day.riskLevel === 'High').length} of 5
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Total rainfall expected:</span>
            <span className="font-medium">
              {forecast.reduce((sum, day) => sum + day.rainfall, 0).toFixed(1)}mm
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecastWidget;