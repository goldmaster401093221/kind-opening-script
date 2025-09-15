-- Update RLS policies for data_center_files to restrict access to collaborators only

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view files" ON public.data_center_files;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.data_center_comments;

-- Create new restrictive policy for viewing files
CREATE POLICY "Users can view their own files and collaborators' files" 
ON public.data_center_files 
FOR SELECT 
USING (
  -- Users can see their own files
  auth.uid() = uploader_id 
  OR 
  -- Users can see files from people they have collaborated with
  EXISTS (
    SELECT 1 
    FROM public.collaborations 
    WHERE 
      (
        (requester_id = auth.uid() AND collaborator_id = uploader_id) 
        OR 
        (collaborator_id = auth.uid() AND requester_id = uploader_id)
      )
      AND status = 'collaborated'
  )
);

-- Create new restrictive policy for viewing comments
CREATE POLICY "Users can view comments on accessible files" 
ON public.data_center_comments 
FOR SELECT 
USING (
  -- Users can see comments on files they have access to
  EXISTS (
    SELECT 1 
    FROM public.data_center_files 
    WHERE 
      data_center_files.id = data_center_comments.file_id 
      AND (
        -- Own files
        auth.uid() = data_center_files.uploader_id 
        OR 
        -- Collaborator files
        EXISTS (
          SELECT 1 
          FROM public.collaborations 
          WHERE 
            (
              (requester_id = auth.uid() AND collaborator_id = data_center_files.uploader_id) 
              OR 
              (collaborator_id = auth.uid() AND requester_id = data_center_files.uploader_id)
            )
            AND status = 'collaborated'
        )
      )
  )
);