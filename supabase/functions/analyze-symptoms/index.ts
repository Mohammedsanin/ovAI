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
interface SymptomAnalysisOutput {
  analysis: string;
  possibleCauses: string[];
  recommendations: string[];
  whenToSeeDoctor: string[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, context } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    // Create the same prompt structure as your Genkit version
    const prompt = `You are a knowledgeable healthcare professional specializing in symptom analysis. Please analyze the provided symptoms and provide helpful insights.

Symptoms: ${symptoms}
${context ? `Additional Context: ${context}` : ''}

IMPORTANT: This is for informational purposes only and not a substitute for professional medical advice.

Please provide:
1. A clear analysis of what these symptoms might indicate
2. Possible causes (most common first)
3. Self-care recommendations
4. Clear indicators of when to seek medical attention

IMPORTANT: You must respond with valid JSON only. The response should follow this exact structure:
{
  "analysis": "A clear and concise analysis of what these symptoms might indicate",
  "possibleCauses": ["Most likely cause 1", "Possible cause 2", "Less common cause 3"],
  "recommendations": ["Self-care recommendation 1", "Recommendation 2", "Recommendation 3"],
  "whenToSeeDoctor": ["Seek immediate care if...", "Consult doctor if...", "Monitor and see doctor if..."]
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
          parts: [{ text: "You are a healthcare professional providing symptom analysis. Always respond with valid JSON only and include appropriate medical disclaimers." }]
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
      throw new Error("No symptom analysis generated");
    }

    const result: SymptomAnalysisOutput = JSON.parse(content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-symptoms:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze symptoms";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
