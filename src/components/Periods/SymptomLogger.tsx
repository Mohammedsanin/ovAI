import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const symptoms = ["Cramps", "Mood Swings", "Bloating", "Headache", "Energy Level"];

export const SymptomLogger = () => {
  const { toast } = useToast();
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [severity, setSeverity] = useState(0);
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);

  const handleSymptomClick = (symptom: string) => {
    setSelectedSymptom(symptom);
    setOpen(true);
  };

  const saveSymptom = async () => {
    if (!selectedSymptom || severity === 0) {
      toast({ title: 'Error', description: 'Select severity level', variant: 'destructive' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      await supabase.from('period_symptoms').insert({
        user_id: user.id,
        symptom_type: selectedSymptom,
        severity,
        notes: notes || null
      });

      toast({ title: 'Success', description: 'Symptom logged!' });
      setOpen(false);
      setSeverity(0);
      setNotes('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="space-y-3">
        {symptoms.map((symptom) => (
          <div
            key={symptom}
            onClick={() => handleSymptomClick(symptom)}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5 transition-colors cursor-pointer"
          >
            <span className="text-sm">{symptom}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className="w-6 h-6 rounded border border-border hover:bg-primary/20 transition-colors"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log {selectedSymptom}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Severity (1-5)</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSeverity(level)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      severity === level
                        ? 'bg-primary text-white border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional details..."
              />
            </div>
            <Button onClick={saveSymptom} className="w-full">Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
