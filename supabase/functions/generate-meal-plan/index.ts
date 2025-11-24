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
interface SingleMeal {
  name: string;
  description: string;
  calories: string;
  fiber: string;
  ingredients: string[];
  recipe: string[];
}

interface MealPlan {
  breakfast: SingleMeal;
  midMorningSnack: SingleMeal;
  lunch: SingleMeal;
  afternoonSnack: SingleMeal;
  dinner: SingleMeal;
}

interface VideoSuggestion {
  meal: string;
  title: string;
  videoId: string | null;
  videoTitle: string | null;
  videoUrl: string | null;
  channelTitle: string | null;
  videoDescription: string | null;
}

interface MealPlanOutput {
  mealPlan: MealPlan;
  shoppingList: string[];
  videoSuggestions: VideoSuggestion[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cyclePhase, dietaryRestrictions, preferences } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Create the same prompt structure as your Genkit version
    const prompt = `You are a creative nutritionist who specializes in creating meal plans tailored to the menstrual cycle.

Create a detailed 1-day meal plan with 5 meals for someone in the ${cyclePhase} phase of their cycle. The five meals are: breakfast, mid-morning snack, lunch, afternoon snack, and dinner. Make the meal names sound appealing and delicious.

For EACH of the 5 meals, you MUST provide the following details:
1. A creative and appealing "name" for the meal.
2. A short, enticing "description" of the dish.
3. Estimated "calories" (e.g., "350-450 kcal").
4. Estimated "fiber" (e.g., "8g").
5. A list of "ingredients".
6. A step-by-step "recipe" for preparation.

Consider these dietary restrictions: ${dietaryRestrictions}

Also consider these preferences: ${preferences}
  
After creating the meal plan with all the required details, generate a complete shopping list of all ingredients needed.

Finally, provide one YouTube video search title for EACH meal (breakfast, mid-morning snack, lunch, afternoon snack, dinner). Create search terms that will find high-quality recipe videos with step-by-step instructions and professional presentation like popular cooking channels. Use this format:

For each meal, create a search term that includes:
- The exact meal name
- Key ingredients (2-3 main ingredients)
- Professional cooking terms for step-by-step videos

Examples:
- "Sunrise Berry & Seed Power Oats Recipe step by step instructions"
- "Mediterranean Feta Olive Appetizer Recipe tutorial step by step"
- "High-Protein Quinoa Tabbouleh Salad Recipe cooking tutorial"
- "Apple Slices Almond Butter Dip Recipe easy tutorial"
- "Tuscan White Bean Kale Stew Recipe step by step cooking"

IMPORTANT: Create search terms that will find professional recipe videos with clear step-by-step instructions, good lighting, and professional presentation like cooking tutorial channels.

IMPORTANT: You must respond with valid JSON only. The response should follow this exact structure:
{
  "mealPlan": {
    "breakfast": { "name": "...", "description": "...", "calories": "...", "fiber": "...", "ingredients": [...], "recipe": [...] },
    "midMorningSnack": { "name": "...", "description": "...", "calories": "...", "fiber": "...", "ingredients": [...], "recipe": [...] },
    "lunch": { "name": "...", "description": "...", "calories": "...", "fiber": "...", "ingredients": [...], "recipe": [...] },
    "afternoonSnack": { "name": "...", "description": "...", "calories": "...", "fiber": "...", "ingredients": [...], "recipe": [...] },
    "dinner": { "name": "...", "description": "...", "calories": "...", "fiber": "...", "ingredients": [...], "recipe": [...] }
  },
  "shoppingList": [...],
  "videoSuggestions": [
    { "meal": "breakfast", "title": "..." },
    { "meal": "midMorningSnack", "title": "..." },
    { "meal": "lunch", "title": "..." },
    { "meal": "afternoonSnack", "title": "..." },
    { "meal": "dinner", "title": "..." }
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
          parts: [{ text: "You are a nutritionist assistant. Always respond with valid JSON only." }]
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
      throw new Error("No meal plan generated");
    }

    let result: MealPlanOutput = JSON.parse(content);

    // Add YouTube video IDs if API key is available (similar to your Genkit version)
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    if (YOUTUBE_API_KEY && result.videoSuggestions) {
      console.log("Fetching step-by-step tutorial videos per meal...");
      const videoPromises = result.videoSuggestions.map(async (suggestion) => {
        try {
          // Build a search query for step-by-step tutorial videos
          const searchQuery = `${suggestion.title} step by step tutorial recipe cooking`;
          console.log(`Searching for tutorial video: ${searchQuery}`);
          
          const videoResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}&order=relevance&videoDuration=medium`
          );
          
          if (videoResponse.ok) {
            const videoData = await videoResponse.json();
            if (videoData.items && videoData.items.length > 0) {
              // Try to find the best tutorial-style video
              let bestVideo = videoData.items[0];
              
              // Prioritize videos with tutorial characteristics
              const tutorialKeywords = [
                'step by step', 'tutorial', 'how to make', 'recipe', 'cooking',
                'easy recipe', 'homemade', 'kitchen', 'chef', 'instructions'
              ];
              
              // Look for videos with clear tutorial indicators
              for (const item of videoData.items) {
                const title = item.snippet.title.toLowerCase();
                const description = item.snippet.description.toLowerCase();
                
                // Check for tutorial-specific keywords
                const hasTutorialKeywords = tutorialKeywords.some(keyword => 
                  title.includes(keyword) || description.includes(keyword)
                );
                
                // Prefer videos with step-by-step indicators
                const hasStepByStep = title.includes('step by step') || 
                                    description.includes('step by step') ||
                                    title.includes('tutorial') ||
                                    description.includes('instructions');
                
                // Prefer videos with detailed descriptions (usually step-by-step recipes)
                const hasDetailedDescription = item.snippet.description.length > 150;
                
                // Prefer videos from known cooking tutorial channels
                const channelName = item.snippet.channelTitle.toLowerCase();
                const isCookingChannel = channelName.includes('recipe') || 
                                        channelName.includes('cooking') ||
                                        channelName.includes('kitchen') ||
                                        channelName.includes('chef');
                
                if (hasStepByStep && hasDetailedDescription) {
                  bestVideo = item;
                  break;
                } else if (hasTutorialKeywords && hasDetailedDescription) {
                  bestVideo = item;
                }
              }
              
              const videoId = bestVideo.id.videoId;
              const videoTitle = bestVideo.snippet.title;
              const videoDescription = bestVideo.snippet.description;
              const channelTitle = bestVideo.snippet.channelTitle;
              
              console.log(`Found tutorial video for ${suggestion.meal}: ${videoId} - ${videoTitle} (${channelTitle})`);
              return { 
                ...suggestion, 
                videoId,
                videoTitle: videoTitle,
                videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
                channelTitle: channelTitle,
                videoDescription: videoDescription.substring(0, 200) + "..." // Truncate for preview
              };
            }
          } else {
            console.error(`YouTube API error for ${suggestion.title}: ${videoResponse.statusText}`);
          }
        } catch (error) {
          console.error(`Error fetching YouTube video for ${suggestion.title}:`, error);
        }
        return { 
          ...suggestion, 
          videoId: null,
          videoTitle: null,
          videoUrl: null,
          channelTitle: null,
          videoDescription: null
        };
      });

      result.videoSuggestions = await Promise.all(videoPromises);
      console.log("Step-by-step tutorial video fetching completed - one video per meal");
    } else {
      console.log("YouTube API key not found, using null videoIds");
      // Ensure videoId is null if no YouTube API key
      result.videoSuggestions = result.videoSuggestions.map(s => ({ 
        ...s, 
        videoId: null,
        videoTitle: null,
        videoUrl: null,
        channelTitle: null,
        videoDescription: null
      }));
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-meal-plan:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate meal plan";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
