-- 096: MFA (2FA) 지원 인프라
-- profiles에 mfa_enabled 플래그 추가 + 복구 코드 테이블

-- 1. profiles 테이블에 MFA 활성화 컬럼 추가
ALTER TABLE public.profiles
  ADD COLUMN mfa_enabled boolean NOT NULL DEFAULT false;

-- 2. 복구 코드 테이블 (Supabase 네이티브 미지원 → 자체 관리)
CREATE TABLE public.mfa_recovery_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  used_at timestamptz DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mfa_recovery_codes ENABLE ROW LEVEL SECURITY;

-- RLS: 본인 코드만 조회 가능 (INSERT/UPDATE/DELETE는 service_role만)
CREATE POLICY "Users read own recovery codes"
  ON public.mfa_recovery_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX idx_mfa_recovery_codes_user_id ON public.mfa_recovery_codes(user_id);
