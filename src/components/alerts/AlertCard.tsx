
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, Info } from 'lucide-react';

interface AlertCardProps {
  title: string;
  description: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const AlertCard: React.FC<AlertCardProps> = ({ title, description, timestamp, riskLevel }) => {
  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'low':
        return <Badge className="bg-plant">Low Risk</Badge>;
      case 'medium':
        return <Badge className="bg-warning-light">Medium Risk</Badge>;
      case 'high':
        return <Badge className="bg-warning-dark">High Risk</Badge>;
      case 'critical':
        return <Badge className="bg-tomato">Critical Risk</Badge>;
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (riskLevel) {
      case 'low':
        return <Info className="h-6 w-6 text-plant" />;
      case 'medium':
        return <Info className="h-6 w-6 text-warning-light" />;
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-warning-dark" />;
      case 'critical':
        return <AlertTriangle className="h-6 w-6 text-tomato" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
          </div>
        </div>
        <div>
          {getRiskBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" className="sm:flex-1">
            <Info className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" variant="outline" className="sm:flex-1">
            <Check className="h-4 w-4 mr-2" />
            Acknowledge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
