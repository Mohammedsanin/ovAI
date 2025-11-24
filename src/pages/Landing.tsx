import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scene3D } from "@/components/Dashboard/Scene3D";
import { 
  Calendar, 
  UtensilsCrossed, 
  Dumbbell, 
  Heart, 
  Baby, 
  Stethoscope, 
  Users, 
  MessageCircle,
  Sparkles,
  ArrowRight,
  Check,
  Brain,
  Zap,
  Shield,
  TrendingUp,
  Orbit
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: Calendar,
    title: "OvAI Cycle Prediction",
    description: "Revolutionary AI-powered cycle tracking with unmatched accuracy. Predict your periods and fertility windows with confidence.",
    color: "from-primary to-primary/60",
  },
  {
    icon: UtensilsCrossed,
    title: "Intelligent Nutrition",
    description: "AI-optimized meal plans that adapt to your cycle phases, cravings, and nutritional needs in real-time.",
    color: "from-secondary to-secondary/60",
  },
  {
    icon: Dumbbell,
    title: "Adaptive Fitness",
    description: "Smart workouts that sync with your hormones. Train harder when you can, rest when you need to.",
    color: "from-accent to-accent/60",
  },
  {
    icon: Heart,
    title: "Mental Wellness AI",
    description: "Mood patterns decoded by AI. Get personalized support exactly when you need it most.",
    color: "from-primary to-primary/60",
  },
  {
    icon: Baby,
    title: "Pregnancy Intelligence",
    description: "Week-by-week AI guidance, kick tracking, and personalized care tips for your journey.",
    color: "from-secondary to-secondary/60",
  },
  {
    icon: Stethoscope,
    title: "Smart Healthcare",
    description: "AI symptom analysis, instant telehealth access, and intelligent health record management.",
    color: "from-accent to-accent/60",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with others on similar journeys. Share insights, join challenges, and grow together.",
    color: "from-primary to-primary/60",
  },
  {
    icon: MessageCircle,
    title: "24/7 AI Assistant",
    description: "Your personal health companion powered by advanced AI. Always available, always learning.",
    color: "from-secondary to-secondary/60",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="relative overflow-hidden shadow-card hover:shadow-glow transition-all duration-500 group animate-fade-in border-2 border-transparent hover:border-primary/30 bg-card/60 backdrop-blur-xl"
      style={{ 
        animationDelay: `${index * 0.05}s`,
        transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-ovai opacity-5 rounded-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity"></div>
      
      <CardContent className="p-8 relative">
        <div 
          className="relative w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-soft"
          style={{
            transform: isHovered ? 'scale(1.1) rotateY(10deg)' : 'scale(1) rotateY(0deg)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <feature.icon className="w-8 h-8 text-white relative z-10" />
          {isHovered && (
            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping"></div>
          )}
        </div>
        
        <h3 className="text-2xl font-black text-primary mb-3 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-lg text-primary/90 font-semibold leading-relaxed">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
};

const Landing = () => {
  const stats = [
    { icon: Brain, number: "99.5%", label: "AI Accuracy" },
    { icon: Zap, number: "24/7", label: "AI Support" },
    { icon: Shield, number: "100%", label: "Secure & Private" },
    { icon: TrendingUp, number: "10", label: "Active Users" },
  ];

  const benefits = [
    "AI-powered predictions with industry-leading accuracy",
    "Complete health ecosystem in one intelligent platform",
    "Personalized insights that learn and adapt to you",
    "Real-time AI assistance for every health question",
    "Secure, private, and built for women by experts",
    "Seamless integration across all life stages",
  ];

  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <Scene3D />

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-soft opacity-[0.02] -z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-background/4 backdrop-blur-sm -z-10 pointer-events-none"></div>
        <div className="absolute -top-24 -right-16 w-[32rem] h-[32rem] bg-primary/2 blur-[60px] rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[26rem] h-[26rem] bg-secondary/2 blur-[60px] rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[20rem] h-[20rem] bg-accent/2 blur-[60px] rounded-full -z-10 pointer-events-none"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 text-center w-full mix-blend-normal">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/60 backdrop-blur-xl border-2 border-primary/20 mb-10 animate-fade-in shadow-glow text-primary">
            <Orbit className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm font-bold">
              Next-Generation AI Health Platform
            </span>
          </div>
          
          {/* Main heading with 3D text effect */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-8xl md:text-[10rem] font-black mb-6 leading-none tracking-tighter text-foreground" style={{ textShadow: '0 0 80px rgba(168,85,247,0.2)' }}>
              <span className="inline-block text-primary">
                OvAI
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-1 w-24 bg-gradient-hero rounded-full"></div>
              <Sparkles className="w-8 h-8 text-primary animate-pulse-soft" />
              <div className="h-1 w-24 bg-gradient-hero rounded-full"></div>
            </div>
          </div>
          
          <p className="text-3xl md:text-4xl font-bold text-primary max-w-4xl mx-auto mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            The Future of
            <span className="font-black text-secondary"> Women's Health Intelligence</span>
          </p>
          
          <p className="text-2xl text-primary/80 font-semibold max-w-3xl mx-auto mb-12 animate-fade-in leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Revolutionary cycle tracking powered by cutting-edge artificial intelligence. 
            Experience personalized health insights that evolve with you.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="text-xl px-12 py-8 shadow-glow hover-scale font-bold rounded-2xl group relative overflow-hidden">
              <Link to="/dashboard">
                <span className="relative z-10 flex items-center gap-3">
                  Launch OvAI
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-xl px-12 py-8 hover-scale border-2 font-bold rounded-2xl bg-card/40 backdrop-blur-xl">
              <Link to="/dashboard">
                Explore Features
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="group animate-fade-in p-8 rounded-3xl bg-card/60 backdrop-blur-xl shadow-card hover:shadow-glow transition-all hover-scale border-2 border-border/50 hover:border-primary/50 cursor-pointer"
                style={{ 
                  animationDelay: `${0.5 + index * 0.1}s`,
                }}
              >
                <div className="relative">
                  <stat.icon className="w-12 h-12 text-primary mb-4 mx-auto group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="text-6xl font-black text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-base font-semibold text-primary/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative isolate overflow-hidden py-32 px-6">
        <div className="absolute inset-0 bg-gradient-soft opacity-70 -z-10 pointer-events-none"></div>
        <div className="absolute -top-24 -left-10 w-96 h-96 bg-primary/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-secondary/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/60 backdrop-blur-xl border-2 border-primary/30 mb-8 text-primary">
              <Brain className="w-6 h-6 text-primary" />
              <span className="text-sm font-bold">Intelligent Features</span>
            </div>
            
            <h2 className="text-7xl md:text-8xl font-black text-primary mb-8 leading-tight">
              AI That
              <br />
              <span className="text-primary drop-shadow">Understands You</span>
            </h2>
            <p className="text-2xl text-primary/90 max-w-4xl mx-auto leading-relaxed font-medium">
              Advanced machine learning algorithms designed specifically for women's health at every stage of life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 animate-fade-in">
            <h2 className="text-7xl font-black text-primary mb-6">
              AI-Powered Simplicity
            </h2>
            <p className="text-2xl text-primary/90 font-medium">
              Three steps to personalized health intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-16 left-0 w-full h-2 bg-gradient-ovai opacity-20 rounded-full"></div>
            
            {[
              {
                step: "01",
                title: "Connect Your Data",
                description: "Share your health profile and preferences. Our AI instantly begins learning your unique patterns.",
                icon: Brain,
              },
              {
                step: "02",
                title: "AI Learns & Adapts",
                description: "Track daily activities effortlessly while our AI analyzes patterns and refines predictions continuously.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Get Smart Insights",
                description: "Receive personalized, AI-powered recommendations that evolve with you throughout your journey.",
                icon: Sparkles,
              },
            ].map((step, index) => (
              <div key={index} className="text-center animate-fade-in relative group" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="relative inline-block mb-12">
                  <div className="w-32 h-32 rounded-full bg-white mx-auto flex items-center justify-center text-primary text-5xl font-black shadow-glow animate-float relative z-10 group-hover:scale-110 transition-transform duration-500">
                    {step.step}
                  </div>
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-70 animate-pulse-soft"></div>
                </div>
                
                <div className="bg-card/80 backdrop-blur-xl p-10 rounded-3xl shadow-card hover:shadow-glow transition-all hover-scale border-2 border-border/50 group-hover:border-primary/50">
                  <step.icon className="w-14 h-14 text-primary mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-3xl font-extrabold text-primary mb-5">
                    {step.title}
                  </h3>
                  <p className="text-primary/90 font-medium leading-relaxed text-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="animate-fade-in space-y-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/60 backdrop-blur-xl border-2 border-secondary/20 text-secondary">
                <Check className="w-6 h-6 text-secondary" />
                <span className="text-sm font-bold">Why OvAI</span>
              </div>
              
              <h2 className="text-7xl font-black text-foreground leading-tight">
                Intelligence
                <br />
                <span className="text-secondary">Meets Intuition</span>
              </h2>
              
              <p className="text-2xl text-foreground/90 leading-relaxed font-medium">
                More than tracking—it's your personal health AI that understands your body's unique language.
              </p>
              
              <div className="space-y-6 pt-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 animate-fade-in group"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1 border-2 border-primary/30 group-hover:scale-110 group-hover:bg-primary/30 transition-all">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-semibold text-xl">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in">
              <div className="aspect-square rounded-[3rem] bg-gradient-hero p-20 flex items-center justify-center relative overflow-hidden shadow-glow">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full animate-pulse-soft"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full animate-float"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10 text-center text-primary">
                  <div className="relative inline-block mb-12">
                    <Brain className="w-48 h-48 mx-auto animate-pulse-soft drop-shadow-2xl" />
                    <div className="absolute inset-0 bg-white rounded-full blur-3xl opacity-40 animate-float"></div>
                  </div>
                  <h3 className="text-5xl font-black mb-8 text-primary drop-shadow-lg">AI-First Platform</h3>
                  <p className="text-primary/90 max-w-md mx-auto text-xl leading-relaxed font-semibold">
                    Built from the ground up with artificial intelligence at its core. 
                    Every feature designed to be smarter, faster, and more personalized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center text-primary">
          <div className="relative inline-block mb-12">
            <Brain className="w-24 h-24 mx-auto animate-pulse-soft drop-shadow-2xl" />
            <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-40"></div>
          </div>
          
          <h2 className="text-7xl md:text-8xl font-black mb-12 leading-tight">
            <span className="text-primary drop-shadow-lg">Ready to Experience</span>
            <br />
            <span className="text-primary drop-shadow-lg">AI-Powered Health?</span>
          </h2>
          
          <p className="text-3xl text-primary/90 mb-16 max-w-4xl mx-auto leading-relaxed">
            Join thousands of women who trust OvAI for intelligent, personalized health insights 
            powered by cutting-edge artificial intelligence.
          </p>
          
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-2xl px-16 py-10 shadow-glow hover-scale font-black rounded-2xl mb-12">
            <Link to="/dashboard">
              Get Started with OvAI
              <ArrowRight className="ml-4 w-8 h-8" />
            </Link>
          </Button>
          
          <div className="flex flex-wrap justify-center gap-12 text-primary text-lg">
            {[
              "Free to Start",
              "Bank-Level Security",
              "Cancel Anytime"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
