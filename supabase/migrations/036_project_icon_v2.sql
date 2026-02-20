-- Migration: Project Icon V2
-- Expand icon support from brand-only to brand/emoji/custom

-- 1. Add new columns
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS icon_type TEXT CHECK (icon_type IN ('brand', 'emoji', 'custom')),
  ADD COLUMN IF NOT EXISTS icon_value TEXT;

COMMENT ON COLUMN public.projects.icon_type IS 'Icon type: brand (SERVICE_BRANDS slug), emoji (emoji character), custom (uploaded image URL)';
COMMENT ON COLUMN public.projects.icon_value IS 'Icon value: brand slug, emoji char, or public URL';

-- 2. Migrate existing icon_slug data
UPDATE public.projects
  SET icon_type = 'brand', icon_value = icon_slug
  WHERE icon_slug IS NOT NULL;

-- 3. Drop old column
ALTER TABLE public.projects DROP COLUMN IF EXISTS icon_slug;

-- 4. Storage bucket for custom icons
INSERT INTO storage.buckets (id, name, public)
  VALUES ('project-icons', 'project-icons', true)
  ON CONFLICT (id) DO NOTHING;

-- 5. Storage RLS policies
CREATE POLICY "Users can upload project icons"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-icons' AND auth.uid() IS NOT NULL);

CREATE POLICY "Project icons are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-icons');

CREATE POLICY "Users can delete own project icons"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-icons' AND auth.uid() IS NOT NULL);
