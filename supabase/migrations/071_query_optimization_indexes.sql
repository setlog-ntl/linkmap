-- Migration 071: DB 인덱싱 & 쿼리 최적화 고도화
-- CTO Review: 전체 DB 구조 점검 결과 반영
-- 목적: 누락 인덱스 추가, CHECK 제약 보강, 데이터 무결성 강화

-- ============================================================
-- 1. HIGH PRIORITY 인덱스 추가 (쿼리 성능 직접 영향)
-- ============================================================

-- 1-1. project_services: 상태 필터링 (대시보드, 동기화에서 빈번 사용)
CREATE INDEX IF NOT EXISTS idx_project_services_status
  ON project_services(project_id, status);

-- 1-2. project_services: service_id 단독 인덱스 (JOIN 최적화)
--      project_id는 있지만 service_id 단독은 없음
CREATE INDEX IF NOT EXISTS idx_project_services_service
  ON project_services(service_id);

-- 1-3. environment_variables: 서비스별+환경별 조회 (env/sync에서 빈번)
CREATE INDEX IF NOT EXISTS idx_env_vars_service_env
  ON environment_variables(service_id, environment)
  WHERE service_id IS NOT NULL AND deleted_at IS NULL;

-- 1-4. service_accounts: 사용자별 활성 계정 조회
CREATE INDEX IF NOT EXISTS idx_service_accounts_user_status
  ON service_accounts(user_id, status)
  WHERE status = 'active';

-- 1-5. audit_logs: 사용자별 시간순 조회 (감사 이력 페이지)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time
  ON audit_logs(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- 1-6. team_members: 팀+사용자 복합 (RLS 정책에서 빈번한 JOIN)
CREATE INDEX IF NOT EXISTS idx_team_members_team_user
  ON team_members(team_id, user_id);

-- 1-7. homepage_deploys: 사용자별 최신 배포 조회
CREATE INDEX IF NOT EXISTS idx_homepage_deploys_user_time
  ON homepage_deploys(user_id, created_at DESC);

-- 1-8. homepage_deploys: 템플릿별 배포 이력
CREATE INDEX IF NOT EXISTS idx_homepage_deploys_template
  ON homepage_deploys(template_id, created_at DESC);

-- ============================================================
-- 2. MEDIUM PRIORITY 인덱스 (특정 기능 최적화)
-- ============================================================

-- 2-1. user_connections: 프로젝트+타입 필터링 (서비스맵 렌더링)
CREATE INDEX IF NOT EXISTS idx_user_connections_project_type
  ON user_connections(project_id, connection_type)
  WHERE deleted_at IS NULL;

-- 2-2. cost_attachments: 서비스별 최신순 조회
CREATE INDEX IF NOT EXISTS idx_cost_attachments_ps_time
  ON cost_attachments(project_service_id, created_at DESC);

-- 2-3. feature_requests: 카테고리+인기순 (피드백 리스트)
CREATE INDEX IF NOT EXISTS idx_feature_requests_category_votes
  ON feature_requests(category, vote_count DESC);

-- 2-4. visitor_logs: 날짜 범위 + 페이지 경로 (관리자 통계)
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_path
  ON visitor_logs(created_at DESC, page_path);

-- 2-5. oauth_states: 사용자별 만료 시간 조회 (토큰 검증/정리)
CREATE INDEX IF NOT EXISTS idx_oauth_states_user_expires
  ON oauth_states(user_id, expires_at DESC);

-- 2-6. projects: soft-delete 필터 + 사용자 + 정렬 (메인 목록)
CREATE INDEX IF NOT EXISTS idx_projects_user_active
  ON projects(user_id, updated_at DESC)
  WHERE deleted_at IS NULL;

-- ============================================================
-- 3. CHECK 제약조건 보강 (Zod <-> DB 동기화)
-- ============================================================

-- 3-1. health_checks.environment: DB에 CHECK 누락 (Zod에만 있음)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'health_checks_environment_check'
  ) THEN
    ALTER TABLE health_checks
      ADD CONSTRAINT health_checks_environment_check
      CHECK (environment IN ('development', 'staging', 'production'));
  END IF;
END $$;

-- 3-2. user_connections: source != target 검증 (Zod에만 있음)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_connections_source_target_different'
  ) THEN
    ALTER TABLE user_connections
      ADD CONSTRAINT user_connections_source_target_different
      CHECK (source_service_id != target_service_id);
  END IF;
END $$;

-- 3-3. project_services: cost_tier_id와 custom_cost 상호배제
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'project_services_cost_tier_xor_custom'
  ) THEN
    ALTER TABLE project_services
      ADD CONSTRAINT project_services_cost_tier_xor_custom
      CHECK (
        (cost_tier_id IS NOT NULL AND custom_cost_monthly IS NULL)
        OR (cost_tier_id IS NULL)
      );
  END IF;
END $$;

-- 3-4. oauth_states.flow_context: 'settings' 값 추가 (M015에서 누락)
DO $$
BEGIN
  -- 기존 CHECK 제약 삭제 후 확장
  ALTER TABLE oauth_states DROP CONSTRAINT IF EXISTS oauth_states_flow_context_check;
  ALTER TABLE oauth_states
    ADD CONSTRAINT oauth_states_flow_context_check
    CHECK (flow_context IN ('oneclick', 'project', 'settings'));
EXCEPTION WHEN OTHERS THEN
  NULL; -- 이미 올바른 제약이면 무시
END $$;

-- ============================================================
-- 4. updated_at 트리거 통합 (3개 중복 함수 -> 1개)
-- ============================================================

-- 범용 updated_at 트리거 함수 (기존 함수들과 호환)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 기존 트리거는 유지하되 새 테이블에는 이 함수 사용
-- (기존 트리거 교체는 위험하므로 새 함수만 정의)

-- ============================================================
-- 5. visitor_logs 통계 집계용 DB 함수
--    (메모리 기반 집계 -> DB 레벨 집계로 전환)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_visitor_stats(
  p_days INTEGER DEFAULT 30
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_page_views', COALESCE(total_pv, 0),
    'unique_sessions', COALESCE(unique_sessions, 0),
    'unique_ips', COALESCE(unique_ips, 0),
    'avg_pages_per_session', COALESCE(avg_pages, 0)
  ) INTO result
  FROM (
    SELECT
      COUNT(*) AS total_pv,
      COUNT(DISTINCT session_id) AS unique_sessions,
      COUNT(DISTINCT ip_address) AS unique_ips,
      ROUND(COUNT(*)::numeric / NULLIF(COUNT(DISTINCT session_id), 0), 1) AS avg_pages
    FROM visitor_logs
    WHERE created_at >= now() - (p_days || ' days')::interval
  ) stats;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_visitor_stats TO authenticated;

-- 일별 방문자 추이 함수
CREATE OR REPLACE FUNCTION public.get_visitor_daily_trend(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  visit_date DATE,
  page_views BIGINT,
  unique_sessions BIGINT,
  unique_ips BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (vl.created_at AT TIME ZONE 'Asia/Seoul')::date AS visit_date,
    COUNT(*) AS page_views,
    COUNT(DISTINCT vl.session_id) AS unique_sessions,
    COUNT(DISTINCT vl.ip_address) AS unique_ips
  FROM visitor_logs vl
  WHERE vl.created_at >= now() - (p_days || ' days')::interval
  GROUP BY 1
  ORDER BY 1;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_visitor_daily_trend TO authenticated;

-- ============================================================
-- 6. 인기 페이지 통계 함수 (관리자 대시보드 최적화)
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_top_pages(
  p_days INTEGER DEFAULT 30,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE(
  page_path TEXT,
  view_count BIGINT,
  unique_visitors BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    vl.page_path,
    COUNT(*) AS view_count,
    COUNT(DISTINCT vl.session_id) AS unique_visitors
  FROM visitor_logs vl
  WHERE vl.created_at >= now() - (p_days || ' days')::interval
  GROUP BY vl.page_path
  ORDER BY view_count DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_top_pages TO authenticated;

-- ============================================================
-- 7. 만료된 OAuth 상태 자동 정리 함수
-- ============================================================

CREATE OR REPLACE FUNCTION public.cleanup_expired_oauth_states()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM oauth_states
  WHERE expires_at < now()
  RETURNING 1;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_oauth_states TO service_role;
