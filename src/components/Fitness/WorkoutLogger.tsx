import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Activity } from 'lucide-react';

export const WorkoutLogger = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState('');

  const saveWorkout = async () => {
    if (!workoutName || !duration) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      await supabase.from('workouts').insert({
        user_id: user.id,
        workout_name: workoutName,
        duration: parseInt(duration),
        calories_burned: calories ? parseInt(calories) : null,
        intensity
      });

      toast({ title: 'Success', description: 'Workout logged!' });
      setOpen(false);
      setWorkoutName('');
      setDuration('');
      setCalories('');
      setIntensity('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Activity className="w-4 h-4 mr-2" />
          Log Workout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a Workout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Workout Name</Label>
            <Input
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., HIIT Cardio"
            />
          </div>
          <div>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <Label>Calories Burned (optional)</Label>
            <Input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="350"
            />
          </div>
          <div>
            <Label>Intensity</Label>
            <Select value={intensity} onValueChange={setIntensity}>
              <SelectTrigger>
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={saveWorkout} className="w-full">Save Workout</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
