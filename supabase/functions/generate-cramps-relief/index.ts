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
interface Routine {
  type: "Stretch" | "Exercise" | "Tip";
  title: string;
  description: string;
  videoSuggestion?: string;
  videoId?: string | null;
}

interface CrampsReliefOutput {
  routines: Routine[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { painArea } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Create the same prompt structure as your Genkit version
    const prompt = `You are a compassionate physiotherapist and wellness expert specializing in menstrual health. A user is experiencing cramp pain in a specific area and needs a gentle, effective relief plan.

User's Pain Area: '${painArea}'

Generate a list of 3-4 distinct and actionable relief routines. For each routine, provide:
1. 'type': "Stretch", "Exercise", or "Tip".
2. 'title': A clear name for the routine.
3. 'description': A simple explanation of the routine.
4. 'videoSuggestion' (optional but highly recommended for stretches/exercises): A concise and accurate YouTube search query for a tutorial video (e.g., "how to do child's pose for back pain").

The tone should be supportive, gentle, and encouraging. Focus on safe and commonly recommended practices.

IMPORTANT: You must respond with valid JSON only. The response should follow this exact structure:
{
  "routines": [
    {
      "type": "Stretch",
      "title": "Cat-Cow Stretch",
      "description": "A gentle spinal movement that relieves lower back tension",
      "videoSuggestion": "cat cow stretch for menstrual cramps"
    },
    {
      "type": "Exercise", 
      "title": "Gentle Pelvic Tilts",
      "description": "Subtle movement to ease abdominal discomfort",
      "videoSuggestion": "pelvic tilts for period pain"
    },
    {
      "type": "Tip",
      "title": "Apply Warm Compress",
      "description": "Heat therapy helps relax uterine muscles and increase blood flow",
      "videoSuggestion": "how to use heat pack for cramps"
    }
  ]
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
          parts: [{ text: "You are a compassionate physiotherapist. Always respond with valid JSON only." }]
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
      throw new Error("No cramps relief plan generated");
    }

    let result: CrampsReliefOutput = JSON.parse(content);

    // Add YouTube video IDs if API key is available (similar to your Genkit version)
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (YOUTUBE_API_KEY && result.routines) {
      console.log("Fetching YouTube videos for cramps relief routines...");
      const enhancedRoutines = await Promise.all(
        result.routines.map(async (routine) => {
          if (!routine.videoSuggestion) {
            return { ...routine, videoId: null };
          }
          try {
            const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(routine.videoSuggestion)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`);
            if (videoResponse.ok) {
              const videoData = await videoResponse.json();
              const videoId = videoData.items && videoData.items.length > 0 ? videoData.items[0].id.videoId : null;
              console.log(`Found video for ${routine.title}: ${videoId}`);
              return { ...routine, videoId };
            } else {
              console.error(`YouTube API error for ${routine.videoSuggestion}: ${videoResponse.statusText}`);
              return { ...routine, videoId: null };
            }
          } catch (error) {
            console.error(`Error fetching YouTube video for ${routine.videoSuggestion}:`, error);
            return { ...routine, videoId: null };
          }
        })
      );

      result.routines = enhancedRoutines;
      console.log("YouTube video fetching completed for cramps relief");
    } else {
      console.log("YouTube API key not found, using null videoIds");
      // Ensure videoId is null if no YouTube API key
      result.routines = result.routines.map(r => ({ ...r, videoId: null }));
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-cramps-relief:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate cramps relief plan";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
