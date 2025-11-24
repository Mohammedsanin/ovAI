-- Update RLS policy for discussion_replies to maintain forum functionality
-- while being more explicit about public visibility

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view replies" ON public.discussion_replies;

-- Create a new policy that's explicit about public discussions
CREATE POLICY "Anyone can view replies to public discussions"
ON public.discussion_replies
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.discussions
    WHERE discussions.id = discussion_replies.discussion_id
  )
);

-- Add policy to allow users to update their own replies
CREATE POLICY "Users can update their own replies"
ON public.discussion_replies
FOR UPDATE
USING (auth.uid() = user_id);