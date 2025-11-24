import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Mic, Volume2, Loader2, Languages } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Extend window type for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const ChatInterface = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [language, setLanguage] = useState('English');
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          toast({
            title: "Listening",
            description: "Speak now... Click microphone again to stop",
          });
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          toast({
            title: "Voice Captured",
            description: "Speech transcribed successfully",
          });
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          
          let errorMessage = "Voice recognition failed";
          let errorDescription = "Please try again or type your question.";
          
          switch (event.error) {
            case 'network':
              errorMessage = "Network Error";
              errorDescription = "Speech recognition servers are unreachable. This is common in some regions. Options: 1) Try Chrome browser, 2) Check internet connection, 3) Refresh page, or 4) Type your question below.";
              break;
            case 'no-speech':
              errorMessage = "No Speech Detected";
              errorDescription = "No speech was detected. Please try speaking clearly or type your question.";
              break;
            case 'audio-capture':
              errorMessage = "Microphone Error";
              errorDescription = "Could not access microphone. Please check permissions or type your question.";
              break;
            case 'not-allowed':
              errorMessage = "Permission Denied";
              errorDescription = "Microphone access was denied. Please allow microphone access or type your question.";
              break;
            case 'service-not-allowed':
              errorMessage = "Service Unavailable";
              errorDescription = "Speech recognition service is unavailable. Please try a different browser or type your question.";
              break;
            default:
              errorMessage = "Voice Error";
              errorDescription = `Voice recognition failed (${event.error}). Please try again or type your question.`;
          }
          
          toast({
            variant: "destructive",
            title: errorMessage,
            description: errorDescription,
            action: (
              <Button 
                size="sm" 
                onClick={() => {
                  setInput("Voice input not working - I'll type my question here");
                  toast({
                    title: "Text Input Ready",
                    description: "You can now type your question in the input field.",
                  });
                }}
              >
                Type Instead
              </Button>
            )
          });
        };
        recognitionRef.current = recognition;
      } else {
        console.warn("Speech Recognition not supported in this browser.");
      }
    }
  }, [toast]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { question: text, language }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (text: string) => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      // Use browser's built-in text-to-speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          toast({
            title: 'Error',
            description: 'Failed to play audio',
            variant: 'destructive',
          });
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        throw new Error('Speech synthesis not supported');
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
      toast({
        title: 'Error',
        description: 'Text-to-speech not supported in this browser',
        variant: 'destructive',
      });
    }
  };

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Voice input is not supported in this browser."
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Check network connection first
      if (!navigator.onLine) {
        toast({
          variant: "destructive",
          title: "Offline",
          description: "No internet connection. Voice recognition requires network access. Please check your connection or type your question."
        });
        return;
      }
      
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        toast({
          variant: "destructive",
          title: "Voice Error",
          description: "Failed to start voice recognition. Please try again or type your question."
        });
        setIsListening(false);
      }
    }
  };

  return (
    <Card className="flex flex-col h-[600px] shadow-soft">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8 space-y-4">
              <p className="text-lg font-medium mb-2">👋 Hi! I'm your wellness assistant</p>
              <p className="text-sm">Ask me about your cycle, nutrition, fitness, or mental health</p>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🎤 Voice Input Tips:</h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 text-left">
                  <li>• Works best in Chrome browser</li>
                  <li>• Requires stable internet connection</li>
                  <li>• Allow microphone permissions when prompted</li>
                  <li>• Speak clearly and at moderate pace</li>
                  <li>• If voice fails, use text input (always available)</li>
                </ul>
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-6 px-2"
                    onClick={() => playAudio(msg.content)}
                    disabled={isPlaying}
                  >
                    {isPlaying ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Volume2 className="w-3 h-3 mr-1" />}
                    {isPlaying ? 'Playing...' : 'Play'}
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handleToggleListening}
            disabled={isLoading}
          >
            {isListening ? <Mic className="w-4 h-4 text-destructive" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Type or say your question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Select onValueChange={setLanguage} defaultValue={language}>
            <SelectTrigger className="w-[140px]">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
              <SelectItem value="Tamil">Tamil</SelectItem>
              <SelectItem value="Telugu">Telugu</SelectItem>
              <SelectItem value="Marathi">Marathi</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="icon"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
