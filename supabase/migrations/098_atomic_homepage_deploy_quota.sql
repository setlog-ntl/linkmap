-- Migration 098: 홈페이지 배포 생성의 원자적 쿼터 강제 (race condition 제거)
--
-- 052의 check_homepage_deploy_quota는 count-only라, 애플리케이션에서 "check → (GitHub 작업) → INSERT"
-- 사이에 advisory lock이 이미 해제되어, 동시 배포(멀티탭/직접 API) 시 두 요청이 모두 통과 후 INSERT하면
-- 한도를 초과할 수 있었다.
--
-- 이 함수는 advisory lock을 잡은 "같은 트랜잭션" 안에서 count와 INSERT를 함께 수행 → 진짜 check-and-insert
-- 원자성을 보장한다. (052의 deploy quota와 동일한 advisory key: hashtext(user)::int, 1)
--
-- SECURITY DEFINER + auth.uid() 사용으로 호출자 위조를 방지하고, 배포 row가 가리킬 프로젝트의 소유권을 검증한다.

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

  -- 배포 row가 가리킬 프로젝트가 호출자 소유인지 검증 (SECURITY DEFINER가 RLS를 우회하므로 명시 확인)
  IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'project not owned by caller' USING ERRCODE = '42501';
  END IF;

  -- per-user advisory lock (트랜잭션 종료 시 해제). key2=1 → 052의 deploy quota와 동일 키로 직렬화.
  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text), 1);

  SELECT plan INTO v_plan
  FROM subscriptions
  WHERE user_id = v_user_id AND status = 'active'
  LIMIT 1;

  SELECT max_homepage_deploys INTO v_max
  FROM plan_quotas
  WHERE plan = COALESCE(v_plan, 'free')
  LIMIT 1;

  IF v_max IS NULL THEN
    v_max := 999999;
  END IF;

  -- advisory lock 하에서 count → 동시 요청 직렬화
  SELECT COUNT(*) INTO v_current
  FROM homepage_deploys
  WHERE user_id = v_user_id;

  IF v_current >= v_max THEN
    RETURN jsonb_build_object('allowed', false, 'current', v_current, 'max', v_max);
  END IF;

  -- 같은 트랜잭션(lock 유지) 안에서 INSERT → check-and-insert 원자성 확보
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

-- RLS는 SECURITY DEFINER가 우회하나, 함수 내부에서 auth.uid()/소유권으로 방어. authenticated에 실행 권한 부여.
-- 기본 PUBLIC 부여(+Supabase의 anon 직접 grant)를 회수하고 authenticated에만 EXECUTE 부여.
-- (함수 내부 auth.uid() 가드와 더불어 defense-in-depth — anon은 호출 자체 불가)
REVOKE EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT) TO authenticated;
