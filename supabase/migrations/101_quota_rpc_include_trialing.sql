-- Migration 101: 쿼터 RPC의 구독 상태 필터에 'trialing' 포함 (앱 레벨 quota.ts와 정렬)
--
-- 원인: 098~100의 PL/pgSQL 쿼터 함수는 subscriptions.status = 'active'만 조회하지만,
-- 앱 레벨 quota.ts(getUserPlan/getUserQuota/checkHomepageDeployQuota 등)는
-- .in('status', ['active', 'trialing'])로 trialing 구독도 인정한다.
-- → trial 중인 Pro/Team 사용자가 원클릭 배포 원자적 RPC(create_homepage_deploy_atomic)
--   경로에서는 plan이 'free'로 떨어져 배포 한도가 3개로 잘못 적용될 수 있었다.
--   (사전 체크 quota.ts는 10/50을 인정 → RPC만 3으로 차단 → 불일치)
--
-- 수정: 세 쿼터 함수 모두 status = 'active' → status IN ('active','trialing')로 정렬.
-- 그 외 시그니처·관리자 바이패스(100)·enum 캐스트(099)·advisory lock·권한은 모두 기존과 동일하게 유지.
-- (기존 마이그레이션 수정 금지 규칙에 따라 새 파일로 CREATE OR REPLACE)

-- 1) create_homepage_deploy_atomic — 100의 관리자 바이패스 버전 기반 + trialing 포함
CREATE OR REPLACE FUNCTION create_homepage_deploy_atomic(
  p_project_id            UUID,
  p_template_id           UUID,
  p_site_name             TEXT,
  p_forked_repo_full_name TEXT,
  p_forked_repo_url       TEXT,
  p_pages_url             TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id  UUID := auth.uid();
  v_is_admin BOOLEAN := false;
  v_plan     TEXT := 'free';
  v_max      INT  := 999999;
  v_current  INT;
  v_id       UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'project not owned by caller' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text), 1);

  -- 관리자 무제한 바이패스 (quota.ts getUserQuota와 동일 정책)
  SELECT is_admin INTO v_is_admin FROM profiles WHERE id = v_user_id;

  IF NOT COALESCE(v_is_admin, false) THEN
    SELECT plan INTO v_plan
    FROM subscriptions
    WHERE user_id = v_user_id AND status IN ('active', 'trialing')
    LIMIT 1;

    SELECT max_homepage_deploys INTO v_max
    FROM plan_quotas
    WHERE plan = COALESCE(v_plan, 'free')::subscription_plan
    LIMIT 1;

    IF v_max IS NULL THEN
      v_max := 999999;
    END IF;
  END IF;

  SELECT COUNT(*) INTO v_current
  FROM homepage_deploys
  WHERE user_id = v_user_id;

  IF v_current >= v_max THEN
    RETURN jsonb_build_object('allowed', false, 'current', v_current, 'max', v_max);
  END IF;

  INSERT INTO homepage_deploys (
    user_id, project_id, template_id, site_name,
    forked_repo_full_name, forked_repo_url,
    fork_status, deploy_status, deploy_method, pages_url, pages_status
  )
  VALUES (
    v_user_id, p_project_id, p_template_id, p_site_name,
    p_forked_repo_full_name, p_forked_repo_url,
    'forked', 'building', 'github_pages', p_pages_url, 'enabling'
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('allowed', true, 'current', v_current + 1, 'max', v_max, 'deploy_id', v_id);
END;
$$;

-- 2) check_homepage_deploy_quota — 099 기반 + trialing 포함
CREATE OR REPLACE FUNCTION check_homepage_deploy_quota(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan        TEXT := 'free';
  v_max_deploys INT  := 999999;
  v_current     INT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text), 1);

  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = p_user_id AND status IN ('active', 'trialing')
  LIMIT 1;

  SELECT max_homepage_deploys INTO v_max_deploys
  FROM plan_quotas
  WHERE plan = COALESCE(v_plan, 'free')::subscription_plan
  LIMIT 1;

  IF v_max_deploys IS NULL THEN
    v_max_deploys := 999999;
  END IF;

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

-- 3) check_project_quota — 099 기반 + trialing 포함
CREATE OR REPLACE FUNCTION check_project_quota(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan     TEXT := 'free';
  v_max_proj INT  := 999999;
  v_current  INT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text), 2);

  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = p_user_id AND status IN ('active', 'trialing')
  LIMIT 1;

  SELECT max_projects INTO v_max_proj
  FROM plan_quotas
  WHERE plan = COALESCE(v_plan, 'free')::subscription_plan
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

-- 권한 재부여 (CREATE OR REPLACE는 기존 GRANT를 유지하지만 명시적으로 보강)
REVOKE EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT  EXECUTE ON FUNCTION check_homepage_deploy_quota(UUID) TO authenticated;
GRANT  EXECUTE ON FUNCTION check_project_quota(UUID)         TO authenticated;
