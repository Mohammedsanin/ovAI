import { Home, Calendar, UtensilsCrossed, Dumbbell, Baby, Stethoscope, Users, MessageCircle, Sparkles, Menu, X, ShieldAlert } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Period Tracker", href: "/periods", icon: Calendar },
  { name: "Nutrition", href: "/nutrition", icon: UtensilsCrossed },
  { name: "Fitness", href: "/fitness", icon: Dumbbell },
  { name: "Wellness Plan", href: "/wellness", icon: Sparkles },
  { name: "Pregnancy", href: "/pregnancy", icon: Baby },
  { name: "Healthcare", href: "/healthcare", icon: Stethoscope },
  { name: "Emergency", href: "/dashboard?view=emergency", icon: ShieldAlert },
  { name: "Community", href: "/community", icon: Users },
  { name: "AI Chatbot", href: "/chatbot", icon: MessageCircle },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar border border-sidebar-border shadow-lg hover:bg-sidebar-accent transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out z-40",
          "md:w-64 md:translate-x-0 md:static",
          "fixed inset-y-0 left-0 w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
            OVAI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Women Wellness Companion</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/" || item.href === "/dashboard"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  "hover:bg-sidebar-accent",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">AI Chatbot</span>
          </button>
        </div>
      </aside>
    </>
  );
};
