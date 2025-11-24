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
interface PredictedCycleOutput {
  predictedNextPeriod: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDay: string;
  cycleLength: number;
  insights: string;
  currentPhase: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lastPeriodStarts } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Validate input
    if (!Array.isArray(lastPeriodStarts) || lastPeriodStarts.length !== 3) {
      throw new Error("Must provide exactly 3 period start dates in YYYY-MM-DD format");
    }

    // Add today's date to the input for the AI to determine the current phase
    const today = new Date().toISOString().split('T')[0];
    
    // Create the same prompt structure as your Genkit version
    const prompt = `You are an expert in women's health and menstrual cycle analysis, tasked with providing the highest accuracy predictions. Based on the following data, predict the user's next cycle. Today's date is ${today}.

Last three period start dates:
- ${lastPeriodStarts[0]}
- ${lastPeriodStarts[1]}
- ${lastPeriodStarts[2]}

Your tasks:
1. **Calculate Average Cycle Length**: Calculate the two intervals between the three provided dates. Average these two intervals to determine the cycle length. This method provides the highest accuracy.
2. **Predict Next Period**: Based on the precise average cycle length and the most recent period start date (${lastPeriodStarts[2]}), predict the exact start date of the next period.
3. **Predict Fertile Window**: The fertile window is the 6 days ending on ovulation day. Assume ovulation happens 14 days *before* the start of the *next* predicted period.
4. **Predict Ovulation Day**: Pinpoint the single estimated day of ovulation.
5. **Provide Insights**: Give a short, one-sentence insight into the user's cycle regularity (e.g., "Your cycle appears to be regular," or "Your cycle length varies slightly.").
6. **Determine Current Phase**: Based on today's date (${today}) and the predicted cycle dates, determine which phase the user is currently in (Menstrual, Follicular, Ovulatory, Luteal).

IMPORTANT: You must respond with valid JSON only. The response should follow this exact structure:
{
  "predictedNextPeriod": "YYYY-MM-DD",
  "fertileWindowStart": "YYYY-MM-DD",
  "fertileWindowEnd": "YYYY-MM-DD",
  "ovulationDay": "YYYY-MM-DD",
  "cycleLength": number,
  "insights": "A brief, helpful insight about the user's cycle regularity or patterns.",
  "currentPhase": "The user's current cycle phase based on today's date."
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
          parts: [{ text: "You are a women's health expert. Always respond with valid JSON only." }]
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
      throw new Error("No cycle prediction generated");
    }

    const result: PredictedCycleOutput = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in predict-cycle:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to predict cycle";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
