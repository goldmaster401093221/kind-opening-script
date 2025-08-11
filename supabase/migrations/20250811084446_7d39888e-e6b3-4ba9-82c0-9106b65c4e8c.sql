-- Allow collaborators (receivers) to update collaboration records they are part of (e.g., accept/reject)
CREATE POLICY "Collaborators can update their received requests"
ON public.collaborations
FOR UPDATE
USING (auth.uid() = collaborator_id);