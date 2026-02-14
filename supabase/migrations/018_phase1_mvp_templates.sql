-- 018: Phase 1 MVP templates (link-in-bio-pro, digital-namecard, dev-showcase)

INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order, deploy_target
) VALUES (
  'b2c3d4e5-0003-4000-9000-000000000003',
  'link-in-bio-pro',
  'Link-in-Bio Pro',
  '링크인바이오 프로',
  'SNS profile link hub with animated backgrounds, custom themes, and visitor stats. Linktree alternative with full code ownership.',
  'SNS 프로필 링크 허브. 애니메이션 배경, 커스텀 테마, 방문자 통계. 코드 완전 소유 Linktree 대안.',
  NULL,
  'linkmap-templates',
  'link-in-bio-pro',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "사이트 이름/닉네임", "required": true},
    {"key": "NEXT_PUBLIC_BIO", "description": "소개 문구", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_THEME", "description": "테마 프리셋 (gradient/neon/minimal/...)", "required": false},
    {"key": "NEXT_PUBLIC_LINKS", "description": "링크 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_YOUTUBE_URL", "description": "유튜브 임베드 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['link-in-bio', 'social', 'creator', 'animated', 'themes', 'nextjs'],
  false,
  true,
  6,
  'github_pages'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order, deploy_target
) VALUES (
  'b2c3d4e5-0004-4000-9000-000000000004',
  'digital-namecard',
  'Digital Namecard',
  '디지털 명함',
  'Online business card with vCard QR code, NFC support, and contact save. Replace paper cards with a living digital profile.',
  '온라인 명함. vCard QR 코드, NFC 지원, 연락처 저장 버튼. 종이 명함을 대체하는 디지털 프로필.',
  NULL,
  'linkmap-templates',
  'digital-namecard',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_TITLE", "description": "직함", "required": false},
    {"key": "NEXT_PUBLIC_COMPANY", "description": "회사명", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일", "required": false},
    {"key": "NEXT_PUBLIC_PHONE", "description": "전화번호", "required": false},
    {"key": "NEXT_PUBLIC_ADDRESS", "description": "주소", "required": false},
    {"key": "NEXT_PUBLIC_WEBSITE", "description": "웹사이트 URL", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_AVATAR_URL", "description": "프로필 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_ACCENT_COLOR", "description": "상단 바 색상", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['namecard', 'vcard', 'qr-code', 'business', 'contact', 'nextjs'],
  false,
  true,
  7,
  'github_pages'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO homepage_templates (
  id, slug, name, name_ko, description, description_ko,
  preview_image_url, github_owner, github_repo, default_branch,
  framework, required_env_vars, tags, is_premium, is_active, display_order, deploy_target
) VALUES (
  'b2c3d4e5-0005-4000-9000-000000000005',
  'dev-showcase',
  'Developer Showcase',
  '개발자 쇼케이스',
  'Developer portfolio with GitHub project integration, skill visualization, experience timeline, and blog. Terminal-style dark theme with scroll animations.',
  '개발자 포트폴리오. GitHub 프로젝트 연동, 기술 스택 시각화, 경력 타임라인, 블로그. 터미널 스타일 다크 테마.',
  NULL,
  'linkmap-templates',
  'dev-showcase',
  'main',
  'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "이름", "required": true},
    {"key": "NEXT_PUBLIC_GITHUB_USERNAME", "description": "GitHub 사용자명", "required": false},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_ABOUT", "description": "자기소개 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_SKILLS", "description": "기술 스택 JSON", "required": false},
    {"key": "NEXT_PUBLIC_EXPERIENCE", "description": "경력 JSON", "required": false},
    {"key": "NEXT_PUBLIC_BLOG_POSTS", "description": "블로그 글 JSON", "required": false},
    {"key": "NEXT_PUBLIC_RESUME_URL", "description": "이력서 PDF URL", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "이메일", "required": false},
    {"key": "NEXT_PUBLIC_LINKEDIN_URL", "description": "LinkedIn URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['developer', 'portfolio', 'github', 'showcase', 'dark-theme', 'nextjs'],
  false,
  true,
  8,
  'github_pages'
) ON CONFLICT (slug) DO NOTHING;
