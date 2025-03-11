
import React from 'react';
import Layout from '@/components/layout/Layout';
import AlertCard from '@/components/alerts/AlertCard';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import { alertsData } from '@/data/mock-data';

const Alerts = () => {
  return (
    <Layout title="Risk Alerts">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{alertsData.length} Active Alerts</h2>
          
          <RadioGroup defaultValue="all" className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm">All</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="unread" id="unread" />
              <Label htmlFor="unread" className="text-sm">Unread</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="critical" id="critical" />
              <Label htmlFor="critical" className="text-sm">Critical</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          {alertsData.map((alert) => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              description={alert.description}
              timestamp={alert.timestamp}
              riskLevel={alert.riskLevel}
            />
          ))}
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="shrink-0 mt-1">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium mb-2">About Risk Levels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium text-plant mb-1">Low Risk</p>
                    <p className="text-muted-foreground">
                      Conditions are favorable for plant growth. Routine monitoring recommended.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-warning-light mb-1">Medium Risk</p>
                    <p className="text-muted-foreground">
                      Early signs of potential issues. Consider preventative measures.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-warning-dark mb-1">High Risk</p>
                    <p className="text-muted-foreground">
                      Immediate attention needed. Conditions favor disease development.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-tomato mb-1">Critical Risk</p>
                    <p className="text-muted-foreground">
                      Urgent action required. High likelihood of rapid disease spread.
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
