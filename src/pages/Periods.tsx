import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Sparkles, Droplets, Activity } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, parseISO } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface PredictedCycleOutput {
  predictedNextPeriod: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDay: string;
  cycleLength: number;
  insights: string;
  currentPhase: string;
}

const PredictionDisplay = ({ 
  prediction, 
  pastDates 
}: { 
  prediction: PredictedCycleOutput; 
  pastDates: Date[];
}) => {
  const [displayDate, setDisplayDate] = useState<Date | undefined>(new Date());
  
  const nextPeriodDate = parseISO(prediction.predictedNextPeriod);
  const fertileStart = parseISO(prediction.fertileWindowStart);
  const fertileEnd = parseISO(prediction.fertileWindowEnd);
  const ovulationDate = parseISO(prediction.ovulationDay);

  const modifiers = {
    selected: pastDates,
    period: nextPeriodDate,
    fertile: { from: fertileStart, to: fertileEnd },
    ovulation: ovulationDate,
  };

  const modifiersStyles = {
    selected: {
      backgroundColor: 'hsl(var(--secondary))',
      color: 'hsl(var(--secondary-foreground))',
      borderRadius: '0.25rem',
    },
    period: {
      backgroundColor: 'hsl(var(--primary) / 0.8)',
      borderRadius: '0.25rem',
      color: 'hsl(var(--primary-foreground))',
      fontWeight: 'bold',
    },
    fertile: {
      backgroundColor: 'hsl(140 70% 50% / 0.2)',
      borderRadius: '0.25rem',
      color: 'hsl(140 70% 40%)'
    },
    ovulation: {
      backgroundColor: 'hsl(140 70% 50%)',
      color: 'hsl(var(--primary-foreground))',
      borderRadius: '9999px',
      fontWeight: 'bold',
    },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 shadow-card">
        <CardHeader>
          <CardTitle>Your Predicted Cycle</CardTitle>
          <CardDescription>AI-powered predictions based on your cycle history</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={displayDate}
            onSelect={setDisplayDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md"
            month={displayDate}
            onMonthChange={setDisplayDate}
          />
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded" style={{backgroundColor: 'hsl(var(--secondary))'}} />
              <span>Past Periods</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded" style={{backgroundColor: 'hsl(var(--primary) / 0.8)'}} />
              <span>Predicted Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded" style={{backgroundColor: 'hsl(140 70% 50% / 0.5)'}} />
              <span>Fertile Window</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{backgroundColor: 'hsl(140 70% 50%)'}} />
              <span>Predicted Ovulation</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-foreground">Summary</p>
              <p className="text-muted-foreground">{prediction.insights}</p>
              <Badge variant="secondary" className="mt-2">Avg. Cycle: {prediction.cycleLength} days</Badge>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Key Dates</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="h-4 w-4 text-primary" />
                <span>Next Period: {format(nextPeriodDate, 'MMM do')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span>Fertile Window: {format(fertileStart, 'MMM do')} - {format(fertileEnd, 'MMM do')}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4 text-green-500" />
                <span>Ovulation: {format(ovulationDate, 'MMM do')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-green-500" />
              Current Phase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>You're currently in your <span className="font-semibold">{prediction.currentPhase} Phase</span>.</p>
            <p className="text-muted-foreground">
              {prediction.currentPhase === "Menstrual" && "Focus on rest and self-care during this time."}
              {prediction.currentPhase === "Follicular" && "Great time for new beginnings and high-energy activities."}
              {prediction.currentPhase === "Ovulatory" && "Peak energy and fertility window. Perfect for social activities."}
              {prediction.currentPhase === "Luteal" && "Consider restorative activities and nutrient-dense foods."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Periods = () => {
  const [periodDates, setPeriodDates] = useState<Date[]>([]);
  const [prediction, setPrediction] = useState<PredictedCycleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictCycle = async () => {
    if (periodDates.length < 3) {
      toast.error("Please select at least 3 period start dates");
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      // Sort dates and take the 3 most recent ones
      const sortedDates = [...periodDates].sort((a, b) => b.getTime() - a.getTime());
      const latestThreeDates = sortedDates.slice(0, 3);
      const dateStrings = latestThreeDates.reverse().map(d => format(d, 'yyyy-MM-dd'));

      const { data, error } = await supabase.functions.invoke('predict-cycle', {
        body: { lastPeriodStarts: dateStrings }
      });

      if (error) throw error;

      setPrediction(data);
      toast.success("Cycle prediction generated successfully!");
    } catch (error) {
      console.error("Failed to predict cycle:", error);
      toast.error("Could not generate your cycle prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isReadyToPredict = periodDates.length >= 3;

  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-foreground">Intelligent Cycle Tracking</h1>
              <p className="text-muted-foreground">
                Predict your cycle, understand your patterns, and get personalized AI insights
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!prediction && (
                <motion.div
                  key="input-step"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-card">
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Enter Your Last 3 Period Start Dates
                      </CardTitle>
                      <CardDescription>
                        Select at least three dates from the calendar below. Our AI will use the most recent three to learn your unique rhythm.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-6">
                      <Calendar
                        mode="multiple"
                        selected={periodDates}
                        onSelect={setPeriodDates}
                        className="rounded-md border"
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      />
                      {periodDates.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {periodDates.length} date{periodDates.length !== 1 ? 's' : ''} selected
                          {periodDates.length < 3 && ` - Need ${3 - periodDates.length} more`}
                        </div>
                      )}
                      <Button 
                        onClick={handlePredictCycle} 
                        disabled={isLoading || !isReadyToPredict}
                        size="lg"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isLoading ? "Analyzing Your Cycle..." : "Predict My Cycle"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {isLoading && !prediction && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="shadow-card text-center p-8">
                    <div className="flex justify-center items-center gap-2 text-lg font-semibold text-primary mb-4">
                      <Sparkles className="animate-spin h-5 w-5" />
                      <p>Our AI is analyzing your cycle data...</p>
                    </div>
                    <p className="text-muted-foreground mb-4">This may take a moment.</p>
                    <Skeleton className="h-64 w-full" />
                  </Card>
                </motion.div>
              )}

              {prediction && (
                <motion.div
                  key="prediction"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <PredictionDisplay prediction={prediction} pastDates={periodDates} />
                  
                  <div className="flex justify-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => { 
                        setPrediction(null); 
                        setPeriodDates([]);
                      }}
                    >
                      Enter New Dates
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Periods;
