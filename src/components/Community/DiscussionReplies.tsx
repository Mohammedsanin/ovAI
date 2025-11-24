import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Reply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface DiscussionRepliesProps {
  discussionId: string;
}

export const DiscussionReplies = ({ discussionId }: DiscussionRepliesProps) => {
  const { toast } = useToast();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    if (showReplies) {
      fetchReplies();
      
      // Subscribe to new replies
      const channel = supabase
        .channel(`replies-${discussionId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'discussion_replies',
            filter: `discussion_id=eq.${discussionId}`
          },
          (payload) => {
            setReplies(prev => [...prev, payload.new as Reply]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [discussionId, showReplies]);

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select('*')
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim()) {
      toast({
        title: 'Error',
        description: 'Reply cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'Please sign in to reply',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          discussion_id: discussionId,
          user_id: user.id,
          content: newReply.trim(),
        });

      if (error) throw error;

      setNewReply('');
      toast({
        title: 'Success',
        description: 'Reply posted!',
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowReplies(!showReplies)}
        className="gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        {showReplies ? 'Hide' : 'View'} Replies ({replies.length})
      </Button>

      {showReplies && (
        <div className="space-y-3 ml-4 border-l-2 border-muted pl-4">
          {replies.map((reply) => (
            <Card key={reply.id} className="p-3">
              <p className="text-sm mb-2">{reply.content}</p>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(reply.created_at)}
              </span>
            </Card>
          ))}

          <div className="flex gap-2">
            <Textarea
              placeholder="Write a reply..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitReply();
                }
              }}
            />
            <Button
              onClick={handleSubmitReply}
              disabled={loading || !newReply.trim()}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
