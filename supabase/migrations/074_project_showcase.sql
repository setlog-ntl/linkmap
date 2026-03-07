-- Add showcase fields to projects table (for non-oneclick projects)
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS is_showcase BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS showcase_description TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS showcase_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS showcase_category TEXT DEFAULT NULL;

-- CHECK constraint (idempotent)
DO $$ BEGIN
  ALTER TABLE projects
    ADD CONSTRAINT chk_project_showcase_category
    CHECK (showcase_category IS NULL OR showcase_category IN (
      'portfolio', 'business', 'blog', 'landing', 'community', 'ecommerce', 'other'
    ));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Index for public showcase queries
CREATE INDEX IF NOT EXISTS idx_projects_showcase
  ON projects (is_showcase, created_at DESC)
  WHERE is_showcase = true;

-- RLS: anyone can read showcase projects
DO $$ BEGIN
  CREATE POLICY "Anyone can view showcase projects"
    ON projects FOR SELECT
    USING (is_showcase = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
