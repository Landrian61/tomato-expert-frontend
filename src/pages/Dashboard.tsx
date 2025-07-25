import React from "react";
import Layout from "@/components/layout/Layout";
import EnvironmentCard from "@/components/dashboard/EnvironmentCard";
import RiskGauge from "@/components/dashboard/RiskGauge";
import ActionButton from "@/components/dashboard/ActionButton";
import CRITrendChart from "@/components/dashboard/CRITrendChart";
import RecentDiagnosesWidget from "@/components/dashboard/RecentDiagnosesWidget";
import WeatherForecastWidget from "@/components/dashboard/WeatherForecastWidget";
import QuickActionsPanel from "@/components/dashboard/QuickActionsPanel";
import AlertsNotificationCenter from "@/components/dashboard/AlertsNotificationCenter";
import FarmSummaryCard from "@/components/dashboard/FarmSummaryCard";
import RecommendationPanel from "@/components/dashboard/RecommendationPanel";
import { Sprout, AlertTriangle, LineChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnvironmentalData } from "@/hooks/environmentalDataHook";
import { toast } from "sonner";
import CRITrendChartCard from "@/components/dashboard/CRITrendChartCard";

const Dashboard = () => {
  const {
    loading,
    error,
    environmentalData,
    criValue,
    criTrendData,
    riskLevel,
    refreshData
  } = useEnvironmentalData();

  const handleRefresh = async () => {
    toast.info("Refreshing environmental data...");
    await refreshData();
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6 pb-4">
        {error ? (
          <Card className="bg-destructive/10 border-destructive/30">
            <CardContent className="p-4">
              <p className="text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={refreshData}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Farm Summary and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <FarmSummaryCard />
              </div>
              <div>
                <QuickActionsPanel />
              </div>
            </div>

            {/* Environmental Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <EnvironmentCard
                    title="Temperature"
                    value={environmentalData?.temperature.value || "0°C"}
                    icon="temperature"
                    change={environmentalData?.temperature.change}
                    trend={environmentalData?.temperature.trend}
                  />
                  <EnvironmentCard
                    title="Humidity"
                    value={environmentalData?.humidity.value || "0%"}
                    icon="humidity"
                    change={environmentalData?.humidity.change}
                    trend={environmentalData?.humidity.trend}
                  />
                  <EnvironmentCard
                    title="Soil Moisture"
                    value={environmentalData?.soilMoisture.value || "0%"}
                    icon="moisture"
                    change={environmentalData?.soilMoisture.change}
                    trend={environmentalData?.soilMoisture.trend}
                  />
                </>
              )}
            </div>

            {/* Risk Gauge and CRI Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                <>
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-48 w-full" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <Skeleton className="h-48 w-full" />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <RiskGauge value={criValue || 0} />
                  <CRITrendChartCard
                    period="week"
                    showTrend={true}
                    title="Blight Risk Trend"
                  />
                </>
              )}
            </div>

            {/* Weather Forecast and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeatherForecastWidget />
              <AlertsNotificationCenter />
            </div>

            {/* AI Recommendations */}
            <div className="grid grid-cols-1">
              <RecommendationPanel />
            </div>

            {/* Recent Diagnoses Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <RecentDiagnosesWidget />
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Data
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
