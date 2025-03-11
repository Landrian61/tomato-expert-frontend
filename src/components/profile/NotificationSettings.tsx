
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const NotificationSettings: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="in-app">In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications within the application
              </p>
            </div>
            <Switch id="in-app" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive daily summaries and critical alerts via email
              </p>
            </div>
            <Switch id="email" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive critical alerts via text message
              </p>
            </div>
            <Switch id="sms" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts even when the app is closed
              </p>
            </div>
            <Switch id="push" defaultChecked />
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-3">Alert Types</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="disease-alerts" className="cursor-pointer">Disease Risk Alerts</Label>
              <Switch id="disease-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="weather-alerts" className="cursor-pointer">Weather Alerts</Label>
              <Switch id="weather-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="treatment-reminders" className="cursor-pointer">Treatment Reminders</Label>
              <Switch id="treatment-reminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="reports" className="cursor-pointer">Weekly Reports</Label>
              <Switch id="reports" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
