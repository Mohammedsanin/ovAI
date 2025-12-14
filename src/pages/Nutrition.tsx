import { useCallback, useEffect, useState } from "react";
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
import MealPlanDisplay, { MealActionSavePayload, MealActionSharePayload } from "@/components/Nutrition/MealPlanDisplay";
import type { Database } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";
import {
  BookmarkPlus,
  Baby,
  Beef,
  Bike,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleDashed,
  Droplets,
  Flame,
  Leaf,
  Minus,
  PersonStanding,
  Play,
  Share2,
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

type SavedMealRow = Database["public"]["Tables"]["saved_meals"]["Row"];

interface SavedMeal {
  id: string;
  mealType: string;
  mealName: string;
  description?: string | null;
  calories?: string | null;
  fiber?: string | null;
  ingredients: string[];
  recipeSteps: string[];
  videoTitle?: string | null;
  videoUrl?: string | null;
  createdAt: string;
}

const normalizeStringArray = (value: SavedMealRow["ingredients"] | SavedMealRow["recipe_steps"]): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string" ? item : typeof item === "number" ? item.toString() : JSON.stringify(item)
    );
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => (typeof item === "string" ? item : JSON.stringify(item)));
      }
    } catch {
      return [value];
    }
  }

  return [];
};

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
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [isSavedMealsExpanded, setIsSavedMealsExpanded] = useState(false);
  const [isLoadingSavedMeals, setIsLoadingSavedMeals] = useState(true);
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

  const loadSavedMeals = useCallback(async () => {
    setIsLoadingSavedMeals(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSavedMeals([]);
        setIsLoadingSavedMeals(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_meals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsedMeals: SavedMeal[] = (data ?? []).map((meal) => ({
        id: meal.id,
        mealType: meal.meal_type,
        mealName: meal.meal_name,
        description: meal.description,
        calories: meal.calories,
        fiber: meal.fiber,
        ingredients: normalizeStringArray(meal.ingredients as SavedMealRow["ingredients"]),
        recipeSteps: normalizeStringArray(meal.recipe_steps as SavedMealRow["recipe_steps"]),
        videoTitle: meal.video_title,
        videoUrl: meal.video_url,
        createdAt: meal.created_at,
      }));

      setSavedMeals(parsedMeals);
    } catch (error) {
      console.error("Failed to load saved meals:", error);
      toast({
        variant: "destructive",
        title: "Couldn't load saved meals",
        description: "Please try refreshing the page.",
      });
    } finally {
      setIsLoadingSavedMeals(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSavedMeals();
  }, [loadSavedMeals]);

  const shareMealDetails = async ({
    mealName,
    mealType,
    description,
    ingredients,
    recipe,
    videoUrl,
  }: {
    mealName: string;
    mealType: string;
    description?: string | null;
    ingredients: string[];
    recipe: string[];
    videoUrl?: string | null;
  }) => {
    const ingredientText = ingredients.length ? ingredients.map((item) => `• ${item}`).join("\n") : "-";
    const recipeText = recipe.length
      ? recipe.map((step, idx) => `${idx + 1}. ${step}`).join("\n")
      : "-";

    const shareText = `Meal Plan: ${mealName} (${mealType})\n\n${description ?? ""}\n\nIngredients:\n${ingredientText}\n\nRecipe Steps:\n${recipeText}${videoUrl ? `\n\nWatch: ${videoUrl}` : ""}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: mealName, text: shareText });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Meal details copied",
          description: "Paste anywhere to share it.",
        });
      } else {
        throw new Error("Share not supported");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("Failed to share meal:", error);
      toast({
        variant: "destructive",
        title: "Unable to share meal",
        description: "Please try again.",
      });
    }
  };

  const handleSaveMeal = async (payload: MealActionSavePayload) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          variant: "destructive",
          title: "Sign in to save meals",
          description: "Create an account or sign in to store meal plans.",
        });
        return;
      }

      const { error } = await supabase.from("saved_meals").insert({
        user_id: user.id,
        meal_type: payload.mealType,
        meal_name: payload.mealName,
        description: payload.description,
        calories: payload.calories,
        fiber: payload.fiber,
        ingredients: payload.ingredients,
        recipe_steps: payload.recipe,
        video_id: payload.video?.videoId ?? null,
        video_title: payload.video?.videoTitle ?? null,
        video_url: payload.video?.videoUrl ?? null,
      });

      if (error) throw error;

      toast({
        title: "Meal saved",
        description: `${payload.mealName} is now in Saved Meals`,
      });

      await loadSavedMeals();
    } catch (error: any) {
      console.error("Failed to save meal:", error);
      toast({
        variant: "destructive",
        title: "Couldn't save meal",
        description: error?.message || "Please try again.",
      });
    }
  };

  const handleShareMeal = async (payload: MealActionSharePayload) => {
    await shareMealDetails({
      mealName: payload.mealName,
      mealType: payload.mealType,
      description: payload.description,
      ingredients: payload.ingredients,
      recipe: payload.recipe,
      videoUrl: payload.videoUrl,
    });
  };

  const handleShareSavedMeal = async (meal: SavedMeal) => {
    await shareMealDetails({
      mealName: meal.mealName,
      mealType: meal.mealType,
      description: meal.description,
      ingredients: meal.ingredients,
      recipe: meal.recipeSteps,
      videoUrl: meal.videoUrl,
    });
  };

  const handleRemoveSavedMeal = async (mealId: string) => {
    try {
      setSavedMeals((prev) => prev.filter((meal) => meal.id !== mealId));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Please sign in to manage saved meals");
      }

      const { error } = await supabase
        .from("saved_meals")
        .delete()
        .eq("user_id", user.id)
        .eq("id", mealId);

      if (error) throw error;

      toast({
        title: "Meal removed",
        description: "This saved plan has been cleared from your list.",
      });
    } catch (error: any) {
      console.error("Failed to remove saved meal:", error);
      toast({
        variant: "destructive",
        title: "Couldn't remove meal",
        description: error?.message || "Please try again.",
      });
      await loadSavedMeals();
    }
  };

  const savedMealsCountLabel = savedMeals.length === 1 ? "meal" : "meals";
  const savedMealsSubtitle = savedMeals.length === 0
    ? "No saved meals yet — capture any plan you love to build your personal cookbook."
    : `You have ${savedMeals.length} saved ${savedMealsCountLabel} ready to revisit.`;
  const shouldShowSavedMealsBody = isSavedMealsExpanded;

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
              <Card className="bg-card/80 backdrop-blur border-primary/10 shadow-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-border/60 px-6 py-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <BookmarkPlus className="h-4 w-4" /> Saved Meal Plans
                    </p>
                    <p className="text-sm text-muted-foreground">{savedMealsSubtitle}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-expanded={isSavedMealsExpanded}
                    onClick={() => setIsSavedMealsExpanded((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full"
                  >
                    {isSavedMealsExpanded ? "Collapse" : "Expand"}
                    {isSavedMealsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {shouldShowSavedMealsBody && (
                  <div className="p-6">
                    {isLoadingSavedMeals ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {[1, 2].map((item) => (
                          <Card key={item} className="p-4 space-y-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-16 w-full" />
                          </Card>
                        ))}
                      </div>
                    ) : savedMeals.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground">
                        Save a meal from your generated plan to see it here.
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2">
                        {savedMeals.map((meal) => (
                          <article
                            key={meal.id}
                            className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 shadow-sm"
                          >
                            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]" />
                            <div className="relative z-10 space-y-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5">
                                  <span className="text-[11px] font-semibold tracking-[0.3em] text-primary/80">
                                    {meal.mealType}
                                  </span>
                                  <h4 className="text-xl font-semibold text-foreground">{meal.mealName}</h4>
                                  {meal.description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed">{meal.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-9 w-9 rounded-full border-primary/30 text-primary"
                                    onClick={() => handleShareSavedMeal(meal)}
                                  >
                                    <Share2 className="h-4 w-4" />
                                    <span className="sr-only">Share saved meal</span>
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9 rounded-full text-destructive hover:bg-destructive/10"
                                    onClick={() => handleRemoveSavedMeal(meal.id)}
                                  >
                                    ×
                                    <span className="sr-only">Remove saved meal</span>
                                  </Button>
                                </div>
                              </div>

                              {(meal.calories || meal.fiber) && (
                                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                  {meal.calories && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-orange-600">
                                      <Flame className="h-3 w-3" /> {meal.calories}
                                    </span>
                                  )}
                                  {meal.fiber && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-green-600">
                                      <Leaf className="h-3 w-3" /> {meal.fiber} fiber
                                    </span>
                                  )}
                                </div>
                              )}

                              {meal.ingredients.length > 0 && (
                                <div className="rounded-2xl bg-background/70 p-4">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                                    Pantry & produce
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {meal.ingredients.map((ingredient) => (
                                      <span
                                        key={ingredient}
                                        className="rounded-full bg-white/80 px-3 py-1 text-sm text-foreground shadow-sm"
                                      >
                                        {ingredient}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {meal.recipeSteps.length > 0 && (
                                <div className="rounded-2xl bg-background/80 p-4 space-y-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Recipe flow
                                  </p>
                                  <ol className="space-y-3 text-sm text-foreground/90">
                                    {meal.recipeSteps.map((step, idx) => (
                                      <li key={`${meal.id}-step-${idx}`} className="flex gap-3">
                                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                                          {idx + 1}
                                        </span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                                <span>Saved {formatDistanceToNow(new Date(meal.createdAt), { addSuffix: true })}</span>
                                {meal.videoUrl && (
                                  <a
                                    href={meal.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary hover:underline"
                                  >
                                    <Play className="h-3 w-3" /> Watch video
                                  </a>
                                )}
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {mealPlan ? (
                <MealPlanDisplay
                  mealPlan={mealPlan.mealPlan}
                  shoppingList={mealPlan.shoppingList}
                  videoSuggestions={mealPlan.videoSuggestions}
                  onGenerateNew={() => setMealPlan(null)}
                  onSaveMeal={handleSaveMeal}
                  onShareMeal={handleShareMeal}
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
