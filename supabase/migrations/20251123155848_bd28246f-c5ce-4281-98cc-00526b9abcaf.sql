-- Update discussions table to support new community forum structure
ALTER TABLE discussions 
  RENAME COLUMN group_name TO category;

-- Change likes from integer to text array to track individual user likes
ALTER TABLE discussions 
  DROP COLUMN likes;

ALTER TABLE discussions 
  ADD COLUMN likes text[] DEFAULT '{}';

-- Add reply_count column (will be updated via trigger)
ALTER TABLE discussions 
  ADD COLUMN reply_count integer DEFAULT 0;

-- Create function to update reply count
CREATE OR REPLACE FUNCTION update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE discussions 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE discussions 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update reply count
CREATE TRIGGER update_reply_count_trigger
AFTER INSERT OR DELETE ON discussion_replies
FOR EACH ROW
EXECUTE FUNCTION update_discussion_reply_count();

-- Initialize reply_count for existing discussions
UPDATE discussions 
SET reply_count = (
  SELECT COUNT(*) 
  FROM discussion_replies 
  WHERE discussion_replies.discussion_id = discussions.id
);