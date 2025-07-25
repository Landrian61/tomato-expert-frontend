import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Bell,
  MapPin,
  TrendingUp,
  Settings,
  FileText,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: {
    text: string;
    variant: "default" | "destructive" | "outline" | "secondary";
  };
  urgent?: boolean;
}

interface QuickActionsPanelProps {
  actions?: QuickAction[];
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  actions = defaultActions
}) => {
  const navigate = useNavigate();

  const handleActionClick = (href: string) => {
    navigate(href);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-tomato" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-start text-left space-y-2 relative ${
                action.urgent ? "border-tomato bg-tomato/5" : ""
              }`}
              onClick={() => handleActionClick(action.href)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {action.icon}
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                {action.badge && (
                  <Badge variant={action.badge.variant} className="text-xs">
                    {action.badge.text}
                  </Badge>
                )}
                {action.urgent && (
                  <AlertCircle className="h-3 w-3 text-tomato absolute top-2 right-2" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </Button>
          ))}
        </div>

        {/* Emergency Actions */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-tomato" />
            <span className="text-sm font-medium">Emergency Actions</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="h-auto p-3"
              onClick={() => handleActionClick("/alerts")}
            >
              <Bell className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="text-sm font-medium">View All Alerts</div>
                <div className="text-xs opacity-90">Check critical warnings</div>
              </div>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-auto p-3"
              onClick={() => handleActionClick("/diagnosis")}
            >
              <Camera className="h-4 w-4 mr-2" />
              <div className="text-left">
                <div className="text-sm font-medium">Emergency Diagnosis</div>
                <div className="text-xs opacity-75">Quick plant check</div>
              </div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Default actions data
const defaultActions: QuickAction[] = [
  {
    id: "diagnose",
    title: "Plant Diagnosis",
    description: "Upload plant images for AI analysis",
    icon: <Camera className="h-4 w-4 text-blue-600" />,
    href: "/diagnosis",
    badge: {
      text: "AI Powered",
      variant: "secondary"
    }
  },
  {
    id: "analytics",
    title: "View Analytics",
    description: "Check farm performance and trends",
    icon: <TrendingUp className="h-4 w-4 text-green-600" />,
    href: "/analytics"
  },
  {
    id: "alerts",
    title: "Risk Alerts",
    description: "Manage notifications and warnings",
    icon: <Bell className="h-4 w-4 text-orange-600" />,
    href: "/alerts",
    badge: {
      text: "3 New",
      variant: "destructive"
    },
    urgent: true
  },
  {
    id: "profile",
    title: "Farm Settings",
    description: "Update location and preferences",
    icon: <MapPin className="h-4 w-4 text-purple-600" />,
    href: "/profile"
  },
  {
    id: "settings",
    title: "App Settings",
    description: "Configure notifications and display",
    icon: <Settings className="h-4 w-4 text-gray-600" />,
    href: "/profile"
  },
  {
    id: "reports",
    title: "Generate Report",
    description: "Export farm data and insights",
    icon: <FileText className="h-4 w-4 text-indigo-600" />,
    href: "/analytics",
    badge: {
      text: "Premium",
      variant: "outline"
    }
  }
];

export default QuickActionsPanel;