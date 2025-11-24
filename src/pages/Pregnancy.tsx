import { useState, useEffect } from 'react';
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KickCounter } from "@/components/pregnancy/kick-counter";
import { ContractionTimer } from "@/components/pregnancy/contraction-timer";
import { supabase } from "@/integrations/supabase/client";
import { 
  Baby, 
  BookOpen, 
  CalendarDays, 
  Heart, 
  Sparkles, 
  Ruler, 
  Activity, 
  Timer, 
  Apple,
  Lightbulb,
  Target,
  Bike
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import month1Video from '@/assets/1month.mp4';
import month2Video from '@/assets/2month.mp4';
import month3Video from '@/assets/3 month.mp4';
import month4Video from '@/assets/4month.mp4';
import month5Video from '@/assets/5month.mp4';
import month7Video from '@/assets/7month.mp4';
import month8Video from '@/assets/8month.mp4';
import month9Video from '@/assets/9month.mp4';

const monthlyPregnancyData = [
  { month: 1, week: 4, trimester: 'First Trimester', babySize: 'a poppy seed', weightGain: '0-1', babyLength: 0.1 },
  { month: 2, week: 8, trimester: 'First Trimester', babySize: 'a raspberry', weightGain: '1-2', babyLength: 1.6 },
  { month: 3, week: 12, trimester: 'First Trimester', babySize: 'a lime', weightGain: '1-2', babyLength: 5.4 },
  { month: 4, week: 16, trimester: 'Second Trimester', babySize: 'an avocado', weightGain: '2-3', babyLength: 11.6 },
  { month: 5, week: 20, trimester: 'Second Trimester', babySize: 'a banana', weightGain: '2-3', babyLength: 25.6 },
  { month: 6, week: 24, trimester: 'Second Trimester', babySize: 'an ear of corn', weightGain: '2-3', babyLength: 30 },
  { month: 7, week: 28, trimester: 'Third Trimester', babySize: 'an eggplant', weightGain: '1-2', babyLength: 37.6 },
  { month: 8, week: 32, trimester: 'Third Trimester', babySize: 'a squash', weightGain: '1-2', babyLength: 42.4 },
  { month: 9, week: 36, trimester: 'Third Trimester', babySize: 'a head of romaine lettuce', weightGain: '1-2', babyLength: 47.4 },
];

const babyLookVideos = [
  {
    month: 1,
    title: 'Month 1: Tiny Beginnings',
    description: 'Your baby is just a cluster of dividing cells, beginning to form the neural tube.',
    video: month1Video
  },
  {
    month: 2,
    title: 'Month 2: Major Milestones',
    description: 'Facial features start to take shape and the heartbeat becomes detectable.',
    video: month2Video
  },
  {
    month: 3,
    title: 'Month 3: Growing Stronger',
    description: 'Fingers and toes are separating, and your baby can flex tiny muscles.',
    video: month3Video
  },
  {
    month: 4,
    title: 'Month 4: Expressive Little One',
    description: 'Facial expressions emerge and the nervous system is rapidly developing.',
    video: month4Video
  },
  {
    month: 5,
    title: 'Month 5: Active Explorer',
    description: 'Your baby practices kicking and responds to sounds from the outside world.',
    video: month5Video
  },
  {
    month: 7,
    title: 'Month 7: Sensory Explorer',
    description: 'Hearing is fully developed and baby reacts to light and familiar voices.',
    video: month7Video
  },
  {
    month: 8,
    title: 'Month 8: Growth Sprint',
    description: 'Brain connections multiply quickly as your baby prepares for life outside.',
    video: month8Video
  },
  {
    month: 9,
    title: 'Month 9: Ready for Debut',
    description: 'Baby settles head-down and practices breathing while gaining healthy weight.',
    video: month9Video
  }
];

interface MonthlyGuide {
  title: string;
  babyDevelopment: string[];
  momChanges: string[];
  nutritionTips: string[];
  exerciseTips: string[];
  thingsToDo: string[];
}

const InfoCard = ({ title, value, unit, icon: Icon, iconBg }: { 
  title: string; 
  value: string | number; 
  unit?: string; 
  icon: React.ElementType; 
  iconBg: string;
}) => (
  <Card className="shadow-card hover:shadow-lg transition-shadow">
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">
          {value} <span className="text-sm font-normal text-muted-foreground">{unit}</span>
        </p>
      </div>
      <div className={`p-2 rounded-full ${iconBg}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </CardContent>
  </Card>
);

const DetailListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
      <Target className="w-3 h-3 text-primary" />
    </div>
    <span className="text-muted-foreground text-sm">{children}</span>
  </li>
);

const GuideLoader = () => (
  <div className="space-y-6">
    <Skeleton className="h-6 w-1/2" />
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  </div>
);

const Pregnancy = () => {
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [monthlyGuide, setMonthlyGuide] = useState<MonthlyGuide | null>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(true);
  const { toast } = useToast();

  const currentMonthData = monthlyPregnancyData.find(d => d.month === selectedMonth) || monthlyPregnancyData[0];

  useEffect(() => {
    const fetchGuide = async () => {
      setIsLoadingGuide(true);
      try {
        const { data, error } = await supabase.functions.invoke('pregnancy-guide', {
          body: { month: selectedMonth }
        });

        if (error) throw error;
        setMonthlyGuide(data);
      } catch (error) {
        console.error("Failed to generate monthly guide:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load the guide for this month. Please try again.'
        });
      }
      setIsLoadingGuide(false);
    };
    fetchGuide();
  }, [selectedMonth, toast]);

  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Pregnancy Journey
              </h2>
              <p className="text-muted-foreground">
                Track your baby's growth and your wellness, week by week.
              </p>
            </div>

            {/* Main Banner */}
            <div className="rounded-2xl bg-gradient-wellness text-white p-6 relative overflow-hidden shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="relative z-10">
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold inline-block mb-2">
                  {currentMonthData.trimester}
                </div>
                <h3 className="text-3xl font-bold">Week {currentMonthData.week}</h3>
                <p className="text-white/90">Your baby is about the size of {currentMonthData.babySize}!</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Kick Counter</span>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <KickCounter />
                </CardContent>
              </Card>
              <InfoCard 
                title="Avg. Weight Gain" 
                value={currentMonthData.weightGain} 
                unit="kg/month" 
                icon={Heart} 
                iconBg="bg-secondary" 
              />
              <InfoCard 
                title="Avg. Baby Size" 
                value={currentMonthData.babyLength} 
                unit="cm" 
                icon={Ruler} 
                iconBg="bg-accent" 
              />
              <Card className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>Contraction Timer</span>
                    <Timer className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContractionTimer />
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Monthly Guide */}
              <div className="lg:col-span-2">
                <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Month-by-Month AI Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-6 bg-accent/50 p-1 rounded-lg">
                      {Array.from({ length: 9 }, (_, i) => i + 1).map((month) => (
                        <button
                          key={month}
                          onClick={() => setSelectedMonth(month)}
                          className={`px-3 sm:px-4 py-1.5 text-sm rounded-md font-medium transition-all ${
                            selectedMonth === month
                              ? 'bg-background text-primary shadow-card'
                              : 'text-muted-foreground hover:bg-background/50'
                          }`}
                        >
                          M{month}
                        </button>
                      ))}
                    </div>

                    {isLoadingGuide ? (
                      <GuideLoader />
                    ) : monthlyGuide ? (
                      <div className="space-y-6">
                        <h3 className="font-semibold text-xl text-primary">
                          Month {selectedMonth}: {monthlyGuide.title}
                        </h3>
                        
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Baby's Development
                          </h4>
                          <ul className="space-y-2 pl-2">
                            {monthlyGuide.babyDevelopment.map((item, i) => (
                              <DetailListItem key={i}>{item}</DetailListItem>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Heart className="h-4 w-4 text-secondary" />
                            Your Body & Changes
                          </h4>
                          <ul className="space-y-2 pl-2">
                            {monthlyGuide.momChanges.map((item, i) => (
                              <DetailListItem key={i}>{item}</DetailListItem>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Apple className="h-4 w-4 text-accent" />
                            Nutrition Tips
                          </h4>
                          <ul className="space-y-2 pl-2">
                            {monthlyGuide.nutritionTips.map((item, i) => (
                              <DetailListItem key={i}>{item}</DetailListItem>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Bike className="h-4 w-4 text-primary" />
                            Exercise & Activity
                          </h4>
                          <ul className="space-y-2 pl-2">
                            {monthlyGuide.exerciseTips.map((item, i) => (
                              <DetailListItem key={i}>{item}</DetailListItem>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-secondary" />
                            Things to Do
                          </h4>
                          <ul className="space-y-2 pl-2">
                            {monthlyGuide.thingsToDo.map((item, i) => (
                              <DetailListItem key={i}>{item}</DetailListItem>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column: Tip */}
              <div className="space-y-6">
                <Card className="bg-gradient-calm text-white shadow-card animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-white" />
                      Today's Tip
                    </h4>
                    <p className="text-sm text-white/90">
                      Talk or sing to your baby! They can hear you now and will recognize your voice after birth.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  How Your Baby Looks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Explore quick visual clips to understand how your baby is developing during the early months.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {babyLookVideos.map(({ month, title, description, video }) => (
                    <div key={month} className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-primary tracking-wide uppercase">Month {month}</p>
                        <h4 className="text-lg font-semibold">{title}</h4>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-border bg-muted/20">
                        <video
                          controls
                          className="w-full h-56 object-cover"
                          preload="metadata"
                        >
                          <source src={video} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Pregnancy;
