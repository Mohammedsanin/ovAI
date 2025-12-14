-- Track saved workout plans for users
CREATE TABLE IF NOT EXISTS public.saved_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  day_number INTEGER,
  routine_title TEXT NOT NULL,
  description TEXT,
  cycle_phase TEXT,
  fitness_goal TEXT,
  equipment TEXT,
  exercises JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.saved_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved workouts"
ON public.saved_workouts
FOR ALL
USING (auth.uid() = user_id);
