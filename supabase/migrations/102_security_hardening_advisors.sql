-- Migration 102: 보안 어드바이저 정리 (RLS / 함수 / 스토리지 하드닝)
-- 점검 일자: 2026-06-21 · 근거: Supabase get_advisors(security)
-- ⚠️ profiles 공개 읽기(075) 관련 변경은 본 파일에 미포함 — 사용자 별도 처리 예정
-- ⚠️ 적용 전 검토용 초안. apply 는 승인 후.

-- ============================================================
-- A. 트리거 함수 RPC 노출 차단 (REVOKE EXECUTE)
--    트리거 함수는 트리거 실행 시 테이블 소유자 컨텍스트로 동작 →
--    EXECUTE 권한을 회수해도 트리거는 정상 작동. /rest/v1/rpc 노출만 제거.
--    ※ get_user_team_ids / get_user_admin_team_ids / get_user_editor_team_ids 는
--      RLS 정책 내부에서 호출되므로 회수 금지 (의도적 제외).
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.handle_new_user()              FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_service_change()           FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_is_admin_self_update() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at()               FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_multi_account_provider()   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_feature_request_vote_count() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_packages_updated_at()   FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column()     FROM anon, authenticated;

-- ============================================================
-- B. function search_path 고정 (search_path 하이재킹 방어)
--    - 테이블 미참조 함수: ALTER 로 search_path='' 설정
--    - 테이블 참조 함수: 본문을 스키마 한정(public.x) 후 search_path='' 로 재정의
--      (CREATE OR REPLACE 는 기존 트리거 바인딩·권한을 보존)
-- ============================================================
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.update_packages_updated_at() SET search_path = '';

CREATE OR REPLACE FUNCTION public.sync_feature_request_vote_count()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feature_requests SET vote_count = vote_count + 1
      WHERE id = NEW.feature_request_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feature_requests SET vote_count = GREATEST(vote_count - 1, 0)
      WHERE id = OLD.feature_request_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_multi_account_provider()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = ''
AS $$
BEGIN
  SELECT supports_multi_account INTO NEW.multi_account_provider
  FROM public.services WHERE id = NEW.service_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_deploy_error_pattern(
  p_fingerprint text, p_error_category text, p_failed_step text, p_sample_message text)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.deploy_error_patterns (fingerprint, error_category, failed_step, sample_message)
  VALUES (p_fingerprint, p_error_category, p_failed_step, p_sample_message)
  ON CONFLICT (fingerprint) DO UPDATE SET
    occurrence_count = public.deploy_error_patterns.occurrence_count + 1,
    last_seen_at = now(),
    sample_message = EXCLUDED.sample_message
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- ============================================================
-- C. 공개 버킷 리스팅 차단
--    public 버킷의 객체 URL 접근(/storage/v1/object/public/...)은 RLS 우회로 유지되며,
--    storage.objects 의 광범위 SELECT 정책만이 list() 전체 파일 열람을 허용한다.
--    앱에서 두 버킷에 .list() 미사용 확인 → 정책 제거 안전.
-- ============================================================
DROP POLICY IF EXISTS "project_icons_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "showcase_images_public_read" ON storage.objects;

-- ============================================================
-- D. 무제한 INSERT(WITH CHECK true) 완화
--    근본 남용 방어는 엣지 Rate Limiting(Cloudflare) 담당 — 여기선 위조/오삽입 축소.
-- ============================================================
-- showcase_views: 인증 사용자는 자신 명의(또는 익명) 조회만 기록 가능
DROP POLICY IF EXISTS "showcase_views_auth_insert" ON public.showcase_views;
CREATE POLICY "showcase_views_auth_insert" ON public.showcase_views
  FOR INSERT TO authenticated
  WITH CHECK (viewer_id = auth.uid() OR viewer_id IS NULL);

-- visitor_logs: 필수 식별 필드 존재를 RLS 레벨에서 명시
DROP POLICY IF EXISTS "public_insert_visitor_logs" ON public.visitor_logs;
CREATE POLICY "public_insert_visitor_logs" ON public.visitor_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (session_id IS NOT NULL AND page_path IS NOT NULL);
