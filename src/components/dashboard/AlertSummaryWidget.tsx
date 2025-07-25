import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Bell
} from "lucide-react";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: boolean;
}

const AlertSummaryWidget = () => {
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentAlerts();
  }, []);

  const fetchRecentAlerts = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock alerts based on current environmental conditions
      const mockAlerts: Alert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Late Blight Risk Detected',
          message: 'Current humidity (72%) and temperature (26.6°C) conditions favor late blight development.',
          timestamp: new Date().toISOString(),
          isRead: false,
          actionRequired: true
        },
        {
          id: '2',
          type: 'info',
          title: 'Weekly Weather Update',
          message: 'Rain expected in the next 3 days. Consider preventive fungicide application.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          isRead: false,
          actionRequired: false
        },
        {
          id: '3',
          type: 'success',
          title: 'Diagnosis Completed',
          message: 'Your recent plant diagnosis has been processed successfully.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          isRead: true,
          actionRequired: false
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Info</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800 text-xs">Success</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Unknown</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' || alert.type === 'warning').length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Alerts</CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800 text-xs">
                {unreadCount} new
              </Badge>
            )}
            {criticalCount > 0 && (
              <Badge className="bg-orange-100 text-orange-800 text-xs">
                {criticalCount} urgent
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">No active alerts</p>
            <p className="text-sm text-muted-foreground">Your farm is in good condition</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                  !alert.isRead ? 'bg-blue-50 border-blue-200' : 'bg-muted/20'
                }`}
                onClick={() => navigate('/alerts')}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">
                        {alert.title}
                      </h4>
                      {getAlertBadge(alert.type)}
                      {alert.actionRequired && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(alert.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {alerts.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => navigate('/alerts')}
              >
                View All Alerts ({alerts.length})
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertSummaryWidget;