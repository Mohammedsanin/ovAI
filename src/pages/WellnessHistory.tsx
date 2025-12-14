import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, Activity, TrendingUp } from "lucide-react";

const WellnessHistory = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Mock data - replace with actual data from your backend
  const wellnessData = [
    {
      id: 1,
      date: "2024-01-15",
      mood: 8,
      energy: 7,
      stress: 3,
      sleep: 8,
      notes: "Feeling good today, had a great workout"
    },
    {
      id: 2,
      date: "2024-01-14",
      mood: 6,
      energy: 5,
      stress: 6,
      sleep: 6,
      notes: "Busy day at work, feeling a bit tired"
    },
    {
      id: 3,
      date: "2024-01-13",
      mood: 9,
      energy: 9,
      stress: 2,
      sleep: 9,
      notes: "Excellent day! Good sleep and meditation"
    }
  ];

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return "bg-green-500";
    if (mood >= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStressColor = (stress: number) => {
    if (stress <= 3) return "bg-green-500";
    if (stress <= 6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wellness History</h1>
          <p className="text-muted-foreground">Track your wellness journey over time</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedPeriod === "all" ? "default" : "outline"}
          onClick={() => setSelectedPeriod("all")}
        >
          All Time
        </Button>
        <Button
          variant={selectedPeriod === "week" ? "default" : "outline"}
          onClick={() => setSelectedPeriod("week")}
        >
          This Week
        </Button>
        <Button
          variant={selectedPeriod === "month" ? "default" : "outline"}
          onClick={() => setSelectedPeriod("month")}
        >
          This Month
        </Button>
      </div>

      <div className="grid gap-4">
        {wellnessData.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {entry.date}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Mood: {entry.mood}/10
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Energy: {entry.energy}/10
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{entry.mood}/10</div>
                    <div className="text-sm text-muted-foreground">Mood</div>
                    <div className={`h-2 rounded-full mt-2 ${getMoodColor(entry.mood)}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{entry.stress}/10</div>
                    <div className="text-sm text-muted-foreground">Stress</div>
                    <div className={`h-2 rounded-full mt-2 ${getStressColor(entry.stress)}`} />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{entry.sleep}/10</div>
                    <div className="text-sm text-muted-foreground">Sleep</div>
                    <div className="bg-blue-500 h-2 rounded-full mt-2" />
                  </div>
                </div>
                {entry.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Wellness Trends
          </CardTitle>
          <CardDescription>
            Your wellness metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Charts and analytics will be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessHistory;