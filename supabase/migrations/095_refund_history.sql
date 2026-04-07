-- 095: 환불 이력 테이블 + subscriptions.canceled_at 컬럼 추가

-- 1. refund_history 테이블
CREATE TABLE refund_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  polar_subscription_id TEXT,
  polar_order_id TEXT,
  polar_refund_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  reason TEXT NOT NULL DEFAULT 'customer_request'
    CHECK (reason IN ('customer_request', 'satisfaction_guarantee', 'duplicate', 'fraudulent', 'other')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ,
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 인덱스
CREATE INDEX idx_refund_history_user_id ON refund_history(user_id);
CREATE INDEX idx_refund_history_polar_subscription_id ON refund_history(polar_subscription_id);
CREATE INDEX idx_refund_history_status ON refund_history(status);

-- 3. RLS
ALTER TABLE refund_history ENABLE ROW LEVEL SECURITY;

-- service_role: ALL
CREATE POLICY "service_role_all" ON refund_history
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- authenticated: SELECT own records
CREATE POLICY "authenticated_select_own" ON refund_history
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 4. subscriptions 테이블에 canceled_at 컬럼 추가
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ;
