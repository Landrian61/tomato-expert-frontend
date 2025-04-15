
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  AlertTriangle,
  LineChart,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Field Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Plant Diagnosis", href: "/diagnosis", icon: Sprout },
  { name: "Risk Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "My Profile", href: "/profile", icon: User }
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Generate user initials for avatar fallback
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return "TE";
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="h-full w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      <div className="flex items-center px-6 py-6">
        <div className="h-10 w-10 flex items-center justify-center">
          <img src="/tomato.svg" alt="Tomato Expert Logo" className="w-7 h-7" />
        </div>
        <h1 className="ml-3 text-xl font-semibold text-sidebar-foreground">
          Tomato Expert
        </h1>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              )}
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Logout button */}
      <div className="p-4 mt-auto">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
