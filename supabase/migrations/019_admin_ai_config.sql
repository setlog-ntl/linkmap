-- ============================================
-- 019: Admin AI Assistant Config
-- profiles.is_admin + ai_assistant_config table
-- ============================================

-- 1. profiles 테이블에 is_admin 컬럼 추가
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. ai_assistant_config 테이블 생성
CREATE TABLE IF NOT EXISTS public.ai_assistant_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_prompt TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
  temperature NUMERIC(3,2) DEFAULT 0.30,
  max_tokens INTEGER DEFAULT 4096,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_ai_config_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER ai_assistant_config_updated_at
  BEFORE UPDATE ON public.ai_assistant_config
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_config_updated_at();

-- 4. RLS 활성화
ALTER TABLE public.ai_assistant_config ENABLE ROW LEVEL SECURITY;

-- 관리자: 모든 CRUD
CREATE POLICY "admin_full_access" ON public.ai_assistant_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 일반 유저: active 설정 SELECT만
CREATE POLICY "anyone_can_read_active" ON public.ai_assistant_config
  FOR SELECT
  USING (is_active = true);
