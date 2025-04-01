// src/components/diagnosis/ImageUploader.tsx
import React, { useState, useRef } from "react";
import { Camera, Upload, AlertTriangle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    // Basic client-side validation before sending to API
    // These are just basic checks to avoid wasting bandwidth on obviously invalid files
    if (!file.type.match("image.*")) {
      alert("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    // Maximum file size (10MB) - adjust based on your API limits
    if (file.size > 10 * 1024 * 1024) {
      alert("Image is too large. Please select an image less than 10MB.");
      return;
    }

    // Create preview for user feedback
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Send to parent component for processing
    // This automatically triggers the diagnosis flow
    onImageSelected(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
        <div className="shrink-0">
          <AlertTriangle className="h-6 w-6 text-warning" />
        </div>
        <div className="text-sm">
          <p className="font-medium mb-1">
            Best practices for accurate diagnosis:
          </p>
          <ul className="text-muted-foreground space-y-1">
            <li>• Take close-up images of the affected plant parts</li>
            <li>• Ensure good lighting to show symptom details clearly</li>
            <li>• Include both healthy and diseased tissue for comparison</li>
            <li>• For Early Blight, focus on the lower leaves</li>
            <li>• For Late Blight, capture any water-soaked lesions</li>
          </ul>
        </div>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Upload Plant Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your image here, or select one of the options below
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleCaptureClick}
            className="flex-1 flex flex-col py-8"
            variant="outline"
          >
            <Camera className="h-8 w-8 mb-2" />
            <span>Capture Image</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              ref={fileInputRef}
              onChange={handleInputChange}
            />
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col py-8"
            variant="outline"
          >
            <Upload className="h-8 w-8 mb-2" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleInputChange}
            />
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Uploading an image will automatically analyze and diagnose your plant
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
