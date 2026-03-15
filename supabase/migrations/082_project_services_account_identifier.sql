-- ============================================
-- 082: project_services에 account_identifier 컬럼 추가
-- 서비스별 사용 계정 아이디 저장 (예: user@gmail.com, @myorg)
-- ============================================

ALTER TABLE public.project_services
  ADD COLUMN IF NOT EXISTS account_identifier TEXT DEFAULT NULL;

COMMENT ON COLUMN public.project_services.account_identifier
  IS '서비스에 사용 중인 계정 아이디 (이메일, 유저네임 등)';
