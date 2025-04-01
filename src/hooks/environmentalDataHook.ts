import { useState, useEffect } from 'react';
import {
  getLatestEnvironmentalData,
  getCRIHistory,
  formatEnvironmentalDataForUI,
  formatCRIHistoryForChart,
  EnvironmentalData,
  CRIHistoryData
} from '@/services/environmentalDataService';
import { toast } from 'sonner';

interface UseEnvironmentalDataReturn {
  loading: boolean;
  error: string | null;
  environmentalData: ReturnType<typeof formatEnvironmentalDataForUI> | null;
  criValue: number | null;
  criTrendData: ReturnType<typeof formatCRIHistoryForChart> | null;
  riskLevel: string | null;
  refreshData: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage environmental data
 * @returns Environmental data and loading state
 */
export const useEnvironmentalData = (): UseEnvironmentalDataReturn => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [criHistory, setCRIHistory] = useState<CRIHistoryData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both latest data and CRI history concurrently
      const [latestData, historyData] = await Promise.all([
        getLatestEnvironmentalData(),
        getCRIHistory('week')
      ]);
      
      setEnvironmentalData(latestData);
      setCRIHistory(historyData);
    } catch (err) {
      console.error('Error fetching environmental data:', err);
      setError('Failed to load environmental data. Please try again later.');
      toast.error('Failed to load environmental data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Format data for UI components
  const formattedEnvironmentalData = environmentalData 
    ? formatEnvironmentalDataForUI(environmentalData)
    : null;
    
  const formattedCRIHistory = criHistory 
    ? formatCRIHistoryForChart(criHistory)
    : null;

  return {
    loading,
    error,
    environmentalData: formattedEnvironmentalData,
    criValue: environmentalData?.cri ?? null,
    criTrendData: formattedCRIHistory,
    riskLevel: environmentalData?.riskLevel ?? null,
    refreshData: fetchData
  };
};