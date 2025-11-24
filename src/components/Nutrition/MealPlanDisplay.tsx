import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Flame, Leaf, ChefHat, Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Meal {
  name: string;
  description: string;
  calories: string;
  fiber: string;
  ingredients: string[];
  recipe: string[];
}

interface VideoSuggestion {
  meal: string;
  title: string;
  videoId?: string | null;
  videoTitle?: string | null;
  videoUrl?: string | null;
  channelTitle?: string | null;
  videoDescription?: string | null;
}

interface MealPlanDisplayProps {
  mealPlan?: {
    breakfast?: Meal;
    midMorningSnack?: Meal;
    lunch?: Meal;
    afternoonSnack?: Meal;
    dinner?: Meal;
  };
  shoppingList?: string[];
  videoSuggestions?: Array<VideoSuggestion>;
  onGenerateNew: () => void;
}

const MealCard = ({ 
  meal, 
  mealType, 
  videoSuggestion 
}: { 
  meal: Meal; 
  mealType: string; 
  videoSuggestion?: VideoSuggestion;
}) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl">{meal.name}</CardTitle>
        <Badge variant="secondary" className="text-xs">{mealType}</Badge>
      </div>
      <CardDescription>{meal.description}</CardDescription>
      <div className="flex gap-4 mt-2 text-sm">
        <span className="flex items-center gap-1">
          <Flame className="h-4 w-4 text-orange-500" />
          {meal.calories}
        </span>
        <span className="flex items-center gap-1">
          <Leaf className="h-4 w-4 text-green-500" />
          {meal.fiber} fiber
        </span>
      </div>
    </CardHeader>
    <CardContent className="pt-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Ingredients
        </h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {meal.ingredients.map((ingredient, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-primary">•</span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <ChefHat className="h-4 w-4" />
          Recipe
        </h4>
        <ol className="space-y-2 text-sm text-muted-foreground">
          {meal.recipe.map((step, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="font-semibold text-primary min-w-[20px]">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      
      {/* Video Section at Bottom */}
      {videoSuggestion?.videoId && (
        <div className="pt-2 space-y-3">
          <Separator />
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Video className="h-4 w-4" />
              Recipe Video Tutorial
            </h4>
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoSuggestion.videoId}`}
                title={videoSuggestion.videoTitle || `${meal.name} Recipe`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            {videoSuggestion?.videoUrl && (
              <Button asChild className="w-full mt-3">
                <a
                  href={videoSuggestion.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Watch Full Recipe Video
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
      
      {!videoSuggestion?.videoId && videoSuggestion && (
        <div className="pt-2">
          <Separator />
          <div className="text-center py-4 text-muted-foreground">
            <Video className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Recipe video not available</p>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function MealPlanDisplay({ mealPlan, shoppingList = [], videoSuggestions = [], onGenerateNew }: MealPlanDisplayProps) {
  if (!mealPlan) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">No meal plan available</p>
        <Button onClick={onGenerateNew} variant="outline">
          Generate New Plan
        </Button>
      </div>
    );
  }

  // Helper function to get video suggestion for a specific meal
  const getVideoForMeal = (mealType: string): VideoSuggestion | undefined => {
    return videoSuggestions.find(video => 
      video.meal.toLowerCase().replace(/\s+/g, '') === mealType.toLowerCase().replace(/\s+/g, '')
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your Personalized Meal Plan
        </h2>
        <p className="text-muted-foreground">Crafted with care for your wellness journey</p>
        <Button onClick={onGenerateNew} variant="outline" className="mt-4">
          Generate New Plan
        </Button>
      </div>

      {/* Meal Cards with Embedded Videos */}
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {mealPlan.breakfast && (
          <MealCard 
            meal={mealPlan.breakfast} 
            mealType="Breakfast" 
            videoSuggestion={getVideoForMeal('breakfast')}
          />
        )}
        {mealPlan.midMorningSnack && (
          <MealCard 
            meal={mealPlan.midMorningSnack} 
            mealType="Mid-Morning Snack" 
            videoSuggestion={getVideoForMeal('midMorningSnack')}
          />
        )}
        {mealPlan.lunch && (
          <MealCard 
            meal={mealPlan.lunch} 
            mealType="Lunch" 
            videoSuggestion={getVideoForMeal('lunch')}
          />
        )}
        {mealPlan.afternoonSnack && (
          <MealCard 
            meal={mealPlan.afternoonSnack} 
            mealType="Afternoon Snack" 
            videoSuggestion={getVideoForMeal('afternoonSnack')}
          />
        )}
        {mealPlan.dinner && (
          <MealCard 
            meal={mealPlan.dinner} 
            mealType="Dinner" 
            videoSuggestion={getVideoForMeal('dinner')}
          />
        )}
      </div>

      {/* Shopping List */}
      <Card className="bg-gradient-to-br from-accent/20 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping List
          </CardTitle>
          <CardDescription>Everything you need for today's meals</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {shoppingList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
