import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import {
  getNotifications,
  type Notification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NotificationResponse
} from "@/services/notificationService";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications
} from "@/services/pushNotificationService";
import { onMessageListener } from "@/services/firebaseService";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  pushSupported: boolean;
  pushPermission: NotificationPermission;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  requestPushPermission: () => Promise<boolean>;
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pushSupported, setPushSupported] = useState<boolean>(false);
  const [pushPermission, setPushPermission] =
    useState<NotificationPermission>("default");

  // Initialize push notification support
  useEffect(() => {
    const checkPushSupport = async () => {
      const supported = await isPushSupported();
      setPushSupported(supported);

      if (supported) {
        // Get current permission status
        const permission = getNotificationPermission();
        setPushPermission(permission);

        // Register service worker
        try {
          await registerServiceWorker();

          // If permission is already granted, try to subscribe
          if (
            permission === "granted" &&
            (localStorage.getItem("token") || localStorage.getItem("authData"))
          ) {
            await subscribeToPushNotifications();

            // Set up foreground message handler with improved notification handling
            onMessageListener((payload) => {
              console.log("Received foreground message:", payload);

              // Always refresh notifications list
              fetchNotifications();

              // Show a local browser notification for every message received
              if (Notification.permission === "granted") {
                try {
                  const title = payload.notification?.title || "Tomato Expert";
                  const options = {
                    body:
                      payload.notification?.body ||
                      "You have a new notification",
                    icon: "/android-chrome-192x192.png",
                    badge: "/favicon.ico",
                    data: payload.data || {},
                    tag: payload.data?.notificationId || "general",
                    renotify: true,
                    vibrate: [200, 100, 200],
                    actions:
                      payload.data?.action === "diagnose"
                        ? [
                            {
                              action: "diagnose",
                              title: "Diagnose Now"
                            }
                          ]
                        : undefined
                  };

                  // Create and show the notification
                  const notification = new Notification(title, options);

                  // Add click handler to the notification
                  notification.onclick = (event) => {
                    // Focus the window and navigate as needed
                    window.focus();

                    // Special handling for blight risk notifications
                    if (payload.data?.type === "blight") {
                      window.location.href = "/diagnosis";
                      return;
                    }

                    // Handle other notification click logic
                    if (payload.data?.action === "diagnose") {
                      window.location.href = "/diagnosis";
                    } else if (payload.data?.type === "diagnosis") {
                      window.location.href = `/diagnosis/${
                        payload.data.diagnosisId || ""
                      }`;
                    } else if (payload.data?.type === "weather") {
                      window.location.href = "/insights";
                    } else if (payload.data?.type === "tip") {
                      window.location.href = "/tips";
                    } else if (payload.data?.url) {
                      window.location.href = payload.data.url;
                    }
                  };
                } catch (error) {
                  console.error("Error showing local notification:", error);
                }
              }
            });
          }
        } catch (error) {
          console.error("Error initializing push notifications:", error);
        }
      }
    };

    checkPushSupport();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response: NotificationResponse = await getNotifications({
        read: false
      });
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Request permission for push notifications
  const requestPushPermission = async (): Promise<boolean> => {
    if (!pushSupported) return false;

    try {
      const permission = await requestNotificationPermission();
      setPushPermission(permission);
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  // Subscribe to push notifications
  const subscribeToPush = async (): Promise<boolean> => {
    if (!pushSupported || pushPermission !== "granted") return false;

    try {
      const token = await subscribeToPushNotifications();
      return !!token;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      return false;
    }
  };

  // Unsubscribe from push notifications
  const unsubscribeFromPush = async (): Promise<boolean> => {
    if (!pushSupported) return false;

    try {
      return await unsubscribeFromPushNotifications();
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      return false;
    }
  };

  // Initial fetch
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, []);

  // Periodic polling (every 1 minute)
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    pushSupported,
    pushPermission,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    requestPushPermission,
    subscribeToPush,
    unsubscribeFromPush
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
