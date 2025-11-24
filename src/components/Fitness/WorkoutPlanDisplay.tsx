import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListVideo, Dumbbell, CheckCircle } from "lucide-react";

interface Exercise {
  name: string;
  sets: string;
  videoTitle?: string;
  videoId?: string | null;
}

interface WorkoutDay {
  day: number;
  title: string;
  description: string;
  exercises: Exercise[];
}

interface WorkoutPlanDisplayProps {
  weeklyPlan: WorkoutDay[];
  onGenerateNew: () => void;
}

const ExerciseItem = ({ exercise }: { exercise: Exercise }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="py-3 border-b last:border-0">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">{exercise.name}</p>
              <p className="text-sm text-muted-foreground">{exercise.sets}</p>
            </div>
          </div>
        </div>
        {exercise.videoTitle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVideo(!showVideo)}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <ListVideo className="h-4 w-4" />
            <span className="hidden sm:inline">{showVideo ? "Hide" : "Watch"}</span>
          </Button>
        )}
      </div>
      {showVideo && exercise.videoTitle && (
        <div className="mt-3 aspect-video rounded-lg overflow-hidden border bg-muted">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${
              exercise.videoId ||
              `?search_query=${encodeURIComponent(exercise.videoTitle)}`
            }`}
            title={exercise.videoTitle || exercise.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default function WorkoutPlanDisplay({ weeklyPlan, onGenerateNew }: WorkoutPlanDisplayProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Dumbbell className="h-8 w-8 text-primary" />
          Your 7-Day Workout Plan
        </h2>
        <p className="text-muted-foreground">
          Personalized for your cycle phase and fitness goals
        </p>
        <Button onClick={onGenerateNew} variant="outline" className="mt-4">
          Generate New Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {weeklyPlan
          .sort((a, b) => a.day - b.day)
          .map((day) => (
            <Card
              key={day.day}
              className="overflow-hidden hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm"
            >
              <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Day {day.day}
                  </Badge>
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{day.title}</CardTitle>
                <CardDescription className="text-sm">{day.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-1">
                  {day.exercises.map((exercise, i) => (
                    <ExerciseItem key={i} exercise={exercise} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          💪 Remember to warm up before each workout and cool down after!
        </p>
      </div>
    </div>
  );
}
