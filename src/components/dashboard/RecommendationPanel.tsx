import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Lightbulb,
  Calendar,
  Droplets,
  Thermometer,
  Shield,
  Sprout,
  Clock,
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "immediate" | "today" | "week" | "prevention";
  priority: "high" | "medium" | "low";
  impact: "high" | "medium" | "low";
  timeToComplete: string;
  difficulty: "easy" | "medium" | "hard";
  confidence: number; // AI confidence score 0-100
  completed?: boolean;
  dueDate?: Date;
}

interface RecommendationPanelProps {
  recommendations?: Recommendation[];
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({
  recommendations = mockRecommendations
}) => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const markAsCompleted = (id: string) => {
    setCompletedIds(prev => new Set([...prev, id]));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "immediate":
        return <Clock className="h-4 w-4 text-red-500" />;
      case "today":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "week":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case "prevention":
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-orange-500 text-white">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-green-500 text-white">Easy</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
      case "hard":
        return <Badge className="bg-red-500 text-white">Advanced</Badge>;
      default:
        return <Badge variant="secondary">{difficulty}</Badge>;
    }
  };

  const getImpactIcon = (impact: string) => {
    const count = impact === "high" ? 3 : impact === "medium" ? 2 : 1;
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < count ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const filterByCategory = (category: string) => {
    return recommendations.filter(rec => rec.category === category);
  };

  const RecommendationCard: React.FC<{ rec: Recommendation }> = ({ rec }) => {
    const isCompleted = completedIds.has(rec.id) || rec.completed;
    
    return (
      <div
        className={`p-4 rounded-lg border transition-all duration-200 ${
          isCompleted
            ? "bg-green-50 border-green-200 opacity-75"
            : "bg-background border-border hover:shadow-sm"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              getCategoryIcon(rec.category)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className={`text-sm font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                {rec.title}
              </h4>
              <div className="flex items-center gap-1">
                {getPriorityBadge(rec.priority)}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              {rec.description}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{rec.timeToComplete}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Impact:</span>
                  {getImpactIcon(rec.impact)}
                </div>
                <div>
                  {getDifficultyBadge(rec.difficulty)}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>AI:</span>
                  <span className="font-medium">{rec.confidence}%</span>
                </div>
                {!isCompleted && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markAsCompleted(rec.id)}
                    className="h-6 px-2 text-xs"
                  >
                    Mark Done
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const immediateRecs = filterByCategory("immediate");
  const todayRecs = filterByCategory("today");
  const weekRecs = filterByCategory("week");
  const preventionRecs = filterByCategory("prevention");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Recommendations
          <Badge variant="secondary" className="ml-auto">
            {recommendations.length} Total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="immediate" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="immediate" className="text-xs">
              Urgent ({immediateRecs.length})
            </TabsTrigger>
            <TabsTrigger value="today" className="text-xs">
              Today ({todayRecs.length})
            </TabsTrigger>
            <TabsTrigger value="week" className="text-xs">
              This Week ({weekRecs.length})
            </TabsTrigger>
            <TabsTrigger value="prevention" className="text-xs">
              Prevention ({preventionRecs.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="immediate" className="mt-4">
            <div className="space-y-3">
              {immediateRecs.length > 0 ? (
                immediateRecs.map(rec => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No urgent actions needed right now
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="today" className="mt-4">
            <div className="space-y-3">
              {todayRecs.map(rec => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="mt-4">
            <div className="space-y-3">
              {weekRecs.map(rec => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="prevention" className="mt-4">
            <div className="space-y-3">
              {preventionRecs.map(rec => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Mock data for development/testing
const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Apply Preventive Fungicide",
    description: "High humidity levels detected. Apply copper-based fungicide to prevent late blight development.",
    category: "immediate",
    priority: "high",
    impact: "high",
    timeToComplete: "30 mins",
    difficulty: "easy",
    confidence: 92
  },
  {
    id: "2",
    title: "Improve Air Circulation",
    description: "Remove lower leaves and increase plant spacing to reduce humidity around plants.",
    category: "today",
    priority: "medium",
    impact: "medium",
    timeToComplete: "1-2 hours",
    difficulty: "medium",
    confidence: 87
  },
  {
    id: "3",
    title: "Check Soil Drainage",
    description: "Recent rainfall may have caused waterlogging. Inspect and improve drainage if needed.",
    category: "today",
    priority: "medium",
    impact: "high",
    timeToComplete: "45 mins",
    difficulty: "easy",
    confidence: 78
  },
  {
    id: "4",
    title: "Weekly Disease Monitoring",
    description: "Conduct systematic plant inspection for early signs of blight or other diseases.",
    category: "week",
    priority: "medium",
    impact: "high",
    timeToComplete: "1 hour",
    difficulty: "easy",
    confidence: 95
  },
  {
    id: "5",
    title: "Install Weather Station",
    description: "Set up automated weather monitoring for more accurate environmental data collection.",
    category: "prevention",
    priority: "low",
    impact: "high",
    timeToComplete: "3-4 hours",
    difficulty: "hard",
    confidence: 85
  },
  {
    id: "6",
    title: "Mulch Application",
    description: "Apply organic mulch around plants to regulate soil moisture and temperature.",
    category: "prevention",
    priority: "low",
    impact: "medium",
    timeToComplete: "2 hours",
    difficulty: "easy",
    confidence: 82
  }
];

export default RecommendationPanel;