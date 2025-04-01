import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  updateNotificationSettings,
  getNotificationSettings,
  requestNotificationPermission,
  NotificationSettings as NotificationSettingsType
} from "@/services/notificationService";

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettingsType>({
    enablePush: false,
    enableEmail: true,
    weatherAlerts: true,
    blightRiskAlerts: true,
    farmingTips: true,
    diagnosisResults: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] =
    useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userSettings = await getNotificationSettings();
        setSettings(userSettings);

        // Check if we have notification permission
        const hasPermission = await requestNotificationPermission();
        setHasNotificationPermission(hasPermission);

        // If we have permission but push notifications are disabled, enable them
        if (hasPermission && !userSettings.enablePush) {
          await handleSettingChange("enablePush", true);
        }
      } catch (error) {
        console.error("Failed to fetch notification settings:", error);
        toast.error("Failed to load notification settings");
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (
    key: keyof NotificationSettingsType,
    value: boolean
  ) => {
    try {
      setIsLoading(true);

      // If enabling push notifications, check for permission first
      if (key === "enablePush" && value) {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          toast.error("Please enable notifications in your browser settings");
          return;
        }
        setHasNotificationPermission(true);
      }

      const updatedSettings = { ...settings, [key]: value };
      setSettings(updatedSettings);

      // Update only the changed setting
      const updateData = { [key]: value };
      await updateNotificationSettings(updateData);

      toast.success("Notification settings updated");
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      // Revert the change on error
      setSettings(settings);
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPermission = async () => {
    try {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        setHasNotificationPermission(true);
        await handleSettingChange("enablePush", true);
        toast.success("Push notifications enabled");
      } else {
        toast.error("Please enable notifications in your browser settings");
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      toast.error("Failed to enable push notifications");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts even when the app is closed
              </p>
            </div>
            {hasNotificationPermission ? (
              <Switch
                id="push"
                checked={settings.enablePush}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handleSettingChange("enablePush", checked)
                }
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestPermission}
                disabled={isLoading}
              >
                Enable Push Notifications
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive daily summaries and critical alerts via email
              </p>
            </div>
            <Switch
              id="email"
              checked={settings.enableEmail}
              disabled={isLoading}
              onCheckedChange={(checked) =>
                handleSettingChange("enableEmail", checked)
              }
            />
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-medium mb-3">Alert Types</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="blight-alerts" className="cursor-pointer">
                Blight Risk Alerts
              </Label>
              <Switch
                id="blight-alerts"
                checked={settings.blightRiskAlerts}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handleSettingChange("blightRiskAlerts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="weather-alerts" className="cursor-pointer">
                Weather Alerts
              </Label>
              <Switch
                id="weather-alerts"
                checked={settings.weatherAlerts}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handleSettingChange("weatherAlerts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="farming-tips" className="cursor-pointer">
                Farming Tips
              </Label>
              <Switch
                id="farming-tips"
                checked={settings.farmingTips}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handleSettingChange("farmingTips", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="diagnosis-results" className="cursor-pointer">
                Diagnosis Results
              </Label>
              <Switch
                id="diagnosis-results"
                checked={settings.diagnosisResults}
                disabled={isLoading}
                onCheckedChange={(checked) =>
                  handleSettingChange("diagnosisResults", checked)
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
