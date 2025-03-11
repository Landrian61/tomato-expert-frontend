
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, X, Info, Search, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
            <TabsTrigger value="detailed" className="flex-1">Detailed View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
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
          </TabsContent>
          
          <TabsContent value="detailed">
            <div className="space-y-4">
              <div className="relative">
                <div className="aspect-video rounded-md overflow-hidden border border-muted">
                  <div className="relative w-full h-full">
                    <img 
                      src="https://extension.umn.edu/sites/extension.umn.edu/files/early%20blight.jpg" 
                      alt="Diagnosed plant" 
                      className="w-full h-full object-cover" 
                    />
                    {/* Infection highlights */}
                    <div className="absolute top-[30%] left-[25%] w-16 h-16 border-2 border-tomato rounded-full animate-pulse opacity-70"></div>
                    <div className="absolute top-[40%] right-[30%] w-12 h-12 border-2 border-tomato rounded-full animate-pulse opacity-70"></div>
                    <div className="absolute bottom-[25%] left-[40%] w-14 h-14 border-2 border-tomato rounded-full animate-pulse opacity-70"></div>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button variant="secondary" size="sm" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" /> Show Healthy Tissue
                  </Button>
                  <Button variant="secondary" size="sm" className="flex items-center gap-1 bg-tomato text-white hover:bg-tomato/90">
                    <Search className="h-4 w-4" /> Highlight Infected Areas
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Infection Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">Condition:</h4>
                      <p className="text-sm">Early Blight (Alternaria solani)</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Affected Areas:</h4>
                      <p className="text-sm">Lower leaves primarily, 35% of leaf surface area</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Progression:</h4>
                      <p className="text-sm">Early-to-mid stage, concentric lesions with yellowing</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">Treatment Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-plant-light/30 text-plant-dark rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">1</div>
                      <p className="text-sm">Apply copper-based fungicide within 24-48 hours</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-plant-light/30 text-plant-dark rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">2</div>
                      <p className="text-sm">Remove infected leaves and destroy (do not compost)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-plant-light/30 text-plant-dark rounded-full h-5 w-5 flex items-center justify-center shrink-0 mt-0.5">3</div>
                      <p className="text-sm">Improve air circulation between plants through pruning</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
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
