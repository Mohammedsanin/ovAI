-- Add cycle_predictions table to track AI predicted periods
CREATE TABLE IF NOT EXISTS public.cycle_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  predicted_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cycle_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their cycle predictions"
ON public.cycle_predictions
FOR ALL
USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS cycle_predictions_user_date_idx
ON public.cycle_predictions (user_id, predicted_date);
