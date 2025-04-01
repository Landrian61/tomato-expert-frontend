import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import AlertCard from "@/components/alerts/AlertCard";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Info,
  RefreshCw,
  Check,
  Send,
  AlertCircle,
  Filter
} from "lucide-react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  Notification,
  NotificationResponse,
  requestTestTip
} from "@/services/notificationService";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

const Alerts = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>("all");
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setAuthError(false);
      let filters = {};

      if (filter === "unread") {
        filters = { read: false };
      } else if (filter === "critical") {
        filters = { type: "blight" }; // Assuming blight notifications are critical
      }

      const response: NotificationResponse = await getNotifications(filters);
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      if (
        error.message?.includes("Authentication token") ||
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setFilterSheetOpen(false); // Close filter sheet after selection on mobile
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleSendTestTip = async () => {
    try {
      setSendingTest(true);
      setAuthError(false);
      await requestTestTip();
      toast.success("Test farming tip sent successfully");

      // Wait a moment before refreshing to allow the backend to process
      setTimeout(() => {
        fetchNotifications();
      }, 1000);
    } catch (error: any) {
      console.error("Error sending test tip:", error);
      // Display a more detailed error message
      toast.error(error.message || "Failed to send test tip");

      if (
        error.message?.includes("Authentication token") ||
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setAuthError(true);
      }
    } finally {
      setSendingTest(false);
    }
  };

  const handleRelogin = () => {
    navigate("/login");
  };

  // Desktop filter options
  const DesktopFilterOptions = () => (
    <RadioGroup
      value={filter}
      onValueChange={handleFilterChange}
      className="flex items-center space-x-3"
    >
      <div className="flex items-center space-x-1">
        <RadioGroupItem value="all" id="all" />
        <Label htmlFor="all" className="text-sm">
          All
        </Label>
      </div>
      <div className="flex items-center space-x-1">
        <RadioGroupItem value="unread" id="unread" />
        <Label htmlFor="unread" className="text-sm">
          Unread
        </Label>
      </div>
      <div className="flex items-center space-x-1">
        <RadioGroupItem value="critical" id="critical" />
        <Label htmlFor="critical" className="text-sm">
          Critical
        </Label>
      </div>
    </RadioGroup>
  );

  // Mobile filter options inside sheet
  const MobileFilterOptions = () => (
    <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filter
          {filter !== "all" && (
            <Badge className="ml-2 bg-primary/20 text-primary">{filter}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto rounded-t-xl pb-8">
        <SheetHeader className="mb-4">
          <SheetTitle>Filter Notifications</SheetTitle>
          <SheetDescription>
            Select a filter to view specific notifications
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4">
          <RadioGroup
            value={filter}
            onValueChange={handleFilterChange}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3 p-2 rounded hover:bg-accent">
              <RadioGroupItem value="all" id="mobile-all" />
              <Label htmlFor="mobile-all" className="flex-1 cursor-pointer">
                All Notifications
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded hover:bg-accent">
              <RadioGroupItem value="unread" id="mobile-unread" />
              <Label htmlFor="mobile-unread" className="flex-1 cursor-pointer">
                Unread Only
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded hover:bg-accent">
              <RadioGroupItem value="critical" id="mobile-critical" />
              <Label
                htmlFor="mobile-critical"
                className="flex-1 cursor-pointer"
              >
                Critical Alerts
              </Label>
            </div>
          </RadioGroup>
          <div className="grid grid-cols-2 gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setFilterSheetOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setFilterSheetOpen(false)}
              className="w-full"
            >
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <Layout title="Notifications">
      <div className="space-y-6">
        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex flex-col sm:flex-row items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-red-800">Authentication Error</h3>
              <p className="text-sm text-red-700 mt-1">
                Your session may have expired. Please log in again to continue
                using the notifications feature.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRelogin}
                className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
              >
                Go to Login
              </Button>
            </div>
          </div>
        )}

        {/* Header section - Responsive layout */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">
                {notifications.length} Notifications
              </h2>
              {unreadCount > 0 && (
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  {unreadCount} Unread
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchNotifications}
                disabled={loading}
                className="h-8 w-8"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Desktop filters */}
              <div className="hidden md:block">
                <DesktopFilterOptions />
              </div>

              {/* Mobile filter sheet */}
              <MobileFilterOptions />

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="whitespace-nowrap"
                  >
                    <Check className="h-4 w-4 mr-2 sm:mr-1" />
                    <span className="hidden sm:inline mr-1">Mark All</span>
                    Read
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendTestTip}
                  disabled={sendingTest}
                >
                  <Send className="h-4 w-4 mr-2 sm:mr-1" />
                  <span className="hidden sm:inline">Test</span>
                  <span className="sm:hidden">Test</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications list - Responsive for all screens */}
        <div>
          {loading ? (
            <div className="flex justify-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <AlertCard
                  key={notification._id}
                  notification={notification}
                  onUpdate={fetchNotifications}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <Info className="h-8 w-8 text-muted-foreground/50" />
                <p>No notifications found</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSendTestTip}
                  disabled={sendingTest}
                  className="mt-2"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Create Test Notification
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Risk levels info card - Made responsive */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="shrink-0 mt-1 flex justify-center sm:justify-start">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium mb-2 text-center sm:text-left">
                  About Risk Levels
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-2 border rounded-md bg-background/50">
                    <p className="font-medium text-plant mb-1">Low Risk</p>
                    <p className="text-muted-foreground">
                      Conditions are favorable for plant growth. Routine
                      monitoring recommended.
                    </p>
                  </div>
                  <div className="p-2 border rounded-md bg-background/50">
                    <p className="font-medium text-warning-light mb-1">
                      Medium Risk
                    </p>
                    <p className="text-muted-foreground">
                      Early signs of potential issues. Consider preventative
                      measures.
                    </p>
                  </div>
                  <div className="p-2 border rounded-md bg-background/50">
                    <p className="font-medium text-warning-dark mb-1">
                      High Risk
                    </p>
                    <p className="text-muted-foreground">
                      Immediate attention needed. Conditions favor disease
                      development.
                    </p>
                  </div>
                  <div className="p-2 border rounded-md bg-background/50">
                    <p className="font-medium text-tomato mb-1">
                      Critical Risk
                    </p>
                    <p className="text-muted-foreground">
                      Urgent action required. High likelihood of rapid disease
                      spread.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Alerts;
