
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ImageUploader from '@/components/diagnosis/ImageUploader';
import DiagnosisResult from '@/components/diagnosis/DiagnosisResult';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

const Diagnosis = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageStatus, setImageStatus] = useState<'none' | 'validating' | 'valid' | 'invalid'>('none');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setShowResult(false);
    setImageStatus('validating');
    
    // Simulate image validation
    setTimeout(() => {
      const isValid = file.size < 10000000; // Example validation: file size < 10MB
      setImageStatus(isValid ? 'valid' : 'invalid');
      
      if (!isValid) {
        toast.error('Image validation failed. Please ensure the image is clear and focused on the plant leaves.');
      } else {
        toast.success('Image successfully validated. Ready for analysis.');
      }
    }, 1500);
  };

  const handleAnalyze = () => {
    if (!selectedImage || imageStatus !== 'valid') return;

    setIsAnalyzing(true);
    // Simulate analysis time
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
      toast.success('Analysis complete. Disease detected: Early Blight.');
    }, 2000);
  };

  const renderValidationStatus = () => {
    if (imageStatus === 'none' || !selectedImage) return null;
    
    if (imageStatus === 'validating') {
      return (
        <Alert className="mt-4 bg-muted">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <AlertTitle>Validating Image</AlertTitle>
          <AlertDescription>
            Checking image quality and clarity...
          </AlertDescription>
        </Alert>
      );
    }
    
    if (imageStatus === 'invalid') {
      return (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Validation Failed</AlertTitle>
          <AlertDescription>
            Please ensure your image is clear, well-lit, and focused on the plant leaves.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (imageStatus === 'valid') {
      return (
        <Alert variant="default" className="mt-4 border-plant text-plant bg-plant-light/20">
          <Check className="h-4 w-4 mr-2" />
          <AlertTitle>Image Validated</AlertTitle>
          <AlertDescription>
            Your image meets the quality requirements for accurate diagnosis.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <Layout title="Plant Diagnosis">
      <div className="space-y-6">
        <ImageUploader onImageSelected={handleImageSelected} />
        
        {renderValidationStatus()}
        
        {selectedImage && imageStatus === 'valid' && !showResult && (
          <div className="flex justify-center mt-6">
            <Button 
              disabled={isAnalyzing} 
              onClick={handleAnalyze}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                'Analyze Image'
              )}
            </Button>
          </div>
        )}
        
        <DiagnosisResult isActive={showResult} />
      </div>
    </Layout>
  );
};

export default Diagnosis;
