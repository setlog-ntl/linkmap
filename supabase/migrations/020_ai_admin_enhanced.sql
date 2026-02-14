-- ============================================
-- 020: AI Admin Enhanced - Personas, Providers, Guardrails, Templates, Usage
-- ============================================

-- ============================================
-- 1. ai_personas 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ko TEXT,
  description TEXT,
  description_ko TEXT,
  system_prompt TEXT NOT NULL,
  avatar_icon TEXT DEFAULT 'bot',
  avatar_color TEXT DEFAULT '#8B5CF6',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  provider TEXT,
  model TEXT,
  temperature NUMERIC(3,2),
  max_tokens INTEGER,
  top_p NUMERIC(3,2),
  frequency_penalty NUMERIC(4,2),
  presence_penalty NUMERIC(4,2),
  stop_sequences TEXT[],
  response_format TEXT DEFAULT 'text',
  version INTEGER DEFAULT 1,
  previous_version_id UUID REFERENCES public.ai_personas(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access" ON public.ai_personas
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "anyone_can_read_active_personas" ON public.ai_personas
  FOR SELECT
  USING (is_active = true);

-- updated_at trigger
CREATE TRIGGER ai_personas_updated_at
  BEFORE UPDATE ON public.ai_personas
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_config_updated_at();

-- ============================================
-- 2. ai_providers 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  encrypted_api_key TEXT,
  base_url TEXT,
  available_models JSONB NOT NULL DEFAULT '[]',
  fallback_provider_id UUID REFERENCES public.ai_providers(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access" ON public.ai_providers
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE TRIGGER ai_providers_updated_at
  BEFORE UPDATE ON public.ai_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_config_updated_at();

-- Seed: 3 providers
INSERT INTO public.ai_providers (slug, name, is_enabled, base_url, available_models, sort_order) VALUES
  ('openai', 'OpenAI', true, 'https://api.openai.com/v1', '[
    {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "description": "빠르고 경제적", "max_tokens": 128000},
    {"id": "gpt-4o", "name": "GPT-4o", "description": "고성능 멀티모달", "max_tokens": 128000},
    {"id": "gpt-4-turbo", "name": "GPT-4 Turbo", "description": "이전 세대 고성능", "max_tokens": 128000},
    {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "description": "가장 경제적", "max_tokens": 16385},
    {"id": "o1-mini", "name": "o1 Mini", "description": "추론 특화", "max_tokens": 128000}
  ]'::jsonb, 1),
  ('anthropic', 'Anthropic', false, 'https://api.anthropic.com/v1', '[
    {"id": "claude-sonnet-4-5-20250929", "name": "Claude Sonnet 4.5", "description": "균형잡힌 성능", "max_tokens": 8192},
    {"id": "claude-haiku-4-5-20251001", "name": "Claude Haiku 4.5", "description": "빠르고 경제적", "max_tokens": 8192}
  ]'::jsonb, 2),
  ('google', 'Google AI', false, 'https://generativelanguage.googleapis.com/v1beta', '[
    {"id": "gemini-2.0-flash", "name": "Gemini 2.0 Flash", "description": "빠르고 효율적", "max_tokens": 8192},
    {"id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "description": "고성능", "max_tokens": 8192}
  ]'::jsonb, 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. ai_guardrails 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_guardrails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_filter_hate TEXT DEFAULT 'medium',
  content_filter_violence TEXT DEFAULT 'medium',
  content_filter_sexual TEXT DEFAULT 'high',
  content_filter_self_harm TEXT DEFAULT 'high',
  denied_topics TEXT[] DEFAULT '{}',
  blocked_words TEXT[] DEFAULT '{}',
  max_conversation_turns INTEGER DEFAULT 50,
  max_input_tokens INTEGER DEFAULT 4096,
  pii_detection_enabled BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_guardrails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access" ON public.ai_guardrails
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE TRIGGER ai_guardrails_updated_at
  BEFORE UPDATE ON public.ai_guardrails
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_config_updated_at();

-- Seed: default guardrails
INSERT INTO public.ai_guardrails (content_filter_hate, content_filter_violence, content_filter_sexual, content_filter_self_harm, is_active)
VALUES ('medium', 'medium', 'high', 'high', true);

-- ============================================
-- 4. ai_prompt_templates 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ko TEXT,
  description TEXT,
  description_ko TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  prompt_text TEXT NOT NULL,
  prompt_text_ko TEXT,
  icon TEXT DEFAULT 'sparkles',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_prompt_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access" ON public.ai_prompt_templates
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "anyone_can_read_active_templates" ON public.ai_prompt_templates
  FOR SELECT
  USING (is_active = true);

CREATE TRIGGER ai_prompt_templates_updated_at
  BEFORE UPDATE ON public.ai_prompt_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_config_updated_at();

-- Seed: 6 default templates
INSERT INTO public.ai_prompt_templates (name, name_ko, description, description_ko, category, prompt_text, prompt_text_ko, icon, sort_order) VALUES
  ('Fix Bug', '버그 수정', 'Analyze and fix the bug in the code', '코드의 버그를 분석하고 수정합니다', 'debug', 'Find and fix the bug in this code. Explain what was wrong and how you fixed it.', '이 코드의 버그를 찾아서 수정해주세요. 무엇이 잘못되었는지와 어떻게 수정했는지 설명해주세요.', 'bug', 1),
  ('Add Comments', '주석 추가', 'Add clear comments to the code', '코드에 명확한 주석을 추가합니다', 'code', 'Add clear, helpful comments to this code explaining what each section does.', '이 코드에 각 섹션이 무엇을 하는지 설명하는 명확한 주석을 추가해주세요.', 'message-square', 2),
  ('Improve Design', '디자인 개선', 'Improve the visual design and UX', '시각적 디자인과 UX를 개선합니다', 'design', 'Improve the visual design of this page. Make it look more modern and professional.', '이 페이지의 비주얼 디자인을 개선해주세요. 더 현대적이고 전문적으로 만들어주세요.', 'palette', 3),
  ('Make Responsive', '반응형 만들기', 'Make the layout responsive for all devices', '모든 디바이스에 반응형으로 만듭니다', 'design', 'Make this layout fully responsive for mobile, tablet, and desktop.', '이 레이아웃을 모바일, 태블릿, 데스크톱에 완전히 반응형으로 만들어주세요.', 'smartphone', 4),
  ('Optimize Performance', '성능 최적화', 'Optimize code for better performance', '더 나은 성능을 위해 코드를 최적화합니다', 'code', 'Optimize this code for better performance. Consider caching, lazy loading, and reducing DOM operations.', '이 코드를 더 나은 성능을 위해 최적화해주세요. 캐싱, 지연 로딩, DOM 작업 줄이기를 고려해주세요.', 'zap', 5),
  ('Explain Code', '코드 설명', 'Explain how the code works', '코드가 어떻게 동작하는지 설명합니다', 'general', 'Explain how this code works in simple terms. Break it down step by step.', '이 코드가 어떻게 동작하는지 쉬운 말로 설명해주세요. 단계별로 나눠서 설명해주세요.', 'book-open', 6)
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. ai_usage_logs 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  persona_id UUID REFERENCES public.ai_personas(id),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ai_usage_user_created ON public.ai_usage_logs(user_id, created_at);
CREATE INDEX idx_ai_usage_created ON public.ai_usage_logs(created_at);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access" ON public.ai_usage_logs
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- ============================================
-- 6. ai_assistant_config 확장 (기존 테이블에 컬럼 추가)
-- ============================================
ALTER TABLE public.ai_assistant_config
  ADD COLUMN IF NOT EXISTS top_p NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS frequency_penalty NUMERIC(4,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS presence_penalty NUMERIC(4,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stop_sequences TEXT[],
  ADD COLUMN IF NOT EXISTS seed INTEGER,
  ADD COLUMN IF NOT EXISTS response_format TEXT DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS default_persona_id UUID,
  ADD COLUMN IF NOT EXISTS default_provider TEXT DEFAULT 'openai',
  ADD COLUMN IF NOT EXISTS response_language TEXT DEFAULT 'auto',
  ADD COLUMN IF NOT EXISTS streaming_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_instructions TEXT;
