-- 026: Phase 4 Community Templates (3개)
-- community-hub, study-recruit, nonprofit-page

-- 1. 커뮤니티 허브
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0015-4000-9000-000000000015',
  'community-hub',
  'Community Hub',
  '커뮤니티 허브',
  'All-in-one community portal for study groups, clubs, and hobby groups. Centralize members, schedules, resources, and join forms in one page.',
  '스터디·동호회·동아리를 위한 올인원 커뮤니티 포탈. 멤버 소개, 일정, 자료 링크, 가입 안내를 한 페이지에 통합.',
  NULL,
  'linkmap-templates', 'community-hub', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "커뮤니티/스터디 이름", "required": true},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "한줄 소개 문구", "required": false},
    {"key": "NEXT_PUBLIC_MEMBER_COUNT", "description": "현재 멤버 수", "required": false},
    {"key": "NEXT_PUBLIC_MEMBERS", "description": "멤버 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_SCHEDULES", "description": "일정 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_RESOURCES", "description": "자료 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON", "required": false},
    {"key": "NEXT_PUBLIC_JOIN_URL", "description": "가입 신청 폼 URL", "required": false},
    {"key": "NEXT_PUBLIC_JOIN_DESCRIPTION", "description": "가입 방법 안내 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_DISCORD_URL", "description": "디스코드 서버 초대 링크", "required": false},
    {"key": "NEXT_PUBLIC_KAKAO_OPEN_CHAT_URL", "description": "카카오톡 오픈채팅 링크", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['community', 'study-group', 'club', 'members', 'schedule', 'resources', 'nextjs'],
  false, true, 13
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 2. 스터디 모집 페이지
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0020-4000-9000-000000000020',
  'study-recruit',
  'Study Recruit',
  '스터디 모집 페이지',
  'Study group and side project recruitment page. Curriculum, organizer profiles, application progress, FAQ, and countdown timer.',
  '스터디/사이드프로젝트 모집 페이지. 커리큘럼, 운영진 소개, 신청 현황, FAQ, 마감 카운트다운.',
  NULL,
  'linkmap-templates', 'study-recruit', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "스터디/프로젝트명", "required": true},
    {"key": "NEXT_PUBLIC_TAGLINE", "description": "한줄 소개", "required": false},
    {"key": "NEXT_PUBLIC_STATUS", "description": "모집 상태 (open/closing/closed)", "required": false},
    {"key": "NEXT_PUBLIC_DEADLINE", "description": "모집 마감일 (ISO 8601)", "required": false},
    {"key": "NEXT_PUBLIC_DESCRIPTION", "description": "스터디 소개 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_CURRICULUM", "description": "커리큘럼 JSON", "required": false},
    {"key": "NEXT_PUBLIC_ORGANIZERS", "description": "운영진 JSON", "required": false},
    {"key": "NEXT_PUBLIC_REQUIREMENTS", "description": "모집 요건 JSON", "required": false},
    {"key": "NEXT_PUBLIC_CURRENT_APPLICANTS", "description": "현재 신청 인원", "required": false},
    {"key": "NEXT_PUBLIC_MAX_CAPACITY", "description": "최대 정원", "required": false},
    {"key": "NEXT_PUBLIC_APPLY_URL", "description": "신청 폼 URL", "required": false},
    {"key": "NEXT_PUBLIC_FAQ", "description": "FAQ JSON", "required": false},
    {"key": "NEXT_PUBLIC_CONTACT_EMAIL", "description": "문의 이메일", "required": false},
    {"key": "NEXT_PUBLIC_CONTACT_KAKAO", "description": "카카오 오픈채팅 URL", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['study', 'recruit', 'community', 'side-project', 'developer', 'nextjs'],
  false, true, 14
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();

-- 3. 비영리 소개 페이지
INSERT INTO homepage_templates (
  id, slug, name, name_ko,
  description, description_ko,
  preview_image_url,
  github_owner, github_repo, default_branch, framework,
  required_env_vars, tags,
  is_premium, is_active, display_order
) VALUES (
  'b2c3d4e5-0017-4000-9000-000000000017',
  'nonprofit-page',
  'Nonprofit Page',
  '비영리 소개 페이지',
  'Emotive nonprofit landing page with mission storytelling, impact statistics with count-up animation, activity gallery, donation CTA, and newsletter subscription.',
  '비영리 단체를 위한 감성적 소개 페이지. 미션 스토리텔링, 성과 통계 카운트업, 활동 갤러리, 후원 CTA, 뉴스레터 구독 기능.',
  NULL,
  'linkmap-templates', 'nonprofit-page', 'main', 'nextjs',
  '[
    {"key": "NEXT_PUBLIC_SITE_NAME", "description": "단체명", "required": true},
    {"key": "NEXT_PUBLIC_MISSION", "description": "미션/비전 설명 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_HERO_IMAGE_URL", "description": "히어로 배경 이미지 URL", "required": false},
    {"key": "NEXT_PUBLIC_IMPACT_STATS", "description": "성과 통계 JSON", "required": false},
    {"key": "NEXT_PUBLIC_ACTIVITIES", "description": "활동 목록 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GALLERY_IMAGES", "description": "갤러리 이미지 URL JSON", "required": false},
    {"key": "NEXT_PUBLIC_TEAM", "description": "팀 멤버 JSON", "required": false},
    {"key": "NEXT_PUBLIC_DONATE_URL", "description": "후원 링크 URL", "required": false},
    {"key": "NEXT_PUBLIC_DONATE_DESCRIPTION", "description": "후원 방법 안내 텍스트", "required": false},
    {"key": "NEXT_PUBLIC_BANK_ACCOUNT", "description": "후원 계좌 정보", "required": false},
    {"key": "NEXT_PUBLIC_NEWSLETTER_ACTION", "description": "뉴스레터 폼 액션 URL", "required": false},
    {"key": "NEXT_PUBLIC_EMAIL", "description": "연락 이메일", "required": false},
    {"key": "NEXT_PUBLIC_SOCIALS", "description": "SNS 링크 JSON", "required": false},
    {"key": "NEXT_PUBLIC_GA_ID", "description": "Google Analytics 4 ID", "required": false}
  ]'::jsonb,
  ARRAY['nonprofit', 'ngo', 'charity', 'donation', 'mission', 'social-impact', 'nextjs'],
  false, true, 15
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, name_ko = EXCLUDED.name_ko,
  description = EXCLUDED.description, description_ko = EXCLUDED.description_ko,
  required_env_vars = EXCLUDED.required_env_vars, tags = EXCLUDED.tags,
  display_order = EXCLUDED.display_order, updated_at = now();
