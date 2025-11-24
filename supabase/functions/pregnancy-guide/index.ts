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
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { month } = await req.json();
    
    if (!month || month < 1 || month > 9) {
      return new Response(
        JSON.stringify({ error: 'Month must be between 1 and 9' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          role: 'system',
          parts: [{ text: 'You are a friendly and knowledgeable obstetrician and pregnancy coach. Generate detailed, encouraging, and easy-to-understand guides for pregnancy. Your tone should be supportive, positive, and informative. Ensure all advice is safe and standard for pregnancy.' }]
        },
        contents: [
          {
            role: 'user',
            parts: [{
              text: `Generate a pregnancy guide for month ${month}. Provide a JSON object with:
- title: A creative, positive title (e.g., "Month 4: Feeling the Flutters")
- babyDevelopment: Array of 3-4 key baby developments
- momChanges: Array of 3-4 common physical/emotional changes for mother
- nutritionTips: Array of 2-3 practical nutrition tips
- exerciseTips: Array of 2-3 safe exercise suggestions
- thingsToDo: Array of 2-3 important reminders/appointments`
            }]
          }
        ],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate guide' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? '').join('').trim();
    
    if (!content) {
      throw new Error('No guide generated');
    }

    const guide = JSON.parse(content);

    return new Response(
      JSON.stringify(guide),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
