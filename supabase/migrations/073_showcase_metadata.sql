-- Add showcase metadata columns to homepage_deploys
ALTER TABLE homepage_deploys
  ADD COLUMN IF NOT EXISTS showcase_description TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS showcase_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS showcase_category TEXT DEFAULT NULL;

-- CHECK constraint for showcase_category (idempotent)
DO $$ BEGIN
  ALTER TABLE homepage_deploys
    ADD CONSTRAINT chk_showcase_category
    CHECK (showcase_category IS NULL OR showcase_category IN (
      'portfolio', 'business', 'blog', 'landing', 'community', 'ecommerce', 'other'
    ));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_homepage_deploys_showcase_category
  ON homepage_deploys (showcase_category)
  WHERE is_showcase = true AND deploy_status = 'ready';

-- GIN index for tags search
CREATE INDEX IF NOT EXISTS idx_homepage_deploys_showcase_tags
  ON homepage_deploys USING GIN (showcase_tags)
  WHERE is_showcase = true AND deploy_status = 'ready';
