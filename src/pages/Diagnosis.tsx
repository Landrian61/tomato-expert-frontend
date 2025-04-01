// src/pages/Diagnosis.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ImageUploader from "@/components/diagnosis/ImageUploader";
import DiagnosisResult from "@/components/diagnosis/DiagnosisResult";
import DiagnosisHistory from "@/components/diagnosis/DiagnosisHistory";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  validatePlantImage,
  diagnosePlant,
  DiagnosisResult as DiagnosisResultType
} from "@/services/diagnosisService";
import { refreshEnvironmentalData } from "@/services/environmentalDataService";
import { fileToBase64 } from "@/utils/imageUtils";

const Diagnosis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>("new-diagnosis");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResultType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [validationId, setValidationId] = useState<string | null>(null);
  const [validationComplete, setValidationComplete] = useState(false);
  const [validatedImageUrl, setValidatedImageUrl] = useState<string | null>(null);

  // Check if we should show the history tab from navigation state
  useEffect(() => {
    const state = location.state as { tab?: string } | null;
    if (state?.tab === "history") {
      setSelectedTab("history");
    }
  }, [location.state]);

  const handleImageSelected = async (file: File) => {
    // Reset previous results
    setSelectedImage(file);
    setShowResult(false);
    setDiagnosisResult(null);
    setValidationId(null);
    setValidationComplete(false);
    setValidatedImageUrl(null);
    setIsProcessing(true);

    try {
      // Step 1: Refresh environmental data to get the latest CRI
      setProcessingStatus("Refreshing environmental data...");
      await refreshEnvironmentalData();

      // Step 2: Convert image to base64
      setProcessingStatus("Processing image...");
      const base64Image = await fileToBase64(file);

      // Step 3: Get current location if available
      let coordinates = null;
      if (navigator.geolocation) {
        try {
          setProcessingStatus("Detecting location...");
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              });
            }
          );

          coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (error) {
          console.log("Geolocation error:", error);
          // Continue without coordinates
        }
      }

      // Step 4: Validate the image
      setProcessingStatus("Validating image...");
      const validationResult = await validatePlantImage(base64Image, coordinates);
      
      setValidationId(validationResult.validationId);
      setValidatedImageUrl(validationResult.imageUrl);
      setValidationComplete(true);
      toast.success("Image validated successfully!");
      
    } catch (error: any) {
      console.error("Error during image validation:", error);

      // Check if the error indicates invalid image
      if (
        error.response?.data?.details &&
        error.response.data.details.includes("Invalid image")
      ) {
        toast.error(
          "Image validation failed. Please ensure the image is clear and focused on the plant."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to validate image. Please try again."
        );
      }

      setSelectedImage(null);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  const handleAnalyzeImage = async () => {
    if (!validationId) {
      toast.error("No validated image to analyze. Please upload an image first.");
      return;
    }

    setIsProcessing(true);
    setProcessingStatus("Analyzing image...");

    try {
      // Step 5: Send validated image for diagnosis
      const result = await diagnosePlant(validationId);
      
      // Step 6: Display results
      setDiagnosisResult(result.diagnosis);
      setShowResult(true);

      // Step 7: Show appropriate message based on diagnosis
      const conditionLower = result.diagnosis.condition.toLowerCase();
      if (conditionLower.includes("healthy")) {
        toast.success("Good news! Your plant appears to be healthy.");
      } else if (conditionLower.includes("early blight")) {
        toast.warning(
          "Early Blight detected. See recommendations for treatment."
        );
      } else if (conditionLower.includes("late blight")) {
        toast.error("Late Blight detected. Immediate action recommended.");
      } else {
        toast.success(
          `Analysis complete. Diagnosis: ${result.diagnosis.condition}`
        );
      }

    } catch (error: any) {
      console.error("Error during diagnosis:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to analyze image. Please try again."
      );
      
      // Reset validation if diagnosis fails
      setValidationComplete(false);
      setValidationId(null);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  return (
    <Layout title="Plant Diagnosis">
      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="new-diagnosis">New Diagnosis</TabsTrigger>
          <TabsTrigger value="history">Diagnosis History</TabsTrigger>
        </TabsList>

        <TabsContent value="new-diagnosis">
          <div className="space-y-6">
            {!isProcessing && !showResult && !validationComplete && (
              <ImageUploader onImageSelected={handleImageSelected} />
            )}

            {isProcessing && (
              <div className="p-20 text-center">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      {processingStatus || "Processing..."}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This may take a moment. Please don't refresh the page.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isProcessing && validationComplete && !showResult && (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle className="text-green-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Image Validated
                  </AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your image has been validated successfully. You can now proceed with the analysis.
                  </AlertDescription>
                </Alert>
                
                {validatedImageUrl && (
                  <div className="flex justify-center">
                    <div className="w-64 h-64 rounded-md overflow-hidden border border-muted">
                      <img 
                        src={validatedImageUrl} 
                        alt="Validated plant image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center mt-4">
                  <Button onClick={handleAnalyzeImage} className="px-8">
                    Analyze Image
                  </Button>
                </div>
              </div>
            )}

            <DiagnosisResult isActive={showResult} result={diagnosisResult} />

            {showResult && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => {
                    setSelectedImage(null);
                    setShowResult(false);
                    setDiagnosisResult(null);
                    setValidationId(null);
                    setValidationComplete(false);
                  }}
                  variant="outline"
                  className="mr-4"
                >
                  Start New Diagnosis
                </Button>
                <Button onClick={() => setSelectedTab("history")}>
                  View History
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <DiagnosisHistory />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Diagnosis;