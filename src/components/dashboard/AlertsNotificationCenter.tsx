import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  MoreHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: "critical" | "warning" | "info" | "success";
  priority: "high" | "medium" | "low";
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  category: "blight" | "weather" | "system" | "recommendation";
}

interface AlertsNotificationCenterProps {
  alerts?: Alert[];
  maxVisible?: number;
}

const AlertsNotificationCenter: React.FC<AlertsNotificationCenterProps> = ({
  alerts = mockAlerts,
  maxVisible = 5
}) => {
  const [showAll, setShowAll] = useState(false);
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertBadge = (type: string, priority: string) => {
    const isHighPriority = priority === "high";
    switch (type) {
      case "critical":
        return (
          <Badge variant="destructive" className={isHighPriority ? "animate-pulse" : ""}>
            Critical
          </Badge>
        );
      case "warning":
        return <Badge className="bg-orange-500 text-white">Warning</Badge>;
      case "info":
        return <Badge variant="outline">Info</Badge>;
      case "success":
        return <Badge className="bg-green-500 text-white">Success</Badge>;
      default:
        return <Badge variant="secondary">Alert</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "blight":
        return "🍅";
      case "weather":
        return "🌦️";
      case "system":
        return "⚙️";
      case "recommendation":
        return "💡";
      default:
        return "📢";
    }
  };

  const markAsRead = (alertId: string) => {
    setLocalAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  const unreadCount = localAlerts.filter(alert => !alert.read).length;
  const criticalCount = localAlerts.filter(alert => alert.type === "critical").length;
  const displayedAlerts = showAll ? localAlerts : localAlerts.slice(0, maxVisible);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Alerts & Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {localAlerts.length > maxVisible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-xs"
            >
              {showAll ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Show All ({localAlerts.length})
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Critical Alerts Summary */}
        {criticalCount > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="font-medium text-red-800">
                {criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""} Require Immediate Attention
              </span>
            </div>
          </div>
        )}

        <ScrollArea className={showAll ? "h-80" : "h-auto"}>
          <div className="space-y-3">
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  alert.read
                    ? "bg-muted/30 border-muted"
                    : "bg-background border-border shadow-sm"
                } ${
                  alert.type === "critical" && !alert.read
                    ? "ring-2 ring-red-200"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{getCategoryIcon(alert.category)}</span>
                          <h4 className={`text-sm font-medium ${!alert.read ? "font-semibold" : ""}`}>
                            {alert.title}
                          </h4>
                          {getAlertBadge(alert.type, alert.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!alert.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(alert.id)}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {alert.actionable && (
                      <div className="mt-2 pt-2 border-t border-muted">
                        <Button size="sm" variant="outline" className="text-xs">
                          Take Action
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {localAlerts.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No alerts at this time</p>
            <p className="text-xs text-muted-foreground">All systems are running normally</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Mock data for development/testing
const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "High Blight Risk Detected",
    message: "Weather conditions favor late blight development. Consider preventive spraying within 24 hours.",
    type: "critical",
    priority: "high",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionable: true,
    category: "blight"
  },
  {
    id: "2",
    title: "Heavy Rain Expected",
    message: "Forecast shows 15mm rainfall tomorrow. Monitor soil drainage and plant humidity levels.",
    type: "warning",
    priority: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionable: true,
    category: "weather"
  },
  {
    id: "3",
    title: "Weekly Report Ready",
    message: "Your farm performance summary for this week is now available.",
    type: "info",
    priority: "low",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: true,
    actionable: false,
    category: "system"
  },
  {
    id: "4",
    title: "Optimal Planting Conditions",
    message: "Weather conditions are ideal for tomato planting in your area this weekend.",
    type: "success",
    priority: "medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: false,
    actionable: false,
    category: "recommendation"
  }
];

export default AlertsNotificationCenter;