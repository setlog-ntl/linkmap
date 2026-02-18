-- 025: Phase 3 Expansion Templates (4개)
-- freelancer-page, saas-landing, newsletter-landing, event-page

-- 1. 프리랜서 페이지
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0012-4000-9000-000000000012',
  'freelancer-page',
  'Freelancer Page',
  '프리랜서 페이지',
  'Professional freelancer page with service listings, portfolio grid with category filter, client testimonials with star ratings, work process steps, and contact form. Built for trust and conversion.',
  '프리랜서 전문 홍보 페이지. 서비스 목록, 카테고리 필터 포트폴리오, 별점 후기, 업무 프로세스, 문의 폼. 신뢰 구축과 전환 최적화에 최적화.',
  NULL,
  'linkmap-templates', 'freelancer-page', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "사이트 이름", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "이름", "required": false},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "전문 분야 한 줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 사진 URL", "required": false},
    {"key": "NEXT_PUBLIC_SERVICES", "description": "서비스 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PORTFOLIO", "description": "포트폴리오 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "클라이언트 후기 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EXPERIENCE", "description": "경력/자격 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PROCESS", "description": "업무 프로세스 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "문의 이메일", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['freelancer', 'services', 'portfolio', 'testimonials', 'business', 'nextjs'],
  false, true, 9
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 2. SaaS 랜딩
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0013-4000-9000-000000000013',
  'saas-landing',
  'SaaS Landing',
  'SaaS 랜딩',
  'Conversion-optimized SaaS landing page with hero section, logo marquee, feature showcase, animated stat counters, pricing comparison table, customer testimonials, FAQ accordion, and newsletter signup. Designed for startups and product launches.',
  '전환율 최적화 SaaS 랜딩 페이지. 히어로, 로고 배너, 기능 소개, 통계 카운터 애니메이션, 가격 비교표, 고객 후기, FAQ 아코디언, 뉴스레터 구독. 스타트업과 제품 런칭에 최적화.',
  NULL,
  'linkmap-templates', 'saas-landing', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "제품/사이트 이름", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "가치 제안 헤드라인", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "히어로 제품 스크린샷 URL", "required": false},
    {"key": "NEXT_PUBLIC_CTA_URL", "description": "주요 CTA 링크", "required": false},
    {"key": "NEXT_PUBLIC_DEMO_URL", "description": "데모 보기 링크", "required": false},
    {"key": "NEXT_PUBLIC_LOGOS", "description": "신뢰 기업 로고 JSON", "required": false},
    {"key": "NEXT_PUBLIC_FEATURES", "description": "기능 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_STATS", "description": "핵심 지표 JSON", "required": false},
    {"key": "NEXT_PUBLIC_PRICING", "description": "가격 플랜 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "고객 후기 JSON", "required": false},
    {"key": "NEXT_PUBLIC_FAQ", "description": "FAQ JSON", "required": false},
    {"key": "NEXT_PUBLIC_NEWSLETTER_ACTION", "description": "뉴스레터 폼 액션 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['saas', 'landing', 'startup', 'pricing', 'conversion', 'faq', 'nextjs'],
  false, true, 10
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 3. 뉴스레터 랜딩
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0019-4000-9000-000000000019',
  'newsletter-landing',
  'Newsletter Landing',
  '뉴스레터 랜딩',
  'Newsletter landing page with archive, subscribe CTA, author intro, and testimonials. Substack/Beehiiv alternative with full code ownership.',
  '뉴스레터 랜딩 페이지. 아카이브, 구독 CTA, 작가 소개, 추천사. 코드 완전 소유 Substack 대안.',
  NULL,
  'linkmap-templates', 'newsletter-landing', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "뉴스레터 제목", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_SUBSCRIBER_COUNT", "description": "구독자 수 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_SUBSCRIBE_URL", "description": "구독 폼 액션 URL", "required": false},
    {"key": "NEXT_PUBLIC_AUTHOR_NAME", "description": "작가 이름", "required": false},
    {"key": "NEXT_PUBLIC_AUTHOR_BIO", "description": "작가 소개", "required": false},
    {"key": "NEXT_PUBLIC_AUTHOR_AVATAR_URL", "description": "작가 프로필 사진 URL", "required": false},
    {"key": "NEXT_PUBLIC_FEATURED_POSTS", "description": "인기/최근 글 JSON", "required": false},
    {"key": "NEXT_PUBLIC_ARCHIVE_POSTS", "description": "전체 아카이브 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TESTIMONIALS", "description": "추천사 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['newsletter', 'creator', 'subscribe', 'archive', 'writing', 'nextjs'],
  false, true, 11
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 4. 이벤트 페이지
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0014-4000-9000-000000000014',
  'event-page',
  'Event Page',
  '이벤트 페이지',
  'Event and conference landing page with real-time countdown timer, speaker profiles, interactive timetable, venue map, registration CTA, and tiered sponsor logos. Perfect for meetups, conferences, and workshops.',
  '이벤트/컨퍼런스 랜딩 페이지. 실시간 카운트다운 타이머, 스피커 프로필, 인터랙티브 타임테이블, 장소 지도, 신청 CTA, 등급별 스폰서 로고. 밋업, 컨퍼런스, 워크숍에 최적화.',
  NULL,
  'linkmap-templates', 'event-page', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이벤트 이름", "required": true},
    {"key": "NEXT_PUBLIC_EVENT_DATE", "description": "이벤트 날짜/시간 (ISO 8601)", "required": false},
    {"key": "NEXT_PUBLIC_EVENT_LOCATION", "description": "장소 이름 + 주소", "required": false},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "이벤트 설명 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_SPEAKERS", "description": "스피커 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_TIMETABLE", "description": "일정표 JSON", "required": false},
    {"key": "NEXT_PUBLIC_MAP_URL", "description": "지도 임베드 URL", "required": false},
    {"key": "NEXT_PUBLIC_REGISTER_URL", "description": "신청 링크", "required": false},
    {"key": "NEXT_PUBLIC_TICKET_PRICE", "description": "참가비 정보", "required": false},
    {"key": "NEXT_PUBLIC_SPONSORS", "description": "스폰서 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "문의 이메일", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['event', 'conference', 'meetup', 'countdown', 'timetable', 'speakers', 'nextjs'],
  false, true, 12
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();
