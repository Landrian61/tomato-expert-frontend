
import React from 'react';
import Layout from '@/components/layout/Layout';
import EnvironmentCard from '@/components/dashboard/EnvironmentCard';
import RiskGauge from '@/components/dashboard/RiskGauge';
import TrendChart from '@/components/dashboard/TrendChart';
import ActionButton from '@/components/dashboard/ActionButton';
import DynamicTomatoPlant from '@/components/dashboard/DynamicTomatoPlant';
import { Sprout, AlertTriangle, LineChart } from 'lucide-react';
import { environmentalData, criValue, criTrendData } from '@/data/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  // Determine plant health based on CRI value
  const getPlantHealth = () => {
    if (criValue < 25) return 'healthy';
    if (criValue < 50) return 'mild-stress';
    if (criValue < 75) return 'moderate-stress';
    return 'severe-stress';
  };

  const plantHealth = getPlantHealth();

  return (
    <Layout title="Field Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <EnvironmentCard
            title="Temperature"
            value={environmentalData.temperature.value}
            icon="temperature"
            change={environmentalData.temperature.change}
            trend={environmentalData.temperature.trend}
          />
          <EnvironmentCard
            title="Humidity"
            value={environmentalData.humidity.value}
            icon="humidity"
            change={environmentalData.humidity.change}
            trend={environmentalData.humidity.trend}
          />
          <EnvironmentCard
            title="Soil Moisture"
            value={environmentalData.soilMoisture.value}
            icon="moisture"
            change={environmentalData.soilMoisture.change}
            trend={environmentalData.soilMoisture.trend}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <RiskGauge value={criValue} />
            <TrendChart title="CRI Trend (7 Days)" data={criTrendData} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Plant Health Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <DynamicTomatoPlant healthStatus={plantHealth} className="h-48" />
              <div className={`mt-4 px-3 py-1 rounded-full text-sm font-medium risk-${plantHealth.split('-')[0]}`}>
                {plantHealth === 'healthy' ? 'Healthy' : plantHealth.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            <ActionButton
              title="Plant Diagnosis"
              icon={<Sprout className="h-6 w-6" />}
              href="/diagnosis"
              variant="default"
            />
            <ActionButton
              title="Risk Alerts"
              icon={<AlertTriangle className="h-6 w-6" />}
              href="/alerts"
            />
            <ActionButton
              title="Field Insights"
              icon={<LineChart className="h-6 w-6" />}
              href="/insights"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
