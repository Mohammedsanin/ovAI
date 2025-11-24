import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle } from 'lucide-react';

export const DiscussionDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createDiscussion = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Error', description: 'Title and content are required', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      const { error } = await supabase.from('discussions').insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        category: category || null
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Your post has been published!' });
      setOpen(false);
      setTitle('');
      setContent('');
      setCategory('');
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast({ title: 'Error', description: 'Could not publish your post', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
          <DialogDescription>Share your thoughts with the community</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the main topic of your discussion?"
            />
          </div>
          <div>
            <Label>Category (optional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cycle Support">Cycle Support</SelectItem>
                <SelectItem value="Wellness Challenges">Wellness Challenges</SelectItem>
                <SelectItem value="Nutrition">Nutrition</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Pregnancy">Pregnancy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts and questions here..."
              className="min-h-[150px]"
            />
          </div>
          <Button onClick={createDiscussion} disabled={isLoading} className="w-full">
            {isLoading ? 'Publishing...' : 'Publish Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
