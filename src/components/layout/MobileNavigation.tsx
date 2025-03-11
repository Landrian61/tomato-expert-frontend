
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, AlertTriangle, LineChart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Diagnosis', href: '/diagnosis', icon: Sprout },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Insights', href: '/insights', icon: LineChart },
  { name: 'Profile', href: '/profile', icon: User }
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
              "flex flex-col items-center justify-center px-2 py-3 text-xs font-medium",
              location.pathname === item.href
                ? "text-sidebar-primary-foreground"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" aria-hidden="true" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
