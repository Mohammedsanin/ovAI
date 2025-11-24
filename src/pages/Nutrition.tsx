import { useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MealPlanDisplay from "@/components/Nutrition/MealPlanDisplay";
import {
  Baby,
  Beef,
  Bike,
  Check,
  ChevronRight,
  CircleDashed,
  Droplets,
  Flame,
  Leaf,
  Minus,
  PersonStanding,
  Sparkles,
  Sprout,
  Target,
  Tractor,
  Wind,
} from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h2 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
      {title} <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </h2>
    {children}
  </div>
);

const OptionCard = ({
  icon,
  title,
  subtitle,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <Card
    onClick={onClick}
    className={`p-4 cursor-pointer transition-all relative ${
      isSelected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="bg-accent p-3 rounded-full">{icon}</div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    {isSelected && (
      <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
        <Check className="h-3 w-3 text-primary-foreground" />
      </div>
    )}
  </Card>
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
  </Card>
);

const Nutrition = () => {
  const [goal, setGoal] = useState<"pregnant" | "cycle">("cycle");
  const [cyclePhase, setCyclePhase] = useState("follicular");
  const [dietStyle, setDietStyle] = useState("vegetarian");
  const [cuisine, setCuisine] = useState("mediterranean");
  const [mainGoal, setMainGoal] = useState("balance_hormones");
  const [calories, setCalories] = useState([1800]);
  const [activityLevel, setActivityLevel] = useState("moderately_active");
  const [allergies, setAllergies] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const { toast } = useToast();

  const dietOptions = [
    { id: "vegetarian", label: "Vegetarian", icon: <Leaf className="h-6 w-6 text-green-600" /> },
    { id: "vegan", label: "Vegan", icon: <Sprout className="h-6 w-6 text-green-700" /> },
    { id: "non-veg", label: "Non-Veg", icon: <Beef className="h-6 w-6 text-red-600" /> },
    { id: "keto", label: "Keto", icon: <Flame className="h-6 w-6 text-orange-500" /> },
    { id: "paleo", label: "Paleo", icon: <Tractor className="h-6 w-6 text-yellow-700" /> },
    { id: "pescatarian", label: "Pescatarian", icon: <CircleDashed className="h-6 w-6 text-blue-500" /> },
  ];

  const cuisineOptions = [
    { id: "indian", label: "Indian", short: "IN" },
    { id: "mediterranean", label: "Mediterranean", short: "GR" },
    { id: "asian", label: "Asian", short: "AS" },
    { id: "western", label: "Western", short: "WS" },
  ];

  const mainGoals = [
    { id: "more_energy", label: "More Energy", icon: <Flame className="h-5 w-5 text-orange-500" /> },
    { id: "reduce_cramps", label: "Reduce Cramps", icon: <Minus className="h-5 w-5 text-red-500" /> },
    { id: "balance_hormones", label: "Balance Hormones", icon: <Wind className="h-5 w-5 text-purple-500" /> },
    { id: "weight_management", label: "Weight Management", icon: <Target className="h-5 w-5 text-blue-500" /> },
  ];

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setMealPlan(null);
    try {
      const preferences = `Cuisine: ${cuisine}, Main Goal: ${mainGoal.replace("_", " ")}, Activity Level: ${activityLevel.replace("_", " ")}, Daily Calories: ${calories[0]}`;
      
      const { data, error } = await supabase.functions.invoke("generate-meal-plan", {
        body: {
          cyclePhase: goal === "cycle" ? cyclePhase : "general",
          dietaryRestrictions: `${dietStyle}, Allergies: ${allergies || "none"}`,
          preferences,
        },
      });

      if (error) throw error;
      
      setMealPlan(data);
      toast({
        title: "Success!",
        description: "Your personalized meal plan is ready.",
      });
    } catch (error: any) {
      console.error("Failed to generate meal plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate your meal plan. Please try again.",
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
                Wellness Nutritionist
              </h1>
              <p className="mt-2 text-muted-foreground">
                AI-powered meal plans tailored for your unique journey ✨
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Baby className="h-4 w-4" />
                  Pregnancy Support
                </span>
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-4 w-4" />
                  Cycle Tracking
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Custom Nutrition
                </span>
              </div>
            </header>

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
              {mealPlan ? (
                <MealPlanDisplay
                  mealPlan={mealPlan.mealPlan}
                  shoppingList={mealPlan.shoppingList}
                  videoSuggestions={mealPlan.videoSuggestions}
                  onGenerateNew={() => setMealPlan(null)}
                />
              ) : isLoading ? (
                <Card className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-64 mx-auto" />
                    <Skeleton className="h-4 w-96 mx-auto" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-[400px]" />
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-6 md:p-8 space-y-8 bg-card/80 backdrop-blur-sm shadow-xl max-w-4xl mx-auto">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">Tell us about yourself</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Help us create the perfect meal plan for you
                    </p>
                  </div>

                  <Section title="What's your goal?">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <OptionCard
                        icon={<Droplets className="h-8 w-8 text-primary" />}
                        title="Track Cycle Phase"
                        subtitle="Optimize nutrition based on your menstrual cycle"
                        isSelected={goal === "cycle"}
                        onClick={() => setGoal("cycle")}
                      />
                      <OptionCard
                        icon={<Baby className="h-8 w-8 text-primary" />}
                        title="Pregnancy Support"
                        subtitle="Nutrition for you and your baby"
                        isSelected={goal === "pregnant"}
                        onClick={() => setGoal("pregnant")}
                      />
                    </div>
                  </Section>

                  {goal === "cycle" && (
                    <Section title="Current Cycle Phase">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {["menstruation", "follicular", "ovulation", "luteal"].map((phase) => (
                          <ChoiceChip
                            key={phase}
                            icon={<Droplets className="h-5 w-5" />}
                            title={phase.charAt(0).toUpperCase() + phase.slice(1)}
                            isSelected={cyclePhase === phase}
                            onClick={() => setCyclePhase(phase)}
                          />
                        ))}
                      </div>
                    </Section>
                  )}

                  <Section title="Dietary Style">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {dietOptions.map((diet) => (
                        <ChoiceChip
                          key={diet.id}
                          icon={diet.icon}
                          title={diet.label}
                          isSelected={dietStyle === diet.id}
                          onClick={() => setDietStyle(diet.id)}
                        />
                      ))}
                    </div>
                  </Section>

                  <Section title="Preferred Cuisine">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {cuisineOptions.map((c) => (
                        <ChoiceChip
                          key={c.id}
                          icon={<span className="text-2xl">{c.short}</span>}
                          title={c.label}
                          isSelected={cuisine === c.id}
                          onClick={() => setCuisine(c.id)}
                        />
                      ))}
                    </div>
                  </Section>

                  <Section title="Main Wellness Goal">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {mainGoals.map((g) => (
                        <ChoiceChip
                          key={g.id}
                          icon={g.icon}
                          title={g.label}
                          isSelected={mainGoal === g.id}
                          onClick={() => setMainGoal(g.id)}
                        />
                      ))}
                    </div>
                  </Section>

                  <Section title="Activity Level">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <ChoiceChip
                        icon={<PersonStanding className="h-5 w-5" />}
                        title="Sedentary"
                        subtitle="Little exercise"
                        isSelected={activityLevel === "sedentary"}
                        onClick={() => setActivityLevel("sedentary")}
                      />
                      <ChoiceChip
                        icon={<Bike className="h-5 w-5" />}
                        title="Moderate"
                        subtitle="3-5 days/week"
                        isSelected={activityLevel === "moderately_active"}
                        onClick={() => setActivityLevel("moderately_active")}
                      />
                      <ChoiceChip
                        icon={<Flame className="h-5 w-5" />}
                        title="Very Active"
                        subtitle="6-7 days/week"
                        isSelected={activityLevel === "very_active"}
                        onClick={() => setActivityLevel("very_active")}
                      />
                    </div>
                  </Section>

                  <Section title={`Daily Calories: ${calories[0]} kcal`}>
                    <Slider
                      value={calories}
                      onValueChange={setCalories}
                      min={1200}
                      max={3000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1200</span>
                      <span>3000</span>
                    </div>
                  </Section>

                  <Section title="Allergies & Restrictions (Optional)">
                    <Textarea
                      placeholder="E.g., nuts, dairy, shellfish..."
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </Section>

                  <Button
                    onClick={handleGeneratePlan}
                    size="lg"
                    className="w-full bg-gradient-wellness hover:opacity-90 transition-opacity"
                    disabled={isLoading}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate My Meal Plan
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

export default Nutrition;
