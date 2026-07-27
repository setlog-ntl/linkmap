-- 108: 함수 EXECUTE의 PUBLIC 기본 권한 회수 (2026-07-20)
--
-- 🔴 배경 — 102·107의 REVOKE가 실효가 없었다:
--   PostgreSQL은 함수 생성 시 EXECUTE를 **PUBLIC에 기본 부여**한다(ACL의 `=X/owner`).
--   `REVOKE EXECUTE ... FROM anon, authenticated`는 두 롤의 *직접* GRANT만 제거하므로
--   PUBLIC 경유 권한이 그대로 남아 `has_function_privilege('anon', …, 'EXECUTE')`는 여전히 true다.
--   실측 결과 public 스키마 함수 24개 중 23개가 PUBLIC EXECUTE를 보유하고 있었고
--   (유일한 예외는 create_homepage_deploy_atomic), 102가 "차단했다"고 기록한 트리거 함수
--   handle_new_user 등도 anon이 /rest/v1/rpc로 호출 가능한 상태였다.
-- 조치: PUBLIC에서 회수하고, 실제로 필요한 롤에만 명시적으로 GRANT한다.
--
-- ⚠️ 트리거 함수(handle_new_user·prevent_is_admin_self_update·set_updated_at 등 10종)는
--    **대상에서 의도적으로 제외**한다. advisor가 WARN을 내지만 PostgreSQL이 트리거 함수의
--    직접 호출 자체를 차단하므로(`trigger functions can only be called as triggers` —
--    라이브에서 실증 확인) RPC 노출은 실질 악용이 불가능하다. 반면 이들의 권한을 건드리면
--    가입 흐름(handle_new_user)·is_admin 자가변경 차단(prevent_is_admin_self_update) 같은
--    핵심 경로를 깨뜨릴 위험만 남는다. 얻는 것 없이 리스크만 지는 변경은 하지 않는다.
-- ⚠️ 반대로 **RLS 정책 본문이 호출하는 함수는 EXECUTE 권한이 필요**하다.
--    get_user_team_ids / get_user_admin_team_ids / get_user_editor_team_ids는
--    projects·teams·team_members·environment_variables·project_services·health_checks·
--    user_connections·user_checklist_progress의 RLS에 걸려 있어 회수 시 전면 장애가 난다 → GRANT 유지.

-- ============================================================
-- A. 공개 호출이 필요한 함수 — PUBLIC 회수 후 필요한 롤에만 재부여
-- ============================================================

-- 비로그인 방문자의 지난달 쇼케이스 조회에서 lazy 선정이 일어난다(107에서 기간 조작은 차단됨)
REVOKE EXECUTE ON FUNCTION public.auto_pick_monthly_showcase(text, timestamptz, timestamptz) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.auto_pick_monthly_showcase(text, timestamptz, timestamptz) TO anon, authenticated;

-- 비로그인 조회수 기록 경로(105에서 delta는 ±1로 클램프됨)
REVOKE EXECUTE ON FUNCTION public.increment_showcase_counter(text, uuid, text, integer) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.increment_showcase_counter(text, uuid, text, integer) TO anon, authenticated;

-- RLS 정책 내부에서 호출됨 — 회수 금지 대상
REVOKE EXECUTE ON FUNCTION public.get_user_team_ids()        FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_user_team_ids()        TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_admin_team_ids()  FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_user_admin_team_ids()  TO anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_editor_team_ids() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_user_editor_team_ids() TO anon, authenticated;

-- 로그인 대시보드에서만 호출
REVOKE EXECUTE ON FUNCTION public.increment_template_downloads(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.increment_template_downloads(uuid) TO authenticated;

-- ============================================================
-- B. 공개 롤이 호출할 이유가 없는 함수 — PUBLIC 회수(재부여 없음)
--    service_role·postgres는 각 함수에 명시 GRANT를 이미 보유하므로 영향 없다.
-- ============================================================

-- 코드 호출부 0건 (107 참조)
REVOKE EXECUTE ON FUNCTION public.get_visitor_stats(integer)        FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_visitor_daily_trend(integer)  FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_top_pages(integer, integer)   FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_project_quota(uuid)         FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_homepage_deploy_quota(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_oauth_states()    FROM PUBLIC;

-- service_role 전용 (deploy-error-logger.ts)
REVOKE EXECUTE ON FUNCTION public.upsert_deploy_error_pattern(text, text, text, text) FROM PUBLIC;

-- 트리거 함수 10종은 위 헤더의 근거대로 제외한다.

-- ============================================================
-- C. 향후 생성 함수의 기본 PUBLIC 부여 차단
--    이 설정이 없으면 새 마이그레이션이 함수를 만들 때마다 같은 문제가 재발한다.
--    ⚠️ 이후 anon/authenticated가 호출해야 하는 RPC를 새로 만들 때는
--       `GRANT EXECUTE ... TO anon, authenticated`를 **명시**해야 한다(암묵 부여 없음).
-- ============================================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
