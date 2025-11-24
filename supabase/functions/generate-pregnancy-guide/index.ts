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
interface MonthlyPregnancyGuideOutput {
  title: string;
  babyDevelopment: string[];
  momChanges: string[];
  nutritionTips: string[];
  exerciseTips: string[];
  thingsToDo: string[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { month } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Validate month input
    if (!month || month < 1 || month > 9) {
      throw new Error("Month must be between 1 and 9");
    }
    
    // Create the same prompt structure as your Genkit version
    const prompt = `You are a friendly and knowledgeable obstetrician and pregnancy coach. Generate a detailed, encouraging, and easy-to-understand guide for month ${month} of pregnancy.

Your tone should be supportive, positive, and informative. Ensure all advice is safe and standard for pregnancy.

For month ${month}, provide the following:
1. **title**: A creative, positive title for the month (e.g., "Month 4: Feeling the Flutters").
2. **babyDevelopment**: 3-4 bullet points on the baby's key developments.
3. **momChanges**: 3-4 bullet points on common physical and emotional changes for the mother.
4. **nutritionTips**: 2-3 practical tips on what to eat or focus on.
5. **exerciseTips**: 2-3 suggestions for safe physical activities.
6. **thingsToDo**: 2-3 important reminders, like appointments or preparations.

IMPORTANT: You must respond with valid JSON only. The response should follow this exact structure:
{
  "title": "A creative and encouraging title for this month of pregnancy",
  "babyDevelopment": ["Development point 1", "Development point 2", "Development point 3"],
  "momChanges": ["Change 1", "Change 2", "Change 3"],
  "nutritionTips": ["Tip 1", "Tip 2"],
  "exerciseTips": ["Exercise 1", "Exercise 2"],
  "thingsToDo": ["Task 1", "Task 2"]
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
          parts: [{ text: "You are a knowledgeable obstetrician and pregnancy coach. Always respond with valid JSON only." }]
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
      throw new Error("No pregnancy guide generated");
    }

    const result: MonthlyPregnancyGuideOutput = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-pregnancy-guide:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate pregnancy guide";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
