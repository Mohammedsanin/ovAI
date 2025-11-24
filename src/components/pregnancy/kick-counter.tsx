import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const KickCounter = () => {
  const [kicks, setKicks] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">{kicks}</p>
        <p className="text-xs text-muted-foreground">kicks today</p>
      </div>
      <Button 
        size="sm" 
        onClick={() => setKicks(kicks + 1)}
        className="h-8 w-8 rounded-full p-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
