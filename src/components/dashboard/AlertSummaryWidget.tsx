import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Clock,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  farmLocation?: string;
  isRead: boolean;
}

const AlertSummaryWidget: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // Simulate API call - in real implementation, this would call an alerts service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock alerts data
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'critical',
          title: 'High Late Blight Risk',
          description: 'Weather conditions indicate high late blight risk for the next 48 hours',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          farmLocation: 'Farm A - Kampala',
          isRead: false
        },
        {
          id: '2',
          type: 'warning',
          title: 'Humidity Spike Detected',
          description: 'Humidity levels exceeded 80% - monitor plants closely',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          farmLocation: 'Farm B - Entebbe',
          isRead: false
        },
        {
          id: '3',
          type: 'info',
          title: 'Weekly Report Available',
          description: 'Your weekly farm analysis report is ready for review',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: true
        },
        {
          id: '4',
          type: 'warning',
          title: 'Soil Moisture Low',
          description: 'Soil moisture levels below optimal range in sector 3',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          farmLocation: 'Farm C - Jinja',
          isRead: true
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-tomato" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning-dark" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-tomato text-white';
      case 'warning':
        return 'bg-warning-dark text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical');

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Alerts
            {unreadAlerts.length > 0 && (
              <Badge className="bg-tomato text-white text-xs">
                {unreadAlerts.length}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchAlerts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts at this time</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-md bg-tomato/10">
                <p className="text-xl font-bold text-tomato">{criticalAlerts.length}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
              <div className="text-center p-2 rounded-md bg-warning-light/10">
                <p className="text-xl font-bold text-warning-dark">
                  {alerts.filter(a => a.type === 'warning').length}
                </p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
              <div className="text-center p-2 rounded-md bg-blue-500/10">
                <p className="text-xl font-bold text-blue-500">
                  {alerts.filter(a => a.type === 'info').length}
                </p>
                <p className="text-xs text-muted-foreground">Info</p>
              </div>
            </div>

            {/* Recent Alerts List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {alerts.slice(0, 4).map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-md border transition-colors hover:bg-muted/50 cursor-pointer ${
                    !alert.isRead ? 'bg-muted/30 border-l-4 border-l-tomato' : 'bg-muted/10'
                  }`}
                  onClick={() => navigate('/alerts')}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {alert.title}
                        </h4>
                        <Badge className={`text-xs ${getAlertBadgeColor(alert.type)}`}>
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(alert.timestamp)}</span>
                        {alert.farmLocation && (
                          <>
                            <span>•</span>
                            <span>{alert.farmLocation}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate('/alerts')}
            >
              View All Alerts
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertSummaryWidget;