
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import InsightCard from '@/components/insights/InsightCard';
import InsightDetail from '@/components/insights/InsightDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { insightsData } from '@/data/mock-data';

const Insights = () => {
  const [selectedInsight, setSelectedInsight] = useState<typeof insightsData[0] | null>(null);
  
  const handleOpenInsight = (id: number) => {
    const insight = insightsData.find(item => item.id === id);
    if (insight) {
      setSelectedInsight(insight);
    }
  };
  
  const handleCloseInsight = () => {
    setSelectedInsight(null);
  };
  
  return (
    <Layout title="Field Insights">
      <Tabs defaultValue="gallery">
        <TabsList className="mb-6">
          <TabsTrigger value="gallery">Gallery View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {insightsData.map((insight) => (
              <InsightCard
                key={insight.id}
                image={insight.image}
                diagnosis={insight.diagnosis}
                confidence={insight.confidence}
                date={insight.date}
                cri={insight.cri}
                onClick={() => handleOpenInsight(insight.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="space-y-4">
            {insightsData.map((insight) => (
              <div 
                key={insight.id} 
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => handleOpenInsight(insight.id)}
              >
                <div className="w-16 h-16 shrink-0 overflow-hidden rounded-md">
                  <img 
                    src={insight.image} 
                    alt={insight.diagnosis}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{insight.diagnosis}</h3>
                    <span className="text-sm text-muted-foreground">{insight.date}</span>
                  </div>
                  <div className="flex items-center text-sm gap-3 mt-1">
                    <span className="text-muted-foreground">Confidence: {insight.confidence}%</span>
                    <span className="text-muted-foreground">CRI: {insight.cri}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Trend Analysis Coming Soon</h3>
            <p className="text-muted-foreground">
              This feature will provide interactive trend graphs showing CRI trends 
              and alert frequencies over time.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedInsight && (
        <InsightDetail 
          isOpen={!!selectedInsight} 
          onClose={handleCloseInsight} 
          data={selectedInsight} 
        />
      )}
    </Layout>
  );
};

export default Insights;
