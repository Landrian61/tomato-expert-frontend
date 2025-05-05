import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DiagnosisResult as DiagnosisResultType } from "@/services/diagnosisService";

interface DiagnosisResultProps {
  isActive: boolean;
  result: DiagnosisResultType | null;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  isActive,
  result
}) => {
  if (!isActive || !result) return null;

  const getBadgeColor = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("healthy")) return "bg-plant";
    if (conditionLower.includes("early blight")) return "bg-warning-dark";
    if (conditionLower.includes("late blight")) return "bg-tomato";
    return "";
  };

  // Log the result to diagnose issues
  console.log("Diagnosis result received:", result);

  return (
    <Card className="border-2 border-muted">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Diagnosis Result</h2>
          <Badge className={getBadgeColor(result.condition)}>
            {result.condition || "Unknown"}
          </Badge>
        </div>

        <div className="space-y-3">
          {/* Image with result */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src={result.imageUrl}
                alt={`Plant with ${result.condition}`}
                className="rounded-md w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Display confidence level if available */}
          {result.confidence > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Confidence Level</h3>
              <div className="h-2.5 w-full bg-muted rounded-full">
                <div
                  className={`h-2.5 rounded-full ${
                    result.confidence > 70
                      ? "bg-plant"
                      : result.confidence > 40
                      ? "bg-warning-light"
                      : "bg-warning-dark"
                  }`}
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <p className="text-xs text-right pt-1">{result.confidence}%</p>
            </div>
          )}

          {/* Symptoms */}
          {result.signsAndSymptoms && (
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Signs and Symptoms</h3>
              <p className="text-sm">{result.signsAndSymptoms}</p>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendation && (
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">Recommendations</h3>
              <p className="text-sm">{result.recommendation}</p>
            </div>
          )}

          {/* Environmental Data */}
          {result.environmentalData && (
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-1">
                Environmental Factors
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CRI:</span>
                  <span>{result.environmentalData.cri.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <span>{result.environmentalData.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span>{result.environmentalData.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span>{result.environmentalData.humidity}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosisResult;
