-- Fix security warnings by properly recreating functions with search_path

-- Drop the trigger first
DROP TRIGGER IF EXISTS update_collaboration_count_trigger ON public.collaborations;

-- Drop and recreate update_collaboration_count function with security definer and search_path
DROP FUNCTION IF EXISTS public.update_collaboration_count();

CREATE OR REPLACE FUNCTION public.update_collaboration_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Recreate the trigger
CREATE TRIGGER update_collaboration_count_trigger
AFTER INSERT OR UPDATE ON public.collaborations
FOR EACH ROW
EXECUTE FUNCTION public.update_collaboration_count();

-- Drop and recreate calculate_match_score function with proper search_path
DROP FUNCTION IF EXISTS public.calculate_match_score(UUID, UUID);

CREATE OR REPLACE FUNCTION public.calculate_match_score(user1_id UUID, user2_id UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;