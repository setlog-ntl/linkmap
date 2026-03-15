export interface FaqItem {
  question: string;
  answer: string;
  category: 'platform' | 'vibe-coding' | 'env' | 'security' | 'deploy' | 'service';
}

export const FAQ_CATEGORIES: Record<string, string> = {
  'vibe-coding': '바이브 코딩',
  platform: 'Linkmap 플랫폼',
  env: '환경변수',
  security: '보안',
  deploy: '배포',
  service: '서비스 연동',
};

export const FAQ_DATA: FaqItem[] = [
  // 바이브 코딩
  {
    category: 'vibe-coding',
    question: '바이브 코딩이란 무엇인가요?',
    answer:
      '바이브 코딩(Vibe Coding)은 AI에게 자연어로 원하는 기능을 설명하면 AI가 코드를 작성해주는 새로운 개발 방식입니다. ChatGPT, Claude, Cursor 같은 AI 도구를 활용해 코딩 경험 없이도 앱과 웹사이트를 만들 수 있습니다.',
  },
  {
    category: 'vibe-coding',
    question: '바이브 코딩으로 실제 서비스를 만들 수 있나요?',
    answer:
      '네, 가능합니다. 다만 AI가 생성한 코드를 배포하려면 GitHub 저장소, 환경변수 설정, 외부 서비스 연동 같은 프로젝트 설정이 필요합니다. Linkmap은 이 설정 과정을 자동화하고 시각화하여 바이브 코더가 배포까지 완료할 수 있도록 돕습니다.',
  },
  {
    category: 'vibe-coding',
    question: '코딩을 전혀 모르는데 Linkmap을 사용할 수 있나요?',
    answer:
      'Linkmap은 초보자를 위해 설계되었습니다. 원클릭 배포 템플릿으로 3분 만에 홈페이지를 만들 수 있고, 10개의 교육 가이드가 환경변수, 인증, 배포 같은 핵심 개념을 쉽게 설명합니다.',
  },
  // Linkmap 플랫폼
  {
    category: 'platform',
    question: 'Linkmap은 무료인가요?',
    answer:
      'Linkmap Free 플랜은 무료로 프로젝트 3개, 환경변수 50개를 관리할 수 있습니다. 80+ 서비스 카탈로그 열람, 10개 교육 가이드, 6개 원클릭 템플릿도 무료로 이용 가능합니다. Pro 플랜은 월 9,900원으로 무제한 프로젝트와 팀 협업을 지원합니다.',
  },
  {
    category: 'platform',
    question: 'Linkmap의 서비스 카탈로그란?',
    answer:
      'Linkmap은 Supabase, Vercel, OpenAI, Stripe 등 80+ 외부 서비스의 연결 방법, 필요한 환경변수, 가격 정보, 난이도를 한곳에서 확인할 수 있는 카탈로그를 제공합니다. 각 서비스의 대안(alternative)과 비교 정보도 포함되어 있습니다.',
  },
  {
    category: 'platform',
    question: '원클릭 배포 템플릿은 어떤 것이 있나요?',
    answer:
      'Linkmap은 6개 원클릭 배포 템플릿을 제공합니다: 개발자 홈(포트폴리오), 링크카드(SNS 링크 허브), 프리랜서 홍보, 디지털 명함, 내 홈페이지, 우리가게 홍보. Google 계정으로 로그인하면 GitHub 연동부터 Vercel/Cloudflare 배포까지 자동으로 처리됩니다.',
  },
  {
    category: 'platform',
    question: '서비스 맵이란 무엇인가요?',
    answer:
      'Linkmap의 서비스 맵은 React Flow 기반 시각화 도구로, 프로젝트에 연결된 외부 서비스(DB, 인증, 결제, AI 등)의 관계를 노드와 엣지로 한눈에 보여줍니다. 어떤 서비스가 어떤 환경변수를 사용하는지 시각적으로 파악할 수 있습니다.',
  },
  // 환경변수
  {
    category: 'env',
    question: '환경변수란 무엇인가요?',
    answer:
      '환경변수(Environment Variable)는 앱이 실행될 때 필요한 설정값을 코드 외부에 저장하는 방법입니다. API 키, 데이터베이스 URL, 시크릿 같은 민감한 정보를 .env 파일에 보관하여 코드에 직접 노출하지 않습니다.',
  },
  {
    category: 'env',
    question: 'API 키를 안전하게 관리하는 방법은?',
    answer:
      'API 키는 절대 코드에 직접 작성하지 않습니다. .env.local 파일에 저장하고 .gitignore에 추가하세요. 배포 시에는 Vercel/Cloudflare 대시보드에서 환경변수로 등록합니다. Linkmap을 사용하면 AES-256-GCM 암호화로 안전하게 보관되며, GitHub 시크릿에 자동 배포됩니다.',
  },
  {
    category: 'env',
    question: 'NEXT_PUBLIC_ 접두사는 언제 사용하나요?',
    answer:
      'Next.js에서 NEXT_PUBLIC_ 접두사가 붙은 환경변수만 브라우저(클라이언트)에서 접근할 수 있습니다. Supabase URL, GA ID처럼 공개해도 안전한 값에만 사용하세요. API 키, 시크릿, DB 비밀번호에는 절대 NEXT_PUBLIC_을 붙이면 안 됩니다.',
  },
  // 보안
  {
    category: 'security',
    question: 'Linkmap에 저장한 API 키는 안전한가요?',
    answer:
      'Linkmap은 모든 API 키와 시크릿을 AES-256-GCM 알고리즘으로 암호화하여 저장합니다. 암호화 키는 서버 환경변수에만 존재하며, 데이터베이스에는 암호문만 보관됩니다. 복호화된 값은 로그에 기록되지 않으며, Supabase RLS로 소유자만 접근할 수 있습니다.',
  },
  {
    category: 'security',
    question: 'GitHub에 실수로 API 키를 올렸으면 어떻게 하나요?',
    answer:
      '즉시 해당 서비스에서 키를 폐기(revoke)하고 새 키를 발급받으세요. git rm --cached .env로 추적을 해제하고 .gitignore에 .env를 추가한 뒤 커밋합니다. 이미 노출된 키는 봇이 수초 내에 탐지할 수 있으므로 반드시 새 키로 교체해야 합니다.',
  },
  // 배포
  {
    category: 'deploy',
    question: '무료로 홈페이지를 만드는 방법은?',
    answer:
      'Linkmap의 원클릭 배포 기능을 사용하면 무료로 홈페이지를 만들 수 있습니다. Google 계정으로 로그인 → 템플릿 선택(개발자 홈, 링크카드, 명함 등) → 내용 입력 → 배포 버튼 클릭만으로 완성됩니다. Vercel이나 Cloudflare의 무료 플랜으로 호스팅됩니다.',
  },
  {
    category: 'deploy',
    question: 'Vercel과 Cloudflare 중 어디에 배포해야 하나요?',
    answer:
      'Vercel은 Next.js 공식 배포 플랫폼으로 설정이 간편하고 프리뷰 배포가 강력합니다. Cloudflare Workers는 전 세계 Edge에서 실행되어 속도가 빠르고 무료 요청 한도가 넉넉합니다. 초보자는 Vercel, 트래픽이 많거나 비용 최적화가 중요하면 Cloudflare를 추천합니다.',
  },
  // 서비스 연동
  {
    category: 'service',
    question: 'Supabase와 Firebase 중 무엇을 선택해야 하나요?',
    answer:
      'Supabase는 오픈소스 PostgreSQL 기반으로 SQL 쿼리, RLS(Row Level Security), 실시간 구독을 지원합니다. Firebase는 Google 생태계와의 통합이 강력하고 NoSQL(Firestore) 기반입니다. 바이브 코딩에는 Supabase가 AI 코드 생성과 더 호환됩니다.',
  },
  {
    category: 'service',
    question: 'OAuth 로그인은 어떻게 설정하나요?',
    answer:
      'Supabase Auth를 사용하면 Google, GitHub, Kakao 로그인을 쉽게 추가할 수 있습니다. 각 서비스의 개발자 콘솔에서 OAuth 앱을 만들고, Client ID와 Secret을 Supabase 대시보드에 등록하면 됩니다. Linkmap의 인증 가이드에서 단계별로 안내합니다.',
  },
];
