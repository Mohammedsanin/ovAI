import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { QuickStats } from "@/components/Dashboard/QuickStats";
import { CycleCalendar } from "@/components/Dashboard/CycleCalendar";
import { QuickActions } from "@/components/Dashboard/QuickActions";
import { AIInsights } from "@/components/Dashboard/AIInsights";
import { EmergencySupport } from "../components/Dashboard/EmergencySupport";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Brain,
  Heart,
  Activity,
  Shield,
  Sparkles,
  Calendar,
  UtensilsCrossed,
  Dumbbell,
  Baby,
  MessageCircle,
  Users,
  Stethoscope,
  ShieldAlert
} from "lucide-react";

const navigationItems = [
  {
    title: "Cycle Intelligence",
    description: "Smart predictions & calendar",
    status: "Ovulation forecast ready",
    icon: Calendar,
    to: "/cycle"
  },
  {
    title: "Nutrition Studio",
    description: "AI-tailored meal plans",
    status: "New meals queued",
    icon: UtensilsCrossed,
    to: "/nutrition"
  },
  {
    title: "Fitness Flow",
    description: "Hormone-aware workouts",
    status: "HIIT block unlocked",
    icon: Dumbbell,
    to: "/fitness"
  },
  {
    title: "Pregnancy Journey",
    description: "Week-by-week companion",
    status: "Month 4 insights updated",
    icon: Baby,
    to: "/pregnancy"
  },
  {
    title: "Healthcare Hub",
    description: "Telehealth & symptom AI",
    status: "Vitals look stable",
    icon: Stethoscope,
    to: "/healthcare"
  },
  {
    title: "Emergency Support",
    description: "Urgent care & hospitals",
    status: "Always available",
    icon: ShieldAlert,
    to: "/emergency"
  },
  {
    title: "Community",
    description: "Challenges & groups",
    status: "3 unread mentions",
    icon: Users,
    to: "/community"
  },
  {
    title: "AI Assistant",
    description: "24/7 OvAI chat",
    status: "Session active",
    icon: MessageCircle,
    to: "/chatbot"
  },
  {
    title: "Mental Wellness",
    description: "Mindful guidance & support",
    status: "Mood journal synced",
    icon: Brain,
    to: "/mental-health"
  }
];

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'emergency') {
      setActiveFeature('emergency');
    }
  }, [searchParams]);

  const handleEmergencyClick = () => {
    setActiveFeature('emergency');
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeFeature === 'emergency' ? (
              <EmergencySupport onBack={() => setActiveFeature(null)} />
            ) : (
              <>
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Your Wellness Dashboard
                  </h2>
                  <p className="text-muted-foreground">
                    Track your health journey with personalized insights
                  </p>
                </div>

                <section className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Navigate OvAI</h3>
                      <p className="text-sm text-muted-foreground">Jump into any experience with one tap.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {navigationItems.map((item) => (
                      item.title === "Emergency Support" ? (
                        <div
                          key={item.title}
                          onClick={handleEmergencyClick}
                          className="group rounded-2xl border border-border bg-card/70 backdrop-blur-lg p-4 shadow-card hover:border-destructive transition cursor-pointer"
                        >
                          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-3 text-destructive">
                            <item.icon className="w-6 h-6" />
                          </div>
                          <h4 className="text-lg font-semibold text-foreground group-hover:text-destructive">
                            {item.title}
                          </h4>
                          <p className="text-xs font-semibold text-destructive mb-1">{item.status}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <span className="text-sm font-semibold text-destructive mt-3 inline-flex items-center gap-1">
                            Access Now
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </div>
                      ) : (
                        <Link
                          key={item.title}
                          to={item.to}
                          className="group rounded-2xl border border-border bg-card/70 backdrop-blur-lg p-4 shadow-card hover:border-primary transition"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
                            <item.icon className="w-6 h-6" />
                          </div>
                          <h4 className="text-lg font-semibold text-foreground group-hover:text-primary">
                            {item.title}
                          </h4>
                          <p className="text-xs font-semibold text-secondary mb-1">{item.status}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <span className="text-sm font-semibold text-primary mt-3 inline-flex items-center gap-1">
                            Explore
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </Link>
                      )
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Dashboard;
