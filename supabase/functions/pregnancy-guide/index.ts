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

interface WeeklyGuide {
  week: number;
  babyDevelopment: string[];
  momChanges: string[];
  nutritionTips: string[];
  exerciseTips: string[];
  thingsToDo: string[];
  videoSuggestion: string;
  videoId?: string | null;
}

interface MonthlyPregnancyGuide {
  title: string;
  weeklyGuides: WeeklyGuide[];
}

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
              text: `Generate a detailed pregnancy guide for month ${month}. Respond with valid JSON that matches this schema:
{
  "title": string,
  "weeklyGuides": [
    {
      "week": number,
      "babyDevelopment": string[2-3],
      "momChanges": string[3-4],
      "nutritionTips": string[2-3],
      "exerciseTips": string[2-3],
      "thingsToDo": string[2-3],
      "videoSuggestion": string
    }
  ]
}

Rules:
1. Provide guides for exactly four consecutive weeks of that month (e.g., month 2 => weeks 5,6,7,8).
2. Keep advice practical, encouraging, and medically safe.
3. Set "videoSuggestion" to a concise YouTube search query for fetal development at that specific week (e.g., "baby at 16 weeks gestation").`
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

    const parsedGuide = JSON.parse(content) as MonthlyPregnancyGuide;

    if (!parsedGuide?.weeklyGuides || parsedGuide.weeklyGuides.length !== 4) {
      throw new Error('Guide missing weekly data');
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    let weeklyGuides: WeeklyGuide[];

    if (!YOUTUBE_API_KEY) {
      console.warn('YOUTUBE_API_KEY not configured. Returning guides without video IDs.');
      weeklyGuides = parsedGuide.weeklyGuides.map((week) => ({ ...week, videoId: null }));
    } else {
      weeklyGuides = await Promise.all(
        parsedGuide.weeklyGuides.map(async (week) => {
          try {
            const youtubeResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${encodeURIComponent(week.videoSuggestion)}&key=${YOUTUBE_API_KEY}`
            );

            if (!youtubeResponse.ok) {
              console.error('YouTube API error:', youtubeResponse.status, await youtubeResponse.text());
              return { ...week, videoId: null };
            }

            const youtubeData = await youtubeResponse.json();
            const videoId = youtubeData?.items?.[0]?.id?.videoId ?? null;
            return { ...week, videoId };
          } catch (youtubeError) {
            console.error('Error fetching YouTube video:', youtubeError);
            return { ...week, videoId: null };
          }
        })
      );
    }

    const guide: MonthlyPregnancyGuide = {
      title: parsedGuide.title,
      weeklyGuides,
    };

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
