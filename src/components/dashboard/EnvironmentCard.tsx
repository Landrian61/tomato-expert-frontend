
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Sprout } from 'lucide-react';

interface EnvironmentCardProps {
  title: string;
  value: string;
  icon: 'temperature' | 'humidity' | 'moisture';
  change?: string;
  trend?: 'up' | 'down' | 'stable';
}

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ title, value, icon, change, trend }) => {
  const getIcon = () => {
    switch (icon) {
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-tomato" />;
      case 'humidity':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'moisture':
        return <Sprout className="h-5 w-5 text-plant" />;
      default:
        return null;
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case 'up':
        return 'text-plant';
      case 'down':
        return 'text-tomato';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${getTrendClass()}`}>
            {change} from yesterday
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EnvironmentCard;
