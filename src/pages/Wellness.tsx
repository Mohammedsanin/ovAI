import { useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Sparkles, BrainCircuit, Leaf, Music, BookOpen, Wind, Star, PenSquare, Droplets, Flame, Sprout } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😩", label: "Stressed" },
  { emoji: "😔", label: "Sad" },
];

interface WellnessPlan {
  mentalStateAnalysis: string;
  relaxationPlan: {
    technique: string;
    steps: string[];
  };
  selfCareTips: string[];
  nutritionMoodSupport: {
    recommendation: string;
    explanation: string;
  };
  musicSuggestionKeywords: string;
  mindfulnessPrompt: string;
  bookRecommendation: {
    title: string;
    author: string;
    reason: string;
  };
  affirmations: string[];
  warmNote: string;
}

const WellnessPlanLoader = () => (
  <Card className="shadow-card animate-fade-in">
    <CardHeader>
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
  </Card>
);

const WellnessPlanDisplay = ({ plan }: { plan: WellnessPlan }) => (
  <Card className="shadow-card animate-fade-in">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Your Personal Wellness Plan
      </CardTitle>
      <CardDescription>A gentle guide crafted just for you</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Understanding Your Feelings
        </h3>
        <p className="text-muted-foreground italic">"{plan.mentalStateAnalysis}"</p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Wind className="h-5 w-5 text-secondary" />
          Relaxation: {plan.relaxationPlan.technique}
        </h3>
        <ol className="list-decimal list-inside text-muted-foreground space-y-1">
          {plan.relaxationPlan.steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-accent" />
          Self-Care Today
        </h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          {plan.selfCareTips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Leaf className="h-5 w-5 text-primary" />
          Mood Nutrition
        </h3>
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{plan.nutritionMoodSupport.recommendation}</span>
          {' - '}
          {plan.nutritionMoodSupport.explanation}
        </p>
      </div>

      {plan.bookRecommendation && (
        <div className="border-t pt-4">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            Mindful Reading
          </h3>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="font-bold">"{plan.bookRecommendation.title}" by {plan.bookRecommendation.author}</p>
            <p className="text-muted-foreground text-sm mt-1">{plan.bookRecommendation.reason}</p>
          </div>
        </div>
      )}

      <div className="border-t pt-4">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <PenSquare className="h-5 w-5 text-accent" />
          A Moment to Reflect
        </h3>
        <p className="text-muted-foreground italic">"{plan.mindfulnessPrompt}"</p>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-primary" />
          Affirmations for You
        </h3>
        <div className="space-y-2">
          {plan.affirmations.map((aff, i) => (
            <p key={i} className="text-center font-medium p-3 bg-muted/50 rounded-lg">"{aff}"</p>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 text-center">
        <p className="text-muted-foreground">{plan.warmNote}</p>
      </div>
    </CardContent>
  </Card>
);

const BodyContextSelector = ({ 
  onSelect, 
  currentContext, 
  isPregnant, 
  onPregnancyToggle 
}: { 
  onSelect: (context: string) => void;
  currentContext: string;
  isPregnant: boolean;
  onPregnancyToggle: (isPregnant: boolean) => void;
}) => {
  const cycleOptions = [
    { id: 'menstrual', label: 'Menstrual', icon: <Droplets className="h-4 w-4" /> },
    { id: 'follicular', label: 'Follicular', icon: <Sprout className="h-4 w-4" /> },
    { id: 'ovulatory', label: 'Ovulatory', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'luteal', label: 'Luteal', icon: <Flame className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Cycle Tracking</span>
        <Switch
          checked={isPregnant}
          onCheckedChange={onPregnancyToggle}
        />
        <span className="text-sm text-muted-foreground">Pregnancy</span>
      </div>
      
      {isPregnant ? (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Select your pregnancy month:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 9 }, (_, i) => i + 1).map(month => (
              <Button
                key={month}
                variant={currentContext === `Pregnancy Month ${month}` ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelect(`Pregnancy Month ${month}`)}
              >
                Month {month}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {cycleOptions.map(opt => (
            <Button
              key={opt.id}
              variant={currentContext === opt.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelect(opt.id)}
              className="gap-2"
            >
              {opt.icon}
              {opt.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

const Wellness = () => {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string>("Calm");
  const [feelings, setFeelings] = useState("");
  const [wellnessPlan, setWellnessPlan] = useState<WellnessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const [bodyContext, setBodyContext] = useState('follicular');

  const handlePregnancyToggle = (isNowPregnant: boolean) => {
    setIsPregnant(isNowPregnant);
    if (isNowPregnant) {
      setBodyContext('Pregnancy Month 1');
    } else {
      setBodyContext('follicular');
    }
  };

  const handleGeneratePlan = async () => {
    if (!selectedMood) {
      toast({
        variant: "destructive",
        title: "Select a mood",
        description: "Please select how you're feeling to generate your plan."
      });
      return;
    }

    setIsLoading(true);
    setWellnessPlan(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-wellness-plan', {
        body: { 
          mood: selectedMood,
          feelings: feelings,
          context: bodyContext,
        }
      });

      if (error) throw error;

      setWellnessPlan(data);
      toast({
        title: "Plan Created!",
        description: "Your personalized wellness plan is ready.",
      });
    } catch (error) {
      console.error("Failed to generate wellness plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate your wellness plan. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="animate-fade-in text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Wellness Support
              </h2>
              <p className="text-muted-foreground">
                A personalized sanctuary to honor your feelings
              </p>
            </div>

            <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">How are you feeling?</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {moods.map((mood) => (
                      <button
                        key={mood.label}
                        className={`flex flex-col items-center justify-center h-20 w-20 rounded-xl border-2 transition-all ${
                          selectedMood === mood.label 
                            ? 'bg-primary/10 border-primary shadow-card scale-105' 
                            : 'bg-background border-border hover:border-primary/50 hover:scale-105'
                        }`}
                        onClick={() => setSelectedMood(mood.label)}
                      >
                        <span className="text-3xl mb-1">{mood.emoji}</span>
                        <span className="text-xs font-medium">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">What's on your mind? (Optional)</h3>
                  <Textarea
                    value={feelings}
                    onChange={(e) => setFeelings(e.target.value)}
                    placeholder="Share your thoughts or feelings..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">Your Body's Context</h3>
                  <BodyContextSelector 
                    onSelect={setBodyContext} 
                    currentContext={bodyContext} 
                    isPregnant={isPregnant}
                    onPregnancyToggle={handlePregnancyToggle}
                  />
                </div>

                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={isLoading} 
                  size="lg" 
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isLoading ? 'Creating Your Plan...' : 'Create My Wellness Plan'}
                </Button>
              </CardContent>
            </Card>

            {isLoading && <WellnessPlanLoader />}
            {wellnessPlan && <WellnessPlanDisplay plan={wellnessPlan} />}

            <div className="text-center text-xs text-muted-foreground pt-4">
              <p>This AI assistant is not a substitute for professional medical advice. If you're in crisis, please contact a healthcare professional or support hotline.</p>
            </div>
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Wellness;
