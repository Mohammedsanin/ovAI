import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export const ContractionTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (isRunning) {
      setSeconds(0);
    }
    setIsRunning(!isRunning);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">{formatTime(seconds)}</p>
        <p className="text-xs text-muted-foreground">duration</p>
      </div>
      <Button 
        size="sm" 
        onClick={handleToggle}
        variant={isRunning ? "destructive" : "default"}
        className="h-8 w-8 rounded-full p-0"
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
    </div>
  );
};
