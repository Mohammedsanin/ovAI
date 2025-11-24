import { Calendar, Heart, Droplet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUserData } from "@/hooks/useUserData";
import { WaterDialog, CycleDialog } from "./TrackingDialogs";

export const QuickStats = () => {
  const { cycleDay, mood, water } = useUserData();

  const getPhase = (day: number) => {
    if (day >= 1 && day <= 5) return "Menstrual phase";
    if (day >= 6 && day <= 13) return "Follicular phase";
    if (day >= 14 && day <= 16) return "Ovulation phase";
    return "Luteal phase";
  };

  const stats = [
    {
      icon: Calendar,
      label: "Cycle Day",
      value: cycleDay.toString(),
      subtitle: getPhase(cycleDay),
      gradient: "bg-gradient-wellness",
    },
    {
      icon: Heart,
      label: "Today's Mood",
      value: mood.mood,
      subtitle: `Energy level: ${mood.energy}`,
      gradient: "bg-gradient-calm",
    },
    {
      icon: Droplet,
      label: "Water Intake",
      value: `${water.consumed}/${water.target}`,
      subtitle: "cups today",
      gradient: "bg-primary",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="overflow-hidden shadow-card hover:shadow-soft transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-3 justify-end">
        <WaterDialog />
        <CycleDialog />
      </div>
    </div>
  );
};
