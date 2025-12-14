import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WorkoutPlanDisplay, { WorkoutActionPayload } from "@/components/Fitness/WorkoutPlanDisplay";
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
  BookmarkPlus,
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import type { Database, Json } from "@/integrations/supabase/types";

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
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);
  const [isSavedExpanded, setIsSavedExpanded] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const { toast } = useToast();

  type SavedWorkoutRow = Database["public"]["Tables"]["saved_workouts"]["Row"];

  interface SavedWorkout {
    id: string;
    dayNumber?: number | null;
    routineTitle: string;
    description?: string | null;
    exercises: WorkoutActionPayload["exercises"];
    cyclePhase?: string | null;
    fitnessGoal?: string | null;
    equipment?: string | null;
    createdAt: string;
  }

  const parseExercises = (value: SavedWorkoutRow["exercises"]): WorkoutActionPayload["exercises"] => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value as unknown as WorkoutActionPayload["exercises"];
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? (parsed as WorkoutActionPayload["exercises"]) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const shareWorkoutDetails = async ({
    routineTitle,
    dayNumber,
    description,
    exercises,
  }: WorkoutActionPayload) => {
    const exerciseLines = exercises.map((ex, idx) => `${idx + 1}. ${ex.name} – ${ex.sets}`).join("\n");
    const shareText = `Workout${dayNumber ? ` Day ${dayNumber}` : ""}: ${routineTitle}\n\n${description}\n\nExercises:\n${exerciseLines}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: routineTitle, text: shareText });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast({ title: "Workout copied", description: "Paste anywhere to share." });
      } else {
        throw new Error("Share not supported");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      console.error("Share failed", error);
      toast({ variant: "destructive", title: "Unable to share", description: "Please try again." });
    }
  };

  const loadSavedWorkouts = useCallback(async () => {
    setIsLoadingSaved(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSavedWorkouts([]);
        setIsLoadingSaved(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsed = (data ?? []).map((row) => ({
        id: row.id,
        dayNumber: row.day_number,
        routineTitle: row.routine_title,
        description: row.description,
        exercises: parseExercises(row.exercises),
        cyclePhase: row.cycle_phase,
        fitnessGoal: row.fitness_goal,
        equipment: row.equipment,
        createdAt: row.created_at,
      }));

      setSavedWorkouts(parsed);
    } catch (error) {
      console.error("Failed to load saved workouts", error);
      toast({
        variant: "destructive",
        title: "Couldn't load saved workouts",
        description: "Please refresh and try again.",
      });
    } finally {
      setIsLoadingSaved(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSavedWorkouts();
  }, [loadSavedWorkouts]);

  const handleSaveWorkoutDay = async (payload: WorkoutActionPayload) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Sign in to save workouts",
          description: "Create an account or sign in to store workout plans.",
        });
        return;
      }

      const { error } = await supabase.from("saved_workouts").insert({
        user_id: user.id,
        day_number: payload.dayNumber,
        routine_title: payload.routineTitle,
        description: payload.description,
        exercises: payload.exercises as unknown as Json,
        cycle_phase: payload.meta?.cyclePhase ?? cyclePhase,
        fitness_goal: payload.meta?.fitnessGoal ?? fitnessGoal,
        equipment: payload.meta?.equipment ?? equipment,
      });

      if (error) throw error;

      toast({ title: "Workout saved", description: `${payload.routineTitle} added to Saved Workouts.` });
      await loadSavedWorkouts();
    } catch (error: any) {
      console.error("Failed to save workout", error);
      toast({
        variant: "destructive",
        title: "Couldn't save workout",
        description: error?.message || "Please try again.",
      });
    }
  };

  const handleShareWorkoutDay = async (payload: WorkoutActionPayload) => {
    await shareWorkoutDetails(payload);
  };

  const handleRemoveWorkout = async (workoutId: string) => {
    try {
      setSavedWorkouts((prev) => prev.filter((w) => w.id !== workoutId));

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Please sign in to manage saved workouts");

      const { error } = await supabase
        .from("saved_workouts")
        .delete()
        .eq("user_id", user.id)
        .eq("id", workoutId);

      if (error) throw error;

      toast({ title: "Workout removed", description: "Cleared from Saved Workouts." });
    } catch (error: any) {
      console.error("Failed to remove workout", error);
      toast({
        variant: "destructive",
        title: "Couldn't remove workout",
        description: error?.message || "Please try again.",
      });
      await loadSavedWorkouts();
    }
  };

  const savedSummary = useMemo(() => {
    if (savedWorkouts.length === 0) return "No saved workouts yet — capture routines you love.";
    return `You have ${savedWorkouts.length} saved ${savedWorkouts.length === 1 ? "plan" : "plans"}.`;
  }, [savedWorkouts.length]);

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
              <Card className="bg-card/80 border-primary/10 shadow-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border/60 px-6 py-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <BookmarkPlus className="h-4 w-4" /> Saved Workout Plans
                    </p>
                    <p className="text-sm text-muted-foreground">{savedSummary}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-expanded={isSavedExpanded}
                    onClick={() => setIsSavedExpanded((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full"
                  >
                    {isSavedExpanded ? "Collapse" : "Expand"}
                    {isSavedExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {isSavedExpanded && (
                  <div className="p-6">
                    {isLoadingSaved ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2].map((item) => (
                          <Card key={item} className="p-4 space-y-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-16 w-full" />
                          </Card>
                        ))}
                      </div>
                    ) : savedWorkouts.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground">
                        Save a workout from your generated plan to see it here.
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2">
                        {savedWorkouts.map((workout) => (
                          <article
                            key={workout.id}
                            className="rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-5 shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <span className="text-[11px] font-semibold tracking-[0.3em] text-primary/80">
                                  {workout.dayNumber ? `Day ${workout.dayNumber}` : "Routine"}
                                </span>
                                <h4 className="text-lg font-semibold text-foreground">{workout.routineTitle}</h4>
                                {workout.description && (
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {workout.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                                  {workout.cyclePhase && (
                                    <span className="rounded-full bg-background/80 px-2 py-1">{workout.cyclePhase}</span>
                                  )}
                                  {workout.fitnessGoal && (
                                    <span className="rounded-full bg-background/80 px-2 py-1">{workout.fitnessGoal}</span>
                                  )}
                                  {workout.equipment && (
                                    <span className="rounded-full bg-background/80 px-2 py-1">{workout.equipment}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-9 w-9 rounded-full border-primary/30 text-primary"
                                  onClick={() =>
                                    shareWorkoutDetails({
                                      dayNumber: workout.dayNumber ?? undefined,
                                      routineTitle: workout.routineTitle,
                                      description: workout.description ?? "",
                                      exercises: workout.exercises,
                                    })
                                  }
                                >
                                  <Share2 className="h-4 w-4" />
                                  <span className="sr-only">Share saved workout</span>
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                                  onClick={() => handleRemoveWorkout(workout.id)}
                                >
                                  ×
                                  <span className="sr-only">Remove saved workout</span>
                                </Button>
                              </div>
                            </div>
                            {workout.exercises.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground">Key moves</p>
                                {workout.exercises.slice(0, 3).map((exercise) => (
                                  <div key={exercise.name} className="rounded-xl bg-background/70 p-3 text-sm">
                                    <span className="font-semibold text-foreground">{exercise.name}</span>
                                    <span className="ml-2 text-muted-foreground">{exercise.sets}</span>
                                  </div>
                                ))}
                                {workout.exercises.length > 3 && (
                                  <p className="text-xs text-muted-foreground">
                                    +{workout.exercises.length - 3} more exercises
                                  </p>
                                )}
                              </div>
                            )}
                            <p className="mt-3 text-xs text-muted-foreground">
                              Saved {new Date(workout.createdAt).toLocaleDateString()}
                            </p>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {workoutPlan ? (
                <WorkoutPlanDisplay
                  weeklyPlan={workoutPlan.weeklyPlan}
                  onGenerateNew={() => setWorkoutPlan(null)}
                  onSaveWorkoutDay={handleSaveWorkoutDay}
                  onShareWorkoutDay={handleShareWorkoutDay}
                  planMeta={{
                    cyclePhase,
                    fitnessGoal,
                    equipment,
                  }}
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
