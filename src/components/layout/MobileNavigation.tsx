import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Sprout, AlertTriangle, LineChart, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Diagnosis", href: "/diagnosis", icon: Sprout },
  { name: "Analytics", href: "/analytics", icon: LineChart },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Profile", href: "/profile", icon: User }
];

const MobileNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-sidebar border-t border-sidebar-border">
      <div className="grid grid-cols-5">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center px-2 py-2 text-[10px] font-medium",
              location.pathname === item.href
                ? "text-primary"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 mb-0.5",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-sidebar-foreground/70"
              )}
              aria-hidden="true"
            />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
