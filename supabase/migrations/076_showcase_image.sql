-- Migration 076: showcase_image_url column + showcase-images storage bucket
-- 쇼케이스 커스텀 이미지 지원

-- 1. homepage_deploys에 showcase_image_url 추가
ALTER TABLE homepage_deploys
  ADD COLUMN IF NOT EXISTS showcase_image_url TEXT;

-- 2. projects에 showcase_image_url 추가
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS showcase_image_url TEXT;

-- 3. showcase-images Storage bucket (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'showcase-images',
  'showcase-images',
  true,
  5242880,  -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage RLS policies

-- SELECT: public read
CREATE POLICY "showcase_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'showcase-images');

-- INSERT: authenticated, own folder only ({user_id}/*)
CREATE POLICY "showcase_images_owner_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'showcase-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE: own folder only
CREATE POLICY "showcase_images_owner_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'showcase-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'showcase-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE: own folder only
CREATE POLICY "showcase_images_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'showcase-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
