
-- Migration: 20251004063109
-- Create user health tracking tables
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Cycle tracking
CREATE TABLE public.cycle_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_day INTEGER NOT NULL,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cycle_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their cycle entries"
ON public.cycle_entries FOR ALL
USING (auth.uid() = user_id);

-- Mood tracking
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood TEXT NOT NULL,
  energy_level TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their mood entries"
ON public.mood_entries FOR ALL
USING (auth.uid() = user_id);

-- Water intake tracking
CREATE TABLE public.water_intake (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cups_consumed INTEGER NOT NULL DEFAULT 0,
  target_cups INTEGER NOT NULL DEFAULT 8,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their water intake"
ON public.water_intake FOR ALL
USING (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251006050008
-- Period Tracker Tables
CREATE TABLE IF NOT EXISTS public.period_symptoms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  symptom_type TEXT NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.period_symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their symptoms"
ON public.period_symptoms
FOR ALL
USING (auth.uid() = user_id);

-- Nutrition Tables
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  calories INTEGER,
  protein INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their meals"
ON public.meals
FOR ALL
USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.cravings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  craving_item TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cravings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their cravings"
ON public.cravings
FOR ALL
USING (auth.uid() = user_id);

-- Fitness Tables
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  workout_name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  calories_burned INTEGER,
  intensity TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their workouts"
ON public.workouts
FOR ALL
USING (auth.uid() = user_id);

-- Mental Health Tables
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their journal entries"
ON public.journal_entries
FOR ALL
USING (auth.uid() = user_id);

-- Pregnancy Tables
CREATE TABLE IF NOT EXISTS public.pregnancy_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  due_date DATE,
  current_week INTEGER,
  kick_count INTEGER DEFAULT 0,
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pregnancy_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their pregnancy data"
ON public.pregnancy_data
FOR ALL
USING (auth.uid() = user_id);

-- Healthcare Tables
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  start_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their medications"
ON public.medications
FOR ALL
USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  appointment_type TEXT NOT NULL,
  doctor_name TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their appointments"
ON public.appointments
FOR ALL
USING (auth.uid() = user_id);

-- Community Tables
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  group_name TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create discussions"
ON public.discussions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view discussions"
ON public.discussions
FOR SELECT
USING (true);

CREATE TABLE IF NOT EXISTS public.discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create replies"
ON public.discussion_replies
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Everyone can view replies"
ON public.discussion_replies
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_pregnancy_data_updated_at
BEFORE UPDATE ON public.pregnancy_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migration: 20251007070527
-- Enable realtime for discussions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussions;

-- Enable realtime for discussion_replies table  
ALTER PUBLICATION supabase_realtime ADD TABLE public.discussion_replies;

-- Set replica identity for discussions
ALTER TABLE public.discussions REPLICA IDENTITY FULL;

-- Set replica identity for discussion_replies
ALTER TABLE public.discussion_replies REPLICA IDENTITY FULL;

-- Migration: 20251007071039
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE 
      WHEN role = 'admin' THEN 1
      WHEN role = 'doctor' THEN 2
      WHEN role = 'user' THEN 3
    END
  LIMIT 1
$$;

-- Update user_profiles table
ALTER TABLE public.user_profiles 
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS specialty TEXT,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Add trigger to create default user role when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update discussions policies
DROP POLICY IF EXISTS "Everyone can view discussions" ON public.discussions;
DROP POLICY IF EXISTS "Users can create discussions" ON public.discussions;

CREATE POLICY "Authenticated users can view discussions"
  ON public.discussions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users and doctors can create discussions"
  ON public.discussions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and doctors can update discussions"
  ON public.discussions
  FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor') OR 
    auth.uid() = user_id
  );

CREATE POLICY "Admins and doctors can delete discussions"
  ON public.discussions
  FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor')
  );

-- Update discussion_replies policies
DROP POLICY IF EXISTS "Everyone can view replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Users can create replies" ON public.discussion_replies;

CREATE POLICY "Authenticated users can view replies"
  ON public.discussion_replies
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON public.discussion_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and doctors can delete replies"
  ON public.discussion_replies
  FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'doctor')
  );

-- Add helpful comments column to discussions for doctor responses
ALTER TABLE public.discussions ADD COLUMN IF NOT EXISTS is_answered BOOLEAN DEFAULT false;
ALTER TABLE public.discussions ADD COLUMN IF NOT EXISTS doctor_response TEXT;
