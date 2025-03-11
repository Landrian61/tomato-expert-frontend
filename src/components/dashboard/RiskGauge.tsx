
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface RiskGaugeProps {
  value: number;
  title?: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ value, title = 'Cumulative Risk Index (CRI)' }) => {
  const getRiskLevel = (value: number) => {
    if (value < 25) return { level: 'Low', class: 'bg-plant' };
    if (value < 50) return { level: 'Medium', class: 'bg-warning-light' };
    if (value < 75) return { level: 'High', class: 'bg-warning-dark' };
    return { level: 'Critical', class: 'bg-tomato' };
  };

  const { level, class: bgClass } = getRiskLevel(value);

  const rotation = (value / 100) * 180;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Cumulative Risk Index (CRI) is a measure of the overall risk of disease 
                for your tomato plants based on environmental conditions, historical data, 
                and disease models.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative h-32 w-64">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
            <div className="h-full w-full rounded-t-full bg-muted"></div>
          </div>
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden"
            style={{ 
              clipPath: `polygon(50% 0, 50% 0, 50% 100%, 50% 100%)`, 
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'bottom center',
              transition: 'transform 1s ease'
            }}
          >
            <div className={`h-full w-full rounded-t-full ${bgClass}`}></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
            <div className="text-3xl font-bold">{value}</div>
          </div>
        </div>
        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium risk-${level.toLowerCase()}`}>
          {level} Risk
        </div>
        <div className="mt-4 w-full grid grid-cols-4 text-xs text-center">
          <div className="text-plant">Low</div>
          <div className="text-warning-light">Medium</div>
          <div className="text-warning-dark">High</div>
          <div className="text-tomato">Critical</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskGauge;
