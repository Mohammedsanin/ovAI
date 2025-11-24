import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const JournalDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const saveEntry = async () => {
    if (!content) {
      toast({ title: 'Error', description: 'Please write something', variant: 'destructive' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      await supabase.from('journal_entries').insert({
        user_id: user.id,
        content,
        mood: mood || null
      });

      toast({ title: 'Success', description: 'Journal entry saved!' });
      setOpen(false);
      setContent('');
      setMood('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Add Journal Entry</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Journal Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>How are you feeling?</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Happy">😊 Happy</SelectItem>
                <SelectItem value="Calm">😌 Calm</SelectItem>
                <SelectItem value="Anxious">😰 Anxious</SelectItem>
                <SelectItem value="Sad">😢 Sad</SelectItem>
                <SelectItem value="Grateful">🙏 Grateful</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Your thoughts</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about your day, feelings, or anything on your mind..."
              rows={6}
            />
          </div>
          <Button onClick={saveEntry} className="w-full">Save Entry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
