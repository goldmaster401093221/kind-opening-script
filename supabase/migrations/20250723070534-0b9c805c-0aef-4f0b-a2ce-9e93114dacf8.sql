-- Add collaboration-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS collaboration_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS what_i_have TEXT[],
ADD COLUMN IF NOT EXISTS what_i_need TEXT[];

-- Create collaborations table for tracking user interactions
CREATE TABLE public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  collaborator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('saved', 'contacted', 'collaborated', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, collaborator_id)
);

-- Enable RLS on collaborations table
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- Create policies for collaborations table
CREATE POLICY "Users can view their own collaboration records" 
ON public.collaborations 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = collaborator_id);

CREATE POLICY "Users can create collaboration records" 
ON public.collaborations 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their own collaboration records" 
ON public.collaborations 
FOR UPDATE 
USING (auth.uid() = requester_id);

-- Create function to update collaboration count
CREATE OR REPLACE FUNCTION public.update_collaboration_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update collaboration count for the collaborator
  UPDATE public.profiles 
  SET collaboration_count = (
    SELECT COUNT(*) 
    FROM public.collaborations 
    WHERE collaborator_id = NEW.collaborator_id 
    AND status = 'collaborated'
  )
  WHERE id = NEW.collaborator_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update collaboration count
CREATE TRIGGER update_collaboration_count_trigger
AFTER INSERT OR UPDATE ON public.collaborations
FOR EACH ROW
EXECUTE FUNCTION public.update_collaboration_count();

-- Add policy to allow all authenticated users to view public profile data (for discovery)
CREATE POLICY "All authenticated users can view public profile data" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Create function to calculate match score (for future use)
CREATE OR REPLACE FUNCTION public.calculate_match_score(user1_id UUID, user2_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  common_keywords INTEGER;
  complementary_needs INTEGER;
BEGIN
  -- Calculate common keywords
  SELECT COUNT(*)
  INTO common_keywords
  FROM (
    SELECT unnest(p1.keywords) AS keyword
    FROM public.profiles p1 
    WHERE p1.id = user1_id
    INTERSECT
    SELECT unnest(p2.keywords) AS keyword
    FROM public.profiles p2 
    WHERE p2.id = user2_id
  ) AS common;
  
  score := score + (common_keywords * 10);
  
  -- Calculate complementary research needs
  SELECT COUNT(*)
  INTO complementary_needs
  FROM (
    SELECT unnest(p1.what_i_need) AS need
    FROM public.profiles p1 
    WHERE p1.id = user1_id
    INTERSECT
    SELECT unnest(p2.what_i_have) AS have
    FROM public.profiles p2 
    WHERE p2.id = user2_id
  ) AS complementary;
  
  score := score + (complementary_needs * 20);
  
  RETURN score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;