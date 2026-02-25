-- ============================================
-- 042: AI 테이블 RLS - 인증 사용자 읽기/쓰기 정책 추가
-- ai_guardrails: authenticated read (active 행만)
-- ai_usage_logs: user own insert
-- ai_providers: encrypted_api_key 보호로 일반 read policy 추가 불가
--               (서버 API에서만 adminSupabase로 접근)
-- ============================================

-- 1. ai_guardrails: 인증된 사용자가 active 가이드라인 읽기 허용
CREATE POLICY "authenticated_read_active_guardrails" ON public.ai_guardrails
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- 2. ai_usage_logs: 사용자가 자신의 사용량 로그 삽입 허용
CREATE POLICY "user_own_insert_usage_logs" ON public.ai_usage_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
