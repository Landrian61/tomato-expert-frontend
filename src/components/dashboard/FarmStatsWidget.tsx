import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { getFarmStats, formatFarmStatsForUI, FarmStats } from '@/services/farmStatsService';
import { Button } from '@/components/ui/button';

const FarmStatsWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FarmStats | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFarmStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching farm stats:', err);
      setError('Failed to load farm statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formattedStats = stats ? formatFarmStatsForUI(stats) : null;

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    subtitle, 
    trend, 
    color = "text-foreground" 
  }: {
    title: string;
    value: string | number;
    icon: React.ComponentType<React.ComponentProps<'svg'>>;
    subtitle?: string;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
  }) => (
    <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/50">
      <div className={`p-2 rounded-md ${color === 'text-plant' ? 'bg-plant/10' : 
                      color === 'text-tomato' ? 'bg-tomato/10' : 
                      color === 'text-warning-dark' ? 'bg-warning-light/10' : 'bg-primary/10'}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {subtitle && (
          <div className="flex items-center gap-1">
            {trend && (
              <span className={`text-xs ${
                trend === 'up' ? 'text-plant' : 
                trend === 'down' ? 'text-tomato' : 
                'text-muted-foreground'
              }`}>
                {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
                 trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
              </span>
            )}
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Farm Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 rounded-md bg-muted/50">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-md bg-muted/50">
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Farm Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-destructive text-sm mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!formattedStats) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Farm Overview
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchStats}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            title="Total Farms"
            value={formattedStats.totalFarms}
            icon={Users}
            subtitle={`CRI: ${formattedStats.averageCRI}`}
          />
          
          <StatCard
            title="Healthy Farms"
            value={formattedStats.healthyFarms}
            icon={ShieldCheck}
            subtitle={`${formattedStats.healthyPercentage}% of total`}
            color="text-plant"
          />
          
          <StatCard
            title="At Risk"
            value={formattedStats.atRiskFarms}
            icon={AlertTriangle}
            subtitle="Need attention"
            color="text-warning-dark"
          />
          
          <StatCard
            title="Critical"
            value={formattedStats.criticalFarms}
            icon={AlertTriangle}
            subtitle="Immediate action"
            color="text-tomato"
          />
        </div>

        {/* Summary Row */}
        <div className="mt-4 p-3 rounded-md bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  className={`${formattedStats.riskPercentage > 50 ? 'bg-tomato' : 
                              formattedStats.riskPercentage > 25 ? 'bg-warning-dark' : 'bg-plant'}`}
                >
                  {formattedStats.riskPercentage}% at risk
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formattedStats.totalDiagnoses} total diagnoses
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last updated</p>
              <p className="text-xs font-medium">{formattedStats.lastUpdatedRelative}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FarmStatsWidget;