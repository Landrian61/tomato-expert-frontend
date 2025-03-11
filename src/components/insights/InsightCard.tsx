
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';

interface InsightCardProps {
  image: string;
  diagnosis: string;
  confidence: number;
  date: string;
  cri: number;
  onClick: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  image, 
  diagnosis, 
  confidence, 
  date, 
  cri, 
  onClick 
}) => {
  const getCriColor = () => {
    if (cri < 25) return 'text-plant';
    if (cri < 50) return 'text-warning-light';
    if (cri < 75) return 'text-warning-dark';
    return 'text-tomato';
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={image} 
          alt={diagnosis}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/60 text-white border-0">
            CRI: <span className={getCriColor()}>{cri}</span>
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium">{diagnosis}</h3>
          <Badge variant="outline" className="font-medium">
            {confidence}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 mr-1" />
          {date}
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
