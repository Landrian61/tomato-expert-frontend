import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Sprout,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Users
} from "lucide-react";

interface FarmStats {
  location: {
    name: string;
    district: string;
    coordinates: string;
  };
  farmInfo: {
    size: string;
    plantsCount: number;
    varietyCount: number;
    lastActivity: string;
  };
  healthMetrics: {
    overallHealth: number;
    diseaseIncidents: number;
    treatmentSuccess: number;
    preventionScore: number;
  };
  recentTrends: {
    healthTrend: "up" | "down" | "stable";
    riskTrend: "up" | "down" | "stable";
    yieldProjection: "up" | "down" | "stable";
  };
}

interface FarmSummaryCardProps {
  farmData?: FarmStats;
}

const FarmSummaryCard: React.FC<FarmSummaryCardProps> = ({
  farmData = mockFarmData
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      case "stable":
        return <Minus className="h-3 w-3 text-gray-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "up":
        return "Improving";
      case "down":
        return "Declining";
      case "stable":
        return "Stable";
      default:
        return "Unknown";
    }
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: "Excellent", color: "bg-green-500" };
    if (score >= 60) return { status: "Good", color: "bg-blue-500" };
    if (score >= 40) return { status: "Fair", color: "bg-yellow-500" };
    return { status: "Needs Attention", color: "bg-red-500" };
  };

  const healthStatus = getHealthStatus(farmData.healthMetrics.overallHealth);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sprout className="h-5 w-5 text-plant" />
          Farm Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location & Basic Info */}
        <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm">{farmData.location.name}</h3>
              <Badge variant="outline" className="text-xs">
                {farmData.location.district}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {farmData.location.coordinates}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Sprout className="h-3 w-3 text-plant" />
                <span>{farmData.farmInfo.plantsCount} plants</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-muted-foreground" />
                <span>{farmData.farmInfo.varietyCount} varieties</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Farm Health</span>
            <Badge className={healthStatus.color}>
              {farmData.healthMetrics.overallHealth}% - {healthStatus.status}
            </Badge>
          </div>
          <Progress 
            value={farmData.healthMetrics.overallHealth} 
            className="h-2 mb-3"
          />
          
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="font-medium text-green-600">
                {farmData.healthMetrics.treatmentSuccess}%
              </div>
              <div className="text-muted-foreground">Treatment Success</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="font-medium text-blue-600">
                {farmData.healthMetrics.preventionScore}%
              </div>
              <div className="text-muted-foreground">Prevention Score</div>
            </div>
            <div className="text-center p-2 bg-muted/30 rounded">
              <div className="font-medium text-orange-600">
                {farmData.healthMetrics.diseaseIncidents}
              </div>
              <div className="text-muted-foreground">This Month</div>
            </div>
          </div>
        </div>

        {/* Recent Trends */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Recent Trends
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-muted-foreground">Plant Health</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(farmData.recentTrends.healthTrend)}
                <span className="text-xs">
                  {getTrendText(farmData.recentTrends.healthTrend)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-muted-foreground">Risk Level</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(farmData.recentTrends.riskTrend)}
                <span className="text-xs">
                  {getTrendText(farmData.recentTrends.riskTrend)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-muted-foreground">Yield Projection</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(farmData.recentTrends.yieldProjection)}
                <span className="text-xs">
                  {getTrendText(farmData.recentTrends.yieldProjection)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="h-3 w-3" />
          <span>Last activity: {farmData.farmInfo.lastActivity}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for development/testing
const mockFarmData: FarmStats = {
  location: {
    name: "Sunrise Tomato Farm",
    district: "Kampala",
    coordinates: "0.3321°N, 32.5705°E"
  },
  farmInfo: {
    size: "2.5 hectares",
    plantsCount: 1240,
    varietyCount: 3,
    lastActivity: "2 hours ago"
  },
  healthMetrics: {
    overallHealth: 78,
    diseaseIncidents: 3,
    treatmentSuccess: 92,
    preventionScore: 85
  },
  recentTrends: {
    healthTrend: "up",
    riskTrend: "stable", 
    yieldProjection: "up"
  }
};

export default FarmSummaryCard;