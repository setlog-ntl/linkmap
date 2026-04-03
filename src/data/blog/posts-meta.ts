import type { BlogCategory } from './blog-categories';

// ---------------------------------------------------------------------------
// BlogPostMeta — content를 제외한 경량 메타데이터
// ---------------------------------------------------------------------------

/** 콘텐츠 표현 유형 — 기본값 'utility' (기존 전체) */
export type BlogContentType = 'utility' | 'narrative';

export interface BlogSeriesMeta {
  id: string;
  order: number;
  totalParts?: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  crossPostUrl?: string;
  relatedGuides?: string[];
  ogImage?: string;
  contentType?: BlogContentType;
  series?: BlogSeriesMeta;
  narrativeHook?: string;
  relatedPosts?: string[];
}

// ---------------------------------------------------------------------------
// Posts metadata (newest first) — content 미포함, ~15KB
// ---------------------------------------------------------------------------

export const BLOG_POSTS_META: BlogPostMeta[] = [
  // ======================================================================
  // 스토리 — 병렬 세션 덮어쓰기 함정 경험담
  // ======================================================================
  {
    slug: 'vibe-coding-parallel-session-trap',
    title: '여러 AI 세션을 동시에 돌렸더니 작업이 사라졌다 — 병렬 세션 덮어쓰기 함정과 Git 워크트리 해결법',
    description: 'AI 코딩 도구를 두 창에서 동시에 돌리면 한쪽 작업이 조용히 덮어써집니다. 왜 이런 일이 생기는지, Git 워크트리로 작업 공간을 물리적으로 분리하는 3단계 해결법을 초보자도 이해할 수 있게 설명합니다.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', 'Git 워크트리', '병렬 세션', 'Claude Code', '바이브코딩 실수'],
    publishedAt: '2026-04-03',
    readingTime: '8분',
    relatedGuides: ['github', 'version-control', 'env', 'deploy'],
    contentType: 'narrative',
    narrativeHook: '빠르겠지 했는데, 한 시간 작업이 흔적도 없이 사라졌다',
  },
  // ======================================================================
  // 스토리 시리즈 — 사용자에서 창작자로 1편
  // ======================================================================
  {
    slug: 'user-to-creator-1-not-a-maker',
    title: '사용자에서 창작자로 ① — 나는 만드는 사람이 아니었다',
    description: '코딩은 전문가의 영역이라 믿었다. 세 번의 시도, 세 번의 포기. 그리고 AI가 코드를 짜주기 시작한 2025년, 그 경계가 사라지기 시작했다.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', '사용자에서 창작자로', '시대 전환', '바이브코딩 입문', 'AI 코딩'],
    publishedAt: '2026-04-03',
    readingTime: '7분',
    relatedGuides: ['env', 'deploy'],
    contentType: 'narrative',
    series: { id: 'user-to-creator', order: 1, totalParts: 5 },
    narrativeHook: '만드는 건 만드는 사람이 하는 거지 — 그 생각이 틀렸다',
    relatedPosts: ['what-is-vibe-coding', 'vibe-coding-getting-started-guide', 'cursor-ai-beginner-guide'],
  },
  // ======================================================================
  // 새 포스트 — AI로 만든 서비스가 "이쁜 쓰레기"가 되는 이유: DB 기초
  // ======================================================================
  {
    slug: 'vibe-coding-why-you-need-database',
    title: 'AI로 만든 서비스가 "이쁜 쓰레기"가 되는 이유 — 바이브 코더가 반드시 알아야 할 데이터베이스 기초',
    description: 'AI가 만들어준 서비스가 겉보기엔 멋지지만 실제로 쓸 수 없는 경우가 있습니다. 하드코딩의 문제점, 보안 취약점, 데이터 정합성 붕괴까지 — 초보자도 이해할 수 있는 DB 필요성과 해결 방법을 실제 사례로 설명합니다.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', '데이터베이스 기초', '하드코딩 문제', 'Supabase', '바이브코딩 실수'],
    publishedAt: '2026-04-03',
    readingTime: '8분',
    relatedGuides: ['supabase', 'env', 'backend', 'security'],
  },
  // ======================================================================
  // 새 포스트 — AI API 타임아웃 비동기 처리 패턴
  // ======================================================================
  {
    slug: 'async-ai-api-timeout-fix',
    title: 'AI API 호출이 자꾸 타임아웃 난다면 — 무거운 작업의 비동기 처리 패턴',
    description: 'AI가 만들어준 코드가 느리거나 Vercel 10초 타임아웃에 걸린다면 처리 구조 문제입니다. Next.js after() 함수로 응답을 먼저 보내고 백그라운드에서 OCR·AI API를 처리하는 3단계 비동기 패턴을 정리합니다.',
    category: 'tutorial',
    tags: ['AI API 타임아웃', '비동기 처리', 'Next.js after', 'OCR 처리', '바이브 코딩'],
    publishedAt: '2026-04-02',
    readingTime: '8분',
    relatedGuides: ['backend', 'api-basics', 'deploy', 'env'],
  },
  // ======================================================================
  // 새 포스트 — 무료 CDN 의존성 함정
  // ======================================================================
  {
    slug: 'free-cdn-dependency-trap',
    title: 'archive.org에 올린 음악 파일 36곡이 갑자기 사라졌다 — 무료 외부 CDN·호스팅 의존성 함정과 탈출 전략',
    description: 'archive.org에 올린 배경 음악 70곡 중 36곡이 예고 없이 접근 불가가 됐습니다. 무료 외부 호스팅의 숨겨진 비용, 어떤 파일을 외부에 맡기면 안 되는지, 직접 호스팅으로 전환하는 실전 전략 3가지를 정리합니다.',
    category: 'insight',
    tags: ['무료 CDN 위험', '외부 서비스 의존성', 'archive.org', '파일 호스팅', '바이브코딩 실수'],
    publishedAt: '2026-04-02',
    readingTime: '7분',
    relatedGuides: ['supabase', 'github', 'deploy', 'cloudflare'],
  },
  // ======================================================================
  // 새 포스트 — Zod parse vs safeParse
  // ======================================================================
  {
    slug: 'zod-parse-vs-safeparse-500-error',
    title: '입력 검증에서 500 에러가 나는 이유 — Zod parse vs safeParse 완전 정리',
    description: 'AI가 생성한 API 코드에 Zod parse()가 있으면 잘못된 입력 하나로 서버가 500 에러를 뱉습니다. safeParse()와의 차이, 왜 AI는 위험한 쪽을 쓰는지, 그리고 실전 5단계 패턴까지 초보자도 이해할 수 있게 설명합니다.',
    category: 'tutorial',
    tags: ['Zod', 'API 입력 검증', '500 에러 해결', 'safeParse', 'Next.js API'],
    publishedAt: '2026-04-02',
    readingTime: '8분',
    relatedGuides: ['backend', 'env', 'frontend', 'auth'],
  },
  // ======================================================================
  // 새 포스트 — Hydration Mismatch 해결기
  // ======================================================================
  {
    slug: 'nextjs-hydration-mismatch-fix',
    title: 'Hydration Mismatch — 왜 새로고침하면 화면이 깨질까? Next.js 완전 해결 가이드',
    description: '로컬에서는 괜찮은데 배포 후 새로고침하면 화면이 깨집니다. 다크모드·언어 설정·로그인 상태가 대표적 원인입니다. 서버와 브라우저의 차이, useEffect 패턴, suppressHydrationWarning 사용 기준까지 초보자도 이해할 수 있게 설명합니다.',
    category: 'deploy-ops',
    tags: ['Hydration Mismatch', 'Next.js 에러', '새로고침 화면 깨짐', 'useEffect', 'SSR 오류'],
    publishedAt: '2026-04-02',
    readingTime: '8분',
    relatedGuides: ['frontend', 'deploy', 'vercel', 'supabase'],
  },
  // ======================================================================
  // 새 포스트 — Cloudflare Workers Error 1102 해결기
  // ======================================================================
  {
    slug: 'cloudflare-workers-error-1102-cpu-limit-fix',
    title: 'Error 1102 해결기 — Cloudflare Workers CPU 10ms 제한과 Next.js 공개 페이지 최적화',
    description: '내 사이트에 Error 1102가 떴습니다. Cloudflare Workers Free Plan의 CPU 10ms 제한을 초과했기 때문입니다. 원인을 찾는 과정, force-dynamic vs revalidate=false 차이, Observability 설정까지 초보자도 이해할 수 있게 설명합니다.',
    category: 'deploy-ops',
    tags: ['Cloudflare Workers 에러', 'Error 1102', 'CPU 제한', 'force-dynamic', 'Next.js 배포 최적화'],
    publishedAt: '2026-04-02',
    readingTime: '9분',
    relatedGuides: ['cloudflare', 'deploy', 'vercel', 'env'],
  },
  // ======================================================================
  // 새 포스트 — 소셜 로그인 가이드
  // ======================================================================
  {
    slug: 'vibe-coding-social-login-guide',
    title: '"구글로 로그인" 버튼 하나에 반나절이 걸린 이유 — 카카오/구글 소셜 로그인 완전 가이드',
    description: 'AI가 로그인 코드는 만들어줬는데 실행하면 에러만 나옵니다. 문제는 콘솔 설정이었습니다. OAuth 개념부터 카카오·구글 연결, 초보자가 반드시 겪는 에러 3가지까지 정리합니다.',
    category: 'tutorial',
    tags: ['소셜 로그인', '카카오 로그인', '구글 로그인', 'OAuth', 'Supabase Auth'],
    publishedAt: '2026-03-24',
    readingTime: '10분',
    relatedGuides: ['auth', 'env', 'supabase', 'deploy'],
  },
  // ======================================================================
  // Cloudflare Workers + Next.js prefetch 503 해결기
  // ======================================================================
  {
    slug: 'cloudflare-workers-nextjs-prefetch-503-fix',
    title: '내 사이트가 간헐적으로 안 열린다? — Next.js 배포 후 503 에러 해결기',
    description: '배포 후 "가끔 사이트가 안 열린다"는 문제의 원인은 Next.js가 자동으로 보내는 숨겨진 요청 52건이었습니다. 코드 한 줄로 해결한 과정을 초보자도 이해할 수 있게 설명합니다.',
    category: 'deploy-ops',
    tags: ['배포 에러 해결', '503 에러', 'Next.js 배포', 'Cloudflare Workers', '사이트 안 열림'],
    publishedAt: '2026-03-20',
    readingTime: '8분',
    relatedGuides: ['deploy', 'cloudflare', 'env'],
  },
  {
    slug: 'linkmap-dev-story-3-community-and-next',
    title: 'ERP 담당자의 Linkmap 개발기 ③ — 혼자 만들되, 혼자 고민하지 마세요',
    description: '트레바리 독서 모임에서 현직 개발자를 만나 몇 달 고민이 한 문장으로 풀렸습니다. 바이브 코딩의 진짜 병목은 코딩이 아니라 도구를 아는 것, 서비스를 연결하는 것, 그리고 커뮤니티였습니다.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', '1인 개발', '커뮤니티', 'Claude Code', 'Linkmap 개발기'],
    publishedAt: '2026-03-18',
    readingTime: '8분',
    relatedGuides: ['env', 'deploy', 'github'],
    contentType: 'narrative',
    series: { id: 'linkmap-dev-story', order: 3, totalParts: 3 },
    narrativeHook: '3개월 수수께끼가 10초 만에 풀렸다',
  },
  {
    slug: 'linkmap-dev-story-2-ai-as-teammate',
    title: 'ERP 담당자의 Linkmap 개발기 ② — AI를 팀원으로 만드는 법',
    description: 'Supabase 데이터 흐름 설계 실패, AI가 만든 RLS 보안 허점, 기능 20개 이상에서 AI가 기존 코드를 무시하는 컨텍스트 한계. ERP 경험으로 돌파한 방법을 공유합니다.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', 'AI 협업', 'PRD', '프롬프트 엔지니어링', '데이터 설계'],
    publishedAt: '2026-03-16',
    readingTime: '9분',
    relatedGuides: ['supabase', 'env', 'backend'],
    contentType: 'narrative',
    series: { id: 'linkmap-dev-story', order: 2, totalParts: 3 },
    narrativeHook: 'AI는 구현을 담당하고, 사람은 설계를 담당한다',
  },
  {
    slug: 'linkmap-dev-story-1-infra-battle',
    title: 'ERP 담당자의 Linkmap 개발기 ① — 코드는 안 바꿨는데 서비스가 안 된다',
    description: '상장사 ERP 담당자가 Claude Code와 Supabase로 Linkmap을 만든 이야기. 배포 환경 3번 이전, OAuth 콘솔 설정, 환경변수 누락으로 에러도 없이 멈추는 서비스의 실제 경험.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', '비개발자 개발', '배포', '환경변수', 'OAuth'],
    publishedAt: '2026-03-14',
    readingTime: '8분',
    relatedGuides: ['env', 'deploy', 'auth'],
    contentType: 'narrative',
    series: { id: 'linkmap-dev-story', order: 1, totalParts: 3 },
    narrativeHook: '코드는 30분, 콘솔 설정은 3시간',
  },
  {
    slug: 'vibe-coding-stripe-payment-guide',
    title: '바이브코딩 프로젝트에 결제 기능 추가하기 — Stripe 연동 가이드',
    description: 'Stripe Checkout으로 바이브코딩 프로젝트에 결제 기능을 추가하는 방법. 한국에서의 제약, 테스트 모드, Webhook 설정, 보안 주의사항까지 실전 가이드.',
    category: 'tutorial',
    tags: ['Stripe 연동', '결제 기능', '바이브코딩 수익화', '온라인 결제', 'SaaS 결제'],
    publishedAt: '2026-03-12',
    readingTime: '7분',
    relatedGuides: ['payment', 'env', 'security', 'deploy'],
  },
  {
    slug: 'vibe-coding-side-project-monetization',
    title: '바이브코딩으로 사이드 프로젝트 수익화하기 — 현실적인 전략',
    description: '바이브코딩으로 만든 프로젝트를 수익화하는 현실적인 전략. SaaS, 도구, 마켓플레이스 유형별 접근법과 비용 최적화, 마케팅 최소 전략까지.',
    category: 'insight',
    tags: ['사이드 프로젝트 수익화', '바이브코딩 수익', '1인 SaaS', 'AI 앱 수익화', '개인 프로젝트'],
    publishedAt: '2026-03-10',
    readingTime: '6분',
    relatedGuides: ['payment', 'deploy', 'env'],
  },
  {
    slug: 'vibe-coding-ecosystem-2026',
    title: '2026 바이브코딩 생태계 총정리 — 트렌드, 도구, 커뮤니티',
    description: '바이브코딩 시장 규모 $47억→$123억, 에이전트 코딩의 부상, MCP 표준화, 한국 커뮤니티 현황까지. 2026년 바이브코딩 생태계를 데이터 기반으로 총정리합니다.',
    category: 'insight',
    tags: ['바이브코딩 트렌드', 'AI 코딩 2026', '바이브코딩 생태계', 'AI 에이전트 코딩', '코딩 트렌드'],
    publishedAt: '2026-03-08',
    readingTime: '7분',
    relatedGuides: ['ai-tools', 'deploy', 'env'],
  },
  {
    slug: 'vibe-coding-vs-traditional-coding',
    title: '바이브코딩 vs 전통 코딩 — 언제 어떤 것을 선택할까',
    description: '바이브코딩과 전통 코딩의 장단점을 균형있게 비교합니다. 프로젝트 유형별 추천, 복잡성 천장 개념, 하이브리드 접근법, 학습 관점에서의 분석까지.',
    category: 'comparison',
    tags: ['바이브코딩 vs 코딩', 'AI 코딩 한계', '바이브코딩 장단점', '코딩 배워야 하나', '전통 코딩'],
    publishedAt: '2026-03-06',
    readingTime: '6분',
    relatedGuides: ['ai-tools', 'frontend', 'backend'],
  },
  {
    slug: 'supabase-for-vibe-coders',
    title: 'Supabase로 백엔드 없이 앱 만들기 — 바이브코더의 데이터베이스',
    description: '코딩 경험 없이도 Supabase로 데이터베이스와 로그인 기능을 추가하는 방법. 프로젝트 생성, CRUD, OAuth 인증, RLS 보안까지 바이브코더를 위한 입문 가이드.',
    category: 'tutorial',
    tags: ['Supabase 시작하기', '백엔드 없이 앱', '서버리스 데이터베이스', '바이브코딩 Supabase', 'Firebase 대안'],
    publishedAt: '2026-03-04',
    readingTime: '6분',
    relatedGuides: ['supabase', 'backend', 'auth', 'env'],
  },
  {
    slug: 'vibe-coding-launch-checklist',
    title: '바이브코딩으로 만든 앱, 실제 사용자에게 공개하기 전 체크리스트',
    description: '바이브코딩 프로젝트를 프로덕션에 공개하기 전 점검해야 할 6대 영역. 보안, 성능, SEO, 에러 모니터링, 백업, 비용 예측까지 빠짐없는 런칭 체크리스트.',
    category: 'tutorial',
    tags: ['런칭 체크리스트', '서비스 공개 전 점검', '바이브코딩 보안', '사이트 성능', '런칭 준비'],
    publishedAt: '2026-03-02',
    readingTime: '7분',
    relatedGuides: ['deploy', 'env', 'security', 'monitoring'],
  },
  {
    slug: 'git-basics-for-vibe-coders',
    title: 'Git을 모르는 바이브코더를 위한 버전 관리 최소 가이드',
    description: 'AI가 코드를 망쳤을 때 되돌리는 유일한 방법, Git. GitHub 계정 만들기, 5가지 필수 명령어, .gitignore 설정까지 바이브코더를 위한 최소 가이드.',
    category: 'tutorial',
    tags: ['Git 초보 가이드', '비개발자 Git', 'GitHub 시작하기', '버전 관리 기초', '바이브코딩 Git'],
    publishedAt: '2026-02-28',
    readingTime: '6분',
    relatedGuides: ['github', 'version-control', 'env', 'deploy'],
  },
  // ======================================================================
  // 신규 5개 — 2026-03-23 기획
  // ======================================================================
  {
    slug: 'cursor-ai-beginner-guide',
    title: 'Cursor AI 완전 정복 — 비개발자를 위한 AI 코딩 에디터 시작 가이드',
    description: '가장 인기 있는 AI 코딩 도구 Cursor. 설치부터 첫 프롬프트, Composer vs Chat 차이, 에러 대처법까지 코딩 경험 없는 분을 위한 실전 가이드.',
    category: 'tutorial',
    tags: ['Cursor AI', 'AI 코딩 에디터', 'Cursor 사용법', 'AI 코딩 입문', 'Cursor 설치'],
    publishedAt: '2026-03-23',
    readingTime: '10분',
    relatedGuides: ['ai-tools', 'github', 'env', 'frontend'],
  },
  {
    slug: 'oneclick-deploy-linkmap-guide',
    title: '원클릭 배포 실전 가이드 — Linkmap 템플릿으로 5분 만에 내 사이트 공개',
    description: '6개 템플릿 상세 비교부터 배포 후 커스터마이징까지. Linkmap 원클릭 배포로 코딩 없이 내 사이트를 인터넷에 공개하는 전체 과정.',
    category: 'tutorial',
    tags: ['원클릭 배포', 'Linkmap 템플릿', '무료 사이트 만들기', '포트폴리오 배포', '5분 배포'],
    publishedAt: '2026-03-23',
    readingTime: '8분',
    relatedGuides: ['deploy', 'github', 'frontend', 'domain'],
  },
  {
    slug: 'nocode-vs-vibe-coding',
    title: 'No-code vs Vibe Coding — Wix로 만들까, AI로 코딩할까',
    description: 'Wix·Framer·Notion 같은 No-code와 Cursor·Bolt 같은 Vibe Coding의 결정적 차이. 비용, 자유도, 확장성, 소유권 4가지 기준으로 상황별 추천.',
    category: 'comparison',
    tags: ['No-code vs Vibe Coding', 'Wix 대안', 'Framer 비교', 'AI 코딩 장단점', '노코드 한계'],
    publishedAt: '2026-03-23',
    readingTime: '7분',
    relatedGuides: ['ai-tools', 'deploy', 'frontend'],
  },
  {
    slug: 'vibe-coding-maintenance-guide',
    title: '바이브코딩 프로젝트 유지보수 — AI가 만든 코드, 혼자서 관리하는 법',
    description: '배포는 했는데 에러가 나면? 업데이트는? AI가 만든 코드를 이해하지 못해도 유지보수할 수 있는 실전 전략 5가지.',
    category: 'insight',
    tags: ['바이브코딩 유지보수', 'AI 코드 관리', '프로젝트 관리', '버그 수정', '의존성 업데이트'],
    publishedAt: '2026-03-23',
    readingTime: '7분',
    relatedGuides: ['github', 'env', 'deploy', 'ai-tools'],
  },
  {
    slug: 'vibe-coding-deploy-guide',
    title: '바이브코딩 프로젝트 배포 완전 정복 — Vercel, Cloudflare, Netlify',
    description: '바이브코딩으로 만든 앱을 실제 인터넷에 공개하는 방법. Vercel, Cloudflare Pages, Netlify 3대 플랫폼을 무료 플랜 기준으로 비교하고 배포 방법을 안내합니다.',
    category: 'tutorial',
    tags: ['바이브코딩 배포', 'Vercel', 'Cloudflare Pages', 'Netlify', '무료 호스팅'],
    publishedAt: '2026-02-24',
    readingTime: '6분',
    relatedGuides: ['deploy', 'cloudflare', 'vercel', 'env'],
  },
  {
    slug: 'vibe-coding-portfolio-site-30min',
    title: '바이브코딩으로 포트폴리오 사이트 만들기 — 30분 완성',
    description: 'v0 또는 Bolt로 포트폴리오 사이트를 30분 만에 만드는 방법. 섹션별 프롬프트 예시, Vercel 무료 배포, 커스텀 도메인 연결까지 실전 튜토리얼.',
    category: 'tutorial',
    tags: ['포트폴리오 사이트', 'AI로 웹사이트', '바이브코딩 포트폴리오', 'Vercel 배포', 'v0'],
    publishedAt: '2026-02-22',
    readingTime: '6분',
    relatedGuides: ['deploy', 'frontend', 'ai-tools', 'domain'],
  },
  {
    slug: 'vibe-coding-learning-roadmap',
    title: '바이브코딩 학습 로드맵 — 원클릭 배포에서 나만의 서비스까지 5단계',
    description: '8주 준비 대신 5분 만에 배포하고 배우는 바이브코딩 로드맵. 원클릭 배포 → Cursor AI 수정 → Supabase DB → Cloudflare/Vercel 고도화 → 서비스 관리까지 단계별 가이드.',
    category: 'vibe-coding',
    tags: ['바이브코딩 로드맵', '원클릭 배포', 'Cursor AI 코딩', 'Cloudflare 배포', 'Vercel 배포', '바이브코딩 순서'],
    publishedAt: '2026-02-19',
    updatedAt: '2026-03-23',
    readingTime: '8분',
    relatedGuides: ['ai-tools', 'env', 'frontend', 'deploy', 'cloudflare'],
  },
  {
    slug: 'vibe-coding-common-mistakes',
    title: '바이브코딩 실패 패턴 5가지 — 초보자가 반드시 피해야 할 함정',
    description: '바이브코딩 프로젝트가 중단되는 5가지 반복 패턴과 해결법. 범위 관리, AI 코드 검증, Git, API 키 보안, 배포 전략까지 실패를 피하는 실전 가이드.',
    category: 'insight',
    tags: ['바이브코딩 실패', 'AI 코딩 실수', '바이브코딩 주의사항', '초보 개발 실수', 'API 키 보안'],
    publishedAt: '2026-02-17',
    readingTime: '6분',
    relatedGuides: ['env', 'github', 'deploy', 'ai-tools'],
  },
  {
    slug: 'vibe-coding-prompt-writing-guide',
    title: 'AI에게 잘 시키는 법 — 바이브코딩 프롬프트 작성 가이드',
    description: '바이브코딩에서 가장 중요한 스킬은 프롬프트 작성입니다. 나쁜 프롬프트와 좋은 프롬프트의 차이, 4단계 구조화 기법, 컨텍스트 관리법을 실전 예시와 함께 안내합니다.',
    category: 'tutorial',
    tags: ['바이브코딩 프롬프트', '프롬프트 엔지니어링', 'AI 코딩 팁', 'Cursor', 'Claude Code'],
    publishedAt: '2026-02-14',
    readingTime: '7분',
    relatedGuides: ['ai-tools', 'frontend', 'backend', 'deploy'],
  },
  {
    slug: 'vibe-coding-tools-comparison-2026',
    title: '2026 바이브코딩 도구 완벽 비교 — 목적별 추천 가이드',
    description: 'Cursor, Claude Code, Windsurf, Lovable, Bolt.new, v0까지 6개 바이브코딩 도구를 목적별로 비교합니다. 가격, 장단점, 추천 대상을 한눈에 정리했습니다.',
    category: 'comparison',
    tags: ['바이브코딩 도구', 'Cursor', 'Claude Code', 'Lovable', 'Bolt.new', 'v0'],
    publishedAt: '2026-02-11',
    readingTime: '8분',
    relatedGuides: ['ai-tools', 'deploy', 'env', 'github'],
  },
  {
    slug: 'vibe-coding-getting-started-guide',
    title: '바이브코딩 시작하기 — 비개발자를 위한 첫걸음 가이드',
    description: '코딩 경험이 전혀 없어도 AI와 대화하며 앱을 만들 수 있습니다. 바이브코딩의 개념, 필요한 준비물, 첫 프로젝트 아이디어, 실전 워크플로까지 완전 입문 가이드.',
    category: 'vibe-coding',
    tags: ['바이브코딩 시작', '비개발자 코딩', 'AI 코딩 입문', '바이브코딩 준비', '코딩 없이 앱 만들기'],
    publishedAt: '2026-02-08',
    readingTime: '6분',
    relatedGuides: ['ai-tools', 'env', 'frontend', 'deploy'],
  },
  {
    slug: 'ai-coding-tools-security-comparison',
    title: '2026 AI 코딩 도구 비교 — 보안과 환경변수 관점에서',
    description: 'ChatGPT, Claude Code, Cursor, Gemini Code Assist, Windsurf, GitHub Copilot 6종을 보안 관점에서 비교합니다. .env 파일 처리 방식, 생성 코드 보안 품질, 도구 자체 CVE를 분석하고 공통 대응 전략을 제안합니다.',
    category: 'comparison',
    tags: ['ChatGPT', 'Claude Code', 'Cursor', 'Gemini', 'Windsurf', '도구 비교', 'AI 코딩', '보안'],
    publishedAt: '2026-02-05',
    readingTime: '8분',
    relatedGuides: ['env', 'github', 'auth', 'deploy'],
    ogImage: '/blog/og/ai-coding-tools-security-comparison.png',
  },
  {
    slug: 'ai-code-security-reality',
    title: 'AI가 만든 코드의 45%는 보안 결함이 있다 — 바이브 코더가 알아야 할 현실',
    description: 'Veracode 2025 보고서 핵심 분석. AI 생성 코드의 XSS 방어 실패율 86%, SQL 인젝션 20%, Java 70%+. 보안 검증 파이프라인과 프로덕션 배포 전 최소 체크리스트를 제안합니다.',
    category: 'insight',
    tags: ['AI 코드 보안', '바이브 코딩', 'XSS', 'SQL 인젝션', 'Veracode'],
    publishedAt: '2026-02-02',
    readingTime: '7분',
    relatedGuides: ['auth', 'env', 'backend', 'supabase'],
    ogImage: '/blog/og/ai-code-security-reality.png',
  },
  {
    slug: 'vibe-coding-security-checklist',
    title: '바이브 코딩 보안 체크리스트 — 프로덕션 배포 전 반드시 확인할 15가지',
    description: '바이브 코딩 앱의 보안 체크리스트 15가지. AI가 빠뜨리기 쉬운 인증, 입력 검증, 환경변수, RLS, CORS까지.',
    category: 'tutorial',
    tags: ['체크리스트', '프로덕션 배포', '보안', '바이브 코딩', 'RLS', 'Zod'],
    publishedAt: '2026-01-30',
    readingTime: '6분',
    relatedGuides: ['auth', 'env', 'deploy', 'supabase'],
    ogImage: '/blog/og/vibe-coding-security-checklist.png',
  },
  {
    slug: 'supabase-rls-vibe-coding-risk',
    title: 'Supabase RLS 미설정 — 바이브 코딩의 가장 위험한 실수',
    description: 'Lovable로 만든 170+ 앱에서 Supabase RLS 미설정 데이터 노출(CVE-2025-48757). 바이브 코더를 위한 Supabase 보안 체크리스트.',
    category: 'vibe-coding',
    tags: ['Supabase', 'RLS', '바이브 코딩', '보안', 'Lovable', 'CVE'],
    publishedAt: '2026-01-27',
    readingTime: '7분',
    relatedGuides: ['supabase', 'auth', 'env', 'backend'],
    ogImage: '/blog/og/supabase-rls-vibe-coding-risk.png',
  },
  {
    slug: 'ai-agent-reads-your-env',
    title: 'AI 코딩 에이전트가 당신의 .env를 읽고 있다',
    description: 'Claude Code, Cursor 등 AI 코딩 어시스턴트가 .env 시크릿을 자동 로드하고 외부 전송할 수 있다는 Knostic 연구. 시크릿 격리 전략.',
    category: 'env-management',
    tags: ['AI 코딩 에이전트', '.env', '시크릿 유출', 'Claude Code', 'Cursor'],
    publishedAt: '2026-01-24',
    readingTime: '6분',
    relatedGuides: ['env', 'auth', 'github', 'supabase'],
    ogImage: '/blog/og/ai-agent-reads-your-env.png',
  },
  {
    slug: 'env-file-exposure-crisis',
    title: '1,200만 개의 .env 파일이 인터넷에 노출되어 있다',
    description: '2026년 3월 보고서 — 전 세계 1,200만 IP에서 .env 파일 노출. Unit 42가 추적한 2.3억 타겟 클라우드 갈취 캠페인의 실체.',
    category: 'env-management',
    tags: ['.env', '환경변수 유출', '클라우드 보안', '시크릿 관리', 'Unit 42'],
    publishedAt: '2026-01-21',
    readingTime: '6분',
    relatedGuides: ['env', 'deploy', 'cloudflare', 'github'],
    ogImage: '/blog/og/env-file-exposure-crisis.png',
  },
  {
    slug: 'vibe-coding-secret-leak-crisis',
    title: '바이브 코딩 시대, 2,380만 개의 시크릿이 유출되고 있다',
    description: 'AI 도구 사용 시 시크릿 유출률 40% 증가, GitHub 연간 2,380만 건 유출 데이터. 바이브 코더를 위한 시크릿 관리 전략.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', 'API 키 유출', '시크릿 관리', '보안', 'GitHub'],
    publishedAt: '2026-01-17',
    readingTime: '6분',
    relatedGuides: ['env', 'github', 'auth', 'deploy'],
    ogImage: '/blog/og/vibe-coding-secret-leak-crisis.png',
  },
  {
    slug: 'doppler-vs-infisical-vs-linkmap-comparison',
    title: 'Doppler vs Infisical vs Linkmap — 환경변수 관리 도구 비교 2026',
    description: '2026년 기준 주요 환경변수·시크릿 관리 도구 3종(Doppler, Infisical, Linkmap)의 기능, 가격, 사용성을 객관적으로 비교합니다. 어떤 도구가 내 팀에 맞는지 확인하세요.',
    category: 'comparison',
    tags: ['환경변수 관리 도구 비교', 'Doppler', 'Infisical', '시크릿 관리', '환경변수', 'API 키 관리'],
    publishedAt: '2026-01-14',
    readingTime: '6분',
    relatedGuides: ['env', 'github', 'deploy', 'cloudflare'],
    ogImage: '/blog/og/doppler-vs-infisical-vs-linkmap-comparison.png',
  },
  {
    slug: 'microservice-dependency-service-map',
    title: '마이크로서비스 환경에서 서비스 의존성 관리하기 — 서비스맵이 필요한 이유',
    description: '마이크로서비스 아키텍처에서 서비스 간 의존성이 복잡해지는 원인, 장애 전파 사례, 의존성 시각화가 팀 생산성과 장애 대응 속도에 미치는 영향을 분석합니다.',
    category: 'insight',
    tags: ['마이크로서비스', '서비스 의존성', '서비스맵', '장애 전파', 'MSA', '시각화'],
    publishedAt: '2026-01-10',
    readingTime: '5분',
    relatedGuides: ['backend', 'deploy', 'github', 'frontend'],
    ogImage: '/blog/og/microservice-dependency-service-map.png',
  },
  {
    slug: 'api-key-leak-incident-response',
    title: 'API 키 유출 사고 대응 — 개발자가 알아야 할 즉시 조치와 예방법',
    description: 'AWS, GitHub, OpenAI API 키 유출 시 즉시 취해야 할 조치와 체크리스트, 그리고 재발을 막는 환경변수 보안 전략을 정리합니다.',
    category: 'env-management',
    tags: ['API 키 유출', '시크릿 유출', '환경변수 보안', '보안 사고 대응', '개발자 보안'],
    publishedAt: '2026-01-06',
    readingTime: '6분',
    relatedGuides: ['env', 'github', 'deploy', 'openai'],
    ogImage: '/blog/og/api-key-leak-incident-response.png',
  },
  {
    slug: 'what-is-vibe-coding',
    title: '바이브 코딩이란 무엇인가 — AI 시대의 새로운 개발 방식',
    description: '코딩 경험 없이 AI에게 자연어로 지시하여 소프트웨어를 만드는 바이브 코딩의 개념, 가능성, 그리고 실전 워크플로를 정리합니다.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', 'AI 코딩', 'Cursor', 'Claude', '노코드'],
    publishedAt: '2025-04-07',
    readingTime: '8분',
    relatedGuides: ['env', 'github', 'supabase', 'vercel'],
    ogImage: '/blog/og/what-is-vibe-coding.png',
  },
  {
    slug: 'why-dotenv-is-dangerous',
    title: '환경변수 관리, .env 파일은 왜 위험한가',
    description: '.env 파일의 보안 위험성과 API 키 유출 사례를 분석하고, 안전한 환경변수 관리 방법을 소개합니다.',
    category: 'env-management',
    tags: ['환경변수', '.env', 'API 키', '보안', '시크릿 관리'],
    publishedAt: '2025-04-14',
    readingTime: '7분',
    relatedGuides: ['env', 'github', 'deploy'],
    ogImage: '/blog/og/why-dotenv-is-dangerous.png',
  },
  {
    slug: 'vibe-coding-can-you-build-saas',
    title: '바이브 코딩으로 SaaS 만들기 — 진짜 가능할까?',
    description: 'AI로 실제 서비스를 만든 경험을 공유합니다. 가능한 것과 아직 어려운 것, 그리고 실전 팁.',
    category: 'vibe-coding',
    tags: ['바이브 코딩', 'SaaS', '사이드 프로젝트', 'AI 코딩', '경험담'],
    publishedAt: '2025-04-21',
    readingTime: '10분',
    relatedGuides: ['env', 'supabase', 'vercel', 'github'],
    ogImage: '/blog/og/vibe-coding-can-you-build-saas.png',
  },
  {
    slug: 'service-map-tutorial',
    title: 'Linkmap으로 서비스맵 만들기 — 3분 튜토리얼',
    description: '프로젝트에 연결된 모든 외부 서비스를 시각화하는 서비스맵을 3분 만에 만드는 방법을 단계별로 안내합니다.',
    category: 'tutorial',
    tags: ['서비스맵', 'Linkmap', '튜토리얼', '시각화', '프로젝트 관리'],
    publishedAt: '2025-05-05',
    readingTime: '5분',
    relatedGuides: ['env', 'github', 'deploy'],
    ogImage: '/blog/og/service-map-tutorial.png',
  },
  {
    slug: 'dotenv-safe-management-tips',
    title: '.env 파일 안전하게 관리하는 5가지 방법',
    description: '개발자가 반드시 알아야 할 .env 파일 보안 실천법. .gitignore 설정부터 환경변수 암호화 도구까지.',
    category: 'env-management',
    tags: ['환경변수', '.env', '보안', 'gitignore', 'GitHub Secrets'],
    publishedAt: '2025-05-12',
    readingTime: '6분',
    relatedGuides: ['env', 'github', 'deploy'],
    ogImage: '/blog/og/dotenv-safe-management-tips.png',
  },
  {
    slug: 'github-secrets-automation',
    title: 'GitHub Secrets 자동화 — 수동 설정은 이제 그만',
    description: 'GitHub Secrets를 하나하나 수동 설정하는 대신, Linkmap으로 환경변수를 자동 배포하는 방법을 소개합니다.',
    category: 'tutorial',
    tags: ['GitHub Secrets', '환경변수', '자동화', 'CI/CD', 'GitHub Actions'],
    publishedAt: '2025-05-19',
    readingTime: '6분',
    relatedGuides: ['github', 'env', 'deploy'],
    ogImage: '/blog/og/github-secrets-automation.png',
  },
];
