
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Thermometer, Droplets, Wind, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface InsightDetailProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    image: string;
    diagnosis: string;
    confidence: number;
    date: string;
    cri: number;
    temperature: string;
    humidity: string;
    windSpeed: string;
    recommendation: string;
  };
}

const InsightDetail: React.FC<InsightDetailProps> = ({ isOpen, onClose, data }) => {
  const getCriColor = () => {
    if (data.cri < 25) return 'text-plant';
    if (data.cri < 50) return 'text-warning-light';
    if (data.cri < 75) return 'text-warning-dark';
    return 'text-tomato';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Diagnosis Detail</DialogTitle>
          <DialogDescription>
            Recorded on <span className="font-medium">{data.date}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video rounded-md overflow-hidden">
            <img 
              src={data.image} 
              alt={data.diagnosis}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{data.diagnosis}</h3>
            <Badge variant="outline" className="font-medium">
              {data.confidence}% Confidence
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${getCriColor()} bg-opacity-20`}>
              CRI: {data.cri}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              {data.date}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Environmental Conditions</h4>
            <div className="grid grid-cols-3 gap-2">
              <Card>
                <CardContent className="p-3 flex flex-col items-center">
                  <Thermometer className="h-5 w-5 text-tomato mb-1" />
                  <span className="text-xs text-muted-foreground">Temperature</span>
                  <span className="font-medium">{data.temperature}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex flex-col items-center">
                  <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-xs text-muted-foreground">Humidity</span>
                  <span className="font-medium">{data.humidity}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 flex flex-col items-center">
                  <Wind className="h-5 w-5 text-gray-500 mb-1" />
                  <span className="text-xs text-muted-foreground">Wind</span>
                  <span className="font-medium">{data.windSpeed}</span>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-3">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Recommendation</h4>
                  <p className="text-sm mt-1">{data.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsightDetail;
