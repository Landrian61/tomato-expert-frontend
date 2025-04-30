import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/authService";
import {
  RefreshCw,
  MapPin,
  TrendingUp,
  Cloud,
  Droplets,
  Thermometer,
  AlertTriangle,
  AlertCircle,
  Edit
} from "lucide-react";
import RiskGauge from "@/components/dashboard/RiskGauge";
import FarmerLocationMap from "@/components/analytics/FarmerLocationMap";
import EnvironmentalTrendCharts from "@/components/analytics/EnvironmentalTrendCharts";
import WeatherForecastSection from "@/components/analytics/WeatherForecastSection";
import { refreshEnvironmentalData } from "@/services/environmentalDataService";
import { FarmLocation, EnvironmentalData } from "@/types/location";
import CRITrendChartCard from "@/components/dashboard/CRITrendChartCard";

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [environmentalData, setEnvironmentalData] =
    useState<EnvironmentalData | null>(null);
  const [farmerLocation, setFarmerLocation] = useState<FarmLocation | null>(
    null
  );
  const [nearbyFarmers, setNearbyFarmers] = useState<FarmLocation[]>([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [error, setError] = useState<string | null>(null);
  const [locationMissing, setLocationMissing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Get location from user's session/profile
  const getFarmerLocation = (): FarmLocation | null => {
    try {
      // Check if user has defaultLocation in their profile
      if (
        user &&
        user.defaultLocation &&
        user.defaultLocation.latitude &&
        user.defaultLocation.longitude
      ) {
        console.log("Using location from auth context:", user.defaultLocation);
        return {
          id: user.id,
          farmer: {
            firstName: user.firstName,
            lastName: user.lastName
          },
          location: {
            latitude: user.defaultLocation.latitude,
            longitude: user.defaultLocation.longitude,
            district: user.district || "",
            name: user.farmName || "My Farm"
          },
          isSelf: true,
          environmentalData: environmentalData || { cri: 50, riskLevel: "Low" }
        };
      }

      // Try getting location from localStorage
      const userData = localStorage.getItem("authData");
      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          if (
            parsedData.user?.defaultLocation?.latitude &&
            parsedData.user?.defaultLocation?.longitude
          ) {
            console.log(
              "Using location from localStorage:",
              parsedData.user.defaultLocation
            );
            return {
              id: parsedData.user.id,
              farmer: {
                firstName: parsedData.user.firstName,
                lastName: parsedData.user.lastName
              },
              location: {
                latitude: parsedData.user.defaultLocation.latitude,
                longitude: parsedData.user.defaultLocation.longitude,
                district: parsedData.user.district || "Unknown",
                name: parsedData.user.farmName || "My Farm"
              },
              isSelf: true,
              environmentalData: environmentalData || {
                cri: 50,
                riskLevel: "Low"
              }
            };
          }
        } catch (parseError) {
          console.error("Error parsing auth data:", parseError);
        }
      }

      // For development, provide mock data if no location exists
      if (process.env.NODE_ENV === "development") {
        return {
          id: user?.id || "user123",
          farmer: {
            firstName: user?.firstName || "Test",
            lastName: user?.lastName || "Farmer"
          },
          location: {
            latitude: 0.3321,
            longitude: 32.5705,
            district: "Kampala",
            name: "Development Farm"
          },
          isSelf: true,
          environmentalData: environmentalData || {
            cri: 65,
            riskLevel: "Medium",
            blightType: "Early Blight"
          }
        };
      }

      console.log("No location data found");
      return null;
    } catch (error) {
      console.error("Error getting farmer location:", error);
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setLocationMissing(false);

    try {
      // Fetch latest environmental data
      const envResponse = await api.get("/environmental/latest");
      if (!envResponse.data) {
        throw new Error("Failed to retrieve environmental data");
      }
      setEnvironmentalData(envResponse.data);

      // Get location from user profile/session
      let location = getFarmerLocation();

      // If no location found in session/storage, try a direct API call
      if (!location) {
        try {
          console.log("Attempting direct API call for user profile");
          const userProfileResponse = await api.get("/user");

          if (
            userProfileResponse.data?.defaultLocation?.latitude &&
            userProfileResponse.data?.defaultLocation?.longitude
          ) {
            console.log(
              "Got location from profile API:",
              userProfileResponse.data.defaultLocation
            );

            location = {
              id: user?.id || userProfileResponse.data.id,
              farmer: {
                firstName: userProfileResponse.data.firstName,
                lastName: userProfileResponse.data.lastName
              },
              location: {
                latitude: userProfileResponse.data.defaultLocation.latitude,
                longitude: userProfileResponse.data.defaultLocation.longitude,
                district: userProfileResponse.data.district || "",
                name: userProfileResponse.data.farmName || "My Farm"
              },
              isSelf: true,
              environmentalData: environmentalData || {
                cri: 50,
                riskLevel: "Low"
              }
            };
          }
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
        }
      }

      if (location) {
        setFarmerLocation(location);

        // For development, generate mock nearby farms
        if (process.env.NODE_ENV === "development") {
          setNearbyFarmers([
            {
              id: "farm1",
              farmer: { firstName: "Jane", lastName: "Doe" },
              location: {
                latitude: location.location.latitude + 0.01,
                longitude: location.location.longitude + 0.01,
                district: "Kampala",
                name: "Nearby Farm 1"
              },
              isSelf: false,
              environmentalData: {
                cri: 45,
                riskLevel: "Low",
                blightType: "Healthy"
              }
            },
            {
              id: "farm2",
              farmer: { firstName: "John", lastName: "Smith" },
              location: {
                latitude: location.location.latitude - 0.01,
                longitude: location.location.longitude - 0.01,
                district: "Kampala",
                name: "Nearby Farm 2"
              },
              isSelf: false,
              environmentalData: {
                cri: 75,
                riskLevel: "High",
                blightType: "Late Blight"
              }
            }
          ]);
        }
      } else {
        setLocationMissing(true);
      }
    } catch (error: any) {
      console.error("Error fetching analytics data:", error);
      setError(error.message || "Failed to load analytics data");
      toast.error(error.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshEnvironmentalData();
      await fetchData();
      toast.success("Data refreshed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  // Show location missing UI when we've explicitly verified no location exists
  if (locationMissing && !loading) {
    return (
      <Layout title="Analytics">
        <div className="space-y-4">
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="h-5 w-5 text-tomato" />
                Farm Location Required
              </CardTitle>
              <CardDescription>
                Analytics needs your farm location to work properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Your farm location has not been properly set or could not be
                retrieved. Analytics features require your location to provide
                accurate insights and forecasts.
              </p>
              <div className="flex gap-3 mt-4">
                <Button onClick={() => navigate("/profile")} variant="default">
                  <Edit className="mr-2 h-4 w-4" />
                  Update Farm Location
                </Button>
                <Button onClick={fetchData} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Show general error message if data couldn't be loaded
  if (error && !loading && !locationMissing) {
    return (
      <Layout title="Analytics">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold">Farm Analytics</h2>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              size="sm"
              variant="outline"
              className="h-8 px-2"
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh Data
            </Button>
          </div>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Data Loading Error
              </CardTitle>
              <CardDescription>
                We couldn't load your analytics data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{error}</p>
              <Button onClick={fetchData} variant="default">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics">
      <div className="space-y-4">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold">Farm Analytics</h2>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="sm"
            variant="outline"
            className="h-8 px-2"
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>

        {/* Tabs navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 h-9 mb-4 w-full">
            <TabsTrigger value="overview" className="text-xs">
              <MapPin className="h-3.5 w-3.5 mr-2" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs">
              <TrendingUp className="h-3.5 w-3.5 mr-2" />
              <span>Trends</span>
            </TabsTrigger>
            <TabsTrigger value="forecast" className="text-xs">
              <Cloud className="h-3.5 w-3.5 mr-2" />
              <span>Forecast</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 gap-4">
                <Skeleton className="h-60" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {/* Farmer location map */}
                  <FarmerLocationMap
                    farmerLocation={farmerLocation}
                    otherLocations={nearbyFarmers}
                    loading={loading}
                  />

                  {/* CRI and risk level */}
                  <RiskGauge value={environmentalData?.cri || 50} />

                  {/* Current environmental data */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Current Conditions
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Last updated:{" "}
                        {new Date(environmentalData?.date).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-5 w-5 text-tomato shrink-0" />
                          <div>
                            <div className="text-xs font-medium">
                              Temperature
                            </div>
                            <div className="text-lg font-bold">
                              {environmentalData?.currentConditions
                                ?.temperature || "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-blue-500 shrink-0" />
                          <div>
                            <div className="text-xs font-medium">Humidity</div>
                            <div className="text-lg font-bold">
                              {environmentalData?.currentConditions?.humidity ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-blue-400 shrink-0" />
                          <div>
                            <div className="text-xs font-medium">Rainfall</div>
                            <div className="text-lg font-bold">
                              {environmentalData?.currentConditions?.rainfall ||
                                "N/A"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-plant shrink-0" />
                          <div>
                            <div className="text-xs font-medium">
                              Soil Moisture
                            </div>
                            <div className="text-lg font-bold">
                              {environmentalData?.currentConditions
                                ?.soilMoisture || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent CRI trend */}
                <CRITrendChartCard
                  period="week"
                  showTrend={true}
                  title="Blight Risk Trend"
                />
              </>
            )}
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <EnvironmentalTrendCharts />
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-4">
            <WeatherForecastSection />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
