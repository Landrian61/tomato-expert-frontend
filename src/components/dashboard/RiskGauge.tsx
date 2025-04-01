import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface RiskGaugeProps {
  value: number;
  title?: string;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({
  value,
  title = "Cumulative Risk Index (CRI)"
}) => {
  // Ensure value is within bounds
  const clampedValue = Math.max(0, Math.min(100, value));

  const getRiskLevel = (value: number) => {
    if (value >= 45 && value <= 55)
      return { level: "Healthy", class: "bg-plant", textClass: "text-plant" };
    if (value < 45) {
      const intensity = Math.min(100, Math.floor(((45 - value) / 45) * 100));
      return {
        level: `Early Blight Risk (${intensity}%)`,
        class: "bg-warning-light",
        textClass: "text-warning-dark"
      };
    }
    const intensity = Math.min(100, Math.floor(((value - 55) / 45) * 100));
    return {
      level: `Late Blight Risk (${intensity}%)`,
      class: "bg-tomato",
      textClass: "text-tomato"
    };
  };

  const { level, textClass } = getRiskLevel(clampedValue);

  // Calculate position for the needle
  // Convert CRI value (0-100) to angle in degrees (0-180)
  const needleAngle = (clampedValue / 100) * 180;

  // Calculate needle endpoint coordinates
  // For a semicircle, 0° is at the left (9 o'clock position), 90° is at the top (12 o'clock), and 180° is at the right (3 o'clock)
  const needleLength = 80;
  const radians = (180 - needleAngle) * (Math.PI / 180);
  const needleEndX = 100 + needleLength * Math.cos(radians);
  const needleEndY = 100 - needleLength * Math.sin(radians);

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
                Cumulative Risk Index (CRI) indicates disease risk:
                <br />• CRI 45-55: Healthy plant conditions
                <br />• CRI &lt; 45: Early Blight risk (lower values = higher
                risk)
                <br />• CRI &gt; 55: Late Blight risk (higher values = higher
                risk)
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Gauge Container */}
        <div className="relative w-full h-[180px]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 200 120"
            preserveAspectRatio="xMidYMax meet"
            className="overflow-visible" // Important for the arrow to be visible
          >
            {/* Gauge Background */}
            <path
              d="M10,100 A90,90 0 0,1 190,100"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="2"
            />

            {/* Early Blight Sector (0-45) */}
            <path
              d="M10,100 A90,90 0 0,1 91,10"
              fill="none"
              stroke="#FFC107"
              strokeWidth="20"
              strokeOpacity="0.3"
            />

            {/* Healthy Sector (45-55) */}
            <path
              d="M91,10 A90,90 0 0,1 109,10"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="20"
              strokeOpacity="0.3"
            />

            {/* Late Blight Sector (55-100) */}
            <path
              d="M109,10 A90,90 0 0,1 190,100"
              fill="none"
              stroke="#F44336"
              strokeWidth="20"
              strokeOpacity="0.3"
            />

            {/* Tick markers */}
            <line
              x1="10"
              y1="100"
              x2="10"
              y2="90"
              stroke="#888"
              strokeWidth="1"
            />
            <line
              x1="91"
              y1="10"
              x2="91"
              y2="20"
              stroke="#888"
              strokeWidth="1"
            />
            <line
              x1="109"
              y1="10"
              x2="109"
              y2="20"
              stroke="#888"
              strokeWidth="1"
            />
            <line
              x1="190"
              y1="100"
              x2="190"
              y2="90"
              stroke="#888"
              strokeWidth="1"
            />

            {/* Tick labels */}
            <text x="10" y="115" textAnchor="middle" fontSize="8" fill="#888">
              0
            </text>
            <text x="91" y="30" textAnchor="middle" fontSize="8" fill="#888">
              45
            </text>
            <text x="109" y="30" textAnchor="middle" fontSize="8" fill="#888">
              55
            </text>
            <text x="190" y="115" textAnchor="middle" fontSize="8" fill="#888">
              100
            </text>

            {/* Needle - Draw using explicit line with calculated endpoints */}
            <line
              x1="100"
              y1="100"
              x2={needleEndX}
              y2={needleEndY}
              stroke="black"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Needle circle base */}
            <circle
              cx="100"
              cy="100"
              r="6"
              fill="#333"
              stroke="#111"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* CRI Value Display */}
        <div className={`-mt-4 text-3xl font-bold ${textClass}`}>
          {clampedValue.toFixed(1)}
        </div>

        {/* Risk Level Badge */}
        <div
          className={`mt-2 px-4 py-1 rounded-full text-sm font-medium ${textClass} bg-background border ${textClass.replace(
            "text-",
            "border-"
          )}`}
        >
          {level}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskGauge;
