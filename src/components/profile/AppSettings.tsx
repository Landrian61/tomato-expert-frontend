import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoonStar, Sun, MapPin, Camera, Info } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import {
  getAppPermissions,
  updateAppPermissions,
  AppPermissions
} from "@/services/notificationService";
import { toast } from "sonner";

const AppSettings: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();
  const [permissions, setPermissions] = useState<AppPermissions>({
    camera: false,
    location: false,
    notifications: false,
    dataSync: true,
    analytics: true,
    offline: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const userPermissions = await getAppPermissions();
        setPermissions(userPermissions);
      } catch (error) {
        console.error("Failed to fetch app permissions:", error);
        toast.error("Failed to load app permissions");
      }
    };

    fetchPermissions();
  }, []);

  const handlePermissionChange = async (
    key: keyof AppPermissions,
    value: boolean
  ) => {
    try {
      setIsLoading(true);
      const updatedPermissions = { ...permissions, [key]: value };
      setPermissions(updatedPermissions);
      await updateAppPermissions({ [key]: value });
      toast.success("App permissions updated");
    } catch (error) {
      console.error("Failed to update app permissions:", error);
      setPermissions(permissions); // Revert on error
      toast.error("Failed to update app permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPermission = async (permission: "camera" | "location") => {
    try {
      setIsLoading(true);
      if (permission === "camera") {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        stream.getTracks().forEach((track) => track.stop());
      } else if (permission === "location") {
        await navigator.geolocation.getCurrentPosition(() => {});
      }
      await handlePermissionChange(permission, true);
      toast.success(
        `${
          permission.charAt(0).toUpperCase() + permission.slice(1)
        } permission granted`
      );
    } catch (error) {
      console.error(`Failed to request ${permission} permission:`, error);
      toast.error(
        `Please enable ${permission} access in your browser settings`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === "light" ? (
                <Sun className="h-5 w-5 text-warning" />
              ) : (
                <MoonStar className="h-5 w-5 text-blue-400" />
              )}
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
            </div>
            <Switch
              id="theme"
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-tomato" />
              <div className="space-y-0.5">
                <Label htmlFor="camera">Camera Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow access to device camera for plant scanning
                </p>
              </div>
            </div>
            {permissions.camera ? (
              <Switch
                id="camera"
                checked={permissions.camera}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handlePermissionChange("camera", checked)
                }
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRequestPermission("camera")}
                disabled={isLoading}
              >
                Enable Camera
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-plant" />
              <div className="space-y-0.5">
                <Label htmlFor="location">Location Services</Label>
                <p className="text-sm text-muted-foreground">
                  Allow access to location for weather data
                </p>
              </div>
            </div>
            {permissions.location ? (
              <Switch
                id="location"
                checked={permissions.location}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handlePermissionChange("location", checked)
                }
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRequestPermission("location")}
                disabled={isLoading}
              >
                Enable Location
              </Button>
            )}
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Application Permissions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These permissions are used to provide you with accurate disease
            forecasting and personalized recommendations based on your location
            and field conditions.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Open browser settings
                if (navigator.permissions) {
                  navigator.permissions
                    .query({ name: "camera" as PermissionName })
                    .then(() => {
                      toast.info(
                        "Please update permissions in your browser settings"
                      );
                    })
                    .catch(() => {
                      toast.error("Unable to open browser settings");
                    });
                }
              }}
            >
              Update Permissions
            </Button>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-sync" className="cursor-pointer">
              Automatic Data Sync
            </Label>
            <Switch
              id="data-sync"
              checked={permissions.dataSync}
              disabled={isLoading}
              onCheckedChange={(checked) =>
                handlePermissionChange("dataSync", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="analytics" className="cursor-pointer">
              Share Analytics
            </Label>
            <Switch
              id="analytics"
              checked={permissions.analytics}
              disabled={isLoading}
              onCheckedChange={(checked) =>
                handlePermissionChange("analytics", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="offline" className="cursor-pointer">
              Offline Mode
            </Label>
            <Switch
              id="offline"
              checked={permissions.offline}
              disabled={isLoading}
              onCheckedChange={(checked) =>
                handlePermissionChange("offline", checked)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppSettings;
