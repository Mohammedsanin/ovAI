import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Sparkles, Droplets, Activity, MoreVertical, Share2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, parseISO, startOfDay } from 'date-fns';
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
  prediction
}: { 
  prediction: PredictedCycleOutput;
}) => {
  const [displayDate, setDisplayDate] = useState<Date | undefined>(new Date());
  
  const nextPeriodDate = parseISO(prediction.predictedNextPeriod);
  const fertileStart = parseISO(prediction.fertileWindowStart);
  const fertileEnd = parseISO(prediction.fertileWindowEnd);
  const ovulationDate = parseISO(prediction.ovulationDay);

  const modifiersStyles = {
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
            modifiers={{
              period: nextPeriodDate,
              fertile: { from: fertileStart, to: fertileEnd },
              ovulation: ovulationDate,
            }}
            modifiersStyles={modifiersStyles}
            className="rounded-md"
            month={displayDate}
            onMonthChange={setDisplayDate}
          />
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
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

interface HistoryGroup {
  periods: Date[];
  prediction: Date | null;
}

interface HistoryStats {
  totalPeriods: number;
  totalPredictions: number;
  lastPeriod: Date | null;
  lastPrediction: Date | null;
  averageCycleLength: number | null;
}

const HistoryPanel = ({
  groups,
  stats,
  onShareGroup,
  onDeleteGroup,
  isLoading
}: {
  groups: HistoryGroup[];
  stats: HistoryStats;
  onShareGroup: (group: HistoryGroup, index: number) => void;
  onDeleteGroup: (group: HistoryGroup, index: number) => void;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Cycle History</CardTitle>
          <CardDescription>Your logged periods and AI predictions</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!groups.length) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Cycle History</CardTitle>
          <CardDescription>Your logged periods and AI predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No history yet. Log at least three period start dates and run a prediction to build your timeline.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Cycle History</CardTitle>
        <CardDescription>Grouped by every three logged periods with the prediction they produced</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {groups.map((group, index) => (
            <div
              key={`${index}-${group.periods[0]?.toISOString() ?? 'empty'}`}
              className="rounded-2xl border border-primary/10 bg-gradient-to-br from-background to-primary/5 p-5 shadow-[0_10px_25px_-15px_rgb(16_24_40/0.45)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-foreground tracking-wide uppercase">Cycle Group #{index + 1}</p>
                </div>
                <div className="flex items-center gap-2">
                  {group.prediction ? (
                    <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Predicted: {format(group.prediction, 'MMM d, yyyy')}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Prediction pending</span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open cycle group menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => onShareGroup(group, index)}>
                        <Share2 className="mr-2 h-4 w-4" /> Share timeline
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeleteGroup(group, index)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Remove group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="space-y-2">
                {group.periods.length ? (
                  group.periods.map((date, idx) => (
                    <div key={date.toISOString()} className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-2 text-sm shadow-inner">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {idx + 1}
                      </span>
                      <span>{format(date, 'MMM d, yyyy')}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No period data in this group.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-foreground/20 bg-foreground/5 p-5 flex flex-col gap-4 shadow-inner">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">Timeline Highlights</p>
            <p className="text-lg font-semibold text-foreground">Your recent cycle snapshots</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Last logged period</p>
              <p className="text-base font-semibold text-foreground">
                {stats.lastPeriod ? format(stats.lastPeriod, 'MMM d, yyyy') : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Most recent prediction</p>
              <p className="text-base font-semibold text-primary flex items-center gap-2">
                {stats.lastPrediction ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {format(stats.lastPrediction, 'MMM d, yyyy')}
                  </>
                ) : (
                  '—'
                )}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-foreground/10 p-3 shadow text-foreground">
                <p className="text-xs text-muted-foreground">Logged Periods</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalPeriods}</p>
              </div>
              <div className="rounded-xl bg-foreground/10 p-3 shadow text-foreground">
                <p className="text-xs text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalPredictions}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Average cycle length</p>
              <p className="text-base font-semibold text-foreground">
                {stats.averageCycleLength ? `${stats.averageCycleLength} days` : 'Not enough data yet'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Periods = () => {
  const [periodDates, setPeriodDates] = useState<Date[]>([]);
  const [prediction, setPrediction] = useState<PredictedCycleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storedPredictionDates, setStoredPredictionDates] = useState<Date[]>([]);
  const [storedPeriodHistory, setStoredPeriodHistory] = useState<Date[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const historyGroups = useMemo<HistoryGroup[]>(() => {
    const groups: HistoryGroup[] = [];
    const predictionCount = storedPredictionDates.length;

    for (let i = 0; i < storedPeriodHistory.length; i += 3) {
      const chunkIndex = Math.floor(i / 3);
      const periods = storedPeriodHistory.slice(i, i + 3);
      const predictionDate = chunkIndex < predictionCount ? storedPredictionDates[chunkIndex] : null;
      groups.push({ periods, prediction: predictionDate ?? null });
    }

    return groups;
  }, [storedPeriodHistory, storedPredictionDates]);

  const historyStats = useMemo<HistoryStats>(() => {
    const totalPeriods = storedPeriodHistory.length;
    const totalPredictions = storedPredictionDates.length;
    const lastPeriod = totalPeriods ? storedPeriodHistory[0] : null;
    const lastPrediction = totalPredictions ? storedPredictionDates[0] : null;

    let averageCycleLength: number | null = null;
    if (storedPeriodHistory.length >= 2) {
      const intervals: number[] = [];
      for (let i = 0; i < storedPeriodHistory.length - 1; i++) {
        const diff = Math.abs(
          startOfDay(storedPeriodHistory[i]).getTime() - startOfDay(storedPeriodHistory[i + 1]).getTime()
        );
        intervals.push(Math.round(diff / (1000 * 60 * 60 * 24)));
      }
      if (intervals.length) {
        const total = intervals.reduce((sum, val) => sum + val, 0);
        averageCycleLength = Math.round(total / intervals.length);
      }
    }

    return {
      totalPeriods,
      totalPredictions,
      lastPeriod,
      lastPrediction,
      averageCycleLength,
    };
  }, [storedPeriodHistory, storedPredictionDates]);

  useEffect(() => {
    const fetchStoredHistory = async () => {
      try {
        setIsHistoryLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsHistoryLoading(false);
          return;
        }

        const { data: predictionData, error: predictionError } = await supabase
          .from('cycle_predictions')
          .select('predicted_date')
          .eq('user_id', user.id)
          .order('predicted_date', { ascending: false });

        if (predictionError) throw predictionError;

        const { data: periodData, error: periodError } = await supabase
          .from('period_history')
          .select('period_start_date')
          .eq('user_id', user.id)
          .order('period_start_date', { ascending: false });

        if (periodError) throw periodError;

        setStoredPredictionDates(
          (predictionData ?? [])
            .map((entry) => parseISO(entry.predicted_date))
            .sort((a, b) => b.getTime() - a.getTime())
        );

        setStoredPeriodHistory(
          (periodData ?? [])
            .map((entry) => parseISO(entry.period_start_date))
            .sort((a, b) => b.getTime() - a.getTime())
        );
      } catch (error) {
        console.error('Failed to load stored predictions:', error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchStoredHistory();
  }, []);

  const persistPredictionDate = async (userId: string, dateString: string) => {
    try {
      const { error } = await supabase
        .from('cycle_predictions')
        .upsert(
          {
            user_id: userId,
            predicted_date: dateString,
          },
          { onConflict: 'user_id,predicted_date' }
        );

      if (error) throw error;

      const dateObj = parseISO(dateString);
      setStoredPredictionDates((prev) => {
        const normalizedNew = startOfDay(dateObj).getTime();
        const exists = prev.some((existing) => startOfDay(existing).getTime() === normalizedNew);
        if (exists) return prev;
        return [...prev, dateObj].sort((a, b) => b.getTime() - a.getTime());
      });
    } catch (error) {
      console.error('Failed to store predicted date:', error);
    }
  };

  const persistPeriodHistory = async (userId: string, dateStrings: string[]) => {
    if (!dateStrings.length) return;
    try {
      const entries = dateStrings.map((dateString) => ({
        user_id: userId,
        period_start_date: dateString,
      }));

      const { error } = await supabase
        .from('period_history')
        .upsert(entries, { onConflict: 'user_id,period_start_date' });

      if (error) throw error;

      setStoredPeriodHistory((prev) => {
        const seen = new Set(prev.map((date) => startOfDay(date).getTime()));
        const updated = [...prev];

        entries.forEach(({ period_start_date }) => {
          const dateObj = parseISO(period_start_date);
          const normalized = startOfDay(dateObj).getTime();
          if (!seen.has(normalized)) {
            updated.push(dateObj);
            seen.add(normalized);
          }
        });

        return updated.sort((a, b) => b.getTime() - a.getTime());
      });
    } catch (error) {
      console.error('Failed to store period history:', error);
    }
  };

  const handlePredictCycle = async () => {
    if (periodDates.length < 3) {
      toast.error("Please select at least 3 period start dates");
      return;
    }

    setIsLoading(true);
    setPrediction(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to predict your cycle");
        return;
      }

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

      await persistPeriodHistory(user.id, dateStrings);
      await persistPredictionDate(user.id, data.predictedNextPeriod);
    } catch (error) {
      console.error("Failed to predict cycle:", error);
      toast.error("Could not generate your cycle prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareGroup = async (group: HistoryGroup, index: number) => {
    const periodLines = group.periods
      .map((date, idx) => `${idx + 1}. ${format(date, 'MMM d, yyyy')}`)
      .join('\n');
    const predictionLine = group.prediction
      ? `Predicted: ${format(group.prediction, 'MMM d, yyyy')}`
      : 'Prediction pending';
    const shareText = `Cycle Group #${index + 1}\n${periodLines}\n${predictionLine}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Cycle Group Timeline', text: shareText });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        toast.success('Timeline copied to clipboard');
      } else {
        throw new Error('Share not supported');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Share failed:', error);
      toast.error('Unable to share this timeline');
    }
  };

  const handleDeleteGroup = async (group: HistoryGroup) => {
    if (!group.periods.length) {
      toast.error('No period entries to remove.');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to manage history.');
        return;
      }

      const periodDates = group.periods.map((date) => format(date, 'yyyy-MM-dd'));

      const { error: periodError } = await supabase
        .from('period_history')
        .delete()
        .eq('user_id', user.id)
        .in('period_start_date', periodDates);

      if (periodError) throw periodError;

      if (group.prediction) {
        const { error: predictionError } = await supabase
          .from('cycle_predictions')
          .delete()
          .eq('user_id', user.id)
          .eq('predicted_date', format(group.prediction, 'yyyy-MM-dd'));

        if (predictionError) throw predictionError;
      }

      setStoredPeriodHistory((prev) => {
        const removeSet = new Set(periodDates);
        return prev.filter((date) => !removeSet.has(format(date, 'yyyy-MM-dd')));
      });

      if (group.prediction) {
        const predictionIso = format(group.prediction, 'yyyy-MM-dd');
        setStoredPredictionDates((prev) => prev.filter((date) => format(date, 'yyyy-MM-dd') !== predictionIso));
      }

      toast.success('Cycle group removed');
    } catch (error) {
      console.error('Failed to remove group:', error);
      toast.error('Could not remove this cycle group.');
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
                        onSelect={(dates) => setPeriodDates(dates ?? [])}
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
                  <PredictionDisplay prediction={prediction} />
                  
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

            <HistoryPanel 
              groups={historyGroups}
              stats={historyStats}
              onShareGroup={handleShareGroup}
              onDeleteGroup={handleDeleteGroup}
              isLoading={isHistoryLoading}
            />
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Periods;
