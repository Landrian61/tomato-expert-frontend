import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  AlertTriangle, 
  BarChart3, 
  MapPin, 
  RefreshCw,
  Plus,
  Bell,
  Settings
} from "lucide-react";
import { toast } from "sonner";

const QuickActionsWidget = () => {
  const navigate = useNavigate();

  const handleRefreshData = () => {
    toast.info("Refreshing all dashboard data...");
    // Trigger a page refresh to reload all data
    window.location.reload();
  };

  const quickActions = [
    {
      id: 'new-diagnosis',
      title: 'New Diagnosis',
      description: 'Scan plant for diseases',
      icon: <Camera className="h-5 w-5" />,
      action: () => navigate('/diagnosis'),
      variant: 'default' as const,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'view-alerts',
      title: 'Risk Alerts',
      description: 'Check active warnings',
      icon: <AlertTriangle className="h-5 w-5" />,
      action: () => navigate('/alerts'),
      variant: 'secondary' as const,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View detailed reports',
      icon: <BarChart3 className="h-5 w-5" />,
      action: () => navigate('/analytics'),
      variant: 'outline' as const,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'update-location',
      title: 'Update Location',
      description: 'Set farm coordinates',
      icon: <MapPin className="h-5 w-5" />,
      action: () => {
        toast.info("Location update feature coming soon");
        // For now, just show a toast. In real implementation, this would open a location update modal
      },
      variant: 'outline' as const,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'refresh-data',
      title: 'Refresh Data',
      description: 'Update all information',
      icon: <RefreshCw className="h-5 w-5" />,
      action: handleRefreshData,
      variant: 'ghost' as const,
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts',
      icon: <Bell className="h-5 w-5" />,
      action: () => {
        toast.info("Notification settings coming soon");
      },
      variant: 'ghost' as const,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className="h-auto p-4 flex flex-col items-center gap-2 text-center"
              onClick={action.action}
            >
              <div className={`p-2 rounded-full ${action.color} text-white`}>
                {action.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
        
        {/* Additional Action: Emergency Contact */}
        <div className="mt-4 pt-3 border-t">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={() => toast.error("Emergency feature: Contact agricultural extension officer")}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsWidget;