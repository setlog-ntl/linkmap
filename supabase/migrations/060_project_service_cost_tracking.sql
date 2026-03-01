-- ============================================
-- 060: 프로젝트별 서비스 비용 추적 및 예산 관리
-- ============================================

-- 1. project_services 테이블 확장
ALTER TABLE public.project_services
  ADD COLUMN IF NOT EXISTS cost_tier_id UUID REFERENCES public.service_cost_tiers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS custom_cost_monthly NUMERIC(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS custom_cost_yearly NUMERIC(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cost_notes TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly'
    CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time', 'usage_based'));

-- 2. projects 테이블 확장
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS monthly_budget NUMERIC(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS budget_currency TEXT DEFAULT 'USD'
    CHECK (budget_currency IN ('USD', 'KRW'));

-- 3. 비용 집계 뷰
CREATE OR REPLACE VIEW public.project_cost_summary AS
SELECT
  ps.project_id,
  COUNT(*) FILTER (
    WHERE ps.cost_tier_id IS NOT NULL OR ps.custom_cost_monthly IS NOT NULL
  ) AS priced_services,
  COUNT(*) AS total_services,
  COALESCE(SUM(
    CASE
      WHEN ps.custom_cost_monthly IS NOT NULL THEN ps.custom_cost_monthly
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

-- 4. 뷰 보안 설정 (SECURITY INVOKER)
ALTER VIEW public.project_cost_summary SET (security_invoker = on);

-- 5. 인덱스
CREATE INDEX IF NOT EXISTS idx_project_services_cost_tier
  ON public.project_services(cost_tier_id)
  WHERE cost_tier_id IS NOT NULL;
