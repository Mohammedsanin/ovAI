import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface FeatureCard3DProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  gradient: string;
  delay: number;
}

export const FeatureCard3D = ({ icon: Icon, title, description, href, gradient, delay }: FeatureCard3DProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link to={href}>
      <Card
        className="relative group overflow-hidden border-2 border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/50 transition-all duration-500 animate-fade-in cursor-pointer"
        style={{ 
          animationDelay: `${delay}s`,
          transform: isHovered ? 'translateY(-10px) rotateX(5deg) rotateY(2deg)' : 'translateY(0) rotateX(0) rotateY(0)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated gradient background */}
        <div 
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${gradient}`}
          style={{
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.5s ease-out'
          }}
        ></div>
        
        {/* Glowing orb effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%)',
            transform: isHovered ? 'scale(1.5)' : 'scale(1)',
            transition: 'all 0.7s ease-out'
          }}
        ></div>

        <div className="relative p-8 z-10">
          {/* Icon container with 3D effect */}
          <div 
            className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 shadow-glow relative"
            style={{
              transform: isHovered ? 'translateZ(30px) rotateY(10deg)' : 'translateZ(0) rotateY(0)',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Icon className="w-10 h-10 text-white" />
            
            {/* Particle effects on hover */}
            {isHovered && (
              <>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              </>
            )}
          </div>

          {/* Content */}
          <h3 className="text-2xl font-black text-foreground mb-3 group-hover:text-white transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
            {description}
          </p>

          {/* Arrow indicator */}
          <div 
            className="mt-6 flex items-center gap-2 text-primary group-hover:text-white transition-all duration-300"
            style={{
              transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
              transition: 'transform 0.3s ease-out'
            }}
          >
            <span className="text-sm font-bold">Explore</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>

        {/* 3D edge highlights */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Card>
    </Link>
  );
};
