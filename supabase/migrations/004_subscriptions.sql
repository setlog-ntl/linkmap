-- Subscription plans and quota management

CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team');

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Plan quotas
CREATE TABLE IF NOT EXISTS plan_quotas (
  plan subscription_plan PRIMARY KEY,
  max_projects INT NOT NULL,
  max_env_vars_per_project INT NOT NULL,
  max_services_per_project INT NOT NULL,
  max_team_members INT NOT NULL DEFAULT 0
);

-- Insert default quotas
INSERT INTO plan_quotas (plan, max_projects, max_env_vars_per_project, max_services_per_project, max_team_members) VALUES
  ('free', 3, 20, 10, 0),
  ('pro', 20, 100, 50, 0),
  ('team', 100, 500, 100, 25)
ON CONFLICT (plan) DO NOTHING;

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_customer_id);
