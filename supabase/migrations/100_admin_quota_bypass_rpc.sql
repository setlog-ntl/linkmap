-- Migration 100: create_homepage_deploy_atomic에 관리자 무제한 바이패스 추가
--
-- 원인: 앱 레벨 quota.ts getUserQuota()는 profiles.is_admin = true면 UNLIMITED_QUOTA를
-- 반환하지만(사전 체크 통과), 098/099의 RPC는 subscriptions→plan_quotas만 보므로
-- 관리자(구독 없음/canceled)가 free 한도(3)로 차단됨 — 403 QUOTA_EXCEEDED (43/3).
-- (2026-06-12 E2E 흐름 테스트 Case B에서 발견 — 099의 enum 캐스트 버그가 이 버그를 가리고 있었음)
--
-- 수정: RPC 시작부에서 profiles.is_admin 확인 → 관리자면 쿼터 검사 생략.
-- SECURITY DEFINER 함수 내부 조회라 사용자가 is_admin을 위조할 수 없음 (profiles.is_admin은
-- RLS로 보호되고 service_role로만 변경 가능).

CREATE OR REPLACE FUNCTION create_homepage_deploy_atomic(
  p_project_id            UUID,
  p_template_id           UUID,
  p_site_name             TEXT,
  p_forked_repo_full_name TEXT,
  p_forked_repo_url       TEXT,
  p_pages_url              TEXT
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
    WHERE user_id = v_user_id AND status = 'active'
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

REVOKE EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
