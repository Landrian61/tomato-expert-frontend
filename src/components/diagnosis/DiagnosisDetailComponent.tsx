import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Thermometer,
  Droplets,
  CloudRain,
  Sprout
} from "lucide-react";
import {
  getDiagnosisById,
  DiagnosisResult,
  formatRecommendation
} from "@/services/diagnosisService"; // Import formatRecommendation
import { toast } from "sonner";

const DiagnosisDetailComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Debug to see what ID is being received from useParams
    console.log("ID from useParams:", id);

    // More thorough ID validation
    if (id && id !== "undefined" && /^[0-9a-fA-F]{24}$/.test(id)) {
      fetchDiagnosisDetails(id);
    } else {
      setLoading(false);
      const errorMsg = !id
        ? "No diagnosis ID provided"
        : id === "undefined"
        ? "Undefined diagnosis ID"
        : "Invalid diagnosis ID format";
      console.error(errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [id]);

  const fetchDiagnosisDetails = async (diagnosisId: string) => {
    setLoading(true);
    try {
      const result = await getDiagnosisById(diagnosisId);
      setDiagnosis(result);
    } catch (error: any) {
      console.error("Failed to fetch diagnosis details:", error);
      setError(error.message || "Failed to load diagnosis details");
      toast.error("Failed to load diagnosis details");
    } finally {
      setLoading(false);
    }
  };

  const getConditionBadge = (condition: string) => {
    if (!condition) return <Badge>Unknown</Badge>;

    if (condition.toLowerCase().includes("healthy")) {
      return <Badge className="bg-plant">Healthy</Badge>;
    } else if (condition.toLowerCase().includes("early blight")) {
      return <Badge className="bg-warning-dark">Early Blight</Badge>;
    } else if (condition.toLowerCase().includes("late blight")) {
      return <Badge className="bg-tomato">Late Blight</Badge>;
    } else {
      return <Badge>{condition}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Skeleton className="h-8 w-1/3 mb-6" />

        <Card>
          <CardContent className="p-0">
            <Skeleton className="w-full aspect-video" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              {error || "Diagnosis not found"}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/diagnosis")}
              className="mt-4"
            >
              Start New Diagnosis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{diagnosis.condition}</h1>
        {getConditionBadge(diagnosis.condition)}
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 mr-1" />
        {new Date(diagnosis.createdAt).toLocaleString()}
      </div>

      <Card>
        <CardContent className="p-0 relative">
          <img
            src={diagnosis.imageUrl}
            alt={diagnosis.condition}
            className="w-full object-cover max-h-[400px]"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-black/70">
              {diagnosis.confidence}% Confidence
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Condition</h3>
              <p>{diagnosis.condition}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Recommendation</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: formatRecommendation(diagnosis.recommendation)
                }}
              />{" "}
              {/* Use formatRecommendation */}
            </div>

            {diagnosis.signsAndSymptoms && ( // ADD THIS SECTION
              <div>
                <h3 className="font-medium mb-2">
                  Observed Signs and Symptoms
                </h3>
                <p>{diagnosis.signsAndSymptoms}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Environmental Data</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnosis.environmentalData ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Thermometer className="h-5 w-5 text-tomato shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Temperature</h3>
                    <p>{diagnosis.environmentalData.temperature}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Droplets className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Humidity</h3>
                    <p>{diagnosis.environmentalData.humidity}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CloudRain className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Rainfall</h3>
                    <p>{diagnosis.environmentalData.rainfall}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Sprout className="h-5 w-5 text-plant shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium">Soil Moisture</h3>
                    <p>{diagnosis.environmentalData.soilMoisture}</p>
                  </div>
                </div>

                <div className="col-span-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CRI</span>
                    <Badge
                      variant="outline"
                      className={
                        diagnosis.environmentalData.riskLevel.toLowerCase() ===
                        "low"
                          ? "text-plant"
                          : diagnosis.environmentalData.riskLevel.toLowerCase() ===
                            "medium"
                          ? "text-warning-light"
                          : diagnosis.environmentalData.riskLevel.toLowerCase() ===
                            "high"
                          ? "text-warning-dark"
                          : "text-tomato"
                      }
                    >
                      {diagnosis.environmentalData.cri.toFixed(1)} -{" "}
                      {diagnosis.environmentalData.riskLevel} Risk
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No environmental data available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => navigate("/diagnosis")}
          className="bg-plant hover:bg-plant-dark"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Start New Diagnosis
        </Button>
      </div>
    </div>
  );
};

export default DiagnosisDetailComponent;
