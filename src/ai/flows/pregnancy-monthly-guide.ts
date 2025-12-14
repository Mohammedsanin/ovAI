"use server";

import { z } from "zod";
import { createClient } from "@/integrations/supabase/server";

const MonthlyPregnancyGuideInputSchema = z.object({
  month: z.number().min(1).max(9)
});

export type MonthlyPregnancyGuideInput = z.infer<typeof MonthlyPregnancyGuideInputSchema>;

const WeeklyGuideSchema = z.object({
  week: z.number(),
  babyDevelopment: z.array(z.string()),
  momChanges: z.array(z.string()),
  nutritionTips: z.array(z.string()),
  exerciseTips: z.array(z.string()),
  thingsToDo: z.array(z.string()),
  videoSuggestion: z.string(),
  videoId: z.string().nullable().optional()
});

const MonthlyPregnancyGuideOutputSchema = z.object({
  title: z.string(),
  weeklyGuides: z.array(WeeklyGuideSchema).length(4)
});

export type MonthlyPregnancyGuideOutput = z.infer<typeof MonthlyPregnancyGuideOutputSchema>;

export async function generateMonthlyPregnancyGuide(
  input: MonthlyPregnancyGuideInput
): Promise<MonthlyPregnancyGuideOutput> {
  const supabase = createClient();
  const { month } = MonthlyPregnancyGuideInputSchema.parse(input);

  const { data, error } = await supabase.functions.invoke("pregnancy-guide", {
    body: { month }
  });

  if (error) {
    throw error;
  }

  return MonthlyPregnancyGuideOutputSchema.parse(data);
}
