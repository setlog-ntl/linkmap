-- Migration 109: 사용자 소스 배포 지원 (내 자료 배포 — 트랙 A 업로드 / 트랙 B repo 연결)
--
-- 기획: docs/planning/2026-08-01_oneclick-user-content-deploy.md
-- 1) homepage_deploys.template_id NULL 허용 + source_type('template'|'upload'|'import') 추가.
--    정합성 CHECK: template 소스만 template_id를 가진다 (sentinel 템플릿 기각 — 카탈로그/쇼케이스 오염 방지).
-- 2) create_homepage_deploy_atomic 재생성:
--    - p_source_type TEXT DEFAULT 'template' 인자 추가. DEFAULT 인자는 구 6-인자 시그니처와
--      오버로드 모호성을 만들므로 반드시 DROP 후 재생성 (CREATE OR REPLACE만으로는 불가).
--    - 본문은 **M101 최신본** 기반: M099(::subscription_plan 캐스트) + M100(admin 바이패스)
--      + M101(status IN ('active','trialing')). 하나라도 빠뜨리면 이미 고쳐진 사고가 재발한다
--      (098 기반 → enum 비교 500 / 100 기반 → trial 중인 Pro·Team이 free 한도 3으로 차단).
--      107·108은 본문이 아닌 권한만 변경했으므로 M101이 본문의 최신 기준이다.
--    - M108 default privileges로 신규 함수는 기본 무권한 → GRANT 명시 필수.

-- 1) 스키마 확장
ALTER TABLE homepage_deploys ALTER COLUMN template_id DROP NOT NULL;

ALTER TABLE homepage_deploys ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'template';

ALTER TABLE homepage_deploys DROP CONSTRAINT IF EXISTS homepage_deploys_source_type_check;
ALTER TABLE homepage_deploys ADD CONSTRAINT homepage_deploys_source_type_check
  CHECK (source_type IN ('template', 'upload', 'import'));

-- 기존 행은 전부 template_id 보유 → source_type 기본값 'template'과 정합 (기존 데이터 호환 확인됨)
ALTER TABLE homepage_deploys DROP CONSTRAINT IF EXISTS homepage_deploys_source_template_consistency;
ALTER TABLE homepage_deploys ADD CONSTRAINT homepage_deploys_source_template_consistency
  CHECK ((source_type = 'template') = (template_id IS NOT NULL));

-- 2) RPC 재생성 (구 시그니처 제거 → 오버로드 모호성 방지)
DROP FUNCTION IF EXISTS create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION create_homepage_deploy_atomic(
  p_project_id            UUID,
  p_template_id           UUID,
  p_site_name             TEXT,
  p_forked_repo_full_name TEXT,
  p_forked_repo_url       TEXT,
  p_pages_url             TEXT,
  p_source_type           TEXT DEFAULT 'template'
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

  IF p_source_type NOT IN ('template', 'upload', 'import') THEN
    RAISE EXCEPTION 'invalid source_type' USING ERRCODE = '22023';
  END IF;

  -- 테이블 CHECK와 동일 조건의 선검증 — 제약 위반 대신 명확한 오류로 반환
  IF (p_source_type = 'template') <> (p_template_id IS NOT NULL) THEN
    RAISE EXCEPTION 'source_type/template_id mismatch' USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id AND user_id = v_user_id) THEN
    RAISE EXCEPTION 'project not owned by caller' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text), 1);

  -- 관리자 무제한 바이패스 (M100 — quota.ts getUserQuota와 동일 정책)
  SELECT is_admin INTO v_is_admin FROM profiles WHERE id = v_user_id;

  IF NOT COALESCE(v_is_admin, false) THEN
    -- M101: trialing 포함 (앱 레벨 quota.ts의 .in('status', ['active','trialing'])와 정렬)
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
    fork_status, deploy_status, deploy_method, pages_url, pages_status,
    source_type
  )
  VALUES (
    v_user_id, p_project_id, p_template_id, p_site_name,
    p_forked_repo_full_name, p_forked_repo_url,
    'forked', 'building', 'github_pages', p_pages_url, 'enabling',
    p_source_type
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('allowed', true, 'current', v_current + 1, 'max', v_max, 'deploy_id', v_id);
END;
$$;

-- M108 default privileges가 PUBLIC EXECUTE를 이미 차단하나, 명시 회수+부여로 의도를 문서화
REVOKE EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION create_homepage_deploy_atomic(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
