-- Add collaboration request fields
ALTER TABLE public.collaborations
  ADD COLUMN IF NOT EXISTS start_date date,
  ADD COLUMN IF NOT EXISTS end_date date,
  ADD COLUMN IF NOT EXISTS terms text[] DEFAULT '{}'::text[];

-- Ensure updated_at auto-updates on changes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_collaborations_updated_at'
  ) THEN
    CREATE TRIGGER update_collaborations_updated_at
    BEFORE UPDATE ON public.collaborations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Helpful index for receiver's pending requests
CREATE INDEX IF NOT EXISTS idx_collaborations_collaborator_status
  ON public.collaborations (collaborator_id, status);
