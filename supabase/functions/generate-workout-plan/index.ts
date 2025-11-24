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
interface Exercise {
  name: string;
  sets: string;
  videoTitle?: string;
  videoId?: string | null;
}

interface DailyWorkout {
  day: number;
  title: string;
  description: string;
  exercises: Exercise[];
}

interface WorkoutPlanOutput {
  weeklyPlan: DailyWorkout[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fitnessGoals, cyclePhase, availableEquipment } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Create the same prompt structure as your Genkit version
    const prompt = `You are a certified personal trainer specializing in female fitness and cycle-syncing. Generate a structured and creative 7-day workout plan based on the user's details.

For each day, provide a title, a short description, and a list of specific exercises with sets/reps or duration.
For 3-5 key exercises per week, suggest a concise and accurate YouTube search title for a tutorial video (e.g., "how to do a kettlebell swing" or "alternating dumbbell bicep curl").

User Details:
- Fitness Goals: ${fitnessGoals}
- Current Cycle Phase: ${cyclePhase}
- Available Equipment: ${availableEquipment}

IMPORTANT: You must respond with valid JSON only. The response should follow this exact structure:
{
  "weeklyPlan": [
    {
      "day": 1,
      "title": "Full Body Strength",
      "description": "Focus on building overall strength",
      "exercises": [
        { "name": "Squats", "sets": "3 sets of 12 reps", "videoTitle": "how to do proper squats" },
        { "name": "Push-ups", "sets": "3 sets of 10 reps", "videoTitle": "proper push-up form" }
      ]
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
          parts: [{ text: "You are a fitness trainer assistant. Always respond with valid JSON only." }]
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
      throw new Error("No workout plan generated");
    }

    let result: WorkoutPlanOutput = JSON.parse(content);

    // Add YouTube video IDs if API key is available (similar to your Genkit version)
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (YOUTUBE_API_KEY && result.weeklyPlan) {
      console.log("Fetching YouTube videos for workout exercises...");
      const enhancedWeeklyPlan = await Promise.all(
        result.weeklyPlan.map(async (day) => {
          const exercisesWithVideos = await Promise.all(
            day.exercises.map(async (exercise) => {
              if (!exercise.videoTitle) {
                return { ...exercise, videoId: null };
              }
              try {
                const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(exercise.videoTitle)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`);
                if (videoResponse.ok) {
                  const videoData = await videoResponse.json();
                  const videoId = videoData.items && videoData.items.length > 0 ? videoData.items[0].id.videoId : null;
                  console.log(`Found video for ${exercise.name}: ${videoId}`);
                  return { ...exercise, videoId };
                } else {
                  console.error(`YouTube API error for ${exercise.videoTitle}: ${videoResponse.statusText}`);
                  return { ...exercise, videoId: null };
                }
              } catch (error) {
                console.error(`Error fetching YouTube video for ${exercise.videoTitle}:`, error);
                return { ...exercise, videoId: null };
              }
            })
          );
          return { ...day, exercises: exercisesWithVideos };
        })
      );

      result.weeklyPlan = enhancedWeeklyPlan;
      console.log("YouTube video fetching completed for workout plan");
    } else {
      console.log("YouTube API key not found, using null videoIds");
      // Ensure videoId is null if no YouTube API key
      result.weeklyPlan = result.weeklyPlan.map(day => ({
        ...day,
        exercises: day.exercises.map(ex => ({ ...ex, videoId: null }))
      }));
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-workout-plan:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate workout plan";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
