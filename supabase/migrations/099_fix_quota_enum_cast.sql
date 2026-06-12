-- Migration 099: 쿼터 함수의 enum 비교 타입 오류 수정 (프로덕션 배포 500 핫픽스)
--
-- 원인: plan_quotas.plan / subscriptions.plan 은 subscription_plan ENUM(004)인데,
-- 052·098의 PL/pgSQL 함수에서 v_plan TEXT 변수와 COALESCE(v_plan, 'free')로 비교
-- → COALESCE가 TEXT 타입을 강제 → "operator does not exist: subscription_plan = text".
--
-- 영향:
--  - 098 create_homepage_deploy_atomic: 원클릭 배포 크리티컬 패스에서 호출 → 배포 전면 500
--    (2026-06-12 E2E 흐름 테스트 Case B에서 발견: docs/e2e-flows/2026-06-12-oneclick-deploy/)
--  - 052 check_homepage_deploy_quota / check_project_quota: 동일 잠재 버그 (호출 경로에선
--    quota.ts가 RPC 대신 PostgREST 직접 쿼리를 사용 중이라 표면화되지 않았음 — 함께 수정)
--
-- 수정: 비교 시 ::subscription_plan 명시 캐스트. 함수 본문 외 시그니처·권한은 기존과 동일하게 재생성.

-- 1) 098 함수 수정
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
  v_user_id UUID := auth.uid();
  v_plan    TEXT := 'free';
  v_max     INT  := 999999;
  v_current INT;
  v_id      UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'project not owned by caller' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text), 1);

  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = v_user_id AND status = 'active'
  LIMIT 1;

  SELECT max_homepage_deploys INTO v_max
  FROM plan_quotas
  WHERE plan = COALESCE(v_plan, 'free')::subscription_plan
  LIMIT 1;

  IF v_max IS NULL THEN
    v_max := 999999;
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

-- 2) 052 함수 수정 (동일 잠재 버그)
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
  WHERE user_id = p_user_id AND status = 'active'
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
  WHERE user_id = p_user_id AND status = 'active'
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
