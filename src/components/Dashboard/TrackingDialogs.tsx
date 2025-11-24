import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Smile, Activity, Plus, Droplet, Calendar } from 'lucide-react';

export const MoodDialog = () => {
  const { toast } = useToast();
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState('');

  const saveMood = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      await supabase.from('mood_entries').upsert({
        user_id: user.id,
        date: today,
        mood,
        energy_level: energy
      });

      toast({ title: 'Success', description: 'Mood logged!' });
      setMood('');
      setEnergy('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3 h-12">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Smile className="w-4 h-4 text-white" />
          </div>
          <span>Log Mood</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How are you feeling?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Mood</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Happy">😊 Happy</SelectItem>
                <SelectItem value="Sad">😢 Sad</SelectItem>
                <SelectItem value="Anxious">😰 Anxious</SelectItem>
                <SelectItem value="Calm">😌 Calm</SelectItem>
                <SelectItem value="Energetic">⚡ Energetic</SelectItem>
                <SelectItem value="Tired">😴 Tired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Energy Level</Label>
            <Select value={energy} onValueChange={setEnergy}>
              <SelectTrigger>
                <SelectValue placeholder="Select energy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={saveMood} className="w-full">Save Mood</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SymptomDialog = () => {
  const { toast } = useToast();
  const [symptom, setSymptom] = useState('');

  const saveSymptom = async () => {
    toast({ title: 'Coming Soon', description: 'Symptom tracking will be available soon!' });
    setSymptom('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3 h-12">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span>Add Symptom</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a Symptom</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Describe your symptom</Label>
            <Textarea
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="E.g., headache, cramps, fatigue..."
            />
          </div>
          <Button onClick={saveSymptom} className="w-full">Save Symptom</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const NoteDialog = () => {
  const { toast } = useToast();
  const [note, setNote] = useState('');

  const saveNote = async () => {
    toast({ title: 'Coming Soon', description: 'Notes will be available soon!' });
    setNote('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-3 h-12">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" />
          </div>
          <span>Quick Note</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Your note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write anything..."
            />
          </div>
          <Button onClick={saveNote} className="w-full">Save Note</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const WaterDialog = () => {
  const { toast } = useToast();
  const [cups, setCups] = useState('');

  const saveWater = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      await supabase.from('water_intake').upsert({
        user_id: user.id,
        date: today,
        cups_consumed: parseInt(cups),
        target_cups: 8
      });

      toast({ title: 'Success', description: 'Water intake logged!' });
      setCups('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Droplet className="w-4 h-4" />
          Log Water
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Track Water Intake</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Cups consumed today</Label>
            <Input
              type="number"
              value={cups}
              onChange={(e) => setCups(e.target.value)}
              placeholder="0"
              min="0"
              max="20"
            />
          </div>
          <Button onClick={saveWater} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const CycleDialog = () => {
  const { toast } = useToast();
  const [day, setDay] = useState('');

  const saveCycle = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      await supabase.from('cycle_entries').insert({
        user_id: user.id,
        cycle_day: parseInt(day)
      });

      toast({ title: 'Success', description: 'Cycle day updated!' });
      setDay('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="w-4 h-4" />
          Update Cycle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Cycle Day</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Current cycle day (1-28)</Label>
            <Input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="14"
              min="1"
              max="28"
            />
          </div>
          <Button onClick={saveCycle} className="w-full">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
