// src/components/diagnosis/DiagnosisHistory.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getDiagnosisHistory,
  DiagnosisResult
} from "@/services/diagnosisService";
import { toast } from "sonner";

const DiagnosisHistory = () => {
  const [loading, setLoading] = useState(true);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisResult[]>(
    []
  );
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiagnosisHistory();
  }, [currentPage]);

  const fetchDiagnosisHistory = async () => {
    setLoading(true);
    try {
      const result = await getDiagnosisHistory(limit, currentPage * limit);
      setDiagnosisHistory(result.diagnoses);
      setTotalItems(result.pagination.total);
    } catch (error) {
      console.error("Failed to fetch diagnosis history:", error);
      toast.error("Failed to load diagnosis history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    if (!id || id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      toast.error("Invalid diagnosis ID");
      return;
    }
    navigate(`/diagnosis/${id}`);
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Diagnosis History</h2>

      {loading ? (
        Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
      ) : diagnosisHistory.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No diagnosis history found</p>
            <Button
              variant="outline"
              onClick={() => navigate("/diagnosis")}
              className="mt-4"
            >
              Start New Diagnosis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {diagnosisHistory.map((diagnosis) => (
            <Card key={diagnosis.id} className="mb-4">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden">
                    <img
                      src={diagnosis.thumbnailUrl || diagnosis.imageUrl}
                      alt={diagnosis.condition}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{diagnosis.condition}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(diagnosis.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {getConditionBadge(diagnosis.condition)}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-warning-light mr-1" />
                        <span className="text-sm">
                          Confidence: {diagnosis.confidence}%
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm"
                        onClick={() => handleViewDetails(diagnosis.id)}
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalItems > limit && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center text-sm">
                Page {currentPage + 1} of {Math.ceil(totalItems / limit)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= Math.ceil(totalItems / limit) - 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiagnosisHistory;
