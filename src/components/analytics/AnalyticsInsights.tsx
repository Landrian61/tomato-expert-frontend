import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/authService";
import { toast } from "sonner";
import {
  Lightbulb,
  AlertTriangle,
  Calendar,
  ArrowRight,
  AlertCircle,
  Activity,
  CheckCircle,
  Bug,
  Sprout,
  Droplets,
  CloudRain,
  Thermometer,
  Info
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnalyticsInsightsProps {
  environmentalData: any;
  farmerLocation: any;
}

const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({
  environmentalData,
  farmerLocation
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [blightStats, setBlightStats] = useState({
    currentRisk: 0,
    weeklyRiskChange: 0,
    seasonalRisk: 0,
    farmHealth: 0
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (environmentalData && farmerLocation) {
      fetchInsights();
    } else {
      setError(
        "Missing environmental data or farm location. Please make sure your farm location is set correctly."
      );
      setLoading(false);
    }
  }, [environmentalData, farmerLocation]);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass environmental data and location for more personalized insights
      const response = await api.get("/analytics/insights", {
        params: {
          farmerId: farmerLocation?.id,
          latitude: farmerLocation?.location?.latitude,
          longitude: farmerLocation?.location?.longitude
        }
      });

      if (response.data && response.status === 200) {
        setInsights(response.data.insights || []);
        setRecommendations(response.data.recommendations || []);
        setBlightStats(
          response.data.stats || {
            currentRisk: 0,
            weeklyRiskChange: 0,
            seasonalRisk: 0,
            farmHealth: 0
          }
        );
      } else {
        setError("Couldn't retrieve analytic insights from the server.");
        toast.error("Failed to load insights data");
      }
    } catch (error: any) {
      console.error("Error fetching insights:", error);
      setError(error.response?.data?.message || "Failed to load insights data");
      toast.error("Failed to load insights data");

      // Generate some mock data if API fails
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    // Create placeholder stats
    setBlightStats({
      currentRisk: 35,
      weeklyRiskChange: 5,
      seasonalRisk: 40,
      farmHealth: 75
    });

    // Create placeholder insights
    setInsights([
      {
        type: "warning",
        title: "Increased Humidity Alert",
        description:
          "Humidity levels have increased by 15% in the past week, creating favorable conditions for fungal growth.",
        icon: "AlertTriangle"
      },
      {
        type: "info",
        title: "Optimal Growing Period",
        description:
          "Current temperature ranges are optimal for tomato growth. Maintain adequate watering schedule.",
        icon: "Lightbulb"
      }
    ]);

    // Create placeholder recommendations
    setRecommendations([
      {
        title: "Apply Preventative Fungicide",
        description:
          "Apply copper-based fungicide as a preventative measure against early blight development.",
        priority: "medium",
        category: "treatment"
      },
      {
        title: "Improve Air Circulation",
        description:
          "Prune excess foliage to improve air circulation and reduce humidity around plants.",
        priority: "high",
        category: "cultural"
      }
    ]);
  };

  // Icon component for insights
  const InsightIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case "AlertCircle":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "AlertTriangle":
        return <AlertTriangle className="h-4 w-4 text-warning-dark" />;
      case "Lightbulb":
        return <Lightbulb className="h-4 w-4 text-warning-light" />;
      case "Calendar":
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case "Activity":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "CheckCircle":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Droplets":
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case "Thermometer":
        return <Thermometer className="h-4 w-4 text-tomato" />;
      case "CloudRain":
        return <CloudRain className="h-4 w-4 text-blue-400" />;
      default:
        return <Lightbulb className="h-4 w-4 text-warning-light" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInsights}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" />
              Blight Risk Assessment
            </CardTitle>
            <CardDescription className="text-[10px]">
              Current and historical risk metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Current Risk</span>
                <span className="text-xs font-medium">
                  {Math.round(blightStats.currentRisk)}%
                </span>
              </div>
              <Progress value={blightStats.currentRisk} className="h-1.5" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Weekly Change</span>
                <span
                  className={`text-xs font-medium ${
                    blightStats.weeklyRiskChange > 0
                      ? "text-destructive"
                      : "text-green-600"
                  }`}
                >
                  {blightStats.weeklyRiskChange > 0 ? "+" : ""}
                  {Math.round(blightStats.weeklyRiskChange)}%
                </span>
              </div>
              <Progress
                value={50 + blightStats.weeklyRiskChange * 1.5}
                className="h-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Seasonal Risk</span>
                <span className="text-xs font-medium">
                  {Math.round(blightStats.seasonalRisk)}%
                </span>
              </div>
              <Progress value={blightStats.seasonalRisk} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1.5">
              <Sprout className="h-3.5 w-3.5 text-plant" />
              Farm Health Index
            </CardTitle>
            <CardDescription className="text-[10px]">
              Overall plant health and resilience
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-plant stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={Math.PI * 80}
                    strokeDashoffset={
                      Math.PI * 80 * (1 - blightStats.farmHealth / 100)
                    }
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold">
                    {Math.round(blightStats.farmHealth)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Health Score
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Insights */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Key Insights & Alerts</h3>

        {insights.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
              <p className="text-xs text-muted-foreground">
                No critical insights at this time. Your farm is running
                smoothly!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <Alert
                key={index}
                className={
                  insight.type === "critical"
                    ? "bg-red-50 border-red-200 p-3"
                    : insight.type === "warning"
                    ? "bg-amber-50 border-amber-200 p-3"
                    : insight.type === "success"
                    ? "bg-green-50 border-green-200 p-3"
                    : "bg-blue-50 border-blue-200 p-3"
                }
              >
                <InsightIcon icon={insight.icon} />
                <AlertTitle
                  className={
                    insight.type === "critical"
                      ? "text-red-800 text-sm"
                      : insight.type === "warning"
                      ? "text-amber-800 text-sm"
                      : insight.type === "success"
                      ? "text-green-800 text-sm"
                      : "text-blue-800 text-sm"
                  }
                >
                  {insight.title}
                </AlertTitle>
                <AlertDescription className="text-muted-foreground text-xs">
                  {insight.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Recommendations</h3>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Info className="h-6 w-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                No specific recommendations at this time.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-3`}
          >
            {recommendations.map((recommendation, index) => (
              <Card key={index} className="border border-dashed">
                <CardHeader className="pb-2 pt-3 px-3">
                  <div className="flex justify-between items-start gap-1.5">
                    <CardTitle className="text-sm">
                      {recommendation.title}
                    </CardTitle>
                    <Badge
                      className={
                        recommendation.priority === "high"
                          ? "bg-red-100 text-red-800 text-[10px] h-5"
                          : recommendation.priority === "medium"
                          ? "bg-amber-100 text-amber-800 text-[10px] h-5"
                          : "bg-blue-100 text-blue-800 text-[10px] h-5"
                      }
                    >
                      {recommendation.priority.charAt(0).toUpperCase() +
                        recommendation.priority.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="text-[10px]">
                    {recommendation.category.charAt(0).toUpperCase() +
                      recommendation.category.slice(1)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    {recommendation.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-muted/30">
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center">
              <Bug className="h-4 w-4 mr-2 text-warning-dark" />
              <span className="text-xs">View treatment guide</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/resources")}
              className="h-7 px-2 py-1"
            >
              <span className="text-xs">View</span>{" "}
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsInsights;
