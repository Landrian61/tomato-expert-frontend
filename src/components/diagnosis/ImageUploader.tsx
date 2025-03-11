
import React, { useState } from 'react';
import { Camera, Upload, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageSelected(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
        <div className="shrink-0">
          <AlertTriangle className="h-6 w-6 text-warning" />
        </div>
        <p className="text-sm">
          Ensure a clear image of the lower leaves for early blight detection. 
          Good lighting and focus will improve diagnostic accuracy.
        </p>
      </div>
      
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
            onChange={handleFileChange}
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
            onChange={handleFileChange}
          />
        </Button>
      </div>
      
      {preview && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full object-cover max-h-[300px]" 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUploader;
