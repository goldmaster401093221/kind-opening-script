-- Create calls table for video calling
CREATE TABLE public.calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_id UUID NOT NULL,
  callee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'calling' CHECK (status IN ('calling', 'ringing', 'connected', 'ended', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Create policies for calls
CREATE POLICY "Users can view calls they are part of" 
ON public.calls 
FOR SELECT 
USING (auth.uid() = caller_id OR auth.uid() = callee_id);

CREATE POLICY "Users can create calls they initiate" 
ON public.calls 
FOR INSERT 
WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Users can update calls they are part of" 
ON public.calls 
FOR UPDATE 
USING (auth.uid() = caller_id OR auth.uid() = callee_id);

-- Enable realtime for calls table
ALTER TABLE public.calls REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;