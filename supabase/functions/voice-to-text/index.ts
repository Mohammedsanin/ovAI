// @ts-ignore - Deno module import works in runtime but TypeScript can't resolve it
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Declare Deno global for TypeScript
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Declare serve function types
interface Request {
  json(): Promise<any>;
  method: string;
}

interface ResponseOptions {
  headers: Record<string, string>;
  status?: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Define the schema types
interface VoiceToTextOutput {
  transcript: string;
  confidence: number;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, language } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    console.log("Voice-to-text request received:", { 
      hasAudioData: !!audioData, 
      audioDataLength: audioData?.length,
      language 
    });
    
    // Validate input
    if (!audioData) {
      throw new Error("Audio data is required");
    }

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Create the prompt for audio transcription
    const prompt = `Transcribe the audio to text. The user is speaking in ${language || 'English'}. 
    Only return the transcribed text without any additional commentary or formatting.
    
    If no speech is detected or the audio is unclear, respond with: "No speech detected"`;

    // Call Gemini API with audio capability
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          role: "system",
          parts: [{ text: "You are a speech transcription system. Convert audio to text accurately." }]
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { 
                inline_data: {
                  mime_type: "audio/webm",
                  data: audioData
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 200,
          responseMimeType: "text/plain"
        }
      }),
    });

    console.log("Gemini API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API response data:", data);
    
    const transcript = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim();
    
    if (!transcript) {
      throw new Error("No transcription generated");
    }

    const result: VoiceToTextOutput = {
      transcript: transcript,
      confidence: 0.9 // Gemini doesn't provide confidence scores, so we use a default
    };

    console.log("Transcription successful:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in voice-to-text:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to transcribe audio";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
