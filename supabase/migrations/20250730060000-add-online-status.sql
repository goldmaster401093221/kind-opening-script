-- Add online status fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_online BOOLEAN DEFAULT false,
ADD COLUMN last_seen TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for better performance on online status queries
CREATE INDEX idx_profiles_is_online ON public.profiles(is_online);
CREATE INDEX idx_profiles_last_seen ON public.profiles(last_seen);

-- Create function to update user's online status
CREATE OR REPLACE FUNCTION public.update_user_online_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update the user's online status and last seen timestamp
  UPDATE public.profiles 
  SET 
    is_online = true,
    last_seen = now(),
    updated_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create function to mark user as offline when they sign out
CREATE OR REPLACE FUNCTION public.mark_user_offline(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    is_online = false,
    last_seen = now(),
    updated_at = now()
  WHERE id = user_id;
END;
$$;

-- Enable realtime for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add profiles table to realtime publication (only if not already added)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'profiles'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    END IF;
END $$; 