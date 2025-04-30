import React, { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { api } from "@/services/authService";
import { useIsMobile } from "@/hooks/use-mobile";

interface CRITrendChartProps {
  period?: "week" | "month";
  height?: number;
  showTrend?: boolean;
}

interface CRIDataPoint {
  date: string;
  cri: number;
  riskLevel: string;
}

const CRITrendChart: React.FC<CRITrendChartProps> = ({
  period = "week",
  height = 300,
  showTrend = false
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CRIDataPoint[]>([]);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCRIHistory();
  }, [period]);

  const fetchCRIHistory = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const endDate = now.toISOString().split("T")[0];

      let startDate;
      if (period === "week") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        startDate = sevenDaysAgo.toISOString().split("T")[0];
      } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        startDate = thirtyDaysAgo.toISOString().split("T")[0];
      }

      const response = await api.get("/environmental/cri-history", {
        params: { startDate, endDate }
      });

      const processedData = response.data.history.map((item: any) => ({
        date: new Date(item.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric"
        }),
        cri: item.cri,
        riskLevel: item.riskLevel
      }));

      setData(processedData);
    } catch (error) {
      console.error("Error fetching CRI history:", error);
      // For demo, generate mock data
      const mockData = generateMockData(period);
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (period: string) => {
    const mockData: CRIDataPoint[] = [];
    const days = period === "week" ? 7 : 30;
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      // Generate a base trend with some variation
      let baseVal = 50;

      // Add a seasonal trend factor
      if (i < days / 3) baseVal -= 10; // More early blight trend at start
      else if (i > (days * 2) / 3) baseVal += 15; // More late blight trend at end

      // Add some random variation
      const variation = Math.random() * 20 - 10;
      const cri = Math.max(1, Math.min(99, baseVal + variation));

      // Determine risk level based on CRI
      let riskLevel;
      if (cri < 20) riskLevel = "Critical";
      else if (cri < 30) riskLevel = "High";
      else if (cri < 40) riskLevel = "Medium";
      else if (cri < 60) riskLevel = "Low";
      else if (cri < 70) riskLevel = "Medium";
      else if (cri < 80) riskLevel = "High";
      else riskLevel = "Critical";

      mockData.push({
        date: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric"
        }),
        cri,
        riskLevel
      });
    }

    return mockData;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const cri = payload[0].value;
      let riskText, riskColor;

      if (cri < 20) {
        riskText = "Critical Early Blight Risk";
        riskColor = "text-red-500";
      } else if (cri < 30) {
        riskText = "High Early Blight Risk";
        riskColor = "text-orange-500";
      } else if (cri < 40) {
        riskText = "Medium Early Blight Risk";
        riskColor = "text-amber-500";
      } else if (cri < 60) {
        riskText = "Low Blight Risk";
        riskColor = "text-green-500";
      } else if (cri < 70) {
        riskText = "Medium Late Blight Risk";
        riskColor = "text-amber-500";
      } else if (cri < 80) {
        riskText = "High Late Blight Risk";
        riskColor = "text-orange-500";
      } else {
        riskText = "Critical Late Blight Risk";
        riskColor = "text-red-500";
      }

      return (
        <div className="bg-background rounded-md border p-2 shadow-md text-xs">
          <p className="font-medium">{label}</p>
          <p>
            CRI: <span className="font-medium">{Math.round(cri)}</span>
          </p>
          <p className={riskColor}>{riskText}</p>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  // Filter dates for mobile view to reduce crowding
  const filteredData =
    isMobile && data.length > 7
      ? data.filter((_, index) => {
          // Always include first and last points
          if (index === 0 || index === data.length - 1) return true;

          // For weekly view, show more points
          if (period === "week") {
            return index % 2 === 0; // Show every other point for week view
          }

          // For monthly view, be more selective
          return index % Math.ceil(data.length / 6) === 0;
        })
      : data;

  // Adjust margins based on screen size
  const margins = isMobile
    ? { top: 15, right: 10, left: 0, bottom: 20 }
    : { top: 20, right: 30, left: 20, bottom: 30 };

  // Calculate chart height to leave space for legends
  const chartHeight = height - (isMobile ? 40 : 30);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%" }}
      className="chart-container"
    >
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={filteredData} margin={margins}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isMobile ? "#f0f0f0" : "#e0e0e0"}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={isMobile ? "preserveEnd" : "preserveStartEnd"}
            tickFormatter={(value) =>
              isMobile && period === "month" ? value.slice(0, 3) : value
            }
            height={30}
            padding={{ left: 10, right: 10 }}
            minTickGap={5}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            width={isMobile ? 30 : 35}
            padding={{ top: 10, bottom: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Reference lines for risk zones */}
          <ReferenceLine y={20} stroke="#f97316" strokeDasharray="3 3" />
          <ReferenceLine y={40} stroke="#84cc16" strokeDasharray="3 3" />
          <ReferenceLine y={60} stroke="#84cc16" strokeDasharray="3 3" />
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" />

          <Line
            type="monotone"
            dataKey="cri"
            stroke="#1f3c26"
            strokeWidth={isMobile ? 1.5 : 2}
            dot={{ fill: "#1f3c26", r: isMobile ? 3 : 4 }}
            activeDot={{ r: isMobile ? 5 : 6, fill: "#1f3c26" }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
      <div
        className={`flex mt-4 text-xs ${
          isMobile ? "flex-row space-x-4 pb-3" : "justify-between px-4"
        }`}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>Early Blight Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Low Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Late Blight Risk</span>
        </div>
      </div>
    </div>
  );
};

export default CRITrendChart;
