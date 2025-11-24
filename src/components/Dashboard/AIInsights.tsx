import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const insights = [
  {
    title: "Nutrition Tip",
    description: "Based on your cycle phase, increase iron-rich foods this week.",
  },
  {
    title: "Exercise Suggestion",
    description: "Your energy is high - perfect time for HIIT or strength training!",
  },
  {
    title: "Wellness Reminder",
    description: "You're approaching your fertile window. Stay hydrated!",
  },
];

export const AIInsights = () => {
  return (
    <Card className="shadow-card bg-gradient-soft border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Insights for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="p-4 bg-card rounded-lg shadow-sm"
          >
            <h4 className="font-semibold text-sm text-foreground mb-1">
              {insight.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {insight.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
