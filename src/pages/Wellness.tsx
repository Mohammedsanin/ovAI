import { useState, type ElementType, type ReactNode } from "react";
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

interface SectionBlockProps {
  icon: ElementType;
  title: string;
  accentClass?: string;
  children: ReactNode;
  eyebrow?: string;
  className?: string;
}

const SectionBlock = ({
  icon: Icon,
  title,
  accentClass = "bg-primary/10 text-primary",
  children,
  eyebrow = "Today",
  className = "",
}: SectionBlockProps) => (
  <div className={`rounded-2xl border border-border/60 bg-card/80 p-5 shadow-soft backdrop-blur ${className}`}>
    <div className="flex items-start gap-3 mb-4">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{eyebrow}</p>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
    </div>
    {children}
  </div>
);

const WellnessPlanDisplay = ({ plan }: { plan: WellnessPlan }) => (
  <Card className="shadow-card animate-fade-in border-none bg-transparent">
    <CardContent className="space-y-8 p-0">
      <div className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-background to-accent/10 p-8 text-center shadow-glow">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/40 px-4 py-1 text-sm font-semibold text-primary backdrop-blur">
          <Sparkles className="h-4 w-4" />
          Crafted just for you
        </div>
        <h2 className="mt-4 text-3xl font-black text-foreground">Your Personal Wellness Plan</h2>
        <p className="mt-2 text-base text-foreground/70">A gentle, grounded guide to carry you through today.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionBlock icon={BrainCircuit} title="Understanding Your Feelings" accentClass="bg-primary/15 text-primary">
          <p className="text-muted-foreground text-base leading-relaxed italic">"{plan.mentalStateAnalysis}"</p>
        </SectionBlock>

        <SectionBlock
          icon={Wind}
          title={`Relaxation • ${plan.relaxationPlan.technique}`}
          accentClass="bg-secondary/15 text-secondary"
        >
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            {plan.relaxationPlan.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </SectionBlock>

        <SectionBlock icon={Heart} title="Self-Care Today" accentClass="bg-accent/15 text-accent">
          <div className="space-y-3">
            {plan.selfCareTips.map((tip, i) => (
              <div key={i} className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground/80 mr-2">{String(i + 1).padStart(2, '0')}.</span>
                {tip}
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock icon={Leaf} title="Mood Nutrition" accentClass="bg-emerald-100 text-emerald-700">
          <div className="rounded-xl border border-emerald-200 bg-white/70 p-4 text-sm text-muted-foreground shadow-inner">
            <p className="font-semibold text-foreground">{plan.nutritionMoodSupport.recommendation}</p>
            <p className="mt-2 leading-relaxed">{plan.nutritionMoodSupport.explanation}</p>
          </div>
        </SectionBlock>

        {plan.bookRecommendation && (
          <SectionBlock
            icon={BookOpen}
            title="Mindful Reading"
            eyebrow="Soul Food"
            accentClass="bg-indigo-100 text-indigo-700"
            className="lg:col-span-2"
          >
            <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 text-left md:flex-row md:items-center">
              <div className="flex-1">
                <p className="text-xl font-semibold text-indigo-900">"{plan.bookRecommendation.title}"</p>
                <p className="text-sm text-indigo-700">by {plan.bookRecommendation.author}</p>
              </div>
              <p className="flex-1 text-sm text-indigo-900/80 leading-relaxed">{plan.bookRecommendation.reason}</p>
            </div>
          </SectionBlock>
        )}

        <SectionBlock
          icon={PenSquare}
          title="A Moment to Reflect"
          accentClass="bg-rose-100 text-rose-700"
          className="lg:col-span-2"
        >
          <blockquote className="rounded-2xl border border-rose-100 bg-white/70 p-5 text-center text-base font-medium text-rose-900 shadow-inner">
            “{plan.mindfulnessPrompt}”
          </blockquote>
        </SectionBlock>

        <SectionBlock icon={Star} title="Affirmations for You" accentClass="bg-amber-100 text-amber-700" className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-3">
            {plan.affirmations.map((aff, i) => (
              <div
                key={i}
                className="rounded-2xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-4 text-center text-sm font-semibold text-amber-900 shadow-sm"
              >
                “{aff}”
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>

      <SectionBlock
        icon={Sparkles}
        title="Warm Note"
        accentClass="bg-primary/20 text-primary"
        eyebrow="Parting words"
      >
        <p className="rounded-2xl bg-primary/5 p-5 text-center text-base leading-relaxed text-foreground/80">
          {plan.warmNote}
        </p>
      </SectionBlock>
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
