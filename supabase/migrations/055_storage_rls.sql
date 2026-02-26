-- Migration 055: Comprehensive storage RLS for project-icons bucket
-- Migration 041 fixed the core vulnerability. This migration ensures
-- all policies are idempotent and adds any residual gaps.

-- Drop all existing project-icons policies to reset to known-good state
DROP POLICY IF EXISTS "Project icons are publicly readable"    ON storage.objects;
DROP POLICY IF EXISTS "Users can upload project icons"         ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own project icons"     ON storage.objects;
DROP POLICY IF EXISTS "Users can update own project icons"     ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own project icons"     ON storage.objects;
DROP POLICY IF EXISTS "Users can delete project icons"         ON storage.objects;

-- SELECT: public read (no auth required)
CREATE POLICY "project_icons_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-icons');

-- INSERT: authenticated users may only write to their own folder ({user_id}/*)
CREATE POLICY "project_icons_owner_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-icons'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE: support upsert (re-upload), scoped to own folder
CREATE POLICY "project_icons_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-icons'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'project-icons'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: only own icons
CREATE POLICY "project_icons_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-icons'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
