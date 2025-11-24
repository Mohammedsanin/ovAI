import { useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, Sparkles, Stethoscope } from "lucide-react";
import { CrampsBodyMap } from "@/components/Healthcare/CrampsBodyMap";
import { CrampsReliefPlan } from "@/components/Healthcare/CrampsReliefPlan";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface Routine {
  type: "Stretch" | "Exercise" | "Tip";
  title: string;
  description: string;
  videoSuggestion?: string;
  videoId?: string | null;
}

const Healthcare = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [reliefPlan, setReliefPlan] = useState<Routine[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [symptomAnalysis, setSymptomAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAreaSelect = async (area: string) => {
    setSelectedArea(area);
    setIsLoading(true);
    setReliefPlan(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-cramps-relief", {
        body: { painArea: area },
      });

      if (error) throw error;

      setReliefPlan(data.routines);
      toast({
        title: "Relief plan generated!",
        description: `Here are some targeted routines for ${area.toLowerCase()} pain.`,
      });
    } catch (error) {
      console.error("Error generating relief plan:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate relief plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomAnalysis = async () => {
    if (!symptoms.trim() || symptoms.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please describe your symptoms in more detail (at least 10 characters).",
      });
      return;
    }

    setIsAnalyzing(true);
    setSymptomAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptoms", {
        body: { symptoms },
      });

      if (error) throw error;

      setSymptomAnalysis(data);
      toast({
        title: "Analysis complete!",
        description: "Your symptom analysis is ready.",
      });
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to analyze symptoms. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                  Cramps Relief Center
                </h2>
              </div>
              <p className="text-muted-foreground">
                Get personalized relief routines for menstrual cramps based on where you feel pain
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-6">
                <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <CrampsBodyMap 
                    onAreaSelect={handleAreaSelect}
                    isLoading={isLoading}
                  />
                </div>

                <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      AI Symptom Analysis
                    </CardTitle>
                    <CardDescription>
                      Describe your symptoms to get AI-powered insights. <span className="font-semibold">This is not medical advice.</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Symptoms or Health Data</label>
                      <Textarea
                        placeholder="e.g., 'I'm experiencing severe cramps and bloating during my period' or 'I have breast tenderness and mood swings'"
                        className="min-h-[120px]"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        disabled={isAnalyzing}
                      />
                    </div>
                    <Button 
                      onClick={handleSymptomAnalysis} 
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
                    </Button>

                    {isAnalyzing && (
                      <div className="space-y-2 pt-4 border-t">
                        <h4 className="font-semibold text-foreground">AI Analysis:</h4>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    )}

                    {symptomAnalysis && !isAnalyzing && (
                      <div className="pt-4 border-t space-y-4">
                        <h4 className="font-semibold text-foreground">AI Analysis:</h4>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="font-medium text-sm text-primary mb-1">Analysis</h5>
                            <p className="text-sm text-muted-foreground">{symptomAnalysis.analysis}</p>
                          </div>
                          
                          {symptomAnalysis.possibleCauses && symptomAnalysis.possibleCauses.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm text-primary mb-1">Possible Causes</h5>
                              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                {symptomAnalysis.possibleCauses.map((cause: string, index: number) => (
                                  <li key={index}>{cause}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {symptomAnalysis.recommendations && symptomAnalysis.recommendations.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm text-primary mb-1">Recommendations</h5>
                              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                {symptomAnalysis.recommendations.map((rec: string, index: number) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {symptomAnalysis.whenToSeeDoctor && symptomAnalysis.whenToSeeDoctor.length > 0 && (
                            <div>
                              <h5 className="font-medium text-sm text-red-600 mb-1">When to See Doctor</h5>
                              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                {symptomAnalysis.whenToSeeDoctor.map((item: string, index: number) => (
                                  <li key={index} className="text-red-600">{item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {isLoading && (
                  <Card className="shadow-card animate-fade-in">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-wellness flex items-center justify-center animate-pulse">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold">Generating your relief plan...</p>
                          <p className="text-sm text-muted-foreground">
                            Creating personalized routines for {selectedArea}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!isLoading && !reliefPlan && (
                  <Card className="shadow-card animate-fade-in">
                    <CardContent className="p-8 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-calm flex items-center justify-center">
                          <Heart className="w-8 h-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-lg font-semibold">Select a pain area</p>
                          <p className="text-sm text-muted-foreground">
                            Tap on the body map to get targeted relief routines
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {reliefPlan && !isLoading && (
                  <div className="animate-fade-in">
                    <CrampsReliefPlan 
                      routines={reliefPlan}
                      painArea={selectedArea!}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Card className="shadow-card bg-gradient-wellness text-white">
                <CardHeader>
                  <CardTitle className="text-white">Tips for Managing Cramps</CardTitle>
                  <CardDescription className="text-white/90">
                    General advice to help you feel better during your period
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg">💧</span>
                    </div>
                    <div>
                      <p className="font-medium">Stay Hydrated</p>
                      <p className="text-sm text-white/90">Drink plenty of water to reduce bloating and discomfort</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg">🔥</span>
                    </div>
                    <div>
                      <p className="font-medium">Heat Therapy</p>
                      <p className="text-sm text-white/90">Apply a heating pad to your lower abdomen or back for relief</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg">🧘‍♀️</span>
                    </div>
                    <div>
                      <p className="font-medium">Gentle Movement</p>
                      <p className="text-sm text-white/90">Light exercise and stretching can help reduce cramping</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg">🍵</span>
                    </div>
                    <div>
                      <p className="font-medium">Herbal Tea</p>
                      <p className="text-sm text-white/90">Try chamomile or ginger tea to soothe cramps naturally</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Healthcare;
