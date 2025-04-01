import React from 'react';
import { Bell } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationContext';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNavigateToAlerts = () => {
    navigate('/alerts');
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
  };

  // Get only the most recent 5 notifications
  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] min-h-[18px] flex items-center justify-center bg-red-500 hover:bg-red-600"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : recentNotifications.length > 0 ? (
          <>
            {recentNotifications.map((notification) => (
              <DropdownMenuItem 
                key={notification._id} 
                className="p-0 focus:bg-transparent"
              >
                <div 
                  className={`p-3 w-full cursor-pointer hover:bg-accent ${!notification.read ? 'bg-accent/10' : ''}`} 
                  onClick={handleNavigateToAlerts}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-medium line-clamp-1">
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-xs"
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                    {notification.message}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center" onClick={handleNavigateToAlerts}>
              View all notifications
            </DropdownMenuItem>
          </>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 