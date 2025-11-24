import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

export const MedicationDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');

  const saveMedication = async () => {
    if (!medName) {
      toast({ title: 'Error', description: 'Enter medication name', variant: 'destructive' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      await supabase.from('medications').insert({
        user_id: user.id,
        medication_name: medName,
        dosage: dosage || null,
        frequency: frequency || null,
        start_date: new Date().toISOString().split('T')[0]
      });

      toast({ title: 'Success', description: 'Medication added!' });
      setOpen(false);
      setMedName('');
      setDosage('');
      setFrequency('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Medication Name</Label>
            <Input
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              placeholder="e.g., Vitamin D"
            />
          </div>
          <div>
            <Label>Dosage (optional)</Label>
            <Input
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 1000 IU"
            />
          </div>
          <div>
            <Label>Frequency (optional)</Label>
            <Input
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g., Daily with breakfast"
            />
          </div>
          <Button onClick={saveMedication} className="w-full">Add Medication</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
