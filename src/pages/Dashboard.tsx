import React from "react";
import Layout from "@/components/layout/Layout";
import EnvironmentCard from "@/components/dashboard/EnvironmentCard";
import RiskGauge from "@/components/dashboard/RiskGauge";
import ActionButton from "@/components/dashboard/ActionButton";
import CRITrendChart from "@/components/dashboard/CRITrendChart";
import { Sprout, AlertTriangle, LineChart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnvironmentalData } from "@/hooks/environmentalDataHook";
import { toast } from "sonner";

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
    <Layout title="Field Overview">
      <div className="space-y-6">
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
                  <CRITrendChart period="week" showTrend={true} />
                </>
              )}
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

            {/* Risk level banner */}
            {riskLevel && (
              <Card
                className={`
                ${riskLevel === "Low" ? "bg-plant/10 border-plant/30" : ""}
                ${
                  riskLevel === "Medium"
                    ? "bg-warning-light/10 border-warning-light/30"
                    : ""
                }
                ${
                  riskLevel === "High"
                    ? "bg-warning-dark/10 border-warning-dark/30"
                    : ""
                }
                ${
                  riskLevel === "Critical"
                    ? "bg-tomato/10 border-tomato/30"
                    : ""
                }
              `}
              >
                <CardContent className="p-4 flex gap-2">
                  <AlertTriangle
                    className={`
                    h-5 w-5 shrink-0 mt-0.5
                    ${riskLevel === "Low" ? "text-plant" : ""}
                    ${riskLevel === "Medium" ? "text-warning-light" : ""}
                    ${riskLevel === "High" ? "text-warning-dark" : ""}
                    ${riskLevel === "Critical" ? "text-tomato" : ""}
                  `}
                  />
                  <div>
                    <p className="font-medium">
                      {riskLevel} Risk Level Detected
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {riskLevel === "Low" &&
                        "Conditions are favorable for tomato growth. Continue monitoring."}
                      {riskLevel === "Medium" &&
                        "Moderate risk of disease. Consider preventative measures."}
                      {riskLevel === "High" &&
                        "High risk of disease. Immediate action recommended."}
                      {riskLevel === "Critical" &&
                        "Critical risk! Immediate intervention required to prevent crop loss."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-4">
                <ActionButton
                  title="Plant Diagnosis"
                  icon={<Sprout className="h-6 w-6" />}
                  href="/diagnosis"
                  variant="default"
                />
                <ActionButton
                  title="Risk Alerts"
                  icon={<AlertTriangle className="h-6 w-6" />}
                  href="/alerts"
                />
                <ActionButton
                  title="Field Insights"
                  icon={<LineChart className="h-6 w-6" />}
                  href="/insights"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
