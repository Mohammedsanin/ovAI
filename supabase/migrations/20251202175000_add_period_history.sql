-- Track manually logged period start dates for users
CREATE TABLE IF NOT EXISTS public.period_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period_start_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.period_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their period history"
ON public.period_history
FOR ALL
USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS period_history_user_date_idx
ON public.period_history (user_id, period_start_date);
