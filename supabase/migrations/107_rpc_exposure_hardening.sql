-- 107: SECURITY DEFINER RPC 노출 최소화 (2026-07-20 advisor 실측 후속)
--
-- 배경: 102가 트리거 함수 8종의 EXECUTE를 회수했지만, SECURITY DEFINER RPC 중
--       앱이 호출하지 않는데도 anon/authenticated에 열려 있는 함수가 남아 있었다.
--       SECURITY DEFINER는 RLS를 우회하므로 PostgREST /rest/v1/rpc 직격이 곧 인가 우회다.
--
-- 코드 전수 검색(src/, packages/) 결과 실제 호출되는 RPC는 5종뿐:
--   auto_pick_monthly_showcase / create_homepage_deploy_atomic /
--   increment_showcase_counter / increment_template_downloads / upsert_deploy_error_pattern
-- 나머지는 호출부가 없어 회수해도 앱 동작에 영향이 없다.

-- ============================================================
-- A. 미사용 RPC — anon·authenticated EXECUTE 전면 회수
--    get_visitor_* / get_top_pages: 무인증으로 전체 사이트 방문 통계
--      (PV·세션 수·고유 IP 수·인기 페이지)를 조회할 수 있었다.
--    check_*_quota: p_user_id를 임의로 넘겨 타인의 플랜·사용량을 조회할 수 있었다.
--    cleanup_expired_oauth_states: 외부에서 DELETE를 트리거할 수 있었다.
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.get_visitor_stats(integer)            FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_visitor_daily_trend(integer)      FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_top_pages(integer, integer)       FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_project_quota(uuid)             FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_homepage_deploy_quota(uuid)     FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_oauth_states()        FROM anon, authenticated;

-- upsert_deploy_error_pattern: 호출부가 admin 클라이언트(service_role) 단독
-- (src/lib/oneclick/deploy-error-logger.ts) → 공개 롤은 불필요.
REVOKE EXECUTE ON FUNCTION public.upsert_deploy_error_pattern(text, text, text, text)
  FROM anon, authenticated;

-- increment_template_downloads: 로그인 대시보드에서만 호출 → anon만 회수.
REVOKE EXECUTE ON FUNCTION public.increment_template_downloads(uuid)    FROM anon;

-- ============================================================
-- B. auto_pick_monthly_showcase — 호출자 입력 기간 제거
--
-- 문제: 집계 기간(p_month_start/p_month_end)을 호출자가 그대로 정할 수 있었고
--       GRANT가 anon에 열려 있었다. 함수 선두의
--       `IF EXISTS (... year_month = p_year_month) THEN RETURN` 가드 때문에,
--       anon이 임의 기간으로 선정을 먼저 박아 넣으면 그 달의 정식 선정이 영구 차단된다
--       (이달의 페이지 선정 결과 조작·선점).
-- 조치: 기간을 p_year_month로부터 함수 내부에서 계산하고, 형식 검증 + 종료되지 않은
--       달(현재·미래월) 거부를 추가한다. anon GRANT는 유지해야 한다 —
--       비로그인 방문자의 지난달 쇼케이스 조회에서 lazy 선정이 일어나기 때문
--       (src/app/api/showcase/monthly-picks/route.ts). 기간이 결정론적으로 고정되면
--       anon이 호출하더라도 정식 선정과 동일한 결과만 나오므로 조작 여지가 없다.
-- 시그니처는 그대로 두어 호출부 변경이 필요 없다(뒤 두 인자는 하위호환용으로 무시).
-- ============================================================
CREATE OR REPLACE FUNCTION public.auto_pick_monthly_showcase(
  p_year_month text,
  p_month_start timestamptz DEFAULT NULL,  -- 무시됨(하위호환)
  p_month_end   timestamptz DEFAULT NULL   -- 무시됨(하위호환)
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_row         RECORD;
  v_rank        INTEGER := 0;
  v_month_start timestamptz;
  v_month_end   timestamptz;
BEGIN
  IF p_year_month !~ '^\d{4}-(0[1-9]|1[0-2])$' THEN
    RAISE EXCEPTION 'invalid year_month: %', p_year_month USING ERRCODE = '22023';
  END IF;

  -- 집계 기간은 호출자 입력이 아니라 year_month에서 계산한다 (조작 차단)
  v_month_start := (p_year_month || '-01')::timestamptz;
  v_month_end   := v_month_start + interval '1 month' - interval '1 microsecond';

  -- 아직 끝나지 않은 달은 선정 대상이 아니다 — 미래월 선점 차단
  IF v_month_start >= date_trunc('month', now()) THEN
    RAISE EXCEPTION 'month not finished: %', p_year_month USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.showcase_monthly_picks WHERE year_month = p_year_month
  ) THEN
    RETURN;
  END IF;

  FOR v_row IN
    SELECT id, 'deploy'::TEXT AS source,
           (COALESCE(like_count,0)*3 + COALESCE(comment_count,0)*2 + COALESCE(view_count,0)*0.1) AS score
    FROM public.homepage_deploys
    WHERE is_showcase = true AND deploy_status = 'ready'
      AND created_at >= v_month_start AND created_at <= v_month_end
    UNION ALL
    SELECT id, 'project'::TEXT AS source,
           (COALESCE(like_count,0)*3 + COALESCE(comment_count,0)*2 + COALESCE(view_count,0)*0.1) AS score
    FROM public.projects
    WHERE is_showcase = true AND deleted_at IS NULL
      AND created_at >= v_month_start AND created_at <= v_month_end
    ORDER BY score DESC
    LIMIT 3
  LOOP
    v_rank := v_rank + 1;
    INSERT INTO public.showcase_monthly_picks
      (showcase_id, showcase_source, year_month, pick_type, rank, score_snapshot)
    VALUES
      (v_row.id, v_row.source, p_year_month, 'algorithm', v_rank, ROUND(v_row.score::NUMERIC, 2))
    ON CONFLICT (showcase_id, year_month) DO NOTHING;
  END LOOP;
END;
$$;
