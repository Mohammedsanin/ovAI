import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUserData } from "@/hooks/useUserData";

const generateCalendarDays = (currentDay: number) => {
  const days = [];
  
  for (let i = 1; i <= 28; i++) {
    let phase = "follicular";
    if (i >= 1 && i <= 5) phase = "menstrual";
    else if (i >= 13 && i <= 15) phase = "ovulation";
    else if (i >= 16) phase = "luteal";
    
    days.push({
      day: i,
      phase,
      isToday: i === currentDay,
    });
  }
  
  return days;
};

const phaseColors = {
  menstrual: "bg-destructive/20 text-destructive",
  follicular: "bg-secondary/20 text-secondary-foreground",
  ovulation: "bg-primary/20 text-primary",
  luteal: "bg-accent/20 text-accent-foreground",
};

export const CycleCalendar = () => {
  const { cycleDay } = useUserData();
  const days = generateCalendarDays(cycleDay);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Your Cycle Calendar</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your menstrual cycle and fertility window
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <div
              key={day.day}
              className={cn(
                "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                phaseColors[day.phase as keyof typeof phaseColors],
                day.isToday && "ring-2 ring-primary ring-offset-2 scale-110"
              )}
            >
              {day.day}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20"></div>
            <span className="text-xs text-muted-foreground">Menstrual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-secondary/20"></div>
            <span className="text-xs text-muted-foreground">Follicular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/20"></div>
            <span className="text-xs text-muted-foreground">Ovulation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent/20"></div>
            <span className="text-xs text-muted-foreground">Luteal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
