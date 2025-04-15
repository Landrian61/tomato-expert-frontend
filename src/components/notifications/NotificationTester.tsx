import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { requestTestTip } from "@/services/notificationService";
import { Bell, BellRing, RefreshCw } from "lucide-react";

const NotificationTester: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [swRegistered, setSwRegistered] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  // Check status of notification components
  const checkStatus = async () => {
    setLoading(true);
    try {
      // Check token
      const token = localStorage.getItem("fcmToken");
      setFcmToken(token);

      // Check service worker
      const registration = await navigator.serviceWorker.getRegistration(
        "/firebase-messaging-sw.js"
      );
      setSwRegistered(!!registration);

      // Check permission
      setPermission(Notification.permission);

      toast.success("Status checked successfully");
    } catch (error) {
      console.error("Error checking notification status:", error);
      toast.error("Failed to check notification status");
    } finally {
      setLoading(false);
    }
  };

  // Send a test notification
  const sendTestNotification = async () => {
    setLoading(true);
    try {
      await requestTestTip();
      toast.success("Test notification sent! Check your notifications.");
    } catch (error: any) {
      console.error("Error sending test notification:", error);
      toast.error(error.message || "Failed to send test notification");
    } finally {
      setLoading(false);
    }
  };

  // Show a local notification (not through FCM)
  const showLocalNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Local Test Notification", {
        body: "This is a local browser notification (not through Firebase)",
        icon: "/android-chrome-192x192.png"
      });
      toast.success("Local notification triggered");
    } else {
      toast.error("Notification permission not granted");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Testing Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Check Status
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={sendTestNotification}
            disabled={loading}
          >
            <BellRing className="h-4 w-4 mr-2" />
            Send FCM Test Notification
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={showLocalNotification}
            disabled={permission !== "granted"}
          >
            <Bell className="h-4 w-4 mr-2" />
            Show Local Notification
          </Button>
        </div>

        {/* Status display */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium">Permission:</span>
            <Badge
              variant={
                permission === "granted"
                  ? "default"
                  : permission === "denied"
                  ? "destructive"
                  : "outline"
              }
            >
              {permission}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Service Worker:</span>
            <Badge
              variant={
                swRegistered === true
                  ? "default"
                  : swRegistered === false
                  ? "destructive"
                  : "outline"
              }
            >
              {swRegistered === null
                ? "Unknown"
                : swRegistered
                ? "Registered"
                : "Not Registered"}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">FCM Token:</span>
            <Badge variant={fcmToken ? "default" : "destructive"}>
              {fcmToken ? "Available" : "Not Found"}
            </Badge>
          </div>

          {fcmToken && (
            <div className="mt-2">
              <Label htmlFor="token" className="text-xs">
                Token (first 10 characters):
              </Label>
              <Input
                id="token"
                value={fcmToken.substring(0, 10) + "..."}
                readOnly
                className="text-xs font-mono mt-1"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTester;
