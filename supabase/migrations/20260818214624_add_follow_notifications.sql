-- Allow 'follow' as a notification type, alongside the existing 'like'/'comment'.
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check CHECK (type IN ('like','comment','follow'));

-- Per-user notification preferences for follows, matching the existing
-- notify_likes_inapp/notify_likes_email and notify_comments_inapp/notify_comments_email pattern.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_follows_inapp boolean DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_follows_email boolean DEFAULT false;
