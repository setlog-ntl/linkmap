-- Migration 052: Atomic quota check functions using transaction-level advisory locks
-- Prevents race conditions in concurrent deploy/project creation flows.
-- Uses pg_advisory_xact_lock (transaction-level; safe with pgBouncer transaction mode).

CREATE OR REPLACE FUNCTION check_homepage_deploy_quota(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan       TEXT    := 'free';
  v_max_deploys INT    := 999999;
  v_current    INT;
BEGIN
  -- Acquire per-user advisory lock (released at transaction end).
  -- hashtext() returns int4; use two-arg form: (key1 int4, key2 int4)
  -- key2=1 distinguishes deploy quota from project quota (key2=2).
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text), 1);

  -- Get active plan
  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;

  -- Get quota limit for the plan
  SELECT max_homepage_deploys INTO v_max_deploys
  FROM plan_quotas
  WHERE plan = COALESCE(v_plan, 'free')
  LIMIT 1;

  -- Fallback when plan_quotas row is absent
  IF v_max_deploys IS NULL THEN
    v_max_deploys := 999999;
  END IF;

  -- Atomic count under the advisory lock
  SELECT COUNT(*) INTO v_current
  FROM homepage_deploys
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'allowed', v_current < v_max_deploys,
    'current', v_current,
    'max',     v_max_deploys
  );
END;
$$;

CREATE OR REPLACE FUNCTION check_project_quota(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan      TEXT := 'free';
  v_max_proj  INT  := 999999;
  v_current   INT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text), 2);

  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;

  SELECT max_projects INTO v_max_proj
  FROM plan_quotas
  WHERE plan = COALESCE(v_plan, 'free')
  LIMIT 1;

  IF v_max_proj IS NULL THEN
    v_max_proj := 999999;
  END IF;

  SELECT COUNT(*) INTO v_current
  FROM projects
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'allowed', v_current < v_max_proj,
    'current', v_current,
    'max',     v_max_proj
  );
END;
$$;

-- Grant execute to authenticated role (RLS still protects the underlying tables)
GRANT EXECUTE ON FUNCTION check_homepage_deploy_quota(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION check_project_quota(UUID)         TO authenticated;
