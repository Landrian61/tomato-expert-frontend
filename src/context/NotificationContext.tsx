import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import {
  getNotifications,
  Notification,
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
  const [serviceWorkerRegistration, setServiceWorkerRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  // Initialize push notification support
  useEffect(() => {
    const supported = isPushSupported();
    setPushSupported(supported);

    if (supported) {
      // Get current permission status
      const permission = getNotificationPermission();
      setPushPermission(permission);

      // Register service worker
      const registerSW = async () => {
        try {
          const registration = await registerServiceWorker();
          setServiceWorkerRegistration(registration);

          // If permission is already granted, try to subscribe
          if (permission === "granted" && localStorage.getItem("token")) {
            await subscribeToPushNotifications();
          }
        } catch (error) {
          console.error("Error registering service worker:", error);
        }
      };

      registerSW();
    }
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
      const subscription = await subscribeToPushNotifications();
      return !!subscription;
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
