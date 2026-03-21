-- ============================================
-- 089: Add 'ai_creative' subcategory under 'media' category
-- ============================================
-- gwanggo(AI 광고 이미지·영상 자동 생성) 서비스 등록을 위해
-- media 카테고리에 AI 크리에이티브 생성 서브카테고리를 추가합니다.

INSERT INTO public.service_subcategories (id, category, name, name_ko, description, description_ko)
VALUES (
  'ai_creative',
  'media',
  'AI Creative Generation',
  'AI 크리에이티브 생성',
  'AI-powered ad image and video generation for marketing',
  'AI 기반 광고 이미지·영상 자동 생성 서비스'
)
ON CONFLICT (id) DO NOTHING;
