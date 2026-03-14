-- 080: Polar 결제 통합 - subscriptions 테이블에 Polar 필드 추가
-- Stripe → Polar 마이그레이션을 위해 기존 Stripe 컬럼은 유지하고 Polar 컬럼 추가

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS polar_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS polar_subscription_id TEXT UNIQUE;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_customer
  ON subscriptions (polar_customer_id) WHERE polar_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_polar_subscription
  ON subscriptions (polar_subscription_id) WHERE polar_subscription_id IS NOT NULL;

-- 결제 제공자 구분 컬럼 추가 (향후 다중 결제 지원 시 활용)
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS payment_provider TEXT DEFAULT 'none'
  CHECK (payment_provider IN ('none', 'stripe', 'polar'));
