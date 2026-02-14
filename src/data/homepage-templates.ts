export interface HomepageTemplateSeed {
  id: string;
  slug: string;
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
  preview_image_url: string | null;
  github_owner: string;
  github_repo: string;
  default_branch: string;
  framework: string;
  required_env_vars: Array<{ key: string; description: string; required: boolean }>;
  tags: string[];
  is_premium: boolean;
  is_active: boolean;
  display_order: number;
  deploy_target?: 'vercel' | 'github_pages' | 'both';
}

// Fixed UUIDs for idempotent seeding
const TEMPLATE_IDS = {
  MINIMAL_PORTFOLIO: 'b2c3d4e5-0001-4000-9000-000000000001',
  LINK_PAGE: 'b2c3d4e5-0002-4000-9000-000000000002',
  LINK_IN_BIO_PRO: 'b2c3d4e5-0003-4000-9000-000000000003',
  DIGITAL_NAMECARD: 'b2c3d4e5-0004-4000-9000-000000000004',
  DEV_SHOWCASE: 'b2c3d4e5-0005-4000-9000-000000000005',
};

export const homepageTemplates: HomepageTemplateSeed[] = [
  {
    id: TEMPLATE_IDS.MINIMAL_PORTFOLIO,
    slug: 'homepage-minimal',
    name: 'Minimal Portfolio',
    name_ko: '미니멀 포트폴리오',
    description: 'Clean, single-page portfolio with dark mode support. Built with Next.js and Tailwind CSS.',
    description_ko: '깔끔한 1페이지 포트폴리오 사이트. 다크모드 지원. Next.js + Tailwind CSS.',
    preview_image_url: null,
    github_owner: 'linkmap-templates',
    github_repo: 'homepage-minimal',
    default_branch: 'main',
    framework: 'nextjs',
    required_env_vars: [
      { key: 'NEXT_PUBLIC_SITE_NAME', description: '사이트 이름', required: true },
      { key: 'NEXT_PUBLIC_SITE_DESCRIPTION', description: '사이트 설명', required: false },
      { key: 'NEXT_PUBLIC_AUTHOR_NAME', description: '작성자 이름', required: false },
    ],
    tags: ['portfolio', 'minimal', 'dark-mode', 'nextjs'],
    is_premium: false,
    is_active: true,
    display_order: 1,
  },
  {
    id: TEMPLATE_IDS.LINK_PAGE,
    slug: 'homepage-links',
    name: 'Link Page',
    name_ko: '링크 모음',
    description: 'A Linktree alternative. Customizable link page with social icons. Own your links with your code.',
    description_ko: 'Linktree 대안 링크 페이지. 소셜 아이콘과 커스터마이징 지원. 내 코드로 내 링크를 관리.',
    preview_image_url: null,
    github_owner: 'linkmap-templates',
    github_repo: 'homepage-links',
    default_branch: 'main',
    framework: 'nextjs',
    required_env_vars: [
      { key: 'NEXT_PUBLIC_SITE_NAME', description: '사이트 이름', required: true },
      { key: 'NEXT_PUBLIC_BIO', description: '소개 문구', required: false },
    ],
    tags: ['links', 'linktree', 'social', 'nextjs'],
    is_premium: false,
    is_active: true,
    display_order: 2,
  },
  {
    id: TEMPLATE_IDS.LINK_IN_BIO_PRO,
    slug: 'link-in-bio-pro',
    name: 'Link-in-Bio Pro',
    name_ko: '링크인바이오 프로',
    description: 'SNS profile link hub with animated backgrounds, custom themes, and visitor stats. Linktree alternative with full code ownership.',
    description_ko: 'SNS 프로필 링크 허브. 애니메이션 배경, 커스텀 테마, 방문자 통계. 코드 완전 소유 Linktree 대안.',
    preview_image_url: null,
    github_owner: 'linkmap-templates',
    github_repo: 'link-in-bio-pro',
    default_branch: 'main',
    framework: 'nextjs',
    required_env_vars: [
      { key: 'NEXT_PUBLIC_SITE_NAME', description: '사이트 이름/닉네임', required: true },
      { key: 'NEXT_PUBLIC_BIO', description: '소개 문구', required: false },
      { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 이미지 URL', required: false },
      { key: 'NEXT_PUBLIC_THEME', description: '테마 프리셋 (gradient/neon/minimal/...)', required: false },
      { key: 'NEXT_PUBLIC_LINKS', description: '링크 목록 JSON', required: false },
      { key: 'NEXT_PUBLIC_SOCIALS', description: 'SNS 링크 JSON', required: false },
      { key: 'NEXT_PUBLIC_YOUTUBE_URL', description: '유튜브 임베드 URL', required: false },
      { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
    ],
    tags: ['link-in-bio', 'social', 'creator', 'animated', 'themes', 'nextjs'],
    is_premium: false,
    is_active: true,
    display_order: 6,
    deploy_target: 'github_pages',
  },
  {
    id: TEMPLATE_IDS.DIGITAL_NAMECARD,
    slug: 'digital-namecard',
    name: 'Digital Namecard',
    name_ko: '디지털 명함',
    description: 'Online business card with vCard QR code, NFC support, and contact save. Replace paper cards with a living digital profile.',
    description_ko: '온라인 명함. vCard QR 코드, NFC 지원, 연락처 저장 버튼. 종이 명함을 대체하는 디지털 프로필.',
    preview_image_url: null,
    github_owner: 'linkmap-templates',
    github_repo: 'digital-namecard',
    default_branch: 'main',
    framework: 'nextjs',
    required_env_vars: [
      { key: 'NEXT_PUBLIC_SITE_NAME', description: '이름', required: true },
      { key: 'NEXT_PUBLIC_TITLE', description: '직함', required: false },
      { key: 'NEXT_PUBLIC_COMPANY', description: '회사명', required: false },
      { key: 'NEXT_PUBLIC_EMAIL', description: '이메일', required: false },
      { key: 'NEXT_PUBLIC_PHONE', description: '전화번호', required: false },
      { key: 'NEXT_PUBLIC_ADDRESS', description: '주소', required: false },
      { key: 'NEXT_PUBLIC_WEBSITE', description: '웹사이트 URL', required: false },
      { key: 'NEXT_PUBLIC_SOCIALS', description: 'SNS 링크 JSON', required: false },
      { key: 'NEXT_PUBLIC_AVATAR_URL', description: '프로필 이미지 URL', required: false },
      { key: 'NEXT_PUBLIC_ACCENT_COLOR', description: '상단 바 색상', required: false },
      { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
    ],
    tags: ['namecard', 'vcard', 'qr-code', 'business', 'contact', 'nextjs'],
    is_premium: false,
    is_active: true,
    display_order: 7,
    deploy_target: 'github_pages',
  },
  {
    id: TEMPLATE_IDS.DEV_SHOWCASE,
    slug: 'dev-showcase',
    name: 'Developer Showcase',
    name_ko: '개발자 쇼케이스',
    description: 'Developer portfolio with GitHub project integration, skill visualization, experience timeline, and blog. Terminal-style dark theme with scroll animations.',
    description_ko: '개발자 포트폴리오. GitHub 프로젝트 연동, 기술 스택 시각화, 경력 타임라인, 블로그. 터미널 스타일 다크 테마.',
    preview_image_url: null,
    github_owner: 'linkmap-templates',
    github_repo: 'dev-showcase',
    default_branch: 'main',
    framework: 'nextjs',
    required_env_vars: [
      { key: 'NEXT_PUBLIC_SITE_NAME', description: '이름', required: true },
      { key: 'NEXT_PUBLIC_GITHUB_USERNAME', description: 'GitHub 사용자명', required: false },
      { key: 'NEXT_PUBLIC_TAGLINE', description: '한줄 소개', required: false },
      { key: 'NEXT_PUBLIC_ABOUT', description: '자기소개 텍스트', required: false },
      { key: 'NEXT_PUBLIC_SKILLS', description: '기술 스택 JSON', required: false },
      { key: 'NEXT_PUBLIC_EXPERIENCE', description: '경력 JSON', required: false },
      { key: 'NEXT_PUBLIC_BLOG_POSTS', description: '블로그 글 JSON', required: false },
      { key: 'NEXT_PUBLIC_RESUME_URL', description: '이력서 PDF URL', required: false },
      { key: 'NEXT_PUBLIC_EMAIL', description: '이메일', required: false },
      { key: 'NEXT_PUBLIC_LINKEDIN_URL', description: 'LinkedIn URL', required: false },
      { key: 'NEXT_PUBLIC_GA_ID', description: 'Google Analytics 4 ID', required: false },
    ],
    tags: ['developer', 'portfolio', 'github', 'showcase', 'dark-theme', 'nextjs'],
    is_premium: false,
    is_active: true,
    display_order: 8,
    deploy_target: 'github_pages',
  },
];
