import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Info, Clock } from "lucide-react";
import { Notification } from "@/services/notificationService";
import { markNotificationAsRead } from "@/services/notificationService";
import { formatDistance } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface AlertCardProps {
  notification: Notification;
  onUpdate?: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ notification, onUpdate }) => {
  const { _id, title, message, priority, type, read, createdAt } = notification;

  // Map the backend priority to UI risk level
  const getRiskLevel = () => {
    switch (priority) {
      case "low":
        return "low";
      case "medium":
        return "medium";
      case "high":
        return "high";
      case "urgent":
        return "critical";
      default:
        return "medium";
    }
  };

  const riskLevel = getRiskLevel();

  const getRiskBadge = () => {
    switch (riskLevel) {
      case "low":
        return <Badge className="bg-plant">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-warning-light">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-warning-dark">High Risk</Badge>;
      case "critical":
        return <Badge className="bg-tomato">Critical Risk</Badge>;
      default:
        return null;
    }
  };

  const getIcon = () => {
    switch (riskLevel) {
      case "low":
        return <Info className="h-5 w-5 sm:h-6 sm:w-6 text-plant" />;
      case "medium":
        return <Info className="h-5 w-5 sm:h-6 sm:w-6 text-warning-light" />;
      case "high":
        return (
          <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-warning-dark" />
        );
      case "critical":
        return <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-tomato" />;
      default:
        return null;
    }
  };

  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch (error) {
      return timestamp;
    }
  };

  // Handle marking notification as read
  const handleMarkAsRead = async () => {
    try {
      await markNotificationAsRead(_id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <Collapsible className={`${read ? "opacity-80" : ""}`}>
      <Card className="mb-0 overflow-hidden">
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="flex flex-row items-start justify-between p-3 sm:p-4 pb-2 sm:pb-3 cursor-pointer">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 shrink-0">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm sm:text-base truncate max-w-[180px] sm:max-w-full">
                    {title}
                  </h3>
                  {!read && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2">
                    {message}
                  </p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="truncate">{formatTimestamp(createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 sm:gap-2 ml-2 shrink-0">
              {getRiskBadge()}
              <Badge variant="outline" className="text-xs">
                {type}
              </Badge>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pt-1 pb-0 sm:hidden">
            <p className="text-sm text-muted-foreground mb-3">{message}</p>
          </div>

          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-1 border-t">
            <div className="flex flex-col sm:flex-row gap-2">
              {notification.data && (
                <Button size="sm" className="sm:flex-1">
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              )}
              {!read && (
                <Button
                  size="sm"
                  variant="outline"
                  className="sm:flex-1"
                  onClick={handleMarkAsRead}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default AlertCard;
