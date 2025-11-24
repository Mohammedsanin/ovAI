import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Routine {
  type: "Stretch" | "Exercise" | "Tip";
  title: string;
  description: string;
  videoSuggestion?: string;
  videoId?: string | null;
}

interface CrampsReliefPlanProps {
  routines: Routine[];
  painArea: string;
}

export const CrampsReliefPlan = ({ routines, painArea }: CrampsReliefPlanProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Stretch":
        return "bg-gradient-wellness text-white";
      case "Exercise":
        return "bg-gradient-calm text-white";
      case "Tip":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Relief Plan for {painArea}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {routines.map((routine, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg hover:shadow-card transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getTypeColor(routine.type)}>
                    {routine.type}
                  </Badge>
                  <h4 className="font-semibold">{routine.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {routine.description}
                </p>
              </div>
            </div>
            
            {routine.videoId && (
              <div className="space-y-2">
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${routine.videoId}`}
                    title={routine.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            
            {routine.videoSuggestion && !routine.videoId && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/results?search_query=${encodeURIComponent(
                      routine.videoSuggestion!
                    )}`,
                    "_blank"
                  )
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch Tutorial
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
