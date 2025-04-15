import React, { useState, useEffect } from "react";
import { Bell, BellOff, Loader2, RefreshCw } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PushNotificationToggleProps {
  className?: string;
}

const PushNotificationToggle: React.FC<PushNotificationToggleProps> = ({
  className = ""
}) => {
  const {
    pushSupported,
    pushPermission,
    requestPushPermission,
    subscribeToPush,
    unsubscribeFromPush
  } = useNotifications();

  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(pushPermission === "granted");

  // Update the checked state when permission changes
  useEffect(() => {
    setIsChecked(pushPermission === "granted");
  }, [pushPermission]);

  // Handle toggling push notifications with better error handling
  const handleToggle = async (enabled: boolean) => {
    // Prevent state change until the operation completes
    setLoading(true);

    try {
      if (enabled) {
        // Request permission if not granted yet
        if (pushPermission !== "granted") {
          console.log("Requesting permission...");
          const granted = await requestPushPermission();

          if (!granted) {
            toast.error(
              "Permission denied. You need to allow notifications in your browser settings."
            );
            setLoading(false);
            return; // Don't update isChecked state
          }
        }

        // Subscribe to push notifications
        console.log("Subscribing to push notifications...");
        try {
          const subscribed = await subscribeToPush();

          if (subscribed) {
            setIsChecked(true);
            toast.success("Push notifications enabled successfully");
          } else {
            console.error(
              "Subscription returned false but no error was thrown"
            );
            toast.error(
              "Failed to enable push notifications. Please try refreshing the page."
            );
            setLoading(false);
            return; // Don't update isChecked state
          }
        } catch (subError: any) {
          console.error("Subscription error:", subError);
          let errorMessage = "Failed to enable push notifications.";

          if (subError.message) {
            if (subError.message.includes("messaging/permission-blocked")) {
              errorMessage =
                "Notification permission was denied in your browser.";
            } else if (
              subError.message.includes("messaging/token-subscribe-failed")
            ) {
              errorMessage =
                "Failed to subscribe. Please try refreshing the page.";
            } else {
              errorMessage += " " + subError.message;
            }
          }

          toast.error(errorMessage);
          setLoading(false);
          return;
        }
      } else {
        // Unsubscribe from push notifications
        console.log("Unsubscribing from push notifications...");
        try {
          const unsubscribed = await unsubscribeFromPush();

          if (unsubscribed) {
            setIsChecked(false);
            toast.success("Push notifications disabled successfully");
          } else {
            toast.error(
              "Failed to disable push notifications. Please try again."
            );
            return; // Don't update isChecked state
          }
        } catch (unsubError: any) {
          console.error("Unsubscribe error:", unsubError);

          // If the error is related to message channel closing, treat it as success
          if (unsubError.message?.includes("message channel closed")) {
            setIsChecked(false);
            toast.success("Push notifications disabled successfully");
          } else {
            toast.error(
              "Failed to disable notifications: " +
                (unsubError.message || "Unknown error")
            );
            return; // Don't update isChecked state
          }
        }
      }
    } catch (error: any) {
      console.error("Error toggling push notifications:", error);
      toast.error("An error occurred: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!pushSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in your browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get instant alerts about disease risks, weather changes, and diagnosis
          results.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">
              {isChecked
                ? "Notifications are enabled"
                : "Notifications are disabled"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isChecked
                ? "You will receive notifications even when the app is closed"
                : "Enable notifications to stay updated"}
            </p>
          </div>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Switch
              checked={isChecked}
              onCheckedChange={handleToggle}
              disabled={loading || pushPermission === "denied"}
              aria-label="Toggle push notifications"
            />
          )}
        </div>

        {!isChecked && !loading && (
          <Alert className="mt-4">
            <RefreshCw className="h-4 w-4" />
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              If you experience any issues enabling notifications, try
              refreshing your browser.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {pushPermission === "denied" && (
        <CardFooter>
          <p className="text-sm text-destructive">
            Notifications are blocked. Please update your browser settings to
            allow notifications.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default PushNotificationToggle;
