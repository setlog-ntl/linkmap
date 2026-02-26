-- Migration 050: Ensure ai_feature_qna FK constraint exists
-- The FK was defined inline in migration 040's CREATE TABLE.
-- This migration adds the constraint only if somehow missing,
-- making it safe to run on any DB state.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ai_feature_qna_feature_slug_fkey'
      AND conrelid = 'ai_feature_qna'::regclass
  ) THEN
    ALTER TABLE ai_feature_qna
      ADD CONSTRAINT ai_feature_qna_feature_slug_fkey
      FOREIGN KEY (feature_slug)
      REFERENCES ai_feature_personas(feature_slug)
      ON DELETE CASCADE;
  END IF;
END $$;

-- Also add sort_order index for ordered queries if missing
CREATE INDEX IF NOT EXISTS idx_ai_feature_qna_sort
  ON ai_feature_qna(feature_slug, sort_order);
