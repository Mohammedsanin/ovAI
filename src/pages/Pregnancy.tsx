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

const monthVideoMap: Record<number, string> = {
  1: month1Video,
  2: month2Video,
  3: month3Video,
  4: month4Video,
  5: month5Video,
  7: month7Video,
  8: month8Video,
  9: month9Video
};
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
interface WeeklyDevelopment {
  month: number;
  weekNumber: number;
  title: string;
  babySize: string;
  summary: string;
  momFocus: string;
  tip: string;
  videoQuery: string;
  localVideo?: string;
}

const pregnancyWeeks: WeeklyDevelopment[] = [
  {
    month: 1,
    weekNumber: 1,
    title: 'Foundations & Implantation Prep',
    babySize: 'a poppy seed',
    summary: 'Ovulation and fertilization occur while the baby-to-be travels toward the uterus and rapidly divides.',
    momFocus: 'Prioritize prenatal vitamins with folate and keep caffeine intake within doctor-approved limits.',
    tip: 'Log the first day of your last period to help your provider calculate an accurate due date.',
    videoQuery: 'pregnancy week 1 baby development animation',
    localVideo: month1Video
  },
  {
    month: 1,
    weekNumber: 2,
    title: 'Implantation in Progress',
    babySize: 'a sesame seed',
    summary: 'The blastocyst burrows into the uterine lining and the placenta begins to form.',
    momFocus: 'Gentle movement and anti-inflammatory foods can ease implantation cramping.',
    tip: 'Schedule your first prenatal appointment as soon as you confirm a positive test.',
    videoQuery: 'pregnancy week 2 implantation baby looks',
    localVideo: month1Video
  },
  {
    month: 1,
    weekNumber: 3,
    title: 'Neural Tube Blueprint',
    babySize: 'a lentil',
    summary: 'Cells organize into layers that will become the brain, spinal cord, and major organs.',
    momFocus: 'Continue folate and add choline-rich foods to protect neural tube development.',
    tip: 'Set reminders for daily supplements if morning sickness makes routines tricky.',
    videoQuery: 'pregnancy week 3 neural tube development ultrasound',
    localVideo: month1Video
  },
  {
    month: 1,
    weekNumber: 4,
    title: 'Heartbeat Spark',
    babySize: 'a peppercorn',
    summary: 'The heart tube starts to pulse, and limb buds appear as tiny nubs.',
    momFocus: 'Balance protein and complex carbohydrates to stabilize blood sugar swings.',
    tip: 'Plan small, frequent snacks to curb nausea without overwhelming your stomach.',
    videoQuery: 'pregnancy week 4 heartbeat baby development',
    localVideo: month1Video
  },
  {
    month: 2,
    weekNumber: 5,
    title: 'Cardiac Crescendo',
    babySize: 'an apple seed',
    summary: 'A four-chambered heart beats at double your rate while the spinal cord seals.',
    momFocus: 'Schedule early prenatal labs and review any prescription medications with your provider.',
    tip: 'Practice deep breathing when fatigue hits—oxygen helps both you and baby.',
    videoQuery: 'pregnancy week 5 heartbeat ultrasound baby size'
  },
  {
    month: 2,
    weekNumber: 6,
    title: 'Facial Features Emerge',
    babySize: 'a sweet pea',
    summary: 'Eyes, jaw, and ear ridges are visible, and the brain grows at lightning speed.',
    momFocus: 'Stay hydrated and aim for extra sleep as hormones soar.',
    tip: 'Keep ginger tea or lemon water nearby to soothe waves of morning sickness.',
    videoQuery: 'pregnancy week 6 embryo face development'
  },
  {
    month: 2,
    weekNumber: 7,
    title: 'Limbs Lengthen',
    babySize: 'a blueberry',
    summary: 'Arm and leg buds stretch out and tiny paddles hint at future fingers and toes.',
    momFocus: 'Add gentle strength moves to keep posture muscles engaged as ligaments loosen.',
    tip: 'Use pelvic tilts or prenatal yoga videos to release growing back tension.',
    videoQuery: 'pregnancy week 7 baby limbs development 3d'
  },
  {
    month: 2,
    weekNumber: 8,
    title: 'Organ Formation Finale',
    babySize: 'a raspberry',
    summary: 'Major organs finish forming, the tail disappears, and baby graduates from embryo to fetus.',
    momFocus: 'Eat iron + vitamin C combos to support expanding blood volume.',
    tip: 'Batch-cook protein-rich meals for days when nausea zaps your energy.',
    videoQuery: 'pregnancy week 8 fetus development video'
  },
  {
    month: 3,
    weekNumber: 9,
    title: 'Tiny Facial Expressions',
    babySize: 'a grape',
    summary: 'Eyelids fuse shut for protection while the upper lip and nose are defined.',
    momFocus: 'Keep prenatal appointments to monitor genetic screening timelines.',
    tip: 'Jot questions in your phone notes so nothing slips past your next visit.',
    videoQuery: 'pregnancy week 9 baby looks ultrasound'
  },
  {
    month: 3,
    weekNumber: 10,
    title: 'Bones Begin to Harden',
    babySize: 'a kumquat',
    summary: 'Cartilage converts to bone, knees and ankles appear, and kidneys produce tiny amounts of urine.',
    momFocus: 'Calcium and vitamin D-rich snacks strengthen your skeleton as baby borrows minerals.',
    tip: 'Pair dairy or fortified alternatives with leafy greens for efficient absorption.',
    videoQuery: 'pregnancy week 10 fetus bones video'
  },
  {
    month: 3,
    weekNumber: 11,
    title: 'Reflex Practice',
    babySize: 'a fig',
    summary: 'Baby can stretch, hiccup, and even grasp as nerve pathways connect.',
    momFocus: 'Light walks boost circulation and ease digestion as the uterus grows.',
    tip: 'Wear supportive sneakers and track steps for motivation without pressure.',
    videoQuery: 'pregnancy week 11 fetal reflexes video'
  },
  {
    month: 3,
    weekNumber: 12,
    title: 'Digestive Dry Runs',
    babySize: 'a plum',
    summary: 'Intestines move into the abdomen, vocal cords form, and fingernails sprout.',
    momFocus: 'Protein, fiber, and plenty of water help manage energy dips in late first trimester.',
    tip: 'Blend smoothies with spinach, berries, and Greek yogurt for a quick nutrient boost.',
    videoQuery: 'pregnancy week 12 baby development 3d'
  },
  {
    month: 4,
    weekNumber: 13,
    title: 'Second Trimester Spark',
    babySize: 'a peach',
    summary: 'Baby can yawn and swallow amniotic fluid as vocal cords refine.',
    momFocus: 'Use renewed energy to plan prenatal classes or movement routines.',
    tip: 'Invest in a supportive belly band before round ligament aches kick in.',
    videoQuery: 'pregnancy week 13 fetus video'
  },
  {
    month: 4,
    weekNumber: 14,
    title: 'Lanugo Layering',
    babySize: 'a lemon',
    summary: 'Fine hair called lanugo covers the skin, and the thyroid starts to work.',
    momFocus: 'Add iodine-rich foods like eggs and dairy to power hormone production.',
    tip: 'Keep a reusable water bottle handy; hydration eases headaches and swelling.',
    videoQuery: 'pregnancy week 14 lanugo development video'
  },
  {
    month: 4,
    weekNumber: 15,
    title: 'Taste Bud Debut',
    babySize: 'an apple',
    summary: 'Taste buds form and baby swallows more fluid, practicing digestion.',
    momFocus: 'Colorful produce flavors the amniotic fluid and delivers antioxidants.',
    tip: 'Experiment with citrus or mint if plain water no longer appeals.',
    videoQuery: 'pregnancy week 15 baby taste buds video'
  },
  {
    month: 4,
    weekNumber: 16,
    title: 'Movement You May Feel',
    babySize: 'an avocado',
    summary: 'Joints work smoothly and facial muscles practice little frowns and smiles.',
    momFocus: 'Tune into early flutters, especially when resting after meals.',
    tip: 'Try side-lying meditation to bond with baby kicks and practice mindful breathing.',
    videoQuery: 'pregnancy week 16 baby movement video'
  },
  {
    month: 5,
    weekNumber: 17,
    title: 'Fat Stores Build',
    babySize: 'a turnip',
    summary: 'Brown fat accumulates to regulate body temperature after birth.',
    momFocus: 'Healthy fats from avocado, nuts, and seeds keep you satiated and support growth.',
    tip: 'Keep crunchy trail mix in your bag for quick energy between meals.',
    videoQuery: 'pregnancy week 17 fetal fat development'
  },
  {
    month: 5,
    weekNumber: 18,
    title: 'Ears in Position',
    babySize: 'a bell pepper',
    summary: 'Ears align with the eyes and myelin begins coating nerves for faster signals.',
    momFocus: 'Play favorite playlists or read aloud—baby is tuning in.',
    tip: 'Use a pregnancy pillow to support side sleeping as anatomy scan approaches.',
    videoQuery: 'pregnancy week 18 baby ears ultrasound'
  },
  {
    month: 5,
    weekNumber: 19,
    title: 'Vernix Protection',
    babySize: 'an heirloom tomato',
    summary: 'Creamy vernix caseosa shields delicate skin from constant amniotic exposure.',
    momFocus: 'Omega-3s nurture skin and brain development alike.',
    tip: 'Add chia pudding or flaxseed oatmeal to breakfast for a fiber + omega combo.',
    videoQuery: 'pregnancy week 19 vernix development video'
  },
  {
    month: 5,
    weekNumber: 20,
    title: 'Halfway Highlights',
    babySize: 'a banana',
    summary: 'Baby measures about 25 cm from head to heel and you may feel patterns in kicks.',
    momFocus: 'Complete the anatomy scan to check organs, spine, and placenta placement.',
    tip: 'Celebrate the halfway mark with a mindful walk or quick journal of milestones.',
    videoQuery: 'pregnancy week 20 anatomy scan baby looks'
  },
  {
    month: 6,
    weekNumber: 21,
    title: 'Eyebrows & Lashes',
    babySize: 'a carrot',
    summary: 'Facial hair follicles appear and baby practices thumb-sucking for comfort.',
    momFocus: 'Boost iron to prevent anemia as blood volume continues to climb.',
    tip: 'Pair plant iron with vitamin C (think beans + bell peppers) for better absorption.',
    videoQuery: 'pregnancy week 21 baby eyebrows video'
  },
  {
    month: 6,
    weekNumber: 22,
    title: 'Lung Alveoli Budding',
    babySize: 'a spaghetti squash',
    summary: 'Tiny air sacs bud inside the lungs while the senses sharpen.',
    momFocus: 'Practice diaphragmatic breathing to expand lung capacity and calm nerves.',
    tip: 'Set a daily two-minute breathing break to reconnect with your body.',
    videoQuery: 'pregnancy week 22 lung development fetus'
  },
  {
    month: 6,
    weekNumber: 23,
    title: 'Sense of Balance',
    babySize: 'a mango',
    summary: 'The inner ear fully forms, helping baby understand which way is up.',
    momFocus: 'Mindful posture work keeps back pain in check as the bump grows forward.',
    tip: 'Stack shoulders over hips when standing and add light stretching each evening.',
    videoQuery: 'pregnancy week 23 fetus inner ear video'
  },
  {
    month: 6,
    weekNumber: 24,
    title: 'Surfactant Production',
    babySize: 'an ear of corn',
    summary: 'The lungs create surfactant to keep future air sacs from sticking together.',
    momFocus: 'Know the signs of preterm labor and keep emergency contacts handy.',
    tip: 'Plug your provider, partner, and hospital numbers into your phone favorites.',
    videoQuery: 'pregnancy week 24 lung surfactant baby video'
  },
  {
    month: 7,
    weekNumber: 25,
    title: 'Spinal Strength',
    babySize: 'a rutabaga',
    summary: 'Vertebrae harden and baby’s grip gets stronger during practice squeezes.',
    momFocus: 'Support your core with pelvic floor exercises cleared by your provider.',
    tip: 'Use a smart-watch reminder for quick Kegel sets throughout the day.',
    videoQuery: 'pregnancy week 25 fetus spine development'
  },
  {
    month: 7,
    weekNumber: 26,
    title: 'Eyes Open to Light',
    babySize: 'a bundle of scallions',
    summary: 'Baby opens eyes for the first time and responds to flashes of light.',
    momFocus: 'Balance screen time with eye breaks to protect your own vision.',
    tip: 'Practice the 20-20-20 rule: look 20 feet away for 20 seconds every 20 minutes.',
    videoQuery: 'pregnancy week 26 baby eyes open video'
  },
  {
    month: 7,
    weekNumber: 27,
    title: 'Brain Growth Burst',
    babySize: 'a cauliflower',
    summary: 'Brain tissue folds into grooves, improving learning and memory potential.',
    momFocus: 'Aim for omega-3s and quality sleep to support your own brain health.',
    tip: 'Create an evening wind-down routine with dim lights and gentle stretches.',
    videoQuery: 'pregnancy week 27 brain development fetus'
  },
  {
    month: 7,
    weekNumber: 28,
    title: 'Dream Cycle Begins',
    babySize: 'a kabocha squash',
    summary: 'REM sleep appears, meaning baby likely experiences first dreams.',
    momFocus: 'Discuss third-trimester labs and glucose screening with your provider.',
    tip: 'Keep a balanced snack (carb + protein) in your bag before the glucose test.',
    videoQuery: 'pregnancy week 28 fetus rem sleep video'
  },
  {
    month: 8,
    weekNumber: 29,
    title: 'Muscle Tone Refinement',
    babySize: 'a butternut squash',
    summary: 'Muscles mature, leading to stronger stretches and more defined kicks.',
    momFocus: 'Track kick counts at the same time daily for consistency.',
    tip: 'Pick a comfy chair, sip cold water, and note 10 movements within an hour.',
    videoQuery: 'pregnancy week 29 baby kicks video'
  },
  {
    month: 8,
    weekNumber: 30,
    title: 'Immune Boost Borrowed',
    babySize: 'a cabbage',
    summary: 'Antibodies transfer through the placenta to prep your baby for birth.',
    momFocus: 'Discuss recommended vaccines and boosters with your care team.',
    tip: 'Add probiotic-rich foods like yogurt or kefir if they agree with your stomach.',
    videoQuery: 'pregnancy week 30 baby immune system development'
  },
  {
    month: 8,
    weekNumber: 31,
    title: 'Temperature Training',
    babySize: 'a coconut',
    summary: 'The nervous system fine-tunes temperature regulation and sleep cycles.',
    momFocus: 'Practice left-side sleeping to optimize blood flow to the placenta.',
    tip: 'Use pillows between knees and under your bump for custom comfort.',
    videoQuery: 'pregnancy week 31 fetal development video'
  },
  {
    month: 8,
    weekNumber: 32,
    title: 'Head-Down Rehearsal',
    babySize: 'a jicama',
    summary: 'Most babies turn head-down while lungs practice rhythmic breathing motions.',
    momFocus: 'Review hospital bag checklists and birthing class materials.',
    tip: 'Start packing a go-bag with travel-sized essentials and favorite snacks.',
    videoQuery: 'pregnancy week 32 baby head down video'
  },
  {
    month: 9,
    weekNumber: 33,
    title: 'Bones Firm, Skull Soft',
    babySize: 'a pineapple',
    summary: 'Long bones strengthen while skull plates remain flexible for birth.',
    momFocus: 'Keep calcium intake steady and practice squats for pelvic mobility.',
    tip: 'Alternate cat-cow stretches with hip circles to loosen the lower back.',
    videoQuery: 'pregnancy week 33 fetal position video'
  },
  {
    month: 9,
    weekNumber: 34,
    title: 'Finishing Lungs',
    babySize: 'a cantaloupe',
    summary: 'Lungs mature and the nervous system coordinates rhythmic breathing.',
    momFocus: 'Review birth preferences with your provider and finalize your support team.',
    tip: 'Print or share your birth plan digitally so everyone stays aligned.',
    videoQuery: 'pregnancy week 34 baby lungs video'
  },
  {
    month: 9,
    weekNumber: 35,
    title: 'Plump & Practice',
    babySize: 'a honeydew melon',
    summary: 'Rapid weight gain rounds out baby cheeks and smooths skin.',
    momFocus: 'Elevate feet when possible to reduce swelling and improve circulation.',
    tip: 'Pack compression socks for long days on your feet or travel to appointments.',
    videoQuery: 'pregnancy week 35 baby weight gain video'
  },
  {
    month: 9,
    weekNumber: 36,
    title: 'Ready-to-Meet Positioning',
    babySize: 'a head of romaine lettuce',
    summary: 'Baby settles lower into the pelvis and keeps practicing sucking and breathing.',
    momFocus: 'Know labor signs, keep your phone charged, and review hospital routes.',
    tip: 'Create a one-page contact sheet for caregivers, pet sitters, and family helpers.',
    videoQuery: 'pregnancy week 36 baby engaged video'
  }
];

const getWeeksForMonth = (month: number) => pregnancyWeeks.filter((week) => week.month === month);

const getYouTubeEmbedUrlFromId = (videoId: string) =>
  `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;

const fetchYouTubeVideoId = async (query: string, apiKey: string) => {
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: '1',
    q: query,
    key: apiKey,
    videoEmbeddable: 'true',
    safeSearch: 'moderate'
  });

  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch YouTube data');
  }

  const data = await response.json();
  return data.items?.[0]?.id?.videoId ?? null;
};

const babyLookVideos = [
  {
    month: 1,
    title: 'Month 1 · Tiny Beginnings',
    description: 'Cells divide rapidly and the foundation for every organ begins.',
    video: month1Video
  },
  {
    month: 2,
    title: 'Month 2 · Major Milestones',
    description: 'A heartbeat flickers on early ultrasounds and limbs take shape.',
    video: month2Video
  },
  {
    month: 3,
    title: 'Month 3 · Growing Stronger',
    description: 'Fingers and toes are visible as baby graduates to fetus status.',
    video: month3Video
  },
  {
    month: 4,
    title: 'Month 4 · Second Trimester Glow',
    description: 'Facial features are expressive and baby may start kicking.',
    video: month4Video
  },
  {
    month: 5,
    title: 'Month 5 · Sensory Explorer',
    description: 'Hearing sharpens and baby practices swallowing amniotic fluid.',
    video: month5Video
  },
  {
    month: 7,
    title: 'Month 7 · Preparing for the Outside World',
    description: 'Brain connections multiply and baby responds to light.',
    video: month7Video
  },
  {
    month: 8,
    title: 'Month 8 · Growth Sprint',
    description: 'Baby gains healthy fat and rehearses breathing motions.',
    video: month8Video
  },
  {
    month: 9,
    title: 'Month 9 · Ready for Debut',
    description: 'Baby settles low in the pelvis while organs finish maturing.',
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
  const [weekVideoIds, setWeekVideoIds] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;

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

  useEffect(() => {
    if (!youtubeApiKey) return;

    const weeksToFetch = getWeeksForMonth(selectedMonth).filter((week) => {
      const key = `${week.month}-${week.weekNumber}`;
      return !weekVideoIds[key];
    });

    if (weeksToFetch.length === 0) return;

    let isCancelled = false;

    const fetchVideos = async () => {
      try {
        const entries = await Promise.all(
          weeksToFetch.map(async (week) => ({
            key: `${week.month}-${week.weekNumber}`,
            videoId: await fetchYouTubeVideoId(week.videoQuery, youtubeApiKey)
          }))
        );

        if (isCancelled) return;

        setWeekVideoIds((prev) => {
          const next = { ...prev };
          entries.forEach(({ key, videoId }) => {
            if (videoId) {
              next[key] = videoId;
            }
          });
          return next;
        });
      } catch (error) {
        if (isCancelled) return;
        console.error('Failed to load YouTube videos', error);
        toast({
          variant: 'destructive',
          title: 'Video unavailable',
          description: 'Could not load the latest baby development video. Showing fallback clips instead.'
        });
      }
    };

    fetchVideos();

    return () => {
      isCancelled = true;
    };
  }, [selectedMonth, youtubeApiKey, weekVideoIds, toast]);

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
                <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.45s" }}>
                  <CardHeader>
                    <CardTitle>Weekly Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {getWeeksForMonth(selectedMonth).map((week) => {
                      const videoKey = `${week.month}-${week.weekNumber}`;
                      const youTubeId = weekVideoIds[videoKey];
                      const fallbackVideo = week.localVideo ?? monthVideoMap[week.month];

                      return (
                        <div key={week.weekNumber} className="border border-border rounded-xl p-4 space-y-4">
                          <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                              Month {week.month} · Week {week.weekNumber}
                            </p>
                            <h4 className="text-lg font-semibold">{week.title}</h4>
                            <p className="text-sm text-muted-foreground">Baby is about the size of {week.babySize}.</p>
                            <p className="text-sm text-muted-foreground mt-2">{week.summary}</p>
                          </div>
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="bg-muted/30 rounded-lg p-3 text-sm">
                              <p className="font-medium text-foreground">Mom Focus</p>
                              <p className="text-muted-foreground">{week.momFocus}</p>
                            </div>
                            <div className="bg-muted/30 rounded-lg p-3 text-sm">
                              <p className="font-medium text-foreground">Tip of the Week</p>
                              <p className="text-muted-foreground">{week.tip}</p>
                            </div>
                          </div>
                          {youTubeId ? (
                            <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
                              <iframe
                                className="w-full h-full"
                                src={getYouTubeEmbedUrlFromId(youTubeId)}
                                title={`Week ${week.weekNumber} baby development video`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                              />
                            </div>
                          ) : fallbackVideo ? (
                            <div className="w-full rounded-lg overflow-hidden border border-border bg-muted/20">
                              <video
                                controls
                                className="w-full h-56 object-cover"
                                preload="metadata"
                              >
                                <source src={fallbackVideo} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <div className="w-full rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                              Video unavailable right now. Please try again later.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="shadow-card animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  Pregnancy Video Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-6">
                  Browse curated clips for each month to visualize how your baby looks right now.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {[1,2,3,4,5,7,8,9].map((month) => {
                    const asset = babyLookVideos.find((video) => video.month === month);
                    if (!asset) return null;
                    return (
                      <div key={`library-${month}`} className="space-y-3">
                        <div>
                          <h4 className="text-lg font-semibold">{asset.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{asset.description}</p>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-border bg-muted/20">
                          <video
                            controls
                            className="w-full h-56 object-cover"
                            preload="metadata"
                          >
                            <source src={asset.video} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    );
                  })}
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
