import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Phone } from 'lucide-react';

const SimpleVoiceChat = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new (window as any).webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          handleSendMessage(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Error",
          description: "Speech recognition failed. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscript('');
      toast({
        title: "Listening",
        description: "Speak now...",
      });
    } else {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      setResponse('Processing...');
      
      // Simple response logic - can be enhanced with AI later
      const keywords = text.toLowerCase();
      let reply = "I'm here to help with your wellness journey.";
      
      if (keywords.includes('emergency') || keywords.includes('danger')) {
        reply = "Emergency detected! Please call emergency services at 911 or your local emergency number.";
        toast({
          title: "Emergency Alert",
          description: reply,
          variant: "destructive",
        });
      } else if (keywords.includes('period') || keywords.includes('cycle')) {
        reply = "I can help you track your menstrual cycle. Would you like to log your cycle day?";
      } else if (keywords.includes('mood')) {
        reply = "How are you feeling today? You can track your mood on the dashboard.";
      } else if (keywords.includes('water')) {
        reply = "Staying hydrated is important! Make sure to drink 8 cups of water daily.";
      }
      
      setResponse(reply);
      speak(reply);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive",
      });
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <Card className="shadow-soft border-2">
          <CardContent className="p-6 space-y-4">
            {transcript && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-primary">You: {transcript}</p>
              </div>
            )}
            
            {response && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-foreground">AI: {response}</p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              {!isRecording ? (
                <Button 
                  onClick={startRecording}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Voice Chat
                </Button>
              ) : (
                <Button 
                  onClick={stopRecording}
                  variant="destructive"
                  size="lg"
                >
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              )}
            </div>

            {!isRecording && (
              <p className="text-xs text-center text-muted-foreground">
                Ask about periods, mood, nutrition, or emergency support
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleVoiceChat;
