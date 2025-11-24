import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { Header } from "@/components/Layout/Header";
import { EmergencySOS } from "@/components/Layout/EmergencySOS";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Heart, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DiscussionDialog } from "@/components/Community/DiscussionDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";


interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string | null;
  likes: string[];
  created_at: string;
  user_id: string;
  is_answered: boolean;
  doctor_response: string | null;
  reply_count: number;
}

interface Reply {
  id: string;
  discussion_id: string;
  content: string;
  created_at: string;
  user_id: string;
}

const Community = () => {
  const { toast } = useToast();
  const { userRole, isDoctor, isAdmin, user } = useUserRole();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<Discussion | null>(null);
  const [newReply, setNewReply] = useState('');
  const [isPostingReply, setIsPostingReply] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    fetchDiscussions();
    
    const channel = supabase
      .channel('discussions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discussions'
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newDiscussion = payload.new as Discussion;
            setDiscussions((current) => [newDiscussion, ...current]);
            await fetchUserProfile(newDiscussion.user_id);
          } else if (payload.eventType === 'UPDATE') {
            setDiscussions((current) =>
              current.map((d) =>
                d.id === payload.new.id ? (payload.new as Discussion) : d
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setDiscussions((current) =>
              current.filter((d) => d.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  useEffect(() => {
    if (selectedThread) {
      fetchReplies(selectedThread.id);
      
      const channel = supabase
        .channel(`replies-${selectedThread.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'discussion_replies',
            filter: `discussion_id=eq.${selectedThread.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newReply = payload.new as Reply;
              setReplies((current) => [...current, newReply]);
              fetchUserProfile(newReply.user_id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedThread]);

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const discussions = data || [];
      setDiscussions(discussions);
      
      if (discussions.length > 0 && !selectedThread) {
        setSelectedThread(discussions[0]);
      }
      
      // Fetch all user profiles
      const userIds = [...new Set(discussions.map(d => d.user_id))];
      await Promise.all(userIds.map(fetchUserProfile));
      
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to load discussions', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (discussionId: string) => {
    try {
      const { data, error } = await supabase
        .from('discussion_replies')
        .select('*')
        .eq('discussion_id', discussionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const replies = data || [];
      setReplies(replies);
      
      const userIds = [...new Set(replies.map(r => r.user_id))];
      await Promise.all(userIds.map(fetchUserProfile));
      
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    if (userProfiles.has(userId)) return;
    
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('display_name, avatar_url')
        .eq('user_id', userId)
        .single();
      
      if (data) {
        setUserProfiles(prev => new Map(prev).set(userId, data));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getUserProfile = (userId: string) => {
    return userProfiles.get(userId) || { display_name: 'Unknown', avatar_url: null };
  };

  const handlePostReply = async () => {
    if (!newReply.trim() || !selectedThread || !user) return;
    
    setIsPostingReply(true);
    try {
      const { error } = await supabase
        .from('discussion_replies')
        .insert({
          discussion_id: selectedThread.id,
          content: newReply,
          user_id: user.id
        });

      if (error) throw error;
      
      setNewReply('');
      toast({ title: 'Reply posted successfully!' });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({ 
        title: 'Error', 
        description: 'Could not post your reply', 
        variant: 'destructive' 
      });
    } finally {
      setIsPostingReply(false);
    }
  };

  const handleLike = async (discussion: Discussion) => {
    if (!user) return;
    
    const hasLiked = discussion.likes.includes(user.id);
    const newLikes = hasLiked
      ? discussion.likes.filter(id => id !== user.id)
      : [...discussion.likes, user.id];
    
    try {
      const { error } = await supabase
        .from('discussions')
        .update({ likes: newLikes })
        .eq('id', discussion.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating like:', error);
      toast({ 
        title: 'Error', 
        description: 'Could not update like status', 
        variant: 'destructive' 
      });
    }
  };



  return (
    <div className="flex min-h-screen w-full bg-gradient-soft">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Community Forum
              </h2>
              <p className="text-muted-foreground">
                Connect, share, and learn in a safe and supportive space
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-1 shadow-card">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Discussions</CardTitle>
                    <DiscussionDialog />
                  </div>
                  <p className="text-sm text-muted-foreground">Browse topics and join the conversation</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <p className="text-center text-muted-foreground py-8">Loading discussions...</p>
                  ) : discussions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No discussions yet. Start one!</p>
                  ) : (
                    discussions.map((discussion) => {
                      const profile = getUserProfile(discussion.user_id);
                      return (
                        <div
                          key={discussion.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            selectedThread?.id === discussion.id
                              ? 'bg-accent border border-primary'
                              : 'hover:bg-accent/50'
                          }`}
                          onClick={() => setSelectedThread(discussion)}
                        >
                          <p className="text-sm font-semibold line-clamp-2">{discussion.title}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback>{profile.display_name?.[0] || 'U'}</AvatarFallback>
                              </Avatar>
                              <span className="truncate max-w-[100px]">{profile.display_name}</span>
                            </div>
                            <span>{formatTimeAgo(discussion.created_at)}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 shadow-card">
                {selectedThread ? (
                  <>
                    <CardHeader>
                      <CardTitle>{selectedThread.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={getUserProfile(selectedThread.user_id).avatar_url || undefined} />
                            <AvatarFallback>
                              {getUserProfile(selectedThread.user_id).display_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">
                            {getUserProfile(selectedThread.user_id).display_name}
                          </span>
                        </div>
                        <span>•</span>
                        <span>{formatTimeAgo(selectedThread.created_at)}</span>
                        {selectedThread.category && (
                          <>
                            <span>•</span>
                            <Badge variant="secondary">{selectedThread.category}</Badge>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">{selectedThread.content}</p>

                      <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-1.5 ${
                            user && selectedThread.likes.includes(user.id) ? 'text-primary' : ''
                          }`}
                          onClick={() => handleLike(selectedThread)}
                        >
                          <Heart className={`h-4 w-4 ${user && selectedThread.likes.includes(user.id) ? 'fill-current' : ''}`} />
                          {selectedThread.likes.length}
                        </Button>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="h-4 w-4" />
                          {selectedThread.reply_count} Replies
                        </div>
                      </div>

                      <div className="mt-6 space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Replies</h3>
                        {replies.map((reply) => {
                          const profile = getUserProfile(reply.user_id);
                          return (
                            <div key={reply.id} className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback>{profile.display_name?.[0] || 'U'}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-accent/70 p-3 rounded-lg rounded-tl-none">
                                  <p className="font-semibold text-sm">{profile.display_name}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{reply.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatTimeAgo(reply.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        {user && (
                          <div className="flex items-start gap-3 pt-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={getUserProfile(user.id).avatar_url || undefined} />
                              <AvatarFallback>{getUserProfile(user.id).display_name?.[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex items-start gap-2">
                              <Textarea
                                value={newReply}
                                onChange={(e) => setNewReply(e.target.value)}
                                placeholder="Add your reply..."
                                className="min-h-[60px]"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostReply();
                                  }
                                }}
                              />
                              <Button
                                onClick={handlePostReply}
                                disabled={isPostingReply || !newReply.trim()}
                                size="icon"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
                    <p>{loading ? 'Loading discussions...' : 'Select a discussion to read'}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>

      <EmergencySOS />
    </div>
  );
};

export default Community;
