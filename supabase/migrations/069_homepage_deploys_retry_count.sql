-- Add retry_count column to homepage_deploys for tracking auto-retry attempts
ALTER TABLE homepage_deploys
  ADD COLUMN IF NOT EXISTS retry_count SMALLINT NOT NULL DEFAULT 0;

COMMENT ON COLUMN homepage_deploys.retry_count IS 'Number of automatic retry attempts for failed workflow deploys';
