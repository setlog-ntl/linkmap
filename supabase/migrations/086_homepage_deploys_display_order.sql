-- homepage_deploys에 display_order 컬럼 추가 (사이드바 순서 변경용)
ALTER TABLE homepage_deploys
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

-- 기존 데이터: created_at 역순으로 초기 순서 부여
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) - 1 AS rn
  FROM homepage_deploys
)
UPDATE homepage_deploys
SET display_order = ranked.rn
FROM ranked
WHERE homepage_deploys.id = ranked.id;
