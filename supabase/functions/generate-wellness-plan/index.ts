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

// Define the schema types (similar to your Genkit zod schemas)
interface RelaxationPlan {
  technique: string;
  steps: string[];
}

interface NutritionMoodSupport {
  recommendation: string;
  explanation: string;
}

interface BookRecommendation {
  title: string;
  author: string;
  reason: string;
}

interface WellnessPlanOutput {
  mentalStateAnalysis: string;
  relaxationPlan: RelaxationPlan;
  selfCareTips: string[];
  nutritionMoodSupport: NutritionMoodSupport;
  musicSuggestionKeywords: string;
  mindfulnessPrompt: string;
  bookRecommendation: BookRecommendation;
  affirmations: string[];
  warmNote: string;
  musicVideoId?: string | null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mood, feelings, context } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Create the same prompt structure as your Genkit version
    const prompt = `You are an empathetic and creative wellness coach. A user needs a personalized support plan.

User's Mood: '${mood}'
User's Feelings (optional): '${feelings || ''}'
User's Context (optional): '${context || ''}'

Analyze their input and generate a supportive, actionable, and gentle support plan. The tone should be calming, encouraging, and human. If the context is pregnancy-related, ensure all suggestions are pregnancy-safe.

IMPORTANT: You must respond with valid JSON only. The response should follow this exact structure:
{
  "mentalStateAnalysis": "Briefly summarize and validate their feelings empathetically.",
  "relaxationPlan": {
    "technique": "The name of a simple relaxation technique",
    "steps": ["Step 1", "Step 2", "Step 3"]
  },
  "selfCareTips": ["Tip 1", "Tip 2", "Tip 3"],
  "nutritionMoodSupport": {
    "recommendation": "A brief suggestion for foods or drinks",
    "explanation": "A short explanation of why these foods are helpful"
  },
  "musicSuggestionKeywords": "A concise search query string for YouTube music",
  "mindfulnessPrompt": "A gentle, open-ended journaling prompt",
  "bookRecommendation": {
    "title": "The title of the recommended book",
    "author": "The author of the recommended book",
    "reason": "A brief explanation for why this book is recommended"
  },
  "affirmations": ["Affirmation 1", "Affirmation 2", "Affirmation 3"],
  "warmNote": "A short, comforting, and human-like closing message"
}`;

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Call Gemini API (similar to your Genkit flow)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          role: "system",
          parts: [{ text: "You are a compassionate wellness coach. Always respond with valid JSON only." }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
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
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("").trim();
    
    if (!content) {
      throw new Error("No wellness plan generated");
    }

    let result: WellnessPlanOutput = JSON.parse(content);

    // Add YouTube music video ID if API key is available (similar to your Genkit version)
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (YOUTUBE_API_KEY && result.musicSuggestionKeywords) {
      console.log("Fetching YouTube music video for wellness plan...");
      try {
        const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(result.musicSuggestionKeywords)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`);
        if (videoResponse.ok) {
          const videoData = await videoResponse.json();
          result.musicVideoId = videoData.items && videoData.items.length > 0 ? videoData.items[0].id.videoId : null;
          console.log(`Found music video: ${result.musicVideoId}`);
        } else {
          console.error(`YouTube API error for music: ${videoResponse.statusText}`);
          result.musicVideoId = null;
        }
      } catch (error) {
        console.error(`Error fetching YouTube music video:`, error);
        result.musicVideoId = null;
      }
      console.log("YouTube music video fetching completed");
    } else {
      console.log("YouTube API key not found, using null musicVideoId");
      result.musicVideoId = null;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-wellness-plan:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate wellness plan";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
