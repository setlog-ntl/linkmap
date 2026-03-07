-- Add showcase flag to homepage_deploys
ALTER TABLE homepage_deploys
  ADD COLUMN IF NOT EXISTS is_showcase BOOLEAN NOT NULL DEFAULT false;

-- Index for public showcase queries
CREATE INDEX IF NOT EXISTS idx_homepage_deploys_showcase
  ON homepage_deploys (is_showcase, deploy_status, created_at DESC)
  WHERE is_showcase = true AND deploy_status = 'ready';

-- Allow anyone to read showcase deployments (public gallery)
CREATE POLICY "Anyone can view showcase deploys"
  ON homepage_deploys FOR SELECT
  USING (is_showcase = true AND deploy_status = 'ready');
