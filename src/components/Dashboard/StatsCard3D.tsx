import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface StatsCard3DProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  delay: number;
}

export const StatsCard3D = ({ icon: Icon, title, value, change, trend, delay }: StatsCard3DProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x: x * 20, y: y * -20 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <Card
      className="relative overflow-hidden border-2 border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/50 transition-all duration-500 animate-fade-in"
      style={{ 
        animationDelay: `${delay}s`,
        transform: isHovered 
          ? `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(10px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: 'all 0.3s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
      
      {/* Spotlight effect following mouse */}
      {isHovered && (
        <div 
          className="absolute w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)',
            left: `${(mousePosition.x + 10) * 5}%`,
            top: `${(mousePosition.y + 10) * 5}%`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      )}

      <div className="relative p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-14 h-14 rounded-xl bg-gradient-ovai flex items-center justify-center shadow-soft"
            style={{
              transform: isHovered ? 'translateZ(20px) scale(1.1)' : 'translateZ(0) scale(1)',
              transition: 'all 0.3s ease-out'
            }}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-secondary' : 'text-destructive'}`}>
            <svg className={`w-4 h-4 ${trend === 'up' ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {change}
          </div>
        </div>

        <div 
          className="space-y-1"
          style={{
            transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)',
            transition: 'all 0.3s ease-out'
          }}
        >
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-4xl font-black bg-gradient-ovai bg-clip-text text-transparent">{value}</p>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </Card>
  );
};
