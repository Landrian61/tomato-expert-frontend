import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import CRITrendChart from "./CRITrendChart";

interface CRITrendChartCardProps {
  period?: "week" | "month";
  height?: number;
  showTrend?: boolean;
  title?: string;
}

const CRITrendChartCard: React.FC<CRITrendChartCardProps> = ({
  period = "week",
  height = 300,
  showTrend = false,
  title = "Blight Risk Trend"
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                This chart shows CRI (Cumulative Risk Index) trends over time:
                <br />• CRI 40-60: Low risk (green zone)
                <br />• CRI &lt; 40: Early Blight risk increases as values
                decrease
                <br />• CRI &gt; 60: Late Blight risk increases as values
                increase
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <CRITrendChart period={period} height={height} showTrend={showTrend} />
      </CardContent>
    </Card>
  );
};

export default CRITrendChartCard;
