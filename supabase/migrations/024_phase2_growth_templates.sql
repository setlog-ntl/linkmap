-- 024: Phase 2 Growth Templates (5개)
-- small-biz, product-landing, qr-menu-pro, resume-site, personal-brand

-- 1. 소상공인 비즈니스
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0006-4000-9000-000000000006',
  'small-biz',
  'Small Business',
  '소상공인 비즈니스',
  'Simple mobile-optimized business page with menu, hours, Kakao Map, and one-tap call/directions. Perfect for cafes, restaurants, salons, and shops.',
  '메뉴판, 영업시간, 카카오맵, 전화 연결을 갖춘 초간단 모바일 최적화 비즈니스 페이지. 카페, 음식점, 미용실, 소매점에 최적화.',
  NULL,
  'linkmap-templates', 'small-biz', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "가게 이름", "required": true},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ADDRESS", "description": "주소", "required": false},
    {"key": "NEXT_PUBLIC_KAKAO_MAP_ID", "description": "카카오맵 장소 ID", "required": false},
    {"key": "NEXT_PUBLIC_BUSINESS_HOURS", "description": "영업시간 JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_MENU_ITEMS", "description": "메뉴 목록 JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_INSTAGRAM_URL", "description": "인스타그램 URL", "required": false},
    {"key": "NEXT_PUBLIC_NAVER_BLOG_URL", "description": "네이버 블로그 URL", "required": false},
    {"key": "NEXT_PUBLIC_KAKAO_CHANNEL", "description": "카카오 채널 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['small-business', 'restaurant', 'cafe', 'shop', 'kakao-map', 'mobile', 'nextjs'],
  false, true, 4
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 2. 제품 랜딩페이지
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0008-4000-9000-000000000008',
  'product-landing',
  'Product Landing',
  '제품 랜딩페이지',
  'Conversion-optimized landing page for side projects and SaaS products. Includes hero, features grid, screenshots, pricing table, testimonials, and FAQ.',
  '사이드 프로젝트와 SaaS 제품을 위한 전환율 최적화 랜딩페이지. 히어로, 기능 그리드, 스크린샷, 가격표, 후기, FAQ 포함.',
  NULL,
  'linkmap-templates', 'product-landing', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "제품명", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 피치", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "히어로 스크린샷/목업 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_CTA_URL", "description": "주요 CTA 링크 URL", "required": false},
    {"key": "NEXT_PUBLIC_CTA_TEXT", "description": "CTA 버튼 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_FEATURES", "description": "기능 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SCREENSHOTS", "description": "스크린샷 URL JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "사용자 후기 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PRICING", "description": "가격표 데이터 JSON", "required": false},
    {"key": "NEXT_PUBLIC_FAQ", "description": "FAQ 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_STATS", "description": "통계 데이터 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['product', 'landing', 'saas', 'startup', 'conversion', 'nextjs'],
  false, true, 5
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 3. QR 메뉴판 프로
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0018-4000-9000-000000000018',
  'qr-menu-pro',
  'QR Menu Pro',
  'QR 메뉴판 프로',
  'Digital QR menu for restaurants and cafes. Photo gallery, allergen info, multi-language support, category tabs, and printable QR code.',
  '식당/카페 디지털 QR 메뉴판. 사진 갤러리, 알레르기 정보, 다국어 지원, 카테고리 필터, QR코드 인쇄.',
  NULL,
  'linkmap-templates', 'qr-menu-pro', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "가게 이름", "required": true},
    {"key": "NEXT_PUBLIC_LOGO_URL", "description": "가게 로고 URL", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ADDRESS", "description": "가게 주소", "required": false},
    {"key": "NEXT_PUBLIC_KAKAOMAP_URL", "description": "카카오맵 링크", "required": false},
    {"key": "NEXT_PUBLIC_HOURS", "description": "영업시간", "required": false},
    {"key": "NEXT_PUBLIC_CATEGORIES", "description": "카테고리 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_MENU_ITEMS", "description": "메뉴 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_CURRENCY", "description": "통화 기호", "required": false},
    {"key": "NEXT_PUBLIC_DEFAULT_LANG", "description": "기본 언어", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['restaurant', 'cafe', 'qr-menu', 'food', 'multilingual', 'business', 'nextjs'],
  false, true, 6
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 4. 이력서 사이트
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0009-4000-9000-000000000009',
  'resume-site',
  'Resume Site',
  '이력서 사이트',
  'Interactive resume with timeline, skill charts, project cards, and PDF download. Perfect for job seekers and career changers.',
  '인터랙티브 타임라인, 스킬 차트, 프로젝트 카드, PDF 다운로드를 갖춘 이력서 사이트. 취준생과 이직자에게 최적화.',
  NULL,
  'linkmap-templates', 'resume-site', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "직함/목표 직무", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일 주소", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ABOUT", "description": "자기소개 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 사진 URL", "required": false},
    {"key": "NEXT_PUBLIC_EXPERIENCE", "description": "경력 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EDUCATION", "description": "학력 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SKILLS", "description": "스킬 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PROJECTS", "description": "프로젝트 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_CERTIFICATIONS", "description": "자격증/수상 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_RESUME_URL", "description": "PDF 이력서 파일 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['resume', 'cv', 'career', 'job-seeker', 'timeline', 'nextjs'],
  false, true, 7
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 5. 퍼스널 브랜드
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0010-4000-9000-000000000010',
  'personal-brand',
  'Personal Brand',
  '퍼스널 브랜드',
  'Storytelling-driven personal branding page with fullscreen hero, parallax scroll, values showcase, and framer-motion animations. Express your identity.',
  '풀스크린 히어로, 패럴렉스 스크롤, 가치관 쇼케이스, framer-motion 애니메이션을 갖춘 스토리텔링 중심 퍼스널 브랜딩 페이지. 나다움을 표현하세요.',
  NULL,
  'linkmap-templates', 'personal-brand', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 태그라인", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "풀스크린 히어로 배경 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_STORY", "description": "자기소개 스토리 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_VALUES", "description": "가치관 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_HIGHLIGHTS", "description": "경력 하이라이트 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON 배열", "required": false},
    {"key": "NEXT_PUBLIC_WRITINGS", "description": "글/미디어 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일 주소", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['personal-brand', 'storytelling', 'mz-generation', 'identity', 'fullscreen', 'nextjs'],
  false, true, 8
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();
