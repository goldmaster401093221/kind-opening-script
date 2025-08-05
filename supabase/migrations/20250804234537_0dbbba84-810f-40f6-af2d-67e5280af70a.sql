-- Create storage bucket for data center files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('data-center', 'data-center', true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create data_center_files table
CREATE TABLE public.data_center_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT NOT NULL,
  uploader_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  views INTEGER DEFAULT 0,
  description TEXT
);

-- Create data_center_comments table
CREATE TABLE public.data_center_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_id UUID NOT NULL REFERENCES public.data_center_files(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on data_center_files
ALTER TABLE public.data_center_files ENABLE ROW LEVEL SECURITY;

-- Create policies for data_center_files
CREATE POLICY "Anyone can view files" 
ON public.data_center_files 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can upload files" 
ON public.data_center_files 
FOR INSERT 
WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Users can update their own files" 
ON public.data_center_files 
FOR UPDATE 
USING (auth.uid() = uploader_id);

-- Enable RLS on data_center_comments
ALTER TABLE public.data_center_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for data_center_comments
CREATE POLICY "Anyone can view comments" 
ON public.data_center_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.data_center_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.data_center_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create storage policies for data-center bucket
CREATE POLICY "Anyone can view data center files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'data-center');

CREATE POLICY "Authenticated users can upload data center files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'data-center' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own data center files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'data-center' AND auth.uid() IS NOT NULL);

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_data_center_files_updated_at
BEFORE UPDATE ON public.data_center_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_center_comments_updated_at
BEFORE UPDATE ON public.data_center_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to increment file views
CREATE OR REPLACE FUNCTION public.increment_file_views(file_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.data_center_files 
  SET views = views + 1
  WHERE id = file_id;
END;
$function$;