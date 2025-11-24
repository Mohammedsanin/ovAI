import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { ChatInterface } from "@/components/Chatbot/ChatInterface";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Mic, Shield, Heart, Sparkles } from "lucide-react";

const Chatbot = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6 pb-64">
            <div className="animate-fade-in text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">24/7 AI Support</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-3">
                AI Wellness Companion
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Voice-enabled AI assistant for women's health. Ask anything about your cycle, 
                pregnancy, nutrition, fitness, or mental wellness. Emergency support available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {[
                {
                  icon: Mic,
                  title: "Voice Enabled",
                  description: "Natural conversation with AI using your voice",
                  color: "bg-primary"
                },
                {
                  icon: Heart,
                  title: "Health Guidance",
                  description: "Expert advice on women's wellness topics",
                  color: "bg-secondary"
                },
                {
                  icon: Shield,
                  title: "Emergency Support",
                  description: "24/7 safety features and emergency help",
                  color: "bg-destructive"
                },
                {
                  icon: MessageCircle,
                  title: "Always Available",
                  description: "Get support anytime, day or night",
                  color: "bg-accent"
                }
              ].map((feature, idx) => (
                <Card key={idx} className="shadow-card hover:shadow-soft transition-all hover-scale">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${feature.color} mx-auto mb-4 flex items-center justify-center`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Card className="shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    How to Use
                  </h3>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">1.</span>
                      <span>Click "Start Voice Chat" below</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">2.</span>
                      <span>Allow microphone access when prompted</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">3.</span>
                      <span>Start speaking naturally about your health concerns</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary">4.</span>
                      <span>Listen to AI responses and continue the conversation</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    What You Can Ask
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Period tracking and cycle questions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Pregnancy symptoms and trimester info</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Nutrition and meal planning advice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Exercise recommendations based on cycle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Mental health and emotional support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive">•</span>
                      <span className="font-semibold">Emergency help and safety support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card bg-destructive/5 border-destructive/20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-destructive">Emergency Support</h3>
                    <p className="text-muted-foreground mb-4">
                      The AI can detect emergency situations and immediately offer help. 
                      If you're in danger, feeling unsafe, or experiencing a medical emergency, 
                      the chatbot will connect you to emergency services.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Examples:</strong> severe pain, heavy bleeding, thoughts of self-harm, 
                      domestic violence, or any situation where you need immediate help.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <ChatInterface />
            </div>

            <div className="h-20"></div>
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Chatbot;
