-- Migration 041: Fix Storage RLS for project-icons bucket
-- Problem: INSERT/DELETE policies only check auth.uid() IS NOT NULL
--          → any authenticated user can overwrite/delete other users' icons
--          UPDATE policy missing → upsert fails on re-upload
-- Fix: Scope all write policies to user's own folder path

-- 1. Drop vulnerable policies
DROP POLICY IF EXISTS "Users can upload project icons" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own project icons" ON storage.objects;

-- 2. INSERT: only allow uploads to own user folder
CREATE POLICY "Users can upload own project icons"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-icons'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. UPDATE: support upsert (re-upload), scoped to own folder
CREATE POLICY "Users can update own project icons"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-icons'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. DELETE: only allow deleting own icons
CREATE POLICY "Users can delete own project icons"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-icons'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT policy "Project icons are publicly readable" remains unchanged
