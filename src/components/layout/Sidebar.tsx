
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sprout, AlertTriangle, LineChart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Field Overview', href: '/', icon: LayoutDashboard },
  { name: 'Plant Diagnosis', href: '/diagnosis', icon: Sprout },
  { name: 'Risk Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Field Insights', href: '/insights', icon: LineChart },
  { name: 'My Profile', href: '/profile', icon: User }
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="h-full w-64 border-r bg-card flex flex-col">
      <div className="flex items-center px-6 py-6">
        <div className="h-10 w-10 rounded-full bg-tomato flex items-center justify-center">
          <span className="text-white font-bold">TE</span>
        </div>
        <h1 className="ml-3 text-xl font-semibold text-foreground">Tomato Expert</h1>
      </div>
      <Separator />
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-primary/10"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <div className="p-4">
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Risk Alert</h3>
              <p className="text-xs mt-1">Early blight risk increased by 15%</p>
              <Button size="sm" variant="outline" className="mt-2 w-full text-xs">View Details</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
