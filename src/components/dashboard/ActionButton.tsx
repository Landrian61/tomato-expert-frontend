
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  title: string;
  icon: React.ReactNode;
  href: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, icon, href, variant = "outline" }) => {
  return (
    <Button
      variant={variant}
      className={cn(
        "h-auto flex flex-col items-center justify-center px-4 py-3 w-full",
        variant === "default" ? "text-primary-foreground" : "text-foreground"
      )}
      asChild
    >
      <Link to={href}>
        <div className="mb-1">{icon}</div>
        <span className="text-xs">{title}</span>
      </Link>
    </Button>
  );
};

export default ActionButton;
