import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend
} from "recharts";
import {
  getCRIHistory,
  formatCRIHistoryForChart
} from "@/services/environmentalDataService";
import { toast } from "sonner";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  HelpCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface CRITrendChartProps {
  period?: "day" | "week" | "month" | "year";
  showTrend?: boolean;
  height?: number;
}

const CRITrendChart: React.FC<CRITrendChartProps> = ({
  period = "week",
  showTrend = true,
  height = 300
}) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [trendDirection, setTrendDirection] = useState<
    "increasing" | "decreasing" | "stable"
  >("stable");
  const [averageChange, setAverageChange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getCRIHistory(period);
        const formattedData = formatCRIHistoryForChart(response);

        setChartData(formattedData);
        setTrendDirection(response.trend.direction);
        setAverageChange(response.trend.averageChange);
      } catch (error) {
        console.error("Error fetching CRI history:", error);
        toast.error("Failed to load CRI trend data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  // Define risk level ranges
  const riskLevels = {
    earlyBlight: {
      min: 0,
      max: 45,
      color: "rgba(255, 193, 7, 0.2)",
      label: "Early Blight Risk"
    },
    healthy: {
      min: 45,
      max: 55,
      color: "rgba(75, 192, 75, 0.2)",
      label: "Healthy"
    },
    lateBlight: {
      min: 55,
      max: 100,
      color: "rgba(220, 53, 69, 0.2)",
      label: "Late Blight Risk"
    }
  };

  const getTrendIcon = () => {
    if (trendDirection === "increasing") {
      return <ArrowUpIcon className="h-4 w-4 text-tomato" />;
    } else if (trendDirection === "decreasing") {
      return <ArrowDownIcon className="h-4 w-4 text-plant" />;
    }
    return <ArrowRightIcon className="h-4 w-4 text-warning-light" />;
  };

  const getTrendText = () => {
    if (trendDirection === "increasing") {
      return (
        <span className="text-tomato">
          Increasing (
          {averageChange > 0
            ? `+${averageChange.toFixed(1)}`
            : averageChange.toFixed(1)}
          )
        </span>
      );
    } else if (trendDirection === "decreasing") {
      return (
        <span className="text-plant">
          Decreasing (
          {averageChange > 0
            ? `+${averageChange.toFixed(1)}`
            : averageChange.toFixed(1)}
          )
        </span>
      );
    }
    return (
      <span className="text-warning-light">
        Stable ({averageChange.toFixed(1)})
      </span>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const cri = payload[0].value;
      let riskText = "Healthy";
      let riskClass = "text-plant";

      if (cri >= 45 && cri <= 55) {
        riskText = "Healthy";
        riskClass = "text-plant";
      } else if (cri > 55) {
        const intensity = Math.min(100, Math.floor(((cri - 55) / 45) * 100));
        riskText = `Late Blight Risk (${intensity}%)`;
        riskClass = "text-tomato";
      } else if (cri < 45) {
        const intensity = Math.min(100, Math.floor(((45 - cri) / 45) * 100));
        riskText = `Early Blight Risk (${intensity}%)`;
        riskClass = "text-warning-dark";
      }

      return (
        <div className="bg-background border rounded-md shadow-md p-2 text-sm">
          <p className="font-medium">{label}</p>
          <p>
            CRI: <span className="font-semibold">{cri}</span>
          </p>
          <p className={riskClass}>{riskText}</p>
        </div>
      );
    }

    return null;
  };

  const CustomizedLegend = () => (
    <div className="flex justify-around mt-2 text-xs">
      <div className="flex items-center">
        <div className="w-3 h-3 mr-1 bg-yellow-500/20 border border-yellow-500"></div>
        <span>Early Blight Risk (0-45)</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 mr-1 bg-green-500/20 border border-green-500"></div>
        <span>Healthy (45-55)</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 mr-1 bg-red-500/20 border border-red-500"></div>
        <span>Late Blight Risk (55-100)</span>
      </div>
    </div>
  );

  const renderChart = () => {
    if (loading) {
      return <Skeleton className={`w-full h-[${height}px]`} />;
    }

    if (!chartData || chartData.length === 0) {
      return (
        <div
          className={`w-full h-[${height}px] flex items-center justify-center bg-muted/50 rounded-md`}
        >
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    return (
      <>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              stroke="#888"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              stroke="#888"
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Risk zone areas */}
            <ReferenceArea
              y1={riskLevels.earlyBlight.min}
              y2={riskLevels.earlyBlight.max}
              fill={riskLevels.earlyBlight.color}
              ifOverflow="extendDomain"
              label={{
                value: "Early Blight Risk",
                position: "insideLeft",
                fill: "#FF9800",
                fontSize: 12
              }}
            />
            <ReferenceArea
              y1={riskLevels.healthy.min}
              y2={riskLevels.healthy.max}
              fill={riskLevels.healthy.color}
              ifOverflow="extendDomain"
              label={{
                value: "Healthy",
                position: "insideLeft",
                fill: "#4CAF50",
                fontSize: 12
              }}
            />
            <ReferenceArea
              y1={riskLevels.lateBlight.min}
              y2={riskLevels.lateBlight.max}
              fill={riskLevels.lateBlight.color}
              ifOverflow="extendDomain"
              label={{
                value: "Late Blight Risk",
                position: "insideLeft",
                fill: "#F44336",
                fontSize: 12
              }}
            />

            {/* Reference lines for threshold boundaries */}
            <ReferenceLine
              y={45}
              stroke="green"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <ReferenceLine
              y={55}
              stroke="green"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />

            <Line
              type="monotone"
              dataKey="value"
              name="CRI"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{
                stroke: "hsl(var(--primary))",
                fill: "white",
                strokeWidth: 2,
                r: 4
              }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <CustomizedLegend />
      </>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <CardTitle className="text-sm font-medium">
              CRI Trend ({period})
            </CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Cumulative Risk Index (CRI) shows overall disease risk based
                    on environmental conditions. Different zones indicate risk
                    levels for healthy conditions, early blight, and late
                    blight.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          {showTrend && !loading && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Trend:</span>
              <Badge variant="outline" className="flex items-center gap-1">
                {getTrendIcon()}
                {getTrendText()}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
};

export default CRITrendChart;
