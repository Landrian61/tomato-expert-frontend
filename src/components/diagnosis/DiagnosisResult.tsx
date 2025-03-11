
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiagnosisResultProps {
  isActive: boolean;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 text-warning mr-2" />
          Diagnosis Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <img 
              src="https://extension.umn.edu/sites/extension.umn.edu/files/early%20blight.jpg" 
              alt="Diagnosed plant" 
              className="w-full h-auto rounded-md" 
            />
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" /> High Risk Area
              </Badge>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Early Blight Detected</h3>
              <p className="text-sm text-muted-foreground">
                Alternaria solani infection identified on lower leaves
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Confidence</span>
                <Badge variant="outline" className="font-medium">92%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-tomato h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Symptoms Identified:</h4>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-plant mr-2" />
                  Brown circular lesions with concentric rings
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-plant mr-2" />
                  Yellow halo around lesions
                </li>
                <li className="flex items-center">
                  <X className="h-4 w-4 text-tomato mr-2" />
                  No stem lesions observed
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-muted p-3 rounded-lg">
          <div className="flex gap-2">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">Recommended Action</h3>
              <p className="text-sm mt-1">
                Apply copper-based fungicide within 24-48 hours. Remove infected leaves 
                and improve air circulation between plants.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button className="flex-1">Save Report</Button>
          <Button variant="outline" className="flex-1">View Detailed Report</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosisResult;
