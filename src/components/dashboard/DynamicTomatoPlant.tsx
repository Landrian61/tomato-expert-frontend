
import React from 'react';
import { cn } from '@/lib/utils';

type PlantHealth = 'healthy' | 'mild-stress' | 'moderate-stress' | 'severe-stress';

interface DynamicTomatoPlantProps {
  healthStatus: PlantHealth;
  className?: string;
}

const DynamicTomatoPlant: React.FC<DynamicTomatoPlantProps> = ({
  healthStatus = 'healthy',
  className
}) => {
  const getPlantColors = () => {
    switch (healthStatus) {
      case 'healthy':
        return {
          stem: 'fill-plant-dark',
          leaves: 'fill-plant',
          fruit: 'fill-tomato',
          animation: 'animate-leaf-sway'
        };
      case 'mild-stress':
        return {
          stem: 'fill-plant-dark',
          leaves: 'fill-plant/90',
          fruit: 'fill-tomato/90',
          animation: 'animate-leaf-sway'
        };
      case 'moderate-stress':
        return {
          stem: 'fill-plant-dark/90',
          leaves: 'fill-yellow-600',
          fruit: 'fill-tomato/80',
          animation: ''
        };
      case 'severe-stress':
        return {
          stem: 'fill-amber-800',
          leaves: 'fill-amber-700',
          fruit: 'fill-tomato/70',
          animation: ''
        };
      default:
        return {
          stem: 'fill-plant-dark',
          leaves: 'fill-plant',
          fruit: 'fill-tomato',
          animation: 'animate-leaf-sway'
        };
    }
  };

  const { stem, leaves, fruit, animation } = getPlantColors();

  return (
    <div className={cn("w-full h-full flex items-center justify-center animate-plant-grow", className)}>
      <svg
        viewBox="0 0 200 220"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[200px]"
      >
        {/* Main Stem */}
        <path
          d="M100 200 L100 120"
          className={`stroke-[6] ${stem}`}
          strokeLinecap="round"
        />

        {/* Branches */}
        <path
          d="M100 160 L80 140 M100 140 L120 120 M100 180 L70 160"
          className={`stroke-[4] ${stem}`}
          strokeLinecap="round"
        />

        {/* Leaves */}
        <g className={animation}>
          <ellipse
            cx="65"
            cy="133"
            rx="18"
            ry="10"
            transform="rotate(-20 65 133)"
            className={leaves}
          />
          <ellipse
            cx="130"
            cy="113"
            rx="18"
            ry="10"
            transform="rotate(20 130 113)"
            className={leaves}
          />
          <ellipse
            cx="55"
            cy="153"
            rx="20"
            ry="12"
            transform="rotate(-30 55 153)"
            className={leaves}
          />
        </g>

        {/* Tomatoes */}
        <circle cx="90" cy="145" r="10" className={fruit} />
        <circle cx="112" cy="125" r="10" className={fruit} />
        <circle cx="80" cy="170" r="8" className={fruit} />

        {/* Pot */}
        <path
          d="M70 200 L80 220 L120 220 L130 200 Z"
          className="fill-amber-800"
        />
        <rect x="75" y="200" width="50" height="10" className="fill-amber-700" />

        {/* Health Symptoms (only show on stressed plants) */}
        {healthStatus !== 'healthy' && (
          <>
            {/* Wilting or spots on leaves for stressed plants */}
            <circle cx="65" cy="133" r="2" className="fill-amber-900" />
            <circle cx="130" cy="113" r="2" className="fill-amber-900" />
            {healthStatus === 'severe-stress' && (
              <>
                <circle cx="70" cy="135" r="1.5" className="fill-amber-900" />
                <circle cx="60" cy="130" r="1.5" className="fill-amber-900" />
                <circle cx="125" cy="110" r="1.5" className="fill-amber-900" />
                <circle cx="135" cy="115" r="1.5" className="fill-amber-900" />
              </>
            )}
          </>
        )}
      </svg>
    </div>
  );
};

export default DynamicTomatoPlant;
