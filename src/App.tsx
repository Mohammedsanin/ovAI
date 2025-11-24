import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home, Calendar, UtensilsCrossed, Dumbbell, Baby, Stethoscope, Users, MessageCircle, Sparkles, Menu, X } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import { AuthForm } from "@/components/Auth/AuthForm";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Periods from "./pages/Periods";
import Nutrition from "./pages/Nutrition";
import Fitness from "./pages/Fitness";
import Pregnancy from "./pages/Pregnancy";
import Healthcare from "./pages/Healthcare";
import Community from "./pages/Community";
import Chatbot from "./pages/Chatbot";
import Wellness from "./pages/Wellness";
import { Settings } from "./pages/Settings";
import { WellnessHistory } from "./pages/WellnessHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/periods" element={<AuthGuard><Periods /></AuthGuard>} />
          <Route path="/nutrition" element={<AuthGuard><Nutrition /></AuthGuard>} />
          <Route path="/fitness" element={<AuthGuard><Fitness /></AuthGuard>} />
          <Route path="/pregnancy" element={<AuthGuard><Pregnancy /></AuthGuard>} />
          <Route path="/healthcare" element={<AuthGuard><Healthcare /></AuthGuard>} />
          <Route path="/community" element={<AuthGuard><Community /></AuthGuard>} />
          <Route path="/chatbot" element={<AuthGuard><Chatbot /></AuthGuard>} />
          <Route path="/wellness" element={<AuthGuard><Wellness /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
          <Route path="/wellness-history" element={<AuthGuard><WellnessHistory /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
