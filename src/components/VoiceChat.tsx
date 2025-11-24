import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VoiceChatProps {
  discussionId?: string;
  discussionTitle?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const VoiceChat = ({ discussionId, discussionTitle }: VoiceChatProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Received event:', event);
    
    if (event.type === 'response.audio_transcript.delta') {
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastMsg,
            content: lastMsg.content + event.delta
          };
          return updated;
        }
        return [...prev, { role: 'assistant', content: event.delta, timestamp: new Date() }];
      });
    } else if (event.type === 'conversation.item.input_audio_transcription.completed') {
      setMessages(prev => [...prev, { 
        role: 'user', 
        content: event.transcript, 
        timestamp: new Date() 
      }]);
    } else if (event.type === 'response.audio.delta') {
      setIsSpeaking(true);
    } else if (event.type === 'response.audio.done') {
      setIsSpeaking(false);
    }
  };

  const startConversation = async () => {
    try {
      chatRef.current = new RealtimeChat(handleMessage, discussionId);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Connected",
        description: "Voice chat is ready. Start speaking!",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Voice Chat {discussionTitle && `- ${discussionTitle}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64 w-full rounded-md border p-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-center gap-4">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              className="gap-2"
              size="lg"
            >
              <Phone className="h-5 w-5" />
              Start Voice Chat
            </Button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {isSpeaking ? (
                  <Mic className="h-5 w-5 animate-pulse text-primary" />
                ) : (
                  <MicOff className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm">
                  {isSpeaking ? 'AI is speaking...' : 'Listening...'}
                </span>
              </div>
              <Button 
                onClick={endConversation}
                variant="destructive"
                className="gap-2"
              >
                <PhoneOff className="h-5 w-5" />
                End Call
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
