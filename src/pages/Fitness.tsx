import { useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WorkoutPlanDisplay from "@/components/Fitness/WorkoutPlanDisplay";
import {
  Dumbbell,
  Flame,
  Droplets,
  Sparkles,
  Sprout,
  HeartPulse,
  Wind,
  Check,
  ChevronRight,
  Zap,
} from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h2 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
      {title} <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </h2>
    {children}
  </div>
);

const ChoiceChip = ({
  icon,
  title,
  subtitle,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <Card
    onClick={onClick}
    className={`p-3 cursor-pointer transition-all text-center flex-grow ${
      isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
    }`}
  >
    <div className="flex flex-col items-center justify-center h-full">
      <div className="mb-2">{icon}</div>
      <p className="font-medium text-sm text-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
    {isSelected && (
      <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
        <Check className="h-3 w-3 text-primary-foreground" />
      </div>
    )}
  </Card>
);

const Fitness = () => {
  const [fitnessGoal, setFitnessGoal] = useState("build_muscle");
  const [cyclePhase, setCyclePhase] = useState("follicular");
  const [equipment, setEquipment] = useState("Dumbbells, yoga mat");
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const { toast } = useToast();

  const goalOptions = [
    { id: "lose_weight", label: "Lose Weight", icon: <Flame className="h-6 w-6 text-orange-500" /> },
    { id: "build_muscle", label: "Build Muscle", icon: <Dumbbell className="h-6 w-6 text-blue-600" /> },
    { id: "improve_endurance", label: "Improve Endurance", icon: <HeartPulse className="h-6 w-6 text-red-500" /> },
    { id: "flexibility", label: "Flexibility", icon: <Wind className="h-6 w-6 text-purple-500" /> },
  ];

  const cycleOptions = [
    { id: "menstrual", label: "Menstrual", icon: <Droplets className="h-6 w-6 text-red-400" /> },
    { id: "follicular", label: "Follicular", icon: <Sprout className="h-6 w-6 text-green-500" /> },
    { id: "ovulatory", label: "Ovulatory", icon: <Sparkles className="h-6 w-6 text-yellow-500" /> },
    { id: "luteal", label: "Luteal", icon: <Flame className="h-6 w-6 text-orange-400" /> },
  ];

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setWorkoutPlan(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-workout-plan", {
        body: {
          fitnessGoals: fitnessGoal.replace("_", " "),
          cyclePhase,
          availableEquipment: equipment,
        },
      });

      if (error) throw error;

      setWorkoutPlan(data);
      toast({
        title: "Success!",
        description: "Your personalized workout plan is ready.",
      });
    } catch (error: any) {
      console.error("Failed to generate workout plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate your workout plan. Please try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-background min-h-full">
            <header className="text-center py-10 px-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
                Cycle-Synced Fitness
              </h1>
              <p className="mt-2 text-muted-foreground">
                AI-driven workout plans adapted to your energy levels and cycle phase ✨
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Dumbbell className="h-4 w-4" />
                  Personalized Training
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  Cycle-Aware
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  AI-Powered
                </span>
              </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
              {workoutPlan ? (
                <WorkoutPlanDisplay
                  weeklyPlan={workoutPlan.weeklyPlan}
                  onGenerateNew={() => setWorkoutPlan(null)}
                />
              ) : isLoading ? (
                <Card className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-4 w-96 mx-auto" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <Skeleton key={i} className="h-[350px]" />
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-6 md:p-8 space-y-8 bg-card/80 backdrop-blur-sm shadow-xl max-w-4xl mx-auto">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">Create Your Workout Plan</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get a personalized 7-day plan tailored to your goals
                    </p>
                  </div>

                  <Section title="Your Fitness Goal">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {goalOptions.map((opt) => (
                        <ChoiceChip
                          key={opt.id}
                          icon={opt.icon}
                          title={opt.label}
                          isSelected={fitnessGoal === opt.id}
                          onClick={() => setFitnessGoal(opt.id)}
                        />
                      ))}
                    </div>
                  </Section>

                  <Section title="Current Cycle Phase">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {cycleOptions.map((opt) => (
                        <ChoiceChip
                          key={opt.id}
                          icon={opt.icon}
                          title={opt.label}
                          isSelected={cyclePhase === opt.id}
                          onClick={() => setCyclePhase(opt.id)}
                        />
                      ))}
                    </div>
                  </Section>

                  <Section title="Available Equipment">
                    <Input
                      placeholder="e.g., dumbbells, treadmill, resistance bands, yoga mat"
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      List any equipment you have access to, or type "none" for bodyweight exercises
                    </p>
                  </Section>

                  <Button
                    onClick={handleGeneratePlan}
                    size="lg"
                    className="w-full bg-gradient-wellness hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate My Workout Plan
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </main>
        <EmergencySOS />
      </div>
    </div>
  );
};

export default Fitness;
