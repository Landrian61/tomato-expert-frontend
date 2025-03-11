
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun, MapPin, Camera } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

const AppSettings: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-warning" />
              ) : (
                <MoonStar className="h-5 w-5 text-blue-400" />
              )}
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
            </div>
            <Switch 
              id="theme" 
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-tomato" />
              <div className="space-y-0.5">
                <Label htmlFor="camera">Camera Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow access to device camera for plant scanning
                </p>
              </div>
            </div>
            <Switch id="camera" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-plant" />
              <div className="space-y-0.5">
                <Label htmlFor="location">Location Services</Label>
                <p className="text-sm text-muted-foreground">
                  Allow access to location for weather data
                </p>
              </div>
            </div>
            <Switch id="location" defaultChecked />
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Application Permissions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            These permissions are used to provide you with accurate disease forecasting and 
            personalized recommendations based on your location and field conditions.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Update Permissions</Button>
            <Button variant="ghost" size="sm">Learn More</Button>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="data-sync" className="cursor-pointer">Automatic Data Sync</Label>
            <Switch id="data-sync" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="analytics" className="cursor-pointer">Share Analytics</Label>
            <Switch id="analytics" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="offline" className="cursor-pointer">Offline Mode</Label>
            <Switch id="offline" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppSettings;
