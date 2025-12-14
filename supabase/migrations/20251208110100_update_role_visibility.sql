DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_profiles'
      AND policyname = 'Authenticated users can view basic profiles'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Authenticated users can view basic profiles"
        ON public.user_profiles
        FOR SELECT
        TO authenticated
        USING (true);
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_roles'
      AND policyname = 'Authenticated users can view user roles'
  ) THEN
    EXECUTE $$
      CREATE POLICY "Authenticated users can view user roles"
        ON public.user_roles
        FOR SELECT
        TO authenticated
        USING (true);
    $$;
  END IF;
END
$$;
