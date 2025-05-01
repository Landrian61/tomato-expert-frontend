import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, X, Info, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DiagnosisResult as DiagnosisResultType,
  formatRecommendation
} from "@/services/diagnosisService"; // Import formatRecommendation

interface DiagnosisResultProps {
  isActive: boolean;
  result?: DiagnosisResultType | null;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  isActive,
  result
}) => {
  const navigate = useNavigate();

  if (!isActive || !result) return null;

  // Determine component display based on condition
  const isEarlyBlight = result.condition.toLowerCase().includes("early blight");
  const isLateBlight = result.condition.toLowerCase().includes("late blight");
  const isHealthy = result.condition.toLowerCase().includes("healthy");

  const getConditionBadge = () => {
    if (isHealthy) {
      return (
        <Badge className="bg-plant flex items-center">
          <Check className="h-3 w-3 mr-1" /> Healthy
        </Badge>
      );
    } else if (isEarlyBlight) {
      return (
        <Badge className="bg-warning-dark flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" /> Early Blight
        </Badge>
      );
    } else if (isLateBlight) {
      return (
        <Badge className="bg-tomato flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" /> Late Blight
        </Badge>
      );
    } else {
      return (
        <Badge className="flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" /> {result.condition}
        </Badge>
      );
    }
  };

  // Handle navigation to history
  const handleViewHistory = () => {
    navigate("/diagnosis", { state: { tab: "history" } });
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          {isHealthy ? (
            <Check className="h-5 w-5 text-plant mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-warning mr-2" />
          )}
          Diagnosis Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="summary" className="flex-1">
              Summary
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex-1">
              Detailed View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <img
                  src={result.imageUrl}
                  alt="Diagnosed plant"
                  className="w-full h-auto rounded-md"
                />
                <div className="absolute top-2 right-2">
                  {getConditionBadge()}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{result.condition}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isEarlyBlight && "Alternaria solani infection identified"}
                    {isLateBlight &&
                      "Phytophthora infestans infection identified"}
                    {isHealthy && "No disease detected"}
                    {!isEarlyBlight &&
                      !isLateBlight &&
                      !isHealthy &&
                      result.condition}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Confidence</span>
                    <Badge variant="outline" className="font-medium">
                      {result.confidence}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        isHealthy
                          ? "bg-plant"
                          : isEarlyBlight
                          ? "bg-warning-dark"
                          : "bg-tomato"
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-video rounded-md overflow-hidden border border-muted">
                  <div className="relative w-full h-full">
                    <img
                      src={result.imageUrl}
                      alt="Diagnosed plant"
                      className="w-full h-full object-cover"
                    />
                    {/* Only show infection highlights for diseased plants */}
                    {!isHealthy && (
                      <>
                        <div className="absolute top-[30%] left-[25%] w-16 h-16 border-2 border-tomato rounded-full animate-pulse opacity-70"></div>
                        <div className="absolute top-[40%] right-[30%] w-12 h-12 border-2 border-tomato rounded-full animate-pulse opacity-70"></div>
                        <div className="absolute bottom-[25%] left-[40%] w-14 h-14 border-2 border-tomato rounded-full animate-pulse opacity-70"></div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Diagnosis Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold">Condition</h4>
                      <p>{result.condition}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Confidence</h4>
                      <p>{result.confidence}%</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Recommendation</h4>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatRecommendation(result.recommendation)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {result.signsAndSymptoms && ( // ADD THIS SECTION
                <Card>
                  <CardHeader>
                    <CardTitle>Observed Signs and Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{result.signsAndSymptoms}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DiagnosisResult;
