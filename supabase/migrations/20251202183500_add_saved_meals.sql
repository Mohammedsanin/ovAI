-- Track saved meal plans with video references
CREATE TABLE IF NOT EXISTS public.saved_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  meal_type TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  description TEXT,
  calories TEXT,
  fiber TEXT,
  ingredients JSONB,
  recipe_steps JSONB,
  video_id TEXT,
  video_title TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved meals"
ON public.saved_meals
FOR ALL
USING (auth.uid() = user_id);
