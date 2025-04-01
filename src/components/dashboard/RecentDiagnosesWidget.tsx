// src/components/dashboard/RecentDiagnosesWidget.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import {
  getDiagnosisHistory,
  DiagnosisResult
} from "@/services/diagnosisService";

const RecentDiagnosesWidget = () => {
  const [loading, setLoading] = useState(true);
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentDiagnoses();
  }, []);

  const fetchRecentDiagnoses = async () => {
    try {
      setLoading(true);
      const result = await getDiagnosisHistory(3, 0); // Get 3 most recent diagnoses
      setDiagnoses(result.diagnoses);
    } catch (error) {
      console.error("Failed to fetch recent diagnoses:", error);
    } finally {
      setLoading(false);
    }
  };

  const getConditionBadge = (condition: string) => {
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Diagnoses</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : diagnoses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No diagnoses found</p>
            <Button variant="outline" onClick={() => navigate("/diagnosis")}>
              Start New Diagnosis
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {diagnoses.map((diagnosis) => (
              <div
                key={diagnosis.id}
                className="flex items-center gap-3 py-2 cursor-pointer hover:bg-muted rounded-md px-2 transition-colors"
                onClick={() => navigate(`/diagnosis/${diagnosis.id}`)}
              >
                <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                  <img
                    src={diagnosis.thumbnailUrl || diagnosis.imageUrl}
                    alt={diagnosis.condition}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">
                      {diagnosis.condition}
                    </h4>
                    {getConditionBadge(diagnosis.condition)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(diagnosis.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={() =>
                navigate("/diagnosis", { state: { tab: "history" } })
              }
            >
              View All Diagnoses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDiagnosesWidget;
