import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";

const DiagnosisDetailComponent = ({ diagnosis }) => {
 if (!diagnosis) {
   return (
     <div className="space-y-6 pb-6">
       <Card>
         <CardContent className="p-4 flex justify-center items-center h-40 flex-col gap-4">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
           <p className="text-muted-foreground">
             Loading diagnosis information...
           </p>
         </CardContent>
       </Card>
     </div>
   );
 }

 const getConditionColor = (condition) => {
   if (condition.toLowerCase().includes("healthy"))
     return "bg-plant text-white";
   if (condition.toLowerCase().includes("early blight"))
     return "bg-warning-dark text-white";
   if (condition.toLowerCase().includes("late blight"))
     return "bg-tomato text-white";
   return "bg-gray-500 text-white";
 };

  const formatRecommendations = (text) => {
    if (!text) return [];
    
    // Convert paragraph text to bullet points
    return text.split(/\.\s+/)
      .filter(point => point.trim().length > 0)
      .map(point => point.trim() + (point.endsWith('.') ? '' : '.'));
  };

  const getLocalResources = () => {
    return [
      {
        name: "Ministry of Agriculture, Uganda",
        url: "https://www.maaif.go.ug/",
        description: "Official government agricultural resources"
      },
      {
        name: "National Agricultural Research Organization",
        url: "https://www.naro.go.ug/",
        description: "Research and best practices for crop diseases"
      },
      {
        name: "Uganda Extension Services Hotline",
        phone: "0800-327-329",
        description: "Call for immediate assistance with plant diseases"
      }
    ];
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className={`px-4 py-3 rounded-md ${getConditionColor(diagnosis.condition)}`}>
          <h2 className="text-xl font-semibold mb-1">{diagnosis.condition}</h2>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Confidence: {diagnosis.confidence}%</span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{new Date(diagnosis.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Image and Symptoms */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="aspect-square w-full max-h-[300px] rounded-md overflow-hidden bg-muted">
            <img 
              src={diagnosis.imageUrl} 
              alt={diagnosis.condition} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">Symptoms Observed</h3>
            <p className="text-muted-foreground">{diagnosis.signs_and_symptoms}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-primary mb-3">Recommendations</h3>
          <div className="space-y-2">
            {formatRecommendations(diagnosis.recommendation).map((rec, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="font-medium text-primary">{idx + 1}.</span>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-primary mb-3">Local Resources</h3>
          <div className="space-y-3">
            {getLocalResources().map((resource, idx) => (
              <div key={idx} className="flex flex-col">
                {resource.url ? (
                  <a 
                    href={resource.url} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex items-center text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {resource.name}
                  </a>
                ) : (
                  <div className="font-medium">{resource.name}: {resource.phone}</div>
                )}
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisDetailComponent;