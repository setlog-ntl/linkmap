-- ============================================
-- 061: OpenAI 실제 사용량 기반 비용 반영
-- ============================================

-- 1. project_services에 실제 사용량 비용 컬럼 추가
ALTER TABLE public.project_services
  ADD COLUMN IF NOT EXISTS actual_cost_monthly NUMERIC(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS usage_synced_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.project_services.actual_cost_monthly IS
  'OpenAI 등 사용량 기반 서비스의 당월 실제 비용 (Usage API 동기화)';
COMMENT ON COLUMN public.project_services.usage_synced_at IS
  'actual_cost_monthly 마지막 동기화 시각';

-- 2. project_cost_summary 뷰 재생성 (actual_cost 우선 반영)
CREATE OR REPLACE VIEW public.project_cost_summary AS
SELECT
  ps.project_id,
  COUNT(*) FILTER (
    WHERE ps.cost_tier_id IS NOT NULL
       OR ps.custom_cost_monthly IS NOT NULL
       OR ps.actual_cost_monthly IS NOT NULL
  ) AS priced_services,
  COUNT(*) AS total_services,
  COALESCE(SUM(
    CASE
      -- actual_cost 최우선 (사용량 기반 동기화 값)
      WHEN ps.actual_cost_monthly IS NOT NULL THEN ps.actual_cost_monthly
      -- 그 다음 커스텀 입력
      WHEN ps.custom_cost_monthly IS NOT NULL THEN ps.custom_cost_monthly
      -- 마지막으로 요금제 단가
      WHEN sct.price_monthly ~ '^\$[\d,]+\.?\d*$' THEN
        CAST(REPLACE(REPLACE(sct.price_monthly, '$', ''), ',', '') AS NUMERIC)
      ELSE 0
    END
  ), 0) AS total_monthly_cost,
  p.monthly_budget,
  p.budget_currency
FROM public.project_services ps
LEFT JOIN public.service_cost_tiers sct ON sct.id = ps.cost_tier_id
JOIN public.projects p ON p.id = ps.project_id
GROUP BY ps.project_id, p.monthly_budget, p.budget_currency;

-- 3. 뷰 보안 설정
ALTER VIEW public.project_cost_summary SET (security_invoker = on);
