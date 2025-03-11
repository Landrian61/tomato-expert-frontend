
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ImageUploader from '@/components/diagnosis/ImageUploader';
import DiagnosisResult from '@/components/diagnosis/DiagnosisResult';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Diagnosis = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setShowResult(false);
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    // Simulate analysis time
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <Layout title="Plant Diagnosis">
      <div className="space-y-6">
        <ImageUploader onImageSelected={handleImageSelected} />
        
        {selectedImage && !showResult && (
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
