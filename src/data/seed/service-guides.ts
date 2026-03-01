export interface ApiKeyIssueStepSeed {
  step: number;
  title: string;
  description: string;
}

export interface ServiceFeatureGuideSeed {
  id: string;
  name: string;
  description: string;
  tag?: 'free' | 'paid' | 'beta';
  api_key?: {
    env_var: string;
    url: string;
    url_label: string;
    issue_steps: ApiKeyIssueStepSeed[];
  };
  setup_steps?: {
    step: number;
    title: string;
    title_ko: string;
    description: string;
    description_ko: string;
    code_snippet?: string;
  }[];
  code_example?: string;
}

export interface ServiceSignupGuideSeed {
  url: string;
  steps: string[];
  free_tier?: string;
}

export interface ServiceGuideSeed {
  service_id: string;
  quick_start: string;
  quick_start_en: string;
  setup_steps: {
    step: number;
    title: string;
    title_ko: string;
    description: string;
    description_ko: string;
    code_snippet?: string
  }[];
  code_examples: Record<string, string>;
  common_pitfalls: {
    title: string;
    title_ko: string;
    problem: string;
    solution: string;
    code?: string
  }[];
  integration_tips: {
    with_service_slug: string;
    tip: string;
    tip_ko: string;
    code?: string
  }[];
  pros: { text: string; text_ko: string }[];
  cons: { text: string; text_ko: string }[];
  api_key_url?: string;
  api_key_url_label?: string;
  // 신규 (v2)
  signup?: ServiceSignupGuideSeed;
  features?: ServiceFeatureGuideSeed[];
}

// Service ID constants
const S = {
  supabase: '10000000-0000-4000-a000-000000000001',
  firebase: '10000000-0000-4000-a000-000000000002',
  vercel: '10000000-0000-4000-a000-000000000003',
  stripe: '10000000-0000-4000-a000-000000000005',
  clerk: '10000000-0000-4000-a000-000000000006',
  resend: '10000000-0000-4000-a000-000000000008',
  openai: '10000000-0000-4000-a000-000000000010',
  sentry: '10000000-0000-4000-a000-000000000013',
  neon: '10000000-0000-4000-a000-000000000015',
  posthog: '10000000-0000-4000-a000-000000000019',
  // Social Login
  kakao_login: '10000000-0000-4000-a000-000000000054',
  google_oauth: '10000000-0000-4000-a000-000000000055',
  naver_login: '10000000-0000-4000-a000-000000000056',
  apple_login: '10000000-0000-4000-a000-000000000057',
  // Advertising
  google_adsense: '10000000-0000-4000-a000-000000000097',
  kakao_adfit: '10000000-0000-4000-a000-000000000098',
  criteo: '10000000-0000-4000-a000-000000000099',
  taboola: '10000000-0000-4000-a000-000000000100',
  amazon_aps: '10000000-0000-4000-a000-000000000101',
  google_ad_manager: '10000000-0000-4000-a000-000000000102',
  // Infra / Deploy / CDN / Storage
  netlify: '10000000-0000-4000-a000-000000000004',
  railway: '10000000-0000-4000-a000-000000000016',
  cloudflare: '10000000-0000-4000-a000-000000000028',
  flyio: '10000000-0000-4000-a000-000000000029',
  render: '10000000-0000-4000-a000-000000000038',
  docker: '10000000-0000-4000-a000-000000000085',
  aws_s3: '10000000-0000-4000-a000-000000000020',
  r2: '10000000-0000-4000-a000-000000000078',
  // Batch 2 — Auth / Database / Cache
  nextauth:      '10000000-0000-4000-a000-000000000007',
  github_oauth:  '10000000-0000-4000-a000-000000000058',
  auth0:         '10000000-0000-4000-a000-000000000059',
  convex:        '10000000-0000-4000-a000-000000000060',
  drizzle:       '10000000-0000-4000-a000-000000000061',
  prisma:        '10000000-0000-4000-a000-000000000062',
  turso:         '10000000-0000-4000-a000-000000000063',
  redis_cloud:   '10000000-0000-4000-a000-000000000064',
  vercel_kv:     '10000000-0000-4000-a000-000000000065',
  planetscale:   '10000000-0000-4000-a000-000000000014',
  upstash_redis: '10000000-0000-4000-a000-000000000027',
};

export const serviceGuides: ServiceGuideSeed[] = [
  {
    service_id: S.supabase,
    quick_start: 'Supabase 프로젝트를 생성하고 Next.js 앱과 연결하여 인증, 데이터베이스, 스토리지를 즉시 사용할 수 있습니다.',
    quick_start_en: 'Create a Supabase project and connect it to your Next.js app to instantly use authentication, database, and storage.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Supabase client',
        title_ko: 'Supabase 클라이언트 설치',
        description: 'Install the Supabase JavaScript client library',
        description_ko: 'Supabase JS 클라이언트 라이브러리 설치',
        code_snippet: 'npm install @supabase/supabase-js'
      },
      {
        step: 2,
        title: 'Initialize client',
        title_ko: '클라이언트 초기화',
        description: 'Create a Supabase client with your project URL and anon key',
        description_ko: '프로젝트 URL과 anon key로 클라이언트 생성',
        code_snippet: `import { createClient } from '@supabase/supabase-js'
const supabase = createClient(URL, ANON_KEY)`
      },
      {
        step: 3,
        title: 'Use auth & database',
        title_ko: '인증 및 DB 사용',
        description: 'Start using authentication and database queries',
        description_ko: '인증 및 데이터베이스 쿼리 시작',
        code_snippet: `const { data } = await supabase.from('table').select()`
      }
    ],
    code_examples: {
      typescript: `import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Auth
await supabase.auth.signInWithOAuth({ provider: 'google' })

// Database
const { data } = await supabase.from('users').select('*')`
    },
    common_pitfalls: [
      {
        title: 'RLS not enabled',
        title_ko: 'RLS 미설정',
        problem: 'Tables are accessible without authentication',
        solution: 'Enable Row Level Security and create policies',
        code: `ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own" ON users FOR SELECT USING (auth.uid() = id);`
      },
      {
        title: 'Server/Client confusion',
        title_ko: '서버/클라이언트 혼용',
        problem: 'Using wrong client in server components',
        solution: 'Use createServerClient for server, createBrowserClient for client'
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Vercel integration to auto-sync environment variables',
        tip_ko: 'Vercel 통합으로 환경변수 자동 동기화',
      }
    ],
    pros: [
      { text: 'All-in-one backend (Auth, DB, Storage, Realtime)', text_ko: '올인원 백엔드 (인증, DB, 스토리지, 실시간)' },
      { text: 'PostgreSQL with automatic REST APIs', text_ko: 'PostgreSQL + 자동 REST API 생성' },
      { text: 'Generous free tier', text_ko: '넉넉한 무료 플랜' }
    ],
    cons: [
      { text: 'Learning curve for RLS policies', text_ko: 'RLS 정책 학습 곡선' },
      { text: 'Cold starts on free tier', text_ko: '무료 플랜 콜드 스타트' }
    ],
    api_key_url: 'https://supabase.com/dashboard/project/_/settings/api',
    api_key_url_label: 'Supabase Dashboard',
  },
  {
    service_id: S.firebase,
    quick_start: 'Firebase 프로젝트를 생성하고 웹앱을 등록하여 인증, Firestore, 클라우드 함수를 즉시 사용할 수 있습니다.',
    quick_start_en: 'Create a Firebase project and register your web app to instantly use Auth, Firestore, and Cloud Functions.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Firebase SDK',
        title_ko: 'Firebase SDK 설치',
        description: 'Install the Firebase JavaScript SDK',
        description_ko: 'Firebase JS SDK 설치',
        code_snippet: 'npm install firebase'
      },
      {
        step: 2,
        title: 'Initialize Firebase',
        title_ko: 'Firebase 초기화',
        description: 'Initialize Firebase with your config object',
        description_ko: 'config 객체로 Firebase 초기화',
        code_snippet: `import { initializeApp } from 'firebase/app'
const app = initializeApp(firebaseConfig)`
      }
    ],
    code_examples: {
      typescript: `import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Auth
await signInWithPopup(auth, new GoogleAuthProvider())

// Firestore
const snap = await getDocs(collection(db, 'users'))`
    },
    common_pitfalls: [
      {
        title: 'Security rules not set',
        title_ko: '보안 규칙 미설정',
        problem: 'Firestore/Storage accessible to all users',
        solution: 'Configure Firestore security rules in Firebase Console',
        code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use environment variables for Firebase config, deploy Cloud Functions separately',
        tip_ko: '환경변수로 Firebase 설정 관리, Cloud Functions는 별도 배포',
      }
    ],
    pros: [
      { text: 'Real-time database and NoSQL flexibility', text_ko: '실시간 DB와 NoSQL 유연성' },
      { text: 'Extensive mobile SDK support', text_ko: '모바일 SDK 풍부' },
      { text: 'Google Cloud integration', text_ko: 'Google Cloud 통합' }
    ],
    cons: [
      { text: 'Complex pricing for high usage', text_ko: '높은 사용량 시 복잡한 가격' },
      { text: 'Vendor lock-in with Google', text_ko: 'Google 종속성' }
    ],
    api_key_url: 'https://console.firebase.google.com',
    api_key_url_label: 'Firebase Console',
  },
  {
    service_id: S.vercel,
    quick_start: 'Vercel CLI로 Next.js 프로젝트를 배포하고 자동으로 CI/CD, 프리뷰, 도메인을 설정할 수 있습니다.',
    quick_start_en: 'Deploy your Next.js project with Vercel CLI and automatically set up CI/CD, previews, and domains.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Vercel CLI',
        title_ko: 'Vercel CLI 설치',
        description: 'Install the Vercel command-line interface',
        description_ko: 'Vercel CLI 설치',
        code_snippet: 'npm i -g vercel'
      },
      {
        step: 2,
        title: 'Deploy project',
        title_ko: '프로젝트 배포',
        description: 'Run vercel in your project directory',
        description_ko: '프로젝트 디렉토리에서 vercel 실행',
        code_snippet: 'vercel'
      }
    ],
    code_examples: {
      typescript: `// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "DATABASE_URL": "@database-url"
  }
}`
    },
    common_pitfalls: [
      {
        title: 'Environment variable mismatch',
        title_ko: '환경변수 불일치',
        problem: 'Local env vars not synced to Vercel',
        solution: 'Use vercel env pull or add vars in Vercel dashboard'
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use Vercel-Supabase integration for automatic env var sync',
        tip_ko: 'Vercel-Supabase 통합으로 환경변수 자동 동기화',
      }
    ],
    pros: [
      { text: 'Zero-config Next.js deployment', text_ko: 'Next.js 무설정 배포' },
      { text: 'Automatic preview deployments for PRs', text_ko: 'PR별 자동 프리뷰 배포' },
      { text: 'Global CDN and edge functions', text_ko: '글로벌 CDN 및 엣지 함수' }
    ],
    cons: [
      { text: 'Expensive for high bandwidth', text_ko: '높은 대역폭 사용 시 비쌈' },
      { text: 'Limited to 10s serverless timeout on Hobby', text_ko: 'Hobby 플랜 10초 타임아웃' }
    ],
    api_key_url: 'https://vercel.com/account/tokens',
    api_key_url_label: 'Vercel Tokens',
  },
  {
    service_id: S.stripe,
    quick_start: 'Stripe 계정을 생성하고 API 키를 발급받아 결제, 구독, 인보이스를 처리할 수 있습니다.',
    quick_start_en: 'Create a Stripe account and get API keys to handle payments, subscriptions, and invoices.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Stripe SDK',
        title_ko: 'Stripe SDK 설치',
        description: 'Install the Stripe Node library',
        description_ko: 'Stripe Node 라이브러리 설치',
        code_snippet: 'npm install stripe'
      },
      {
        step: 2,
        title: 'Initialize Stripe',
        title_ko: 'Stripe 초기화',
        description: 'Create a Stripe instance with your secret key',
        description_ko: 'Secret key로 Stripe 인스턴스 생성',
        code_snippet: `import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)`
      },
      {
        step: 3,
        title: 'Create checkout session',
        title_ko: '결제 세션 생성',
        description: 'Create a checkout session for payment',
        description_ko: '결제를 위한 체크아웃 세션 생성',
        code_snippet: `const session = await stripe.checkout.sessions.create({
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  mode: 'payment'
})`
      }
    ],
    code_examples: {
      typescript: `import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Create checkout session
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: 'price_1234', quantity: 1 }],
  mode: 'subscription',
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel'
})`
    },
    common_pitfalls: [
      {
        title: 'Webhook signature not verified',
        title_ko: '웹훅 서명 미검증',
        problem: 'Accepting unverified webhook events',
        solution: 'Always verify webhook signatures using stripe.webhooks.constructEvent',
        code: `const event = stripe.webhooks.constructEvent(
  body, signature, webhookSecret
)`
      },
      {
        title: 'Test mode in production',
        title_ko: '프로덕션에서 테스트 모드',
        problem: 'Using test keys in production',
        solution: 'Use live keys in production environment variables'
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'clerk',
        tip: 'Sync Stripe customer ID to Clerk user metadata for unified user management',
        tip_ko: 'Stripe 고객 ID를 Clerk 사용자 메타데이터에 동기화',
      }
    ],
    pros: [
      { text: 'Comprehensive payment APIs and webhooks', text_ko: '포괄적인 결제 API 및 웹훅' },
      { text: 'Built-in fraud detection', text_ko: '내장 사기 탐지' },
      { text: 'Excellent documentation', text_ko: '훌륭한 문서화' }
    ],
    cons: [
      { text: 'Complex for simple use cases', text_ko: '간단한 사용 사례에는 복잡함' },
      { text: 'Transaction fees add up', text_ko: '거래 수수료 누적' }
    ],
    api_key_url: 'https://dashboard.stripe.com/apikeys',
    api_key_url_label: 'Stripe API Keys',
    signup: {
      url: 'https://dashboard.stripe.com/register',
      steps: [
        'stripe.com 접속 후 [회원가입] 클릭',
        '이메일·비밀번호 입력 후 이메일 인증',
        '사업자 정보 또는 개인 정보 입력',
        '계좌 연결 (출금 받으려면 필수)',
      ],
      free_tier: '무료 가입 후 결제 성공 시 2.9% + $0.30 수수료만 부과 (월정액 없음)',
    },
    features: [
      {
        id: 'payments',
        name: '결제 처리',
        description: '신용카드·간편결제·국제 결제를 한 번에 처리합니다. Checkout 또는 Elements UI로 빠르게 구현할 수 있습니다.',
        tag: 'paid',
        api_key: {
          env_var: 'STRIPE_SECRET_KEY',
          url: 'https://dashboard.stripe.com/apikeys',
          url_label: 'Stripe API Keys 페이지',
          issue_steps: [
            { step: 1, title: '대시보드 접속', description: 'dashboard.stripe.com에 로그인합니다.' },
            { step: 2, title: 'Developers → API keys 클릭', description: '좌측 사이드바에서 Developers 메뉴를 열고 API keys를 선택합니다.' },
            { step: 3, title: 'Secret key 복사', description: '"Secret key" 옆 [Reveal test key] 버튼을 클릭해 키를 복사합니다. 절대 공개하지 마세요.' },
            { step: 4, title: '.env에 저장', description: 'STRIPE_SECRET_KEY=sk_test_... 형식으로 .env.local에 붙여넣습니다.' },
          ],
        },
        code_example: `import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const session = await stripe.checkout.sessions.create({
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  mode: 'payment',
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
})`,
      },
      {
        id: 'webhooks',
        name: '웹훅 (Webhook)',
        description: '결제 완료·환불·구독 갱신 등 이벤트를 서버로 실시간 수신합니다. 반드시 서명 검증을 해야 합니다.',
        tag: 'free',
        api_key: {
          env_var: 'STRIPE_WEBHOOK_SECRET',
          url: 'https://dashboard.stripe.com/webhooks',
          url_label: 'Stripe Webhooks 페이지',
          issue_steps: [
            { step: 1, title: 'Webhooks 페이지 이동', description: '대시보드 → Developers → Webhooks 클릭합니다.' },
            { step: 2, title: '엔드포인트 추가', description: '[Add endpoint] 버튼을 클릭하고 수신할 서버 URL (예: https://yoursite.com/api/webhooks/stripe)을 입력합니다.' },
            { step: 3, title: '이벤트 선택', description: 'checkout.session.completed, invoice.paid 등 필요한 이벤트를 선택합니다.' },
            { step: 4, title: 'Signing secret 복사', description: '엔드포인트 생성 후 나타나는 [Reveal] 버튼을 눌러 Signing secret (whsec_...)을 복사합니다.' },
            { step: 5, title: '.env에 저장', description: 'STRIPE_WEBHOOK_SECRET=whsec_... 형식으로 .env.local에 붙여넣습니다.' },
          ],
        },
        code_example: `import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(
    body, sig, process.env.STRIPE_WEBHOOK_SECRET!
  )
  if (event.type === 'checkout.session.completed') {
    // 결제 완료 처리
  }
  return Response.json({ received: true })
}`,
      },
      {
        id: 'subscriptions',
        name: '구독 관리',
        description: '월/연 구독 상품을 만들고 자동 갱신·업그레이드·해지를 관리합니다. 결제 API 키와 동일하게 사용합니다.',
        tag: 'paid',
        api_key: {
          env_var: 'STRIPE_SECRET_KEY',
          url: 'https://dashboard.stripe.com/apikeys',
          url_label: 'Stripe API Keys 페이지',
          issue_steps: [
            { step: 1, title: '결제 처리와 동일한 키 사용', description: '구독도 동일한 STRIPE_SECRET_KEY를 사용합니다. 별도 발급이 필요하지 않습니다.' },
            { step: 2, title: '구독 상품 생성', description: '대시보드 → Products → [Add product]에서 구독 상품과 가격 플랜을 먼저 생성합니다.' },
          ],
        },
      },
    ],
  },
  {
    service_id: S.clerk,
    quick_start: 'Clerk 앱을 생성하고 publishable key를 발급받아 Next.js에 인증을 추가할 수 있습니다.',
    quick_start_en: 'Create a Clerk app and get publishable keys to add authentication to your Next.js app.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Clerk Next.js',
        title_ko: 'Clerk Next.js 설치',
        description: 'Install the Clerk Next.js SDK',
        description_ko: 'Clerk Next.js SDK 설치',
        code_snippet: 'npm install @clerk/nextjs'
      },
      {
        step: 2,
        title: 'Add ClerkProvider',
        title_ko: 'ClerkProvider 추가',
        description: 'Wrap your app with ClerkProvider in the root layout',
        description_ko: '루트 레이아웃에 ClerkProvider 래핑',
        code_snippet: `import { ClerkProvider } from '@clerk/nextjs'
export default function RootLayout({ children }) {
  return <ClerkProvider>{children}</ClerkProvider>
}`
      }
    ],
    code_examples: {
      typescript: `import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <SignedOut><SignInButton /></SignedOut>
      <SignedIn><UserButton /></SignedIn>
      {children}
    </ClerkProvider>
  )
}`
    },
    common_pitfalls: [
      {
        title: 'Missing middleware',
        title_ko: 'middleware 누락',
        problem: 'Protected routes are accessible without auth',
        solution: 'Create middleware.ts with clerkMiddleware',
        code: `import { clerkMiddleware } from '@clerk/nextjs/server'
export default clerkMiddleware()
export const config = { matcher: ['/((?!.*\\\\..*|_next).*)', '/', '/(api|trpc)(.*)'] }`
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'stripe',
        tip: 'Store Stripe customer ID in Clerk user metadata for seamless billing',
        tip_ko: 'Clerk 사용자 메타데이터에 Stripe 고객 ID 저장',
      }
    ],
    pros: [
      { text: 'Pre-built UI components for auth', text_ko: '인증용 사전 빌드 UI 컴포넌트' },
      { text: 'Multi-factor authentication out of the box', text_ko: '기본 제공 MFA' },
      { text: 'User management dashboard', text_ko: '사용자 관리 대시보드' }
    ],
    cons: [
      { text: 'Paid plans for production features', text_ko: '프로덕션 기능 유료' },
      { text: 'Limited customization on free tier', text_ko: '무료 플랜 커스터마이징 제한' }
    ],
    api_key_url: 'https://dashboard.clerk.com',
    api_key_url_label: 'Clerk Dashboard',
  },
  {
    service_id: S.openai,
    quick_start: 'OpenAI API 키를 발급받아 GPT 모델, 임베딩, 이미지 생성을 즉시 사용할 수 있습니다.',
    quick_start_en: 'Get an OpenAI API key to instantly use GPT models, embeddings, and image generation.',
    setup_steps: [
      {
        step: 1,
        title: 'Get API Key',
        title_ko: 'API 키 발급',
        description: 'Sign up at platform.openai.com and create a secret API key',
        description_ko: 'platform.openai.com에서 가입 후 API Keys 메뉴에서 키 생성 (생성 후 재조회 불가 — 즉시 복사)',
      },
      {
        step: 2,
        title: 'Set environment variable',
        title_ko: '환경변수 설정',
        description: 'Add OPENAI_API_KEY to your .env file (never use NEXT_PUBLIC_ prefix)',
        description_ko: '.env 파일에 OPENAI_API_KEY 추가 (NEXT_PUBLIC_ 접두사 절대 금지 — 브라우저 노출 위험)',
        code_snippet: `OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx`
      },
      {
        step: 3,
        title: 'Install OpenAI SDK',
        title_ko: 'OpenAI SDK 설치',
        description: 'Install the official OpenAI Node.js SDK',
        description_ko: '공식 OpenAI Node.js SDK 설치',
        code_snippet: 'npm install openai'
      },
      {
        step: 4,
        title: 'Initialize client',
        title_ko: '클라이언트 초기화',
        description: 'Create an OpenAI client — API key is read automatically from env',
        description_ko: '클라이언트 생성 — 환경변수에서 API 키 자동 인식',
        code_snippet: `import OpenAI from 'openai'
const openai = new OpenAI()
// process.env.OPENAI_API_KEY 자동 인식
// 명시적 설정: new OpenAI({ apiKey: process.env.OPENAI_API_KEY })`
      }
    ],
    code_examples: {
      typescript: `import OpenAI from 'openai'
const openai = new OpenAI()

// Chat completion
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }]
})

console.log(completion.choices[0].message.content)

// Streaming
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '긴 응답을 스트리밍으로 받기' }],
  stream: true,
})
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}`,
      python: `from openai import OpenAI

client = OpenAI()  # OPENAI_API_KEY 환경변수 자동 인식

# Chat completion
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)

# Embeddings
embed = client.embeddings.create(
    model="text-embedding-3-small",
    input="텍스트를 벡터로 변환"
)
vector = embed.data[0].embedding`
    },
    common_pitfalls: [
      {
        title: 'Not handling rate limits',
        title_ko: '속도 제한 미처리',
        problem: 'API calls fail with 429 errors',
        solution: 'Implement exponential backoff and respect rate limit headers'
      },
      {
        title: 'Streaming not used',
        title_ko: '스트리밍 미사용',
        problem: 'Long wait times for responses',
        solution: 'Use stream: true for real-time token streaming',
        code: `const stream = await openai.chat.completions.create({
  model: 'gpt-4o', messages, stream: true
})`
      },
      {
        title: 'Exposing API key to client',
        title_ko: 'API 키 클라이언트 노출',
        problem: 'Using NEXT_PUBLIC_OPENAI_API_KEY exposes the key in the browser bundle',
        solution: 'Always use server-side API routes. Never add NEXT_PUBLIC_ prefix to OpenAI key',
        code: `// ❌ 절대 금지
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY })

// ✅ 올바른 방법 (서버 전용)
// src/app/api/chat/route.ts
export async function POST(req: Request) {
  const openai = new OpenAI() // 서버에서만 실행
}`
      },
      {
        title: 'No max_tokens limit set',
        title_ko: 'max_tokens 미설정',
        problem: 'Unexpected large responses cause cost spikes',
        solution: 'Always set max_tokens to control cost and response length',
        code: `const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages,
  max_tokens: 1024, // 반드시 설정
})`
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Vercel AI SDK for easy streaming and React hooks',
        tip_ko: 'Vercel AI SDK로 스트리밍 및 React 훅 간편 사용',
        code: `import { OpenAIStream, StreamingTextResponse } from 'ai'
const stream = OpenAIStream(response)
return new StreamingTextResponse(stream)`
      },
      {
        with_service_slug: 'supabase',
        tip: 'Store embeddings in pgvector for semantic search',
        tip_ko: 'Supabase pgvector에 임베딩 저장 후 시맨틱 검색 구현',
        code: `// OpenAI로 임베딩 생성 후 Supabase에 저장
const { data: embed } = await openai.embeddings.create({
  model: 'text-embedding-3-small', input: text
})
await supabase.from('documents').insert({
  content: text, embedding: embed.data[0].embedding
})`
      }
    ],
    pros: [
      { text: 'State-of-the-art language models', text_ko: '최첨단 언어 모델' },
      { text: 'Simple and well-documented API', text_ko: '간단하고 잘 문서화된 API' },
      { text: 'Function calling and structured outputs', text_ko: '함수 호출 및 구조화된 출력' },
      { text: 'Broad model selection (GPT-4o, o1, DALL-E, Whisper)', text_ko: '다양한 모델 선택 (GPT-4o, o1, DALL-E, Whisper)' }
    ],
    cons: [
      { text: 'Can be expensive at scale', text_ko: '대규모 사용 시 비용 부담' },
      { text: 'Rate limits on lower tiers', text_ko: '낮은 티어 속도 제한' },
      { text: 'Risk of unexpected cost spikes without max_tokens', text_ko: 'max_tokens 미설정 시 비용 폭증 위험' }
    ],
    api_key_url: 'https://platform.openai.com/api-keys',
    api_key_url_label: 'OpenAI API Keys',
  },
  {
    service_id: S.sentry,
    quick_start: 'Sentry 프로젝트를 생성하고 DSN을 발급받아 에러 모니터링과 성능 추적을 시작할 수 있습니다.',
    quick_start_en: 'Create a Sentry project and get a DSN to start error monitoring and performance tracking.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Sentry SDK',
        title_ko: 'Sentry SDK 설치',
        description: 'Install the Sentry Next.js SDK',
        description_ko: 'Sentry Next.js SDK 설치',
        code_snippet: 'npx @sentry/wizard@latest -i nextjs'
      },
      {
        step: 2,
        title: 'Configure Sentry',
        title_ko: 'Sentry 설정',
        description: 'The wizard creates sentry config files automatically',
        description_ko: '위자드가 자동으로 설정 파일 생성',
        code_snippet: `// sentry.client.config.ts
Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN })`
      }
    ],
    code_examples: {
      typescript: `import * as Sentry from '@sentry/nextjs'

// Capture exception
Sentry.captureException(new Error('Something went wrong'))

// Add context
Sentry.setUser({ id: '123', email: 'user@example.com' })

// Performance monitoring
const transaction = Sentry.startTransaction({ name: 'API Call' })
// ... do work
transaction.finish()`
    },
    common_pitfalls: [
      {
        title: 'Source maps not uploaded',
        title_ko: '소스맵 미업로드',
        problem: 'Stack traces show minified code',
        solution: 'Enable source map upload in next.config.js',
        code: `module.exports = {
  sentry: { hideSourceMaps: false }
}`
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Vercel-Sentry integration for automatic source map uploads',
        tip_ko: 'Vercel-Sentry 통합으로 소스맵 자동 업로드',
      }
    ],
    pros: [
      { text: 'Real-time error tracking and alerts', text_ko: '실시간 에러 추적 및 알림' },
      { text: 'Performance monitoring included', text_ko: '성능 모니터링 포함' },
      { text: 'Rich context and breadcrumbs', text_ko: '풍부한 컨텍스트 및 breadcrumb' }
    ],
    cons: [
      { text: 'Can be overwhelming with many errors', text_ko: '많은 에러 시 압도적' },
      { text: 'Paid plans for team features', text_ko: '팀 기능 유료' }
    ],
    api_key_url: 'https://sentry.io/settings/account/api/auth-tokens/',
    api_key_url_label: 'Sentry Auth Tokens',
  },
  {
    service_id: S.neon,
    quick_start: 'Neon 프로젝트를 생성하고 연결 문자열을 발급받아 서버리스 PostgreSQL을 즉시 사용할 수 있습니다.',
    quick_start_en: 'Create a Neon project and get a connection string to instantly use serverless PostgreSQL.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Neon project',
        title_ko: 'Neon 프로젝트 생성',
        description: 'Create a project in Neon console and copy connection string',
        description_ko: 'Neon 콘솔에서 프로젝트 생성 후 연결 문자열 복사',
      },
      {
        step: 2,
        title: 'Install Postgres client',
        title_ko: 'Postgres 클라이언트 설치',
        description: 'Install a PostgreSQL client like @neondatabase/serverless',
        description_ko: '@neondatabase/serverless 같은 클라이언트 설치',
        code_snippet: 'npm install @neondatabase/serverless'
      },
      {
        step: 3,
        title: 'Connect to database',
        title_ko: '데이터베이스 연결',
        description: 'Use the connection string to connect',
        description_ko: '연결 문자열로 연결',
        code_snippet: `import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
const result = await sql\`SELECT * FROM users\``
      }
    ],
    code_examples: {
      typescript: `import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Query
const users = await sql\`SELECT * FROM users WHERE id = \${userId}\`

// Transaction
const result = await sql.transaction([
  sql\`INSERT INTO users (name) VALUES ('John')\`,
  sql\`UPDATE accounts SET balance = balance - 100\`
])`
    },
    common_pitfalls: [
      {
        title: 'Connection pooling not configured',
        title_ko: '커넥션 풀링 미설정',
        problem: 'Too many connections in serverless',
        solution: 'Use Neon serverless driver or connection pooling',
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Vercel-Neon integration for automatic connection string setup',
        tip_ko: 'Vercel-Neon 통합으로 연결 문자열 자동 설정',
      }
    ],
    pros: [
      { text: 'Serverless PostgreSQL with auto-scaling', text_ko: '오토스케일링 서버리스 PostgreSQL' },
      { text: 'Branching for development environments', text_ko: '개발 환경용 브랜칭' },
      { text: 'Generous free tier', text_ko: '넉넉한 무료 플랜' }
    ],
    cons: [
      { text: 'Cold starts on free tier', text_ko: '무료 플랜 콜드 스타트' },
      { text: 'Limited to PostgreSQL', text_ko: 'PostgreSQL로 제한' }
    ],
    api_key_url: 'https://console.neon.tech/app/settings/api-keys',
    api_key_url_label: 'Neon API Keys',
  },
  {
    service_id: S.resend,
    quick_start: 'Resend 계정을 생성하고 API 키를 발급받아 트랜잭셔널 이메일을 전송할 수 있습니다.',
    quick_start_en: 'Create a Resend account and get an API key to send transactional emails.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Resend SDK',
        title_ko: 'Resend SDK 설치',
        description: 'Install the Resend Node SDK',
        description_ko: 'Resend Node SDK 설치',
        code_snippet: 'npm install resend'
      },
      {
        step: 2,
        title: 'Send email',
        title_ko: '이메일 전송',
        description: 'Initialize Resend and send an email',
        description_ko: 'Resend 초기화 후 이메일 전송',
        code_snippet: `import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({ from, to, subject, html })`
      }
    ],
    code_examples: {
      typescript: `import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY!)

await resend.emails.send({
  from: 'onboarding@example.com',
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<p>Thanks for signing up!</p>'
})`
    },
    common_pitfalls: [
      {
        title: 'Domain not verified',
        title_ko: '도메인 미인증',
        problem: 'Emails fail to send from custom domain',
        solution: 'Verify your domain in Resend dashboard with DNS records'
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'clerk',
        tip: 'Use Resend with Clerk webhooks to send custom onboarding emails',
        tip_ko: 'Clerk 웹훅과 Resend로 커스텀 온보딩 이메일 전송',
      }
    ],
    pros: [
      { text: 'Simple API for transactional emails', text_ko: '트랜잭셔널 이메일용 간단한 API' },
      { text: 'React email template support', text_ko: 'React 이메일 템플릿 지원' },
      { text: 'Affordable pricing', text_ko: '합리적인 가격' }
    ],
    cons: [
      { text: 'Limited analytics compared to SendGrid', text_ko: 'SendGrid 대비 제한적 분석' },
      { text: 'Newer service with smaller ecosystem', text_ko: '신생 서비스로 작은 생태계' }
    ],
    api_key_url: 'https://resend.com/api-keys',
    api_key_url_label: 'Resend API Keys',
  },
  {
    service_id: S.posthog,
    quick_start: 'PostHog 프로젝트를 생성하고 API 키를 발급받아 제품 분석, A/B 테스트, 세션 리플레이를 시작할 수 있습니다.',
    quick_start_en: 'Create a PostHog project and get an API key to start product analytics, A/B testing, and session replays.',
    setup_steps: [
      {
        step: 1,
        title: 'Install PostHog',
        title_ko: 'PostHog 설치',
        description: 'Install the PostHog JavaScript library',
        description_ko: 'PostHog JS 라이브러리 설치',
        code_snippet: 'npm install posthog-js'
      },
      {
        step: 2,
        title: 'Initialize PostHog',
        title_ko: 'PostHog 초기화',
        description: 'Initialize PostHog with your project API key',
        description_ko: '프로젝트 API 키로 PostHog 초기화',
        code_snippet: `import posthog from 'posthog-js'
posthog.init(apiKey, { api_host: 'https://app.posthog.com' })`
      }
    ],
    code_examples: {
      typescript: `import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: 'https://app.posthog.com'
})

// Track event
posthog.capture('button_clicked', { button_id: 'signup' })

// Identify user
posthog.identify('user_123', { email: 'user@example.com' })`
    },
    common_pitfalls: [
      {
        title: 'Client-side only tracking',
        title_ko: '클라이언트 전용 추적',
        problem: 'Server-side events not tracked',
        solution: 'Use posthog-node for server-side tracking',
        code: `import { PostHog } from 'posthog-node'
const client = new PostHog(apiKey)
client.capture({ distinctId: 'user', event: 'server_event' })`
      }
    ],
    integration_tips: [
      {
        with_service_slug: 'clerk',
        tip: 'Sync Clerk user ID to PostHog for unified user tracking',
        tip_ko: 'Clerk 사용자 ID를 PostHog에 동기화',
      }
    ],
    pros: [
      { text: 'All-in-one product analytics platform', text_ko: '올인원 제품 분석 플랫폼' },
      { text: 'Session replay and feature flags', text_ko: '세션 리플레이 및 기능 플래그' },
      { text: 'Open source with self-hosting option', text_ko: '오픈소스 셀프호스팅 가능' }
    ],
    cons: [
      { text: 'Can be expensive for high event volume', text_ko: '높은 이벤트 볼륨 시 비쌈' },
      { text: 'UI can be complex for beginners', text_ko: '초보자에게 복잡한 UI' }
    ],
    api_key_url: 'https://app.posthog.com/settings/project-api-key',
    api_key_url_label: 'PostHog Project Key',
  },

  // ---------------------------------------------------------------------------
  // Advertising services
  // ---------------------------------------------------------------------------
  {
    service_id: S.google_adsense,
    quick_start: 'AdSense 계정을 생성하고 게시자 ID를 발급받아 Next.js 레이아웃에 스크립트를 추가하면 자동으로 컨텍스트 광고가 게재됩니다.',
    quick_start_en: 'Create an AdSense account, get your publisher ID, and add the script to your Next.js layout to automatically serve contextual ads.',
    setup_steps: [
      {
        step: 1,
        title: 'Create AdSense account & get Publisher ID',
        title_ko: 'AdSense 계정 생성 및 게시자 ID 발급',
        description: 'Sign up at adsense.google.com, submit your site for review, and copy your publisher ID (ca-pub-XXXXXXXXXXXXXXXX). Approval can take 1–2 weeks.',
        description_ko: 'adsense.google.com에서 가입 후 사이트를 심사 신청합니다. 계정 개요 페이지에서 게시자 ID(ca-pub-XXXXXXXXXXXXXXXX)를 복사합니다. 승인까지 1~2주 소요될 수 있습니다.',
      },
      {
        step: 2,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Add your AdSense credentials to .env.local. Both values must use NEXT_PUBLIC_ prefix because they are rendered client-side.',
        description_ko: '.env.local에 AdSense 자격증명을 추가합니다. 두 값 모두 클라이언트에서 렌더링되므로 NEXT_PUBLIC_ 접두사가 필요합니다.',
        code_snippet: 'NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX\nNEXT_PUBLIC_ADSENSE_SLOT_ID=1234567890',
      },
      {
        step: 3,
        title: 'Add AdSense script to root layout',
        title_ko: '루트 레이아웃에 AdSense 스크립트 추가',
        description: 'Use next/script with the afterInteractive strategy to load the AdSense script exactly once in app/layout.tsx.',
        description_ko: 'app/layout.tsx에 next/script의 afterInteractive 전략으로 AdSense 스크립트를 한 번만 로드합니다.',
        code_snippet: `import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Script
          src={\`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=\${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}\`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  )
}`,
      },
      {
        step: 4,
        title: 'Create AdSense ad unit component',
        title_ko: '광고 단위 컴포넌트 생성',
        description: 'Create a reusable AdUnit component that renders the ins element and triggers adsbygoogle.push on mount.',
        description_ko: 'ins 요소를 렌더링하고 마운트 시 adsbygoogle.push를 호출하는 재사용 가능한 AdUnit 컴포넌트를 생성합니다.',
        code_snippet: `'use client'
import { useEffect } from 'react'

export function AdUnit({ slot, format = 'auto' }: { slot: string; format?: string }) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle as unknown as unknown[]).push({})
    } catch {}
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}`,
      },
    ],
    code_examples: {
      typescript: `// src/components/ads/AdUnit.tsx
'use client'
import { useEffect } from 'react'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface AdUnitProps {
  slot?: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
}

export function AdUnit({
  slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID ?? '',
  format = 'auto',
}: AdUnitProps) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {}
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}`,
    },
    common_pitfalls: [
      {
        title: 'Multiple adsbygoogle.push() calls per slot',
        title_ko: '슬롯당 adsbygoogle.push() 중복 호출',
        problem: 'React components re-mount causing push() to fire multiple times on the same ins element, resulting in console errors.',
        solution: 'Check if the ins element already has data-adsbygoogle-status before calling push(), or guard with a ref flag.',
        code: `useEffect(() => {
  const el = adRef.current
  if (!el || el.getAttribute('data-adsbygoogle-status')) return
  try {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  } catch {}
}, [])`,
      },
      {
        title: 'AdSense script loaded in multiple places',
        title_ko: 'AdSense 스크립트 중복 로드',
        problem: 'Adding the script tag in both layout.tsx and individual page components causes duplicate script errors.',
        solution: 'Load adsbygoogle.js exactly once in the root app/layout.tsx using next/script with strategy="afterInteractive".',
      },
      {
        title: 'Ads not showing during development',
        title_ko: '개발 환경에서 광고 미노출',
        problem: 'AdSense does not serve ads on localhost or non-approved domains.',
        solution: 'Test on a deployed URL (Vercel preview or production). Use the AdSense preview tool for layout testing.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'google-ad-manager',
        tip: 'Migrate from AdSense to Google Ad Manager when you need direct deals, header bidding, or multi-network management. GAM supports AdSense as a demand source via Ad Exchange.',
        tip_ko: '다이렉트 딜, 헤더 비딩, 멀티 네트워크 관리가 필요하면 Google Ad Manager로 마이그레이션하세요. GAM은 AdSense를 Ad Exchange 수요 소스로 지원합니다.',
      },
      {
        with_service_slug: 'vercel',
        tip: 'Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID and NEXT_PUBLIC_ADSENSE_SLOT_ID in Vercel project settings so they are available in preview and production deployments.',
        tip_ko: 'Vercel 프로젝트 설정의 Environment Variables에 두 환경변수를 추가하면 프리뷰 및 프로덕션 배포에서 모두 사용 가능합니다.',
      },
    ],
    pros: [
      { text: 'Zero setup cost — revenue share model with 68% payout to publishers', text_ko: '비용 없음 — 수익 공유 방식, 게시자 68% 수익 지급' },
      { text: 'Automatic contextual ad matching — no manual campaign management', text_ko: '자동 컨텍스트 광고 매칭 — 수동 캠페인 관리 불필요' },
      { text: 'Easy integration via a single script tag and ins element', text_ko: '스크립트 태그 하나와 ins 요소로 간단한 통합' },
    ],
    cons: [
      { text: 'Site approval required — review can take 1–2 weeks and may be rejected', text_ko: '사이트 승인 필요 — 심사에 1~2주 소요, 거부 가능성 있음' },
      { text: 'Limited control over which ads appear — advertisers selected by Google', text_ko: '게재 광고 제어 제한 — Google이 광고주 선택' },
      { text: 'Low RPM for low-traffic or niche sites', text_ko: '저트래픽·틈새 사이트의 경우 낮은 RPM' },
    ],
    api_key_url: 'https://www.google.com/adsense',
    api_key_url_label: 'Google AdSense',
  },
  {
    service_id: S.kakao_adfit,
    quick_start: 'AdFit 계정을 생성하고 광고 단위 ID(DAN-XXXXXXXXXXXXXXXX)를 발급받아 Next.js 컴포넌트에 ins 요소와 SDK 스크립트를 삽입하면 광고가 게재됩니다.',
    quick_start_en: 'Create an AdFit account, get your ad unit ID (DAN-XXXXXXXXXXXXXXXX), then insert the ins element and SDK script into your Next.js component to start serving ads.',
    setup_steps: [
      {
        step: 1,
        title: 'Create AdFit account & ad unit',
        title_ko: 'AdFit 계정 생성 및 광고 단위 발급',
        description: 'Sign up at adfit.kakao.com, create a new ad unit, and copy the ad unit ID (DAN-XXXXXXXXXXXXXXXX format). Choose the banner size (e.g., 320x50, 300x250).',
        description_ko: 'adfit.kakao.com에서 가입 후 광고 단위를 생성하고 광고 단위 ID(DAN-XXXXXXXXXXXXXXXX 형식)를 복사합니다. 배너 크기(예: 320x50, 300x250)를 선택합니다.',
      },
      {
        step: 2,
        title: 'Set environment variable',
        title_ko: '환경변수 설정',
        description: 'Add your AdFit ad unit ID to .env.local. The NEXT_PUBLIC_ prefix is required as this value is used client-side.',
        description_ko: '.env.local에 AdFit 광고 단위 ID를 추가합니다. 클라이언트에서 사용되므로 NEXT_PUBLIC_ 접두사가 필요합니다.',
        code_snippet: 'NEXT_PUBLIC_ADFIT_AD_UNIT_ID=DAN-XXXXXXXXXXXXXXXX',
      },
      {
        step: 3,
        title: 'Create AdFit React component',
        title_ko: 'AdFit React 컴포넌트 생성',
        description: 'Create a client component that renders an ins element with kakao_ad_area class and dynamically loads the AdFit SDK script.',
        description_ko: 'kakao_ad_area 클래스의 ins 요소를 렌더링하고 AdFit SDK 스크립트를 동적으로 로드하는 클라이언트 컴포넌트를 생성합니다.',
        code_snippet: `'use client'
import { useEffect } from 'react'

export function AdFitBanner({ width = 320, height = 50 }: { width?: number; height?: number }) {
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]'
    )
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'
      script.async = true
      script.charset = 'utf-8'
      document.body.appendChild(script)
    }
  }, [])

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: 'none', width: '100%' }}
      data-ad-unit={process.env.NEXT_PUBLIC_ADFIT_AD_UNIT_ID}
      data-ad-width={String(width)}
      data-ad-height={String(height)}
    />
  )
}`,
      },
    ],
    code_examples: {
      typescript: `// src/components/ads/AdFitBanner.tsx
'use client'
import { useEffect } from 'react'

interface AdFitBannerProps {
  unitId?: string
  width?: number
  height?: number
  onFail?: (el: HTMLElement) => void
}

export function AdFitBanner({
  unitId = process.env.NEXT_PUBLIC_ADFIT_AD_UNIT_ID ?? '',
  width = 320,
  height = 50,
  onFail,
}: AdFitBannerProps) {
  useEffect(() => {
    const existing = document.querySelector(
      'script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]'
    )
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'
      script.async = true
      script.charset = 'utf-8'
      document.body.appendChild(script)
    }
  }, [])

  return (
    <ins
      className="kakao_ad_area"
      style={{ display: 'none', width: '100%' }}
      data-ad-unit={unitId}
      data-ad-width={String(width)}
      data-ad-height={String(height)}
      {...(onFail ? { 'data-ad-onfail': '__adfit_onfail__' } : {})}
    />
  )
}

// 사용 예시
// <AdFitBanner width={300} height={250} onFail={(el) => (el.style.display = 'none')} />`,
    },
    common_pitfalls: [
      {
        title: 'Script loaded multiple times on route change',
        title_ko: '라우트 변경 시 스크립트 중복 로드',
        problem: 'App Router에서 페이지를 이동할 때마다 컴포넌트가 언마운트/마운트되어 AdFit SDK 스크립트가 중복 삽입됩니다.',
        solution: '스크립트 삽입 전 동일 src의 스크립트가 이미 있는지 querySelector로 확인합니다.',
        code: `const existing = document.querySelector(
  'script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]'
)
if (!existing) {
  const script = document.createElement('script')
  script.src = 'https://t1.daumcdn.net/kas/static/ba.min.js'
  script.async = true
  document.body.appendChild(script)
}`,
      },
      {
        title: 'ins element display:none causes CLS',
        title_ko: 'ins 요소 display:none으로 인한 레이아웃 깜빡임',
        problem: 'AdFit SDK가 광고를 채우기 전까지 ins 요소가 display:none 상태이므로 광고가 나타날 때 레이아웃이 밀립니다.',
        solution: '광고 영역의 높이를 미리 예약해 두어 CLS(Cumulative Layout Shift)를 방지합니다.',
        code: `// 광고 영역 높이 예약
<div style={{ minHeight: height, width }}>
  <AdFitBanner width={width} height={height} />
</div>`,
      },
      {
        title: 'Korean-only ad network',
        title_ko: '한국 전용 광고 네트워크',
        problem: 'AdFit은 한국어 콘텐츠 사이트를 대상으로만 광고를 공급합니다. 글로벌 사이트에서는 광고 충전율이 매우 낮습니다.',
        solution: '글로벌 트래픽이 주인 사이트라면 Google AdSense와 병행 운영하거나 AdSense만 사용하는 것을 권장합니다.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'google-adsense',
        tip: 'Run AdFit alongside AdSense for Korean traffic. Use the data-ad-onfail callback to fall back to AdSense when AdFit has no fill.',
        tip_ko: '한국 트래픽에는 AdFit, 해외 트래픽에는 AdSense를 병행 운영하세요. data-ad-onfail 콜백으로 AdFit 광고가 없을 때 AdSense로 폴백할 수 있습니다.',
      },
      {
        with_service_slug: 'vercel',
        tip: 'Add NEXT_PUBLIC_ADFIT_AD_UNIT_ID to Vercel Environment Variables. Create separate ad units for preview (*.vercel.app) and production domains since each unit ID is domain-specific.',
        tip_ko: 'Vercel 환경변수에 NEXT_PUBLIC_ADFIT_AD_UNIT_ID를 추가합니다. 광고 단위 ID는 도메인에 종속되므로 프리뷰와 프로덕션 도메인 각각 별도 광고 단위를 생성해야 합니다.',
      },
    ],
    pros: [
      { text: 'High fill rate for Korean-language content — best domestic ad network', text_ko: '한국어 콘텐츠 높은 광고 충전율 — 국내 최고 광고 네트워크' },
      { text: 'No minimum traffic requirement for signup — easy onboarding', text_ko: '가입 최소 트래픽 요건 없음 — 쉬운 온보딩' },
      { text: 'Simple ins element integration — no SDK package installation needed', text_ko: 'ins 요소만으로 통합 — SDK 패키지 설치 불필요' },
    ],
    cons: [
      { text: 'Korea-only — near-zero fill rate for international traffic', text_ko: '한국 전용 — 글로벌 트래픽은 광고 충전율 거의 없음' },
      { text: 'Limited ad formats compared to Google AdSense', text_ko: 'Google AdSense 대비 제한적인 광고 형식' },
      { text: 'Minimum payout threshold and monthly settlement cycle', text_ko: '최소 지급액 기준 및 월 정산 주기' },
    ],
    api_key_url: 'https://adfit.kakao.com',
    api_key_url_label: 'Kakao AdFit',
  },
  {
    service_id: S.criteo,
    quick_start: 'Criteo 계정을 생성하고 파트너 ID를 발급받은 후 OneTag를 페이지 head에 삽입하면 리타겟팅 광고가 자동으로 활성화됩니다.',
    quick_start_en: 'Create a Criteo account, get your partner ID, then insert the OneTag loader in your page head to activate retargeting ads automatically.',
    setup_steps: [
      {
        step: 1,
        title: 'Get Criteo Partner ID',
        title_ko: 'Criteo 파트너 ID 발급',
        description: 'Contact Criteo sales or sign up at criteo.com. Once approved, locate your Partner ID in the Criteo Management Center under Account Settings.',
        description_ko: 'Criteo 영업팀에 문의하거나 criteo.com에서 가입합니다. 계정 승인 후 Criteo Management Center 계정 설정에서 파트너 ID를 확인합니다.',
      },
      {
        step: 2,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Store Criteo credentials server-side only. Do NOT use NEXT_PUBLIC_ prefix for server-side API calls.',
        description_ko: 'Criteo 자격증명을 서버 전용으로 저장합니다. 서버 API 호출에는 NEXT_PUBLIC_ 접두사를 사용하지 마세요.',
        code_snippet: 'CRITEO_PARTNER_ID=12345\nCRITEO_NETWORK_ID=67890',
      },
      {
        step: 3,
        title: 'Add OneTag loader script',
        title_ko: 'OneTag 로더 스크립트 추가',
        description: 'Add the Criteo OneTag loader to your root layout. The loader is asynchronous and does not block page rendering.',
        description_ko: '루트 레이아웃에 Criteo OneTag 로더를 추가합니다. 로더 스크립트는 비동기이므로 페이지 렌더링을 차단하지 않습니다.',
        code_snippet: `import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const partnerId = process.env.CRITEO_PARTNER_ID
  return (
    <html>
      <body>
        {partnerId && (
          <Script id="criteo-onetag" strategy="afterInteractive">
            {\`
              window.criteo_q = window.criteo_q || [];
              window.criteo_q.push(
                { event: 'setAccount', account: \${partnerId} },
                { event: 'setSiteType', type: /Mobile|iP(hone|od|ad)|Android/i.test(navigator.userAgent) ? 'm' : 'd' }
              );
            \`}
          </Script>
        )}
        {children}
      </body>
    </html>
  )
}`,
      },
      {
        step: 4,
        title: 'Track page events',
        title_ko: '페이지 이벤트 추적',
        description: 'Push page-specific events (viewHome, viewList, viewItem, viewBasket, trackTransaction) to window.criteo_q on each route.',
        description_ko: '각 라우트에서 페이지별 이벤트(viewHome, viewList, viewItem, viewBasket, trackTransaction)를 window.criteo_q에 push합니다.',
        code_snippet: `// 제품 상세 페이지
window.criteo_q = window.criteo_q || []
window.criteo_q.push({ event: 'viewItem', item: product.id })

// 장바구니 페이지
window.criteo_q.push({
  event: 'viewBasket',
  item: cart.map(i => ({ id: i.productId, price: i.price, quantity: i.qty }))
})`,
      },
    ],
    code_examples: {
      typescript: `// src/lib/criteo.ts
declare global {
  interface Window { criteo_q: unknown[] }
}

type DeviceType = 'd' | 't' | 'm'

function getDeviceType(): DeviceType {
  return /Mobile|iP(hone|od|ad)|Android/i.test(navigator.userAgent) ? 'm' : 'd'
}

const base = () => [
  { event: 'setAccount', account: process.env.CRITEO_PARTNER_ID },
  { event: 'setSiteType', type: getDeviceType() },
]

export const criteo = {
  viewHome() {
    if (typeof window === 'undefined') return
    window.criteo_q = window.criteo_q || []
    window.criteo_q.push(...base(), { event: 'viewHome' })
  },
  viewItem(itemId: string) {
    if (typeof window === 'undefined') return
    window.criteo_q = window.criteo_q || []
    window.criteo_q.push(...base(), { event: 'viewItem', item: itemId })
  },
  viewBasket(items: Array<{ id: string; price: number; quantity: number }>) {
    if (typeof window === 'undefined') return
    window.criteo_q = window.criteo_q || []
    window.criteo_q.push(...base(), { event: 'viewBasket', item: items })
  },
}

// 사용 예시
// useEffect(() => { criteo.viewItem(product.id) }, [product.id])`,
    },
    common_pitfalls: [
      {
        title: 'OneTag not firing on SPA route changes',
        title_ko: 'SPA 라우트 변경 시 OneTag 미발화',
        problem: 'Next.js App Router에서 페이지 이동 시 문서가 재로드되지 않아 OneTag 페이지뷰 이벤트를 수동으로 push해야 합니다.',
        solution: 'usePathname()으로 라우트 변경을 감지하고 useEffect에서 적절한 criteo_q 이벤트를 push합니다.',
        code: `import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function CriteoTracker() {
  const pathname = usePathname()
  useEffect(() => {
    window.criteo_q = window.criteo_q || []
    window.criteo_q.push(
      { event: 'setAccount', account: Number(process.env.CRITEO_PARTNER_ID) },
      { event: 'viewHome' }
    )
  }, [pathname])
  return null
}`,
      },
      {
        title: 'Partner ID exposed unnecessarily',
        title_ko: '파트너 ID 불필요한 노출',
        problem: 'OneTag client-side usage requires the partner ID in the browser, but server-side Criteo API calls must never use NEXT_PUBLIC_ prefix.',
        solution: 'For client-side OneTag, the partner ID is acceptable in the page source. For server API calls, keep credentials server-only.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'taboola',
        tip: 'Use Criteo for retargeting existing visitors and Taboola for acquiring new audiences through content discovery. Both can run simultaneously with different goals.',
        tip_ko: '기존 방문자 리타겟팅에는 Criteo를, 신규 오디언스 콘텐츠 디스커버리에는 Taboola를 사용하세요. 서로 다른 목표로 동시에 운영 가능합니다.',
      },
      {
        with_service_slug: 'amazon-aps',
        tip: 'Complement Criteo retargeting with Amazon APS header bidding for higher CPM yields on display inventory. APS adds Amazon first-party demand while Criteo covers retargeting.',
        tip_ko: 'Criteo 리타겟팅과 Amazon APS 헤더 비딩을 결합하면 디스플레이 인벤토리의 CPM 수익을 높일 수 있습니다.',
      },
    ],
    pros: [
      { text: 'AI-powered retargeting with high conversion rates for e-commerce', text_ko: '이커머스에 최적화된 AI 기반 리타겟팅으로 높은 전환율' },
      { text: 'Large advertiser network — access to major brands globally', text_ko: '대규모 광고주 네트워크 — 글로벌 주요 브랜드 접근' },
      { text: 'Dynamic product ads using your catalog feed', text_ko: '카탈로그 피드 기반 다이나믹 상품 광고' },
    ],
    cons: [
      { text: 'Minimum budget requirement — not suitable for small publishers', text_ko: '최소 예산 요건 — 소규모 퍼블리셔에 부적합' },
      { text: 'Complex setup — requires event tracking on each page type', text_ko: 'AdSense 대비 복잡한 설정 — 페이지 유형별 이벤트 추적 필요' },
      { text: 'Black-box optimization — limited visibility into bid and audience decisions', text_ko: '블랙박스 최적화 — 입찰 및 오디언스 결정에 대한 가시성 제한' },
    ],
    api_key_url: 'https://marketing.criteo.com',
    api_key_url_label: 'Criteo Console',
  },
  {
    service_id: S.taboola,
    quick_start: 'Taboola 계정을 생성하고 퍼블리셔 ID를 발급받은 후 페이지 head에 로더 스크립트를 추가하고 광고를 노출할 위치에 위젯 컴포넌트를 삽입합니다.',
    quick_start_en: 'Create a Taboola account, get your publisher ID, add the loader script to your page head, then insert a widget component wherever you want ads to appear.',
    setup_steps: [
      {
        step: 1,
        title: 'Apply to Taboola Publisher Network',
        title_ko: 'Taboola 퍼블리셔 네트워크 신청',
        description: 'Apply at publishers.taboola.com. Taboola has a minimum traffic requirement (typically 500K monthly page views). Once approved, your account manager provides your Publisher ID and Widget ID.',
        description_ko: 'publishers.taboola.com에서 신청합니다. Taboola는 최소 트래픽 기준(일반적으로 월 50만 페이지뷰)이 있습니다. 승인 후 담당 매니저가 퍼블리셔 ID와 위젯 ID를 제공합니다.',
      },
      {
        step: 2,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Add Taboola credentials to .env.local. Publisher ID and Widget ID are public values embedded in the client-side script.',
        description_ko: '.env.local에 Taboola 자격증명을 추가합니다. 퍼블리셔 ID와 위젯 ID는 클라이언트 스크립트에 포함되는 공개 값입니다.',
        code_snippet: 'TABOOLA_PUBLISHER_ID=my-publisher\nTABOOLA_WIDGET_ID=taboola-below-article',
      },
      {
        step: 3,
        title: 'Add Taboola loader to root layout',
        title_ko: '루트 레이아웃에 Taboola 로더 추가',
        description: 'Add the Taboola loader script to your root layout head. The loader script is publisher-specific and must be placed in the head.',
        description_ko: '루트 레이아웃 head에 Taboola 로더 스크립트를 추가합니다. 로더 스크립트는 퍼블리셔별 맞춤 파일이므로 head에 위치해야 합니다.',
        code_snippet: `import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const publisherId = process.env.TABOOLA_PUBLISHER_ID
  return (
    <html>
      <head>
        {publisherId && (
          <Script
            id="taboola-loader"
            strategy="beforeInteractive"
            src={\`//cdn.taboola.com/libtrc/\${publisherId}/loader.js\`}
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}`,
      },
      {
        step: 4,
        title: 'Create Taboola widget component',
        title_ko: 'Taboola 위젯 컴포넌트 생성',
        description: 'Create a client component that pushes the widget configuration to window._taboola and renders the placement div.',
        description_ko: 'window._taboola에 위젯 설정을 push하고 배치 div를 렌더링하는 클라이언트 컴포넌트를 생성합니다.',
        code_snippet: `'use client'
import { useEffect } from 'react'

export function TaboolaWidget({ placement = 'Below Article' }: { placement?: string }) {
  useEffect(() => {
    window._taboola = window._taboola || []
    window._taboola.push({ article: 'auto' })
    window._taboola.push({
      mode: 'thumbnails-a',
      container: 'taboola-below-article',
      placement,
      target_type: 'mix',
    })
    window._taboola.push({ flush: true })
  }, [])

  return <div id="taboola-below-article" />
}`,
      },
    ],
    code_examples: {
      typescript: `// src/components/ads/TaboolaWidget.tsx
'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window { _taboola: unknown[] }
}

interface TaboolaWidgetProps {
  containerId: string
  mode?: string
  placement?: string
  targetType?: 'mix' | 'video' | 'text'
}

export function TaboolaWidget({
  containerId,
  mode = 'thumbnails-a',
  placement = 'Below Article Thumbnails',
  targetType = 'mix',
}: TaboolaWidgetProps) {
  const pathname = usePathname()

  useEffect(() => {
    window._taboola = window._taboola || []
    window._taboola.push({ article: 'auto' })
    window._taboola.push({
      mode,
      container: containerId,
      placement,
      target_type: targetType,
    })
    window._taboola.push({ flush: true })
  }, [pathname, containerId, mode, placement, targetType])

  return <div id={containerId} />
}

// 사용 예시 (기사 하단)
// <TaboolaWidget
//   containerId="taboola-below-article"
//   placement="Below Article Thumbnails"
// />`,
    },
    common_pitfalls: [
      {
        title: 'Widget not rendering on SPA navigation',
        title_ko: 'SPA 내비게이션 시 위젯 미렌더링',
        problem: 'Taboola widgets push configuration once on load. When navigating in Next.js, the DOM div is replaced but Taboola does not re-render the widget automatically.',
        solution: 'Push a new page-type and widget configuration to _taboola on every route change using usePathname() in a useEffect.',
        code: `const pathname = usePathname()
useEffect(() => {
  window._taboola = window._taboola || []
  window._taboola.push({ article: 'auto' })
  window._taboola.push({
    mode: 'thumbnails-a',
    container: containerId,
    placement: 'Below Article',
    target_type: 'mix',
  })
  window._taboola.push({ flush: true })
}, [pathname])`,
      },
      {
        title: 'Loader script blocking render',
        title_ko: '로더 스크립트 렌더 블로킹',
        problem: 'Using strategy="beforeInteractive" for the Taboola loader can delay Time to Interactive if not cached.',
        solution: 'Use strategy="afterInteractive" for most pages. Only use beforeInteractive if above-the-fold ad placement is critical.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'criteo',
        tip: 'Use Taboola for top-of-funnel content discovery to attract new readers, and Criteo for retargeting return visitors. The two platforms serve different funnel stages.',
        tip_ko: '신규 독자 유입을 위한 상단 퍼널 콘텐츠 디스커버리에 Taboola를, 재방문자 리타겟팅에 Criteo를 사용하세요. 두 플랫폼은 서로 다른 퍼널 단계를 커버합니다.',
      },
      {
        with_service_slug: 'google-ad-manager',
        tip: 'Integrate Taboola as a demand source in Google Ad Manager via header bidding to compete with direct-sold and programmatic inventory for maximum yield.',
        tip_ko: '헤더 비딩을 통해 Taboola를 Google Ad Manager의 수요 소스로 통합하면 다이렉트 판매 및 프로그래매틱 인벤토리와 경쟁하여 수익을 극대화할 수 있습니다.',
      },
    ],
    pros: [
      { text: 'Native content recommendation format — higher CTR than traditional banners', text_ko: '네이티브 콘텐츠 추천 형식 — 기존 배너 광고보다 높은 CTR' },
      { text: 'Revenue share model — no upfront cost for publishers', text_ko: '수익 공유 방식 — 퍼블리셔 초기 비용 없음' },
      { text: 'Premium advertiser demand from major brands and agencies', text_ko: '주요 브랜드 및 대행사의 프리미엄 광고주 수요' },
    ],
    cons: [
      { text: 'Minimum traffic requirement (typically 500K+ monthly page views)', text_ko: '최소 트래픽 요건 (일반적으로 월 50만+ 페이지뷰)' },
      { text: 'Widget placement largely fixed — limited layout customization', text_ko: '위젯 배치 고정 — 레이아웃 커스터마이징 제한' },
      { text: 'Can affect page performance if loader is not deferred properly', text_ko: '로더가 적절히 지연되지 않으면 페이지 성능에 영향' },
    ],
    api_key_url: 'https://backstage.taboola.com',
    api_key_url_label: 'Taboola Backstage',
  },
  {
    service_id: S.amazon_aps,
    quick_start: 'Amazon Publisher Services에 가입하고 apstag 스크립트를 page head에 추가한 후 헤더 비딩 설정을 완료하면 Amazon 수요와 연결된 CPM 수익화가 시작됩니다.',
    quick_start_en: 'Sign up for Amazon Publisher Services, add the apstag script to your page head, and complete the header bidding configuration to start monetizing with Amazon demand.',
    setup_steps: [
      {
        step: 1,
        title: 'Apply to Amazon Publisher Services',
        title_ko: 'Amazon Publisher Services 신청',
        description: 'Apply at aps.amazon.com. APS requires a minimum of 5,000 daily unique visitors. Once approved, you receive your Publisher ID, App ID, and Slot UUIDs from the APS console.',
        description_ko: 'aps.amazon.com에서 신청합니다. APS는 일일 고유 방문자 5,000명 이상이 필요합니다. 승인 후 APS 콘솔에서 퍼블리셔 ID, 앱 ID, 슬롯 UUID를 발급받습니다.',
      },
      {
        step: 2,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Store APS credentials. Publisher ID and App ID are server-side secrets. Slot UUID is used client-side for bid requests.',
        description_ko: 'APS 자격증명을 저장합니다. 퍼블리셔 ID와 앱 ID는 서버 전용 비밀값입니다. 슬롯 UUID는 클라이언트 입찰 요청에 사용됩니다.',
        code_snippet: 'APS_PUBLISHER_ID=your-publisher-id\nAPS_APP_ID=your-app-id\nNEXT_PUBLIC_APS_SLOT_UUID=your-slot-uuid',
      },
      {
        step: 3,
        title: 'Add apstag loader to layout',
        title_ko: '레이아웃에 apstag 로더 추가',
        description: 'Add the Amazon apstag script and initialization to your root layout. Initialize with your publisher ID configured to work with Google Ad Manager.',
        description_ko: '루트 레이아웃에 Amazon apstag 스크립트와 초기화 코드를 추가합니다. 퍼블리셔 ID로 초기화하고 Google Ad Manager와 연동합니다.',
        code_snippet: `import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Script id="apstag-loader" strategy="beforeInteractive">
          {\`
            !function(a9,a,p,s,t,A,g){if(a[a9])return;
            function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function(){q('i',arguments)},
            fetchBids:function(){q('f',arguments)},setDisplayBids:function(){},
            targetingKeys:function(){return[]},_Q:[]};
            A=p.createElement(s);A.async=!0;A.src=t;
            g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)
            }('apstag',window,document,'script','//c.amazon-adsystem.com/aax2/apstag.js');

            apstag.init({
              pubID: '${process.env.APS_PUBLISHER_ID ?? ''}',
              adServer: 'googletag'
            });
          \`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}`,
      },
      {
        step: 4,
        title: 'Fetch bids and refresh GAM slots',
        title_ko: '입찰 요청 및 GAM 슬롯 갱신',
        description: 'Call apstag.fetchBids() before requesting ads from Google Ad Manager, then call setDisplayBids() to apply Amazon targeting keys.',
        description_ko: 'Google Ad Manager에 광고를 요청하기 전에 apstag.fetchBids()를 호출하고, setDisplayBids()로 Amazon 타겟팅 키를 적용합니다.',
        code_snippet: `window.apstag.fetchBids(
  {
    slots: [{
      slotID: 'div-gpt-ad-top',
      slotName: '/network_code/ad_unit',
      sizes: [[728, 90], [970, 90]],
    }],
    timeout: 2000,
  },
  function() {
    window.googletag.cmd.push(function() {
      window.apstag.setDisplayBids()
      window.googletag.pubads().refresh()
    })
  }
)`,
      },
    ],
    code_examples: {
      typescript: `// src/components/ads/ApsAdSlot.tsx
'use client'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    apstag: {
      init: (config: { pubID: string; adServer: string }) => void
      fetchBids: (
        config: { slots: ApsSlot[]; timeout: number },
        callback: () => void
      ) => void
      setDisplayBids: () => void
    }
    googletag: {
      cmd: Array<() => void>
      defineSlot: (path: string, sizes: number[][], id: string) => GamSlot | null
      pubads: () => { refresh: (slots?: GamSlot[]) => void; enableSingleRequest: () => void; getSlots: () => GamSlot[] }
      enableServices: () => void
      display: (id: string) => void
      destroySlots: (slots: GamSlot[]) => void
    }
  }
}

interface ApsSlot { slotID: string; slotName: string; sizes: number[][] }
interface GamSlot { addService: (s: unknown) => GamSlot; getSlotElementId: () => string }

interface ApsAdSlotProps {
  slotId: string
  adUnitPath: string
  sizes: number[][]
}

export function ApsAdSlot({ slotId, adUnitPath, sizes }: ApsAdSlotProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || typeof window === 'undefined') return
    if (!window.apstag || !window.googletag) return
    initialized.current = true

    window.googletag.cmd.push(() => {
      const slot = window.googletag.defineSlot(adUnitPath, sizes, slotId)
      if (!slot) return
      slot.addService(window.googletag.pubads())
      window.googletag.pubads().enableSingleRequest()
      window.googletag.enableServices()
    })

    window.apstag.fetchBids(
      { slots: [{ slotID: slotId, slotName: adUnitPath, sizes }], timeout: 2000 },
      () => {
        window.googletag.cmd.push(() => {
          window.apstag.setDisplayBids()
          window.googletag.pubads().refresh()
        })
      }
    )
  }, [slotId, adUnitPath, sizes])

  return <div id={slotId} style={{ minHeight: sizes[0]?.[1] ?? 0 }} />
}

// 사용 예시
// <ApsAdSlot
//   slotId="div-gpt-ad-leaderboard"
//   adUnitPath={\`/\${process.env.NEXT_PUBLIC_GAM_NETWORK_CODE}/homepage\`}
//   sizes={[[728, 90], [970, 90]]}
// />`,
    },
    common_pitfalls: [
      {
        title: 'apstag not initialized before fetchBids',
        title_ko: 'fetchBids 호출 전 apstag 미초기화',
        problem: 'Calling apstag.fetchBids() before apstag.init() completes causes silent failures with no bids returned.',
        solution: 'Always load and initialize apstag in the page head before any fetchBids calls. Use the beforeInteractive script strategy.',
        code: `// 레이아웃 head에서 초기화
apstag.init({ pubID: 'YOUR_PUB_ID', adServer: 'googletag' })

// 컴포넌트 useEffect에서 입찰 요청
apstag.fetchBids({ slots: [...], timeout: 2000 }, callback)`,
      },
      {
        title: 'Bid timeout too short',
        title_ko: '입찰 타임아웃이 너무 짧음',
        problem: 'Setting timeout below 1000ms causes Amazon bids to frequently time out, reducing fill rate and CPM.',
        solution: 'Set timeout to 1500–2000ms for a balance between latency and bid response rate. Monitor win rate in APS console.',
      },
      {
        title: 'GAM line items not configured for APS',
        title_ko: 'GAM 라인 아이템 미설정',
        problem: 'APS header bidding only works when corresponding line items are set up in GAM to accept Amazon targeting keys (amzniid, amznbid, amznsz).',
        solution: 'Follow APS documentation to create price-granularity line items in GAM that match Amazon bid key-value targeting.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'google-ad-manager',
        tip: 'APS is designed to work alongside Google Ad Manager. Call apstag.fetchBids() in parallel with GPT slot definition, then apply Amazon bids via apstag.setDisplayBids() before googletag.pubads().refresh().',
        tip_ko: 'APS는 Google Ad Manager와 함께 동작하도록 설계되었습니다. GPT 슬롯 정의와 병렬로 apstag.fetchBids()를 호출하고, googletag refresh 전에 apstag.setDisplayBids()를 호출하세요.',
        code: `window.apstag.fetchBids(
  { slots: amazonSlots, timeout: 2000 },
  function() {
    window.googletag.cmd.push(function() {
      window.apstag.setDisplayBids()   // Amazon 타겟팅 적용
      window.googletag.pubads().refresh() // GAM 광고 요청
    })
  }
)`,
      },
      {
        with_service_slug: 'criteo',
        tip: 'Run APS and Criteo in parallel — APS provides Amazon first-party demand via header bidding while Criteo adds retargeting demand for a complementary monetization stack.',
        tip_ko: 'APS와 Criteo를 병렬 실행하세요 — APS는 헤더 비딩으로 Amazon 퍼스트파티 수요를, Criteo는 리타겟팅 수요를 보완하여 수익을 극대화합니다.',
      },
    ],
    pros: [
      { text: 'Access to Amazon first-party demand and DSP — premium CPM rates', text_ko: 'Amazon 퍼스트파티 수요 및 DSP 접근 — 높은 CPM 단가' },
      { text: 'No additional cost — revenue share model with free integration', text_ko: '추가 비용 없음 — 수익 공유 방식, 무료 통합' },
      { text: 'Prebid adapter available for easy integration with existing header bidding', text_ko: '기존 헤더 비딩 설정과 쉽게 통합하는 Prebid 어댑터 제공' },
    ],
    cons: [
      { text: 'High technical complexity — requires GAM line item setup and header bidding expertise', text_ko: '높은 기술 복잡도 — GAM 라인 아이템 설정 및 헤더 비딩 전문 지식 필요' },
      { text: 'Minimum traffic requirement (5,000+ daily unique visitors)', text_ko: '최소 트래픽 요건 (일일 고유 방문자 5,000명+)' },
      { text: 'Adds latency to ad loading if timeout is not managed carefully', text_ko: '타임아웃 관리 미흡 시 광고 로딩 지연 발생' },
    ],
    api_key_url: 'https://aps.amazon.com/aps/index.html',
    api_key_url_label: 'Amazon APS',
  },
  {
    service_id: S.google_ad_manager,
    quick_start: 'Google Ad Manager 계정을 생성하고 네트워크 코드를 발급받은 후 GPT 스크립트를 레이아웃에 추가하면 프로그래매틱 광고 서빙이 시작됩니다.',
    quick_start_en: 'Create a Google Ad Manager account, get your network code, add the GPT script to your layout, and programmatic ad serving begins immediately.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Google Ad Manager account',
        title_ko: 'Google Ad Manager 계정 생성',
        description: 'Sign up at admanager.google.com. Small publishers get Ad Manager for free (up to 90M impressions/month). Copy your network code from Admin > Global Settings.',
        description_ko: 'admanager.google.com에서 가입합니다. 소규모 퍼블리셔는 무료 이용 가능(월 9천만 노출 이하). 관리 > 전역 설정 페이지에서 네트워크 코드를 복사합니다.',
      },
      {
        step: 2,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Add your GAM credentials to .env.local. Both are public values used in client-side GPT calls.',
        description_ko: '.env.local에 GAM 자격증명을 추가합니다. 두 값 모두 클라이언트 GPT 호출에 사용되는 공개 값입니다.',
        code_snippet: 'NEXT_PUBLIC_GAM_NETWORK_CODE=12345678\nNEXT_PUBLIC_GAM_AD_UNIT_PATH=/12345678/homepage-leaderboard',
      },
      {
        step: 3,
        title: 'Load GPT script in root layout',
        title_ko: '루트 레이아웃에 GPT 스크립트 로드',
        description: 'Add the GPT script and googletag initialization to root layout. Use enableSingleRequest() and disableInitialLoad() to control ad requests.',
        description_ko: '루트 레이아웃에 GPT 스크립트와 googletag 초기화를 추가합니다. enableSingleRequest()와 disableInitialLoad()로 광고 요청을 제어합니다.',
        code_snippet: `import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Script
          id="gpt-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: \`
              window.googletag = window.googletag || { cmd: [] };
              googletag.cmd.push(function() {
                googletag.pubads().enableSingleRequest();
                googletag.pubads().disableInitialLoad();
                googletag.enableServices();
              });
            \`,
          }}
        />
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}`,
      },
      {
        step: 4,
        title: 'Create Ad slot component',
        title_ko: '광고 슬롯 컴포넌트 생성',
        description: 'Create a reusable GamAdSlot component that defines a GPT slot, displays it, and destroys it on unmount to prevent memory leaks.',
        description_ko: 'GPT 슬롯을 정의하고 표시하며, 언마운트 시 destroySlots()로 메모리 누수를 방지하는 재사용 가능한 컴포넌트를 생성합니다.',
        code_snippet: `'use client'
import { useEffect, useId } from 'react'

export function GamAdSlot({ adUnitPath, sizes }: { adUnitPath: string; sizes: number[][] }) {
  const slotId = \`gam-\${useId().replace(/:/g, '')}\`

  useEffect(() => {
    const { googletag } = window
    if (!googletag) return

    let slot: unknown = null
    googletag.cmd.push(() => {
      slot = googletag.defineSlot(adUnitPath, sizes, slotId)
      if (!slot) return
      slot.addService(googletag.pubads())
      googletag.display(slotId)
      googletag.pubads().refresh([slot])
    })

    return () => {
      googletag.cmd.push(() => {
        if (slot) googletag.destroySlots([slot])
      })
    }
  }, [adUnitPath, sizes, slotId])

  return <div id={slotId} style={{ minHeight: sizes[0]?.[1] ?? 0 }} />
}`,
      },
    ],
    code_examples: {
      typescript: `// src/components/ads/GamAdSlot.tsx
'use client'
import { useEffect, useId } from 'react'

declare global {
  interface Window {
    googletag: {
      cmd: Array<() => void>
      defineSlot: (path: string, sizes: number[][], id: string) => GptSlot | null
      destroySlots: (slots: GptSlot[]) => void
      display: (id: string) => void
      pubads: () => GptPubAds
      enableServices: () => void
    }
  }
}

interface GptSlot {
  addService: (svc: GptPubAds) => GptSlot
  getSlotElementId: () => string
  setTargeting: (k: string, v: string) => GptSlot
}

interface GptPubAds {
  enableSingleRequest: () => void
  disableInitialLoad: () => void
  refresh: (slots?: GptSlot[]) => void
  getSlots: () => GptSlot[]
}

interface GamAdSlotProps {
  adUnitPath?: string
  sizes: number[][]
  targeting?: Record<string, string>
}

export function GamAdSlot({
  adUnitPath = process.env.NEXT_PUBLIC_GAM_AD_UNIT_PATH ?? '',
  sizes,
  targeting = {},
}: GamAdSlotProps) {
  const rawId = useId()
  const slotId = \`gam-\${rawId.replace(/:/g, '').replace(/^-/, '')}\`

  useEffect(() => {
    const { googletag } = window
    if (!googletag || !adUnitPath) return

    let slot: GptSlot | null = null

    googletag.cmd.push(() => {
      slot = googletag.defineSlot(adUnitPath, sizes, slotId)
      if (!slot) return
      Object.entries(targeting).forEach(([k, v]) => slot!.setTargeting(k, v))
      slot.addService(googletag.pubads())
      googletag.display(slotId)
      googletag.pubads().refresh([slot])
    })

    return () => {
      googletag.cmd.push(() => {
        if (slot) googletag.destroySlots([slot])
      })
    }
  }, [adUnitPath, slotId])

  return (
    <div
      id={slotId}
      style={{ minHeight: sizes[0]?.[1] ?? 0, width: sizes[0]?.[0] ?? 'auto' }}
    />
  )
}

// 사용 예시
// <GamAdSlot
//   adUnitPath={\`/\${process.env.NEXT_PUBLIC_GAM_NETWORK_CODE}/leaderboard\`}
//   sizes={[[728, 90], [970, 90]]}
//   targeting={{ section: 'tech', pos: 'top' }}
// />`,
    },
    common_pitfalls: [
      {
        title: 'Slot defined multiple times without destroy',
        title_ko: 'destroy 없이 슬롯 중복 정의',
        problem: 'Re-mounting the component without destroying the previous slot causes "Slot already defined" errors and duplicated ad requests.',
        solution: 'Always call googletag.destroySlots() in the useEffect cleanup function before the component unmounts.',
        code: `useEffect(() => {
  let slot: GptSlot | null = null
  googletag.cmd.push(() => {
    slot = googletag.defineSlot(path, sizes, slotId)
    if (slot) {
      slot.addService(googletag.pubads())
      googletag.display(slotId)
      googletag.pubads().refresh([slot])
    }
  })
  return () => {
    googletag.cmd.push(() => {
      if (slot) googletag.destroySlots([slot])
    })
  }
}, [path, slotId])`,
      },
      {
        title: 'disableInitialLoad() not called — double ad requests',
        title_ko: 'disableInitialLoad() 미호출로 광고 중복 요청',
        problem: 'Without disableInitialLoad(), GPT sends an ad request on display(), then another on refresh(), causing double billing.',
        solution: 'Call googletag.pubads().disableInitialLoad() during initialization and use refresh() to control when ads load.',
        code: `googletag.cmd.push(function() {
  googletag.pubads().enableSingleRequest()
  googletag.pubads().disableInitialLoad() // 필수
  googletag.enableServices()
})`,
      },
      {
        title: 'CLS from unsized ad containers',
        title_ko: '크기 미지정 광고 컨테이너로 인한 CLS',
        problem: 'Ad slots without pre-defined height cause layout shifts when ads load, hurting Core Web Vitals scores.',
        solution: 'Set minHeight on the ad container div equal to the smallest possible ad size to reserve space before the ad loads.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'amazon-aps',
        tip: 'Combine GAM with APS for header bidding. Call apstag.fetchBids() in parallel with GPT slot definition, then apply Amazon bids via apstag.setDisplayBids() before googletag.pubads().refresh().',
        tip_ko: 'GAM과 APS를 헤더 비딩으로 결합하세요. GPT 슬롯 정의와 병렬로 apstag.fetchBids()를 호출하고, googletag refresh 전에 apstag.setDisplayBids()를 호출하세요.',
        code: `window.apstag.fetchBids(
  { slots: apsSlots, timeout: 2000 },
  function() {
    window.googletag.cmd.push(function() {
      window.apstag.setDisplayBids()
      window.googletag.pubads().refresh()
    })
  }
)`,
      },
      {
        with_service_slug: 'google-adsense',
        tip: 'GAM can serve AdSense demand via Ad Exchange (AdX). Connect your AdSense account to GAM to access AdX programmatic demand while managing direct-sold inventory in GAM.',
        tip_ko: 'GAM은 Ad Exchange(AdX)를 통해 AdSense 수요를 서빙할 수 있습니다. AdSense 계정을 GAM에 연결하면 AdX 프로그래매틱 수요에 접근하면서 다이렉트 판매 인벤토리는 GAM에서 관리합니다.',
      },
    ],
    pros: [
      { text: 'Enterprise-grade ad server — full control over direct deals, programmatic, and header bidding', text_ko: '엔터프라이즈급 광고 서버 — 다이렉트 딜, 프로그래매틱, 헤더 비딩 완전 제어' },
      { text: 'Free for small publishers (up to 90M impressions/month)', text_ko: '소규모 퍼블리셔 무료 (월 9천만 노출 이하)' },
      { text: 'Unified reporting across all demand sources', text_ko: '모든 수요 소스에 대한 통합 리포팅' },
    ],
    cons: [
      { text: 'High technical complexity — requires GAM expertise for line item setup', text_ko: '높은 기술 복잡도 — 라인 아이템 설정을 위한 GAM 전문 지식 필요' },
      { text: 'Google vendor lock-in — migration requires significant infrastructure work', text_ko: 'Google 종속성 — 마이그레이션 시 상당한 인프라 작업 필요' },
      { text: 'Full-featured UI can be overwhelming for small publisher teams', text_ko: '소규모 팀에게 압도적인 복잡한 UI' },
    ],
    api_key_url: 'https://admanager.google.com',
    api_key_url_label: 'Google Ad Manager',
  },

  // ---------------------------------------------------------------------------
  // Social Login services
  // ---------------------------------------------------------------------------
  {
    service_id: S.kakao_login,
    quick_start: '카카오 개발자 콘솔에서 앱을 생성하고 REST API 키를 발급받아 Next.js 앱에 카카오 로그인을 추가할 수 있습니다.',
    quick_start_en: 'Create an app in Kakao Developers console and get a REST API key to add Kakao Login to your Next.js app.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Kakao App',
        title_ko: '카카오 앱 생성',
        description: 'Go to developers.kakao.com, create a new application, and copy the REST API Key and JavaScript Key.',
        description_ko: 'developers.kakao.com에서 새 애플리케이션을 생성하고 REST API 키와 JavaScript 키를 복사합니다.',
      },
      {
        step: 2,
        title: 'Configure Redirect URI',
        title_ko: '리다이렉트 URI 설정',
        description: 'In Kakao Developers > App Settings > Kakao Login, add your redirect URI (e.g., https://your-domain.com/api/auth/callback/kakao).',
        description_ko: '카카오 개발자 > 앱 설정 > 카카오 로그인에서 리다이렉트 URI를 추가합니다 (예: https://your-domain.com/api/auth/callback/kakao).',
      },
      {
        step: 3,
        title: 'Set Environment Variables',
        title_ko: '환경변수 설정',
        description: 'Add NEXT_PUBLIC_KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY, and KAKAO_REDIRECT_URI to your .env file.',
        description_ko: '.env 파일에 NEXT_PUBLIC_KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET, NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY, KAKAO_REDIRECT_URI를 추가합니다.',
      },
    ],
    code_examples: {},
    common_pitfalls: [
      {
        title: 'Redirect URI mismatch',
        title_ko: '리다이렉트 URI 불일치',
        problem: 'OAuth callback fails with redirect_uri_mismatch error',
        solution: 'Ensure the redirect URI in Kakao Developers matches your app URL exactly including protocol and path',
      },
    ],
    integration_tips: [],
    pros: [
      { text: 'Most popular login method in Korea', text_ko: '한국에서 가장 인기 있는 로그인 방식' },
      { text: 'Completely free to use', text_ko: '완전 무료' },
    ],
    cons: [
      { text: 'Korea-only user base', text_ko: '한국 전용 사용자 기반' },
      { text: 'Documentation mainly in Korean', text_ko: '문서가 주로 한국어' },
    ],
    api_key_url: 'https://developers.kakao.com/console/app',
    api_key_url_label: 'Kakao Developers',
  },
  {
    service_id: S.google_oauth,
    quick_start: 'Google Cloud Console에서 OAuth 2.0 클라이언트를 생성하고 Client ID/Secret을 발급받아 소셜 로그인을 추가할 수 있습니다.',
    quick_start_en: 'Create an OAuth 2.0 client in Google Cloud Console and get Client ID/Secret to add social login.',
    setup_steps: [],
    code_examples: {},
    common_pitfalls: [],
    integration_tips: [],
    pros: [
      { text: 'Global user base with Gmail accounts', text_ko: 'Gmail 계정의 글로벌 사용자 기반' },
      { text: 'Well-documented OAuth 2.0 flow', text_ko: '잘 문서화된 OAuth 2.0 흐름' },
    ],
    cons: [
      { text: 'Google Cloud Console can be complex', text_ko: 'Google Cloud Console이 복잡할 수 있음' },
    ],
    api_key_url: 'https://console.cloud.google.com/apis/credentials',
    api_key_url_label: 'Google Cloud Console',
  },
  {
    service_id: S.naver_login,
    quick_start: '네이버 개발자 센터에서 애플리케이션을 등록하고 Client ID/Secret을 발급받아 네이버 로그인을 추가할 수 있습니다.',
    quick_start_en: 'Register an application in Naver Developers and get Client ID/Secret to add Naver Login.',
    setup_steps: [],
    code_examples: {},
    common_pitfalls: [],
    integration_tips: [],
    pros: [
      { text: 'Second most popular login in Korea', text_ko: '한국에서 두 번째로 인기 있는 로그인' },
      { text: 'Free to use', text_ko: '무료 사용' },
    ],
    cons: [
      { text: 'Korea-only user base', text_ko: '한국 전용 사용자 기반' },
    ],
    api_key_url: 'https://developers.naver.com/apps/#/myapps',
    api_key_url_label: 'Naver Developers',
  },
  {
    service_id: S.apple_login,
    quick_start: 'Apple Developer Console에서 Sign in with Apple을 활성화하고 Service ID를 생성하여 앱에 연결할 수 있습니다.',
    quick_start_en: 'Enable Sign in with Apple in Apple Developer Console and create a Service ID to connect to your app.',
    setup_steps: [],
    code_examples: {},
    common_pitfalls: [],
    integration_tips: [],
    pros: [
      { text: 'Required for iOS apps with third-party login', text_ko: '서드파티 로그인이 있는 iOS 앱에 필수' },
      { text: 'Privacy-focused with email relay', text_ko: '이메일 릴레이로 프라이버시 중시' },
    ],
    cons: [
      { text: 'Requires Apple Developer account ($99/year)', text_ko: 'Apple 개발자 계정 필요 (연 $99)' },
    ],
    api_key_url: 'https://developer.apple.com/account/resources/identifiers/list/serviceId',
    api_key_url_label: 'Apple Developer',
  },

  // ---------------------------------------------------------------------------
  // Infra / Deploy / CDN / Storage
  // ---------------------------------------------------------------------------

  // 1. Netlify
  {
    service_id: S.netlify,
    quick_start: 'Netlify CLI로 정적 사이트나 Next.js 앱을 30초 안에 글로벌 CDN에 배포하고, Git 연동으로 자동 CI/CD를 설정할 수 있습니다.',
    quick_start_en: 'Deploy a static site or Next.js app to the global CDN in under 30 seconds with the Netlify CLI and set up automatic CI/CD via Git integration.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Netlify CLI',
        title_ko: 'Netlify CLI 설치',
        description: 'Install the Netlify CLI globally and log in to your account.',
        description_ko: 'Netlify CLI를 전역 설치하고 계정에 로그인합니다.',
        code_snippet: `npm install -g netlify-cli
netlify login`,
      },
      {
        step: 2,
        title: 'Initialize and deploy',
        title_ko: '초기화 및 배포',
        description: 'Run netlify init in your project directory to link a site, then deploy a preview with netlify deploy or push to production with the --prod flag.',
        description_ko: '프로젝트 디렉토리에서 netlify init으로 사이트를 연결하고, netlify deploy로 프리뷰 배포하거나 --prod 플래그로 운영 배포합니다.',
        code_snippet: `netlify init
netlify deploy          # 프리뷰 배포
netlify deploy --prod   # 운영 배포`,
      },
      {
        step: 3,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Add environment variables from the Netlify dashboard or sync from a local .env file.',
        description_ko: 'Netlify 대시보드에서 환경변수를 추가하거나 로컬 .env 파일을 동기화합니다.',
        code_snippet: `netlify env:set DATABASE_URL "postgresql://..."
netlify env:import .env.production`,
      },
    ],
    code_examples: {
      typescript: `// netlify.toml
// @ts-nocheck  (TOML 파일은 TypeScript가 아니지만 설명용으로 포함)

/*
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"
*/

// Next.js API Route — Netlify Functions 자동 변환 예시
// src/app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello from Netlify Edge' })
}`,
    },
    common_pitfalls: [
      {
        title: 'Missing @netlify/plugin-nextjs',
        title_ko: '@netlify/plugin-nextjs 누락',
        problem: 'Next.js SSR/ISR routes return 404 or fall back to static rendering after deployment.',
        solution: 'Add @netlify/plugin-nextjs to netlify.toml [[plugins]] and install it as a dev dependency.',
        code: `npm install -D @netlify/plugin-nextjs

# netlify.toml
[[plugins]]
  package = "@netlify/plugin-nextjs"`,
      },
      {
        title: 'Environment variables not available at build time',
        title_ko: '빌드 시 환경변수 미적용',
        problem: 'NEXT_PUBLIC_ variables are undefined because they were added after the last deploy.',
        solution: 'Set variables in the Netlify dashboard under Site settings > Environment variables, then trigger a new deploy.',
      },
      {
        title: 'Large function bundle size',
        title_ko: '함수 번들 크기 초과',
        problem: 'Deployment fails with "Function bundle exceeds the maximum size limit" error.',
        solution: 'Use next/dynamic for heavy client-only components and ensure unnecessary server-side imports are tree-shaken.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use the Netlify-Supabase integration or manually add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the Netlify environment variables panel.',
        tip_ko: 'Netlify-Supabase 통합을 사용하거나, Netlify 환경변수 패널에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 수동으로 추가합니다.',
      },
      {
        with_service_slug: 'github',
        tip: 'Connect your GitHub repository in the Netlify dashboard to enable automatic deployments on every push and branch preview deployments for PRs.',
        tip_ko: 'Netlify 대시보드에서 GitHub 저장소를 연결하면 모든 푸시에 자동 배포되고, PR별 브랜치 프리뷰가 생성됩니다.',
      },
    ],
    pros: [
      { text: 'Zero-config static and JAMstack deployments with instant global CDN', text_ko: '무설정 정적·JAMstack 배포, 즉각적인 글로벌 CDN' },
      { text: 'Automatic branch preview deployments for every PR', text_ko: 'PR마다 자동 브랜치 프리뷰 배포' },
      { text: 'Generous free tier with unlimited bandwidth for static sites', text_ko: '정적 사이트 무제한 대역폭 포함 넉넉한 무료 플랜' },
    ],
    cons: [
      { text: 'Serverless function cold starts can be noticeable', text_ko: '서버리스 함수 콜드 스타트 지연이 발생할 수 있음' },
      { text: 'Advanced Next.js features (ISR, streaming) require the paid plugin tier', text_ko: 'ISR·스트리밍 등 고급 Next.js 기능은 유료 플러그인 티어 필요' },
    ],
    api_key_url: 'https://app.netlify.com/user/applications',
    api_key_url_label: 'Netlify Personal Access Tokens',
  },

  // 2. Railway
  {
    service_id: S.railway,
    quick_start: 'Railway CLI로 Node.js, Python, Docker 앱을 단 한 줄 명령어로 배포하고 Postgres, Redis 등 매니지드 DB를 즉시 프로비저닝할 수 있습니다.',
    quick_start_en: 'Deploy Node.js, Python, or Docker apps with a single command using the Railway CLI and instantly provision managed Postgres or Redis databases.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Railway CLI and login',
        title_ko: 'Railway CLI 설치 및 로그인',
        description: 'Install the Railway CLI and authenticate with your account.',
        description_ko: 'Railway CLI를 설치하고 계정 인증을 완료합니다.',
        code_snippet: `npm install -g @railway/cli
railway login`,
      },
      {
        step: 2,
        title: 'Initialize and deploy project',
        title_ko: '프로젝트 초기화 및 배포',
        description: 'Run railway init to create a new project, then deploy the current directory.',
        description_ko: 'railway init으로 새 프로젝트를 생성하고, 현재 디렉토리를 배포합니다.',
        code_snippet: `railway init
railway up`,
      },
      {
        step: 3,
        title: 'Add a Postgres database',
        title_ko: 'Postgres 데이터베이스 추가',
        description: 'Provision a managed PostgreSQL database from the Railway dashboard or CLI. The DATABASE_URL is automatically injected.',
        description_ko: 'Railway 대시보드 또는 CLI에서 PostgreSQL을 프로비저닝합니다. DATABASE_URL이 자동으로 주입됩니다.',
        code_snippet: `railway add --database postgres
# DATABASE_URL 환경변수가 자동으로 서비스에 주입됩니다`,
      },
    ],
    code_examples: {
      typescript: `// railway.json (선택 사항 - 빌드/시작 커맨드 오버라이드)
// {
//   "$schema": "https://railway.app/railway.schema.json",
//   "build": { "builder": "NIXPACKS" },
//   "deploy": { "startCommand": "node dist/index.js", "restartPolicyType": "ON_FAILURE" }
// }

// Next.js — railway는 nixpacks로 자동 감지하므로 별도 설정 불필요
// package.json start script 확인
// {
//   "scripts": {
//     "build": "next build",
//     "start": "next start -p $PORT"   // $PORT 변수 사용 필수
//   }
// }

// 환경변수 참조 예시 (TypeScript)
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})`,
    },
    common_pitfalls: [
      {
        title: 'Hard-coded PORT instead of $PORT',
        title_ko: 'PORT 하드코딩 (환경변수 미사용)',
        problem: 'App binds to a fixed port (e.g., 3000) instead of Railway\'s dynamic $PORT, causing deployment health checks to fail.',
        solution: 'Use process.env.PORT as the listening port. Railway injects PORT automatically.',
        code: `// Bad
app.listen(3000)

// Good
app.listen(Number(process.env.PORT) || 3000)`,
      },
      {
        title: 'Missing build output — nixpacks guesses wrong start command',
        title_ko: 'nixpacks가 시작 명령어를 잘못 추론',
        problem: 'Railway cannot find the correct start command when the build output structure is non-standard.',
        solution: 'Add a railway.json with an explicit deploy.startCommand, or set the Start Command in the Railway dashboard.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'neon',
        tip: 'Use Neon Postgres as an external database instead of Railway\'s built-in Postgres for serverless branching and autoscaling. Set DATABASE_URL in Railway environment variables.',
        tip_ko: 'Railway 내장 Postgres 대신 Neon Postgres를 외부 데이터베이스로 사용하면 서버리스 브랜칭과 오토스케일링을 활용할 수 있습니다. DATABASE_URL을 Railway 환경변수에 설정합니다.',
      },
      {
        with_service_slug: 'github',
        tip: 'Connect your GitHub repository in the Railway dashboard to enable automatic deployments on every push to the main branch.',
        tip_ko: 'Railway 대시보드에서 GitHub 저장소를 연결하면 main 브랜치 푸시마다 자동 배포됩니다.',
      },
    ],
    pros: [
      { text: 'One-command deploy with automatic language/framework detection via nixpacks', text_ko: '단 한 줄 배포, nixpacks로 언어/프레임워크 자동 감지' },
      { text: 'Built-in managed Postgres, Redis, MySQL — DATABASE_URL auto-injected', text_ko: '내장 매니지드 Postgres·Redis·MySQL, DATABASE_URL 자동 주입' },
      { text: 'Pay-per-use pricing with no minimum — ideal for side projects', text_ko: '최소 요금 없는 종량제 — 사이드 프로젝트에 최적' },
    ],
    cons: [
      { text: 'No built-in CDN — static asset delivery requires a separate CDN layer', text_ko: '내장 CDN 없음 — 정적 에셋 전달에 별도 CDN 레이어 필요' },
      { text: 'Limited observability — advanced logging/tracing requires external tools', text_ko: '제한된 관측 가능성 — 고급 로깅/트레이싱은 외부 도구 필요' },
    ],
    api_key_url: 'https://railway.app/account/tokens',
    api_key_url_label: 'Railway API Tokens',
  },

  // 3. Cloudflare
  {
    service_id: S.cloudflare,
    quick_start: 'Wrangler CLI로 Cloudflare Workers를 배포하고, Pages로 프론트엔드를 서빙하며, R2·KV·D1 등 엣지 스토리지를 활용할 수 있습니다.',
    quick_start_en: 'Deploy Cloudflare Workers with the Wrangler CLI, serve frontends with Pages, and leverage edge storage with R2, KV, and D1.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Wrangler CLI',
        title_ko: 'Wrangler CLI 설치',
        description: 'Install the Wrangler CLI and log in with your Cloudflare account.',
        description_ko: 'Wrangler CLI를 설치하고 Cloudflare 계정으로 로그인합니다.',
        code_snippet: `npm install -g wrangler
wrangler login`,
      },
      {
        step: 2,
        title: 'Create a Worker',
        title_ko: 'Worker 생성',
        description: 'Create a new Worker project. Choose "Hello World" template to get started quickly.',
        description_ko: '새 Worker 프로젝트를 생성합니다. "Hello World" 템플릿으로 빠르게 시작합니다.',
        code_snippet: `npm create cloudflare@latest my-worker
cd my-worker
npm run dev     # 로컬 미리보기 (workerd 런타임)
npm run deploy  # 운영 배포`,
      },
      {
        step: 3,
        title: 'Configure wrangler.toml',
        title_ko: 'wrangler.toml 설정',
        description: 'Define bindings for R2, KV, D1 and set the compatibility date.',
        description_ko: 'R2, KV, D1 바인딩과 compatibility_date를 설정합니다.',
        code_snippet: `# wrangler.toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2025-04-01"
compatibility_flags = ["nodejs_compat"]

[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "my-bucket"`,
      },
    ],
    code_examples: {
      typescript: `// src/index.ts — Cloudflare Worker
export interface Env {
  MY_BUCKET: R2Bucket
  MY_KV: KVNamespace
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // R2 파일 서빙
    if (url.pathname.startsWith('/files/')) {
      const key = url.pathname.slice('/files/'.length)
      const object = await env.MY_BUCKET.get(key)
      if (!object) return new Response('Not Found', { status: 404 })
      return new Response(object.body, {
        headers: { 'Content-Type': object.httpMetadata?.contentType ?? 'application/octet-stream' },
      })
    }

    // KV 읽기
    const value = await env.MY_KV.get('key')
    return Response.json({ value })
  },
}`,
    },
    common_pitfalls: [
      {
        title: 'compatibility_date too old — process.env unavailable',
        title_ko: 'compatibility_date가 오래되어 process.env 미지원',
        problem: 'Environment variables via process.env are undefined because the compatibility date predates 2025-04-01.',
        solution: 'Set compatibility_date = "2025-04-01" or later and add the nodejs_compat flag.',
        code: `# wrangler.toml
compatibility_date = "2025-04-01"
compatibility_flags = ["nodejs_compat"]`,
      },
      {
        title: 'Edge runtime declaration blocks @opennextjs/cloudflare',
        title_ko: 'edge runtime 선언이 @opennextjs/cloudflare를 차단',
        problem: 'Next.js route files with export const runtime = "edge" are incompatible with @opennextjs/cloudflare.',
        solution: 'Remove all edge runtime declarations and rely on the Node.js runtime which @opennextjs/cloudflare handles correctly.',
        code: `// 제거:  export const runtime = 'edge'
// Worker는 기본적으로 엣지에서 실행되므로 별도 선언 불필요`,
      },
      {
        title: 'DB client instantiated at module scope',
        title_ko: 'DB 클라이언트가 모듈 스코프에서 생성',
        problem: 'Database connections created at module level are reused across requests, which is incompatible with the Workers runtime.',
        solution: 'Instantiate DB clients inside the request handler function, not at the top level of the module.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'r2',
        tip: 'Bind an R2 bucket directly in wrangler.toml for zero-egress, S3-compatible object storage. Access it via env.BUCKET inside your Worker without any SDK.',
        tip_ko: 'wrangler.toml에서 R2 버킷을 직접 바인딩하면 이그레스 비용 없는 S3 호환 스토리지를 SDK 없이 Worker 내부에서 바로 사용할 수 있습니다.',
        code: `# wrangler.toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-assets"`,
      },
      {
        with_service_slug: 'supabase',
        tip: 'Use Supabase with Cloudflare Workers by adding SUPABASE_URL and SUPABASE_ANON_KEY as Worker secrets. Use @supabase/supabase-js in edge-compatible mode.',
        tip_ko: 'SUPABASE_URL과 SUPABASE_ANON_KEY를 Worker 시크릿으로 추가하여 Cloudflare Workers에서 Supabase를 사용하세요. @supabase/supabase-js는 엣지 호환 모드로 동작합니다.',
      },
    ],
    pros: [
      { text: 'Unlimited bandwidth on free CDN tier — no egress fees for Workers', text_ko: '무료 CDN 무제한 대역폭, Workers 이그레스 비용 없음' },
      { text: 'Sub-millisecond cold starts in the Workers runtime', text_ko: 'Workers 런타임에서 밀리초 이하 콜드 스타트' },
      { text: 'All-in-one: CDN, DNS, WAF, Workers, R2, KV, D1 under one platform', text_ko: 'CDN·DNS·WAF·Workers·R2·KV·D1을 하나의 플랫폼에서 관리' },
    ],
    cons: [
      { text: 'Workers runtime differences from Node.js require code adaptation', text_ko: 'Workers 런타임이 Node.js와 달라 코드 적응 필요' },
      { text: 'Worker size limit (3 MiB free / 10 MiB paid) can be tight for large apps', text_ko: 'Worker 크기 제한 (무료 3MiB / 유료 10MiB)이 대형 앱에는 빠듯할 수 있음' },
    ],
    api_key_url: 'https://dash.cloudflare.com/profile/api-tokens',
    api_key_url_label: 'Cloudflare API Tokens',
  },

  // 4. Fly.io
  {
    service_id: S.flyio,
    quick_start: 'flyctl CLI로 Docker 컨테이너를 전 세계 35개 이상 리전에 배포하고 Postgres, Redis 등 매니지드 서비스를 함께 프로비저닝할 수 있습니다.',
    quick_start_en: 'Deploy Docker containers to 35+ global regions with the flyctl CLI and provision managed Postgres or Redis alongside your app.',
    setup_steps: [
      {
        step: 1,
        title: 'Install flyctl and authenticate',
        title_ko: 'flyctl 설치 및 인증',
        description: 'Install the Fly.io CLI (flyctl) and sign up or log in.',
        description_ko: 'Fly.io CLI(flyctl)를 설치하고 계정에 가입하거나 로그인합니다.',
        code_snippet: `# macOS/Linux
curl -L https://fly.io/install.sh | sh
# Windows (PowerShell)
# iwr https://fly.io/install.ps1 -useb | iex

fly auth login`,
      },
      {
        step: 2,
        title: 'Launch your app',
        title_ko: '앱 런치',
        description: 'Run fly launch in your project directory. Fly.io detects your framework and generates fly.toml and a Dockerfile if needed.',
        description_ko: '프로젝트 디렉토리에서 fly launch를 실행합니다. 프레임워크를 자동 감지하고 fly.toml과 Dockerfile을 생성합니다.',
        code_snippet: `fly launch
# 대화형 프롬프트: 앱 이름, 리전 선택
fly deploy`,
      },
      {
        step: 3,
        title: 'Set secrets and scale',
        title_ko: '시크릿 설정 및 스케일 조정',
        description: 'Add secrets (environment variables) and configure machine count for high availability.',
        description_ko: '시크릿(환경변수)을 추가하고 고가용성을 위한 머신 수를 설정합니다.',
        code_snippet: `fly secrets set DATABASE_URL="postgresql://..."
fly scale count 2   # 2대로 스케일 아웃`,
      },
    ],
    code_examples: {
      typescript: `# fly.toml — Next.js 앱 예시
# app = "my-nextjs-app"
# primary_region = "nrt"  # Tokyo
#
# [build]
#
# [http_service]
#   internal_port = 3000
#   force_https = true
#   auto_stop_machines = "stop"
#   auto_start_machines = true
#   min_machines_running = 0
#
# [[vm]]
#   memory = "512mb"
#   cpu_kind = "shared"
#   cpus = 1

// Dockerfile — Next.js multi-stage (standalone 모드)
/*
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
*/`,
    },
    common_pitfalls: [
      {
        title: 'No Dockerfile — fly launch fails to detect framework',
        title_ko: 'Dockerfile 없음 — 프레임워크 자동 감지 실패',
        problem: 'fly launch cannot find the right builder and exits with an error for non-standard project structures.',
        solution: 'Provide a Dockerfile in the project root. Use the multi-stage Node.js template as a starting point.',
      },
      {
        title: 'Machine auto-stop causes cold starts',
        title_ko: '머신 자동 중지로 콜드 스타트 발생',
        problem: 'With auto_stop_machines = "stop", machines are stopped when idle and take ~2–5 seconds to restart.',
        solution: 'Set min_machines_running = 1 in fly.toml to keep at least one machine always warm, or use auto_stop_machines = "suspend" for faster wake-up.',
        code: `# fly.toml
[http_service]
  auto_stop_machines = "suspend"
  min_machines_running = 1`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'docker',
        tip: 'Fly.io deploys directly from a Dockerfile. Use multi-stage builds with Next.js output: "standalone" to keep images under 100 MB.',
        tip_ko: 'Fly.io는 Dockerfile에서 직접 배포합니다. Next.js output: "standalone"과 멀티스테이지 빌드를 사용하면 이미지를 100MB 이하로 줄일 수 있습니다.',
        code: `// next.config.ts
export default {
  output: 'standalone',
}`,
      },
      {
        with_service_slug: 'neon',
        tip: 'Use Neon Postgres for a serverless database that pairs well with Fly.io\'s global edge deployment. Set DATABASE_URL as a Fly.io secret.',
        tip_ko: 'Fly.io 글로벌 엣지 배포와 잘 어울리는 서버리스 데이터베이스로 Neon Postgres를 사용하세요. DATABASE_URL을 Fly.io 시크릿으로 설정합니다.',
      },
    ],
    pros: [
      { text: '35+ global regions with anycast routing — low latency worldwide', text_ko: '35개 이상 글로벌 리전과 애니캐스트 라우팅으로 전 세계 저지연' },
      { text: 'Full Docker support — any language or runtime runs as-is', text_ko: '완전한 Docker 지원 — 모든 언어·런타임을 그대로 실행' },
      { text: 'Built-in Postgres, Redis, and volume storage with easy CLI management', text_ko: '내장 Postgres·Redis·볼륨 스토리지와 쉬운 CLI 관리' },
    ],
    cons: [
      { text: 'Billing can be unpredictable for always-on multi-machine setups', text_ko: '상시 가동 멀티머신 구성의 비용이 예측하기 어려울 수 있음' },
      { text: 'Cold starts with auto-stop enabled require tuning to avoid latency', text_ko: '자동 중지 활성화 시 지연 방지를 위한 min_machines_running 튜닝 필요' },
    ],
    api_key_url: 'https://fly.io/user/personal_access_tokens',
    api_key_url_label: 'Fly.io Access Tokens',
  },

  // 5. Render
  {
    service_id: S.render,
    quick_start: 'GitHub 저장소를 Render에 연결하고 웹 서비스, 정적 사이트, 크론 작업, PostgreSQL을 클릭 몇 번으로 배포할 수 있습니다.',
    quick_start_en: 'Connect your GitHub repository to Render and deploy web services, static sites, cron jobs, and PostgreSQL in just a few clicks.',
    setup_steps: [
      {
        step: 1,
        title: 'Connect GitHub and create service',
        title_ko: 'GitHub 연결 및 서비스 생성',
        description: 'Go to Render dashboard, click "New Web Service", and connect your GitHub repository.',
        description_ko: 'Render 대시보드에서 "New Web Service"를 클릭하고 GitHub 저장소를 연결합니다.',
      },
      {
        step: 2,
        title: 'Configure build and start commands',
        title_ko: '빌드·시작 명령어 설정',
        description: 'Set the build command (e.g., npm run build) and start command (e.g., npm start). Render auto-detects Node.js and Next.js.',
        description_ko: '빌드 명령어(npm run build)와 시작 명령어(npm start)를 설정합니다. Render가 Node.js와 Next.js를 자동 감지합니다.',
        code_snippet: `# Build Command
npm run build
# Start Command
npm start   # Next.js는 PORT 환경변수를 자동으로 읽습니다`,
      },
      {
        step: 3,
        title: 'Add environment variables',
        title_ko: '환경변수 추가',
        description: 'Add all required environment variables in the "Environment" tab. For Database connections, Render provides the internal URL for free.',
        description_ko: '"Environment" 탭에서 필요한 환경변수를 추가합니다. DB 연결 시 내부 URL을 무료로 제공합니다.',
        code_snippet: `# render.yaml (Infrastructure as Code)
services:
  - type: web
    name: my-app
    runtime: node
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: my-postgres
          property: connectionString`,
      },
    ],
    code_examples: {
      typescript: `// render.yaml — 웹 서비스 + PostgreSQL IaC 예시
// services:
//   - type: web
//     name: my-nextjs-app
//     runtime: node
//     plan: free
//     buildCommand: npm ci && npm run build
//     startCommand: node .next/standalone/server.js
//     envVars:
//       - key: NODE_ENV
//         value: production
//       - key: DATABASE_URL
//         fromDatabase:
//           name: my-db
//           property: connectionString
//
// databases:
//   - name: my-db
//     plan: free

// package.json — PORT를 $PORT로 참조
// {
//   "scripts": {
//     "start": "next start -p $PORT"
//   }
// }

// Next.js — output standalone 활성화 (선택)
// next.config.ts
export default {
  output: 'standalone',
}`,
    },
    common_pitfalls: [
      {
        title: 'App not binding to $PORT',
        title_ko: '$PORT 환경변수 미사용',
        problem: 'Render assigns a dynamic PORT and the health check fails if the app listens on a hard-coded port.',
        solution: 'Use process.env.PORT in Node.js apps. For Next.js, pass -p $PORT to the start command.',
        code: `// next start -p $PORT
// 또는 package.json:
// "start": "next start -p $PORT"`,
      },
      {
        title: 'Free tier service sleeps after 15 minutes',
        title_ko: '무료 티어 서비스 15분 후 절전 모드 진입',
        problem: 'Free-tier web services spin down after 15 minutes of inactivity, causing a 30+ second cold start on the next request.',
        solution: 'Upgrade to the paid Individual plan ($7/month) or use a cron job / uptime monitor to keep the service warm.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Add SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY as Render environment variables. Use the internal database URL for Render Postgres.',
        tip_ko: 'SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY를 Render 환경변수로 추가합니다. Render Postgres 사용 시에는 내부 DB URL을 활용합니다.',
      },
      {
        with_service_slug: 'github',
        tip: 'Connect GitHub to Render for automatic deployments on every push. You can also configure auto-deploy to trigger only on main branch merges.',
        tip_ko: 'GitHub를 Render에 연결하면 모든 푸시마다 자동 배포됩니다. main 브랜치 병합 시에만 자동 배포되도록 설정할 수도 있습니다.',
      },
    ],
    pros: [
      { text: 'Simplest Git-to-deploy workflow with zero infrastructure knowledge required', text_ko: '인프라 지식 없이 Git 연동만으로 배포 완료' },
      { text: 'Free PostgreSQL and Redis — easy to get started for side projects', text_ko: '무료 PostgreSQL·Redis — 사이드 프로젝트 시작에 최적' },
      { text: 'render.yaml support for Infrastructure as Code', text_ko: 'render.yaml로 Infrastructure as Code 지원' },
    ],
    cons: [
      { text: 'Free tier web services sleep after 15 min inactivity — cold starts up to 30 seconds', text_ko: '무료 티어 서비스 15분 비활성 후 절전 — 콜드 스타트 최대 30초' },
      { text: 'No built-in edge/CDN layer — all traffic routes through a single region', text_ko: '엣지/CDN 레이어 없음 — 모든 트래픽이 단일 리전을 통과' },
    ],
    api_key_url: 'https://dashboard.render.com/u/settings#api-keys',
    api_key_url_label: 'Render API Keys',
  },

  // 6. Docker
  {
    service_id: S.docker,
    quick_start: '멀티스테이지 Dockerfile로 Next.js 앱을 경량 컨테이너로 빌드하고, Docker Compose로 로컬 개발 환경을 구성한 뒤 어느 클라우드에나 배포할 수 있습니다.',
    quick_start_en: 'Build a lightweight Next.js container with a multi-stage Dockerfile, set up a local dev environment with Docker Compose, and deploy to any cloud.',
    setup_steps: [
      {
        step: 1,
        title: 'Write a multi-stage Dockerfile',
        title_ko: '멀티스테이지 Dockerfile 작성',
        description: 'Use a multi-stage build to separate the build environment from the production image, keeping the final image small.',
        description_ko: '멀티스테이지 빌드로 빌드 환경과 운영 이미지를 분리하여 최종 이미지를 경량화합니다.',
        code_snippet: `# Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system nodejs && adduser --system --ingroup nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        step: 2,
        title: 'Create .dockerignore',
        title_ko: '.dockerignore 파일 생성',
        description: 'Exclude node_modules, .next build cache, and .env files to speed up builds and prevent secret leakage.',
        description_ko: 'node_modules, .next 빌드 캐시, .env 파일을 제외하여 빌드 속도를 높이고 시크릿 유출을 방지합니다.',
        code_snippet: `# .dockerignore
node_modules
.next
.env*
*.log
.git`,
      },
      {
        step: 3,
        title: 'Docker Compose for local dev',
        title_ko: '로컬 개발용 Docker Compose',
        description: 'Use Docker Compose to spin up your app with dependent services like PostgreSQL and Redis locally.',
        description_ko: 'Docker Compose로 앱과 PostgreSQL, Redis 등 의존 서비스를 로컬에서 한 번에 실행합니다.',
        code_snippet: `# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb`,
      },
    ],
    code_examples: {
      typescript: `// next.config.ts — standalone 출력 활성화 (Docker 최적화 필수)
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
}

export default config

// Docker 빌드 & 실행
// docker build -t my-app .
// docker run -p 3000:3000 --env-file .env.production my-app

// 멀티플랫폼 빌드 (M1/M2 Mac → amd64 배포)
// docker buildx build --platform linux/amd64 -t my-app:latest --push .`,
    },
    common_pitfalls: [
      {
        title: 'Missing output: standalone in next.config',
        title_ko: 'next.config에 output: standalone 누락',
        problem: 'The Docker image includes the full node_modules (500 MB+) because Next.js standalone mode is not enabled.',
        solution: 'Add output: "standalone" to next.config.ts. The .next/standalone directory contains only the files needed to run the app.',
        code: `// next.config.ts
export default { output: 'standalone' }`,
      },
      {
        title: 'Running as root inside the container',
        title_ko: '컨테이너 내부에서 root로 실행',
        problem: 'Running the Node.js process as root is a security risk and some cloud platforms reject root containers.',
        solution: 'Create a non-root system user in the Dockerfile and switch to it with USER before CMD.',
        code: `RUN addgroup --system nodejs && adduser --system --ingroup nodejs nextjs
USER nextjs`,
      },
      {
        title: '.env file accidentally copied into image',
        title_ko: '.env 파일이 이미지에 포함',
        problem: 'Secret keys in .env are baked into the Docker image and become visible to anyone who pulls the image.',
        solution: 'Add .env* to .dockerignore. Pass secrets at runtime via --env-file or environment orchestration (e.g., Kubernetes Secrets).',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'flyio',
        tip: 'Fly.io deploys directly from your Dockerfile. With output: "standalone" and a multi-stage build, you can keep images under 150 MB for fast deploys.',
        tip_ko: 'Fly.io는 Dockerfile에서 직접 배포합니다. output: "standalone"과 멀티스테이지 빌드로 이미지를 150MB 이하로 유지하면 빠른 배포가 가능합니다.',
      },
      {
        with_service_slug: 'railway',
        tip: 'Railway auto-detects a Dockerfile in the project root and uses it for building. Combine with railway.json for fine-grained start command control.',
        tip_ko: 'Railway는 프로젝트 루트의 Dockerfile을 자동으로 감지하여 빌드에 사용합니다. railway.json과 조합하면 시작 명령어를 세밀하게 제어할 수 있습니다.',
      },
    ],
    pros: [
      { text: 'Portable — build once and run on any cloud or on-premise server', text_ko: '이식성 — 한 번 빌드하면 모든 클라우드·온프레미스에서 실행' },
      { text: 'Reproducible environments — eliminates "works on my machine" issues', text_ko: '재현 가능한 환경 — "내 컴퓨터에서는 됩니다" 문제 제거' },
      { text: 'Multi-stage builds drastically reduce production image size', text_ko: '멀티스테이지 빌드로 운영 이미지 크기를 대폭 절감' },
    ],
    cons: [
      { text: 'Adds build pipeline complexity compared to platform-native deployments', text_ko: '플랫폼 네이티브 배포 대비 빌드 파이프라인 복잡도 증가' },
      { text: 'Container registry management and image versioning require additional tooling', text_ko: '컨테이너 레지스트리 관리 및 이미지 버전 관리에 추가 도구 필요' },
    ],
    api_key_url: 'https://hub.docker.com/settings/security',
    api_key_url_label: 'Docker Hub Access Tokens',
  },

  // 7. AWS S3
  {
    service_id: S.aws_s3,
    quick_start: 'AWS SDK v3로 S3 버킷에 파일을 업로드하고, 프리사인 URL을 생성하여 클라이언트에서 직접 S3에 안전하게 업로드할 수 있습니다.',
    quick_start_en: 'Upload files to S3 buckets with AWS SDK v3 and generate presigned URLs for secure client-side direct uploads.',
    setup_steps: [
      {
        step: 1,
        title: 'Install AWS SDK v3',
        title_ko: 'AWS SDK v3 설치',
        description: 'Install the S3 client and presigner packages from the modular AWS SDK v3.',
        description_ko: 'AWS SDK v3의 S3 클라이언트와 프리사인 패키지를 설치합니다.',
        code_snippet: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`,
      },
      {
        step: 2,
        title: 'Create S3 client',
        title_ko: 'S3 클라이언트 생성',
        description: 'Initialize the S3 client with your AWS credentials and region via environment variables.',
        description_ko: '환경변수로 자격증명과 리전을 설정하여 S3 클라이언트를 초기화합니다.',
        code_snippet: `import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})`,
      },
      {
        step: 3,
        title: 'Upload a file',
        title_ko: '파일 업로드',
        description: 'Use PutObjectCommand to upload a file, or GetObjectCommand with getSignedUrl to generate a presigned URL.',
        description_ko: 'PutObjectCommand로 파일을 업로드하거나, getSignedUrl로 프리사인 URL을 생성합니다.',
        code_snippet: `import { PutObjectCommand } from '@aws-sdk/client-s3'

await s3.send(new PutObjectCommand({
  Bucket: process.env.AWS_S3_BUCKET!,
  Key: 'uploads/file.png',
  Body: fileBuffer,
  ContentType: 'image/png',
}))`,
      },
    ],
    code_examples: {
      typescript: `import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// 서버→S3 직접 업로드
export async function uploadFile(key: string, body: Buffer, contentType: string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
  return \`https://\${process.env.AWS_S3_BUCKET}.s3.\${process.env.AWS_REGION}.amazonaws.com/\${key}\`
}

// 클라이언트→S3 프리사인 업로드 URL 생성 (서버에서 호출)
export async function getUploadPresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(s3, command, { expiresIn: 3600 }) // 1시간 유효
}

// 다운로드 프리사인 URL 생성
export async function getDownloadPresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  })
  return getSignedUrl(s3, command, { expiresIn: 900 }) // 15분 유효
}`,
    },
    common_pitfalls: [
      {
        title: 'CORS not configured on S3 bucket',
        title_ko: 'S3 버킷 CORS 미설정',
        problem: 'Browser direct uploads via presigned URLs fail with a CORS error.',
        solution: 'Configure CORS policy on the S3 bucket to allow PUT requests from your domain.',
        code: `// S3 CORS 설정 (AWS Console → S3 → Bucket → Permissions → CORS)
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]`,
      },
      {
        title: 'Exposing AWS credentials in the client bundle',
        title_ko: 'AWS 자격증명이 클라이언트 번들에 포함',
        problem: 'Importing the S3 client in a React component leaks AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to the browser.',
        solution: 'Always call S3 from server-side code (API routes, Server Actions). Use presigned URLs to allow client-side uploads without exposing credentials.',
      },
      {
        title: 'Public bucket without proper IAM — data leakage risk',
        title_ko: '공개 버킷 + IAM 미설정 — 데이터 유출 위험',
        problem: 'Setting the bucket ACL to "public-read" exposes all objects, including private user data.',
        solution: 'Keep the bucket private, use presigned URLs for time-limited access, and define fine-grained IAM policies.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Prefer Supabase Storage for simple use cases — it provides an S3-compatible API, RLS policies, and built-in CDN. Use S3 directly when you need advanced lifecycle rules or cross-region replication.',
        tip_ko: '단순한 경우에는 Supabase Storage를 우선 사용하세요. S3 호환 API, RLS 정책, 내장 CDN을 제공합니다. 고급 수명 주기 규칙이나 크로스 리전 복제가 필요할 때 S3를 직접 사용합니다.',
      },
      {
        with_service_slug: 'cloudflare',
        tip: 'Pair S3 with Cloudflare CDN by setting S3 bucket as the origin. Cloudflare caches static assets globally with zero egress fees from Cloudflare to the client.',
        tip_ko: 'S3 버킷을 오리진으로 설정하여 Cloudflare CDN과 연동하세요. Cloudflare에서 클라이언트까지의 이그레스 비용이 없으며 전 세계에서 정적 에셋을 캐싱합니다.',
      },
    ],
    pros: [
      { text: '99.999999999% (11 nines) durability — industry-leading reliability', text_ko: '99.999999999%(11 나인) 내구성 — 업계 최고 수준 신뢰성' },
      { text: 'Presigned URLs enable secure direct client uploads without server relay', text_ko: '프리사인 URL로 서버 중계 없이 안전한 클라이언트 직접 업로드' },
      { text: 'Rich ecosystem: lifecycle rules, versioning, replication, event triggers', text_ko: '풍부한 에코시스템: 수명 주기 규칙, 버전 관리, 복제, 이벤트 트리거' },
    ],
    cons: [
      { text: 'Egress fees can be significant for high-traffic public assets', text_ko: '트래픽이 많은 공개 에셋의 이그레스 요금이 상당할 수 있음' },
      { text: 'IAM permission setup has a steep learning curve', text_ko: 'IAM 권한 설정의 학습 곡선이 가파름' },
    ],
    api_key_url: 'https://console.aws.amazon.com/iam/home#/security_credentials',
    api_key_url_label: 'AWS IAM Security Credentials',
  },

  // 8. Cloudflare R2
  {
    service_id: S.r2,
    quick_start: 'AWS SDK v3를 사용하여 Cloudflare R2에 파일을 업로드합니다. R2는 S3 호환 API를 제공하며 이그레스 비용이 없어 대용량 파일 배포에 최적입니다.',
    quick_start_en: 'Upload files to Cloudflare R2 using the AWS SDK v3. R2 provides an S3-compatible API with zero egress fees, ideal for serving large files globally.',
    setup_steps: [
      {
        step: 1,
        title: 'Create R2 bucket and API token',
        title_ko: 'R2 버킷 생성 및 API 토큰 발급',
        description: 'In the Cloudflare dashboard, go to R2 > Overview, create a bucket, then generate an R2 API token with Object Read & Write permission.',
        description_ko: 'Cloudflare 대시보드에서 R2 > Overview로 이동하여 버킷을 생성하고, Object Read & Write 권한으로 R2 API 토큰을 발급합니다.',
      },
      {
        step: 2,
        title: 'Install AWS SDK v3',
        title_ko: 'AWS SDK v3 설치',
        description: 'R2 is fully S3-compatible — install the same @aws-sdk/client-s3 package used for AWS S3.',
        description_ko: 'R2는 완전 S3 호환입니다. AWS S3와 동일한 @aws-sdk/client-s3 패키지를 설치합니다.',
        code_snippet: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`,
      },
      {
        step: 3,
        title: 'Initialize R2 client',
        title_ko: 'R2 클라이언트 초기화',
        description: 'Point the S3 client to your R2 endpoint. The endpoint format is: https://<ACCOUNT_ID>.r2.cloudflarestorage.com',
        description_ko: 'S3 클라이언트의 엔드포인트를 R2로 지정합니다. 형식: https://<ACCOUNT_ID>.r2.cloudflarestorage.com',
        code_snippet: `import { S3Client } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: \`https://\${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})`,
      },
    ],
    code_examples: {
      typescript: `import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: \`https://\${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME!

// 파일 업로드
export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }))
  // Public 버킷의 경우 커스텀 도메인 URL 반환
  return \`https://assets.yourdomain.com/\${key}\`
}

// 클라이언트 업로드용 프리사인 URL 생성
export async function getR2UploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType })
  return getSignedUrl(r2, command, { expiresIn: 3600 })
}

// 파일 삭제
export async function deleteFromR2(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}`,
    },
    common_pitfalls: [
      {
        title: 'Missing region: "auto" — SignatureDoesNotMatch error',
        title_ko: 'region: "auto" 누락 — SignatureDoesNotMatch 오류',
        problem: 'Setting a real AWS region (e.g., "us-east-1") for R2 causes a signature mismatch error because R2 requires region "auto".',
        solution: 'Always use region: "auto" when configuring the S3Client for R2.',
        code: `const r2 = new S3Client({
  region: 'auto',   // 반드시 'auto'
  endpoint: \`https://\${ACCOUNT_ID}.r2.cloudflarestorage.com\`,
  credentials: { ... },
})`,
      },
      {
        title: 'Public access not configured for CDN serving',
        title_ko: '공개 접근 미설정으로 CDN 서빙 불가',
        problem: 'Files uploaded to R2 are private by default. Serving them directly via URL returns 403 Forbidden.',
        solution: 'Enable "Public Access" for the bucket in the R2 dashboard, or connect a custom domain to serve assets publicly. Alternatively, use presigned URLs for private, time-limited access.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'cloudflare',
        tip: 'Bind the R2 bucket directly in wrangler.toml for zero-overhead access inside a Cloudflare Worker. Avoid the extra network hop of the S3 API when running on Workers.',
        tip_ko: 'wrangler.toml에서 R2 버킷을 직접 바인딩하면 Cloudflare Worker 내부에서 오버헤드 없이 접근할 수 있습니다. Workers에서는 S3 API를 거치지 않아 네트워크 왕복이 없습니다.',
        code: `# wrangler.toml
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "my-assets"

# Worker 내부
# const obj = await env.ASSETS.get(key)`,
      },
      {
        with_service_slug: 'aws-s3',
        tip: 'Migrate from AWS S3 to R2 by changing only the endpoint and credentials in the S3Client constructor. All existing PutObjectCommand / GetObjectCommand / presigned URL code works without modification.',
        tip_ko: 'AWS S3에서 R2로 전환할 때는 S3Client의 endpoint와 credentials만 변경하면 됩니다. 기존 PutObjectCommand, GetObjectCommand, 프리사인 URL 코드는 수정 없이 그대로 작동합니다.',
      },
    ],
    pros: [
      { text: 'Zero egress fees — no charge for data transfer out to the internet', text_ko: '이그레스 비용 없음 — 인터넷으로 나가는 데이터 전송 무료' },
      { text: 'Fully S3-compatible API — drop-in replacement for AWS S3', text_ko: '완전 S3 호환 API — AWS S3 드롭인 대체재' },
      { text: 'Generous free tier: 10 GB storage and 1M Class A operations/month', text_ko: '넉넉한 무료 티어: 10GB 스토리지 + 월 100만 Class A 작업' },
    ],
    cons: [
      { text: 'Fewer storage features than S3 — no object versioning or lifecycle rules yet', text_ko: 'S3 대비 기능 부족 — 객체 버전 관리·수명 주기 규칙 미지원' },
      { text: 'Cloudflare account dependency — migrating away requires re-uploading all objects', text_ko: 'Cloudflare 계정 의존성 — 탈출 시 모든 객체를 재업로드해야 함' },
    ],
    api_key_url: 'https://dash.cloudflare.com/?to=/:account/r2/api-tokens',
    api_key_url_label: 'R2 API Tokens',
  },

  // ---------------------------------------------------------------------------
  // Batch 2 — Auth / Database / Cache
  // ---------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // 1. NextAuth.js / Auth.js v5
  // -------------------------------------------------------------------------
  {
    service_id: S.nextauth,
    quick_start:
      'next-auth 패키지를 설치하고 auth.ts 설정 파일과 API 라우트 핸들러를 생성하면 GitHub·Google 등 40개 이상의 OAuth 프로바이더를 즉시 사용할 수 있습니다.',
    quick_start_en:
      'Install next-auth, create an auth.ts config and a catch-all route handler to use 40+ OAuth providers like GitHub and Google out of the box.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Auth.js',
        title_ko: 'Auth.js 설치',
        description: 'Install the next-auth v5 package (Auth.js). Requires Next.js 14+.',
        description_ko: 'next-auth v5 패키지(Auth.js)를 설치합니다. Next.js 14 이상이 필요합니다.',
        code_snippet: 'npm install next-auth@beta',
      },
      {
        step: 2,
        title: 'Generate AUTH_SECRET',
        title_ko: 'AUTH_SECRET 생성',
        description: 'Generate a secure secret for JWT signing and session encryption.',
        description_ko: 'JWT 서명 및 세션 암호화에 사용할 시크릿을 생성합니다.',
        code_snippet: 'npx auth secret',
      },
      {
        step: 3,
        title: 'Create auth.ts config',
        title_ko: 'auth.ts 설정 파일 생성',
        description: 'Create auth.ts at the project root. Export auth, handlers, signIn, and signOut.',
        description_ko: '프로젝트 루트에 auth.ts를 생성하고 auth, handlers, signIn, signOut을 내보냅니다.',
        code_snippet: `// auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
})`,
      },
      {
        step: 4,
        title: 'Add route handler',
        title_ko: 'API 라우트 핸들러 추가',
        description: 'Create app/api/auth/[...nextauth]/route.ts to handle all auth requests.',
        description_ko: 'app/api/auth/[...nextauth]/route.ts를 생성하여 모든 인증 요청을 처리합니다.',
        code_snippet: `// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from '@/auth'`,
      },
      {
        step: 5,
        title: 'Protect routes with middleware',
        title_ko: '미들웨어로 라우트 보호',
        description: 'Create middleware.ts to automatically protect specific routes.',
        description_ko: 'middleware.ts를 생성하여 특정 라우트를 자동으로 보호합니다.',
        code_snippet: `// middleware.ts
export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}`,
      },
    ],
    code_examples: {
      typescript: `// auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
})

// app/api/auth/[...nextauth]/route.ts
export { handlers as GET, handlers as POST } from '@/auth'

// Server Component에서 세션 사용
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()
  if (!session) return <p>로그인이 필요합니다.</p>
  return <p>안녕하세요, {session.user?.name}!</p>
}`,
    },
    common_pitfalls: [
      {
        title: 'NEXTAUTH_SECRET vs AUTH_SECRET',
        title_ko: 'NEXTAUTH_SECRET vs AUTH_SECRET 혼용',
        problem:
          'v4에서 사용하던 NEXTAUTH_SECRET을 v5에서도 그대로 사용하면 세션이 작동하지 않습니다.',
        solution:
          'v5(Auth.js)에서는 AUTH_SECRET 환경변수를 사용합니다. npx auth secret 명령으로 자동 생성하세요.',
        code: '# .env.local\nAUTH_SECRET="$(openssl rand -hex 32)"',
      },
      {
        title: 'Missing AUTH_URL in production',
        title_ko: '프로덕션에서 AUTH_URL 누락',
        problem:
          '배포 환경에서 AUTH_URL을 설정하지 않으면 OAuth 콜백이 localhost로 리다이렉트됩니다.',
        solution:
          'Vercel은 VERCEL_URL이 자동 설정되지만, 다른 플랫폼에서는 AUTH_URL을 명시적으로 설정해야 합니다.',
        code: '# .env.production\nAUTH_URL=https://your-domain.com',
      },
      {
        title: 'useSession in Server Components',
        title_ko: 'Server Component에서 useSession 사용',
        problem:
          'useSession()은 Client Component 전용 훅입니다. Server Component에서 호출하면 오류가 발생합니다.',
        solution:
          'Server Component에서는 import { auth } from "@/auth"를 사용하고 await auth()로 세션을 가져옵니다.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use NextAuth with Supabase Adapter to persist sessions in the Supabase database. Install @auth/supabase-adapter and configure it in auth.ts.',
        tip_ko:
          '@auth/supabase-adapter를 설치하고 auth.ts에 adapter 옵션으로 설정하면 세션이 Supabase DB에 저장됩니다.',
        code: `import { SupabaseAdapter } from '@auth/supabase-adapter'

export const { handlers, auth } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [],
})`,
      },
      {
        with_service_slug: 'prisma',
        tip: 'Use @auth/prisma-adapter to store users, accounts, sessions, and verification tokens in your Prisma-managed database.',
        tip_ko:
          '@auth/prisma-adapter를 사용하면 사용자·계정·세션·인증 토큰을 Prisma 데이터베이스에 저장할 수 있습니다.',
        code: `import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
})`,
      },
      {
        with_service_slug: 'upstash-redis',
        tip: 'Use @auth/upstash-redis-adapter to store sessions in Upstash Redis — ideal for edge/serverless deployments with sub-millisecond session reads.',
        tip_ko:
          '@auth/upstash-redis-adapter로 세션을 Upstash Redis에 저장하면 엣지 환경에서 밀리초 이하의 세션 조회가 가능합니다.',
      },
    ],
    pros: [
      { text: 'Zero-config OAuth for 40+ providers (GitHub, Google, Discord, etc.)', text_ko: '40개 이상 OAuth 프로바이더(GitHub, Google, Discord 등) 제로 설정' },
      { text: 'Free and open-source with no vendor lock-in', text_ko: '완전 무료 오픈소스, 벤더 종속 없음' },
      { text: 'Supports JWT and database session strategies', text_ko: 'JWT 및 데이터베이스 세션 전략 모두 지원' },
      { text: 'Native App Router support with v5 universal auth() function', text_ko: 'v5 범용 auth() 함수로 App Router 네이티브 지원' },
    ],
    cons: [
      { text: 'v4 to v5 migration involves breaking changes', text_ko: 'v4 → v5 마이그레이션 시 Breaking Change 발생' },
      { text: 'Database adapter setup adds complexity for persistent sessions', text_ko: '영구 세션을 위한 DB 어댑터 설정이 복잡할 수 있음' },
      { text: 'Limited built-in UI — custom login pages require extra work', text_ko: '기본 UI가 제한적이어서 커스텀 로그인 페이지 구현에 추가 작업 필요' },
    ],
    api_key_url: 'https://authjs.dev/getting-started',
    api_key_url_label: 'Auth.js 공식 문서',
  },

  // -------------------------------------------------------------------------
  // 2. Auth0
  // -------------------------------------------------------------------------
  {
    service_id: S.auth0,
    quick_start:
      'Auth0 테넌트를 생성하고 @auth0/nextjs-auth0 SDK를 설치하면 엔터프라이즈급 SSO, MFA, 소셜 로그인을 5분 만에 Next.js 앱에 통합할 수 있습니다.',
    quick_start_en:
      'Create an Auth0 tenant and install @auth0/nextjs-auth0 to integrate enterprise-grade SSO, MFA, and social login into your Next.js app in 5 minutes.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Auth0 Application',
        title_ko: 'Auth0 애플리케이션 생성',
        description:
          'Sign up at auth0.com, create a tenant, and register a Regular Web Application. Copy the Domain, Client ID, and Client Secret.',
        description_ko:
          'auth0.com에서 가입 후 테넌트를 생성하고 Regular Web Application을 등록합니다. Domain, Client ID, Client Secret을 복사합니다.',
      },
      {
        step: 2,
        title: 'Install SDK',
        title_ko: 'SDK 설치',
        description: 'Install the Auth0 Next.js SDK. Use --legacy-peer-deps if on Next.js 16.',
        description_ko:
          'Auth0 Next.js SDK를 설치합니다. Next.js 16 사용 시 --legacy-peer-deps 플래그가 필요합니다.',
        code_snippet: 'npm install @auth0/nextjs-auth0',
      },
      {
        step: 3,
        title: 'Set Environment Variables',
        title_ko: '환경변수 설정',
        description:
          'Add AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, and AUTH0_SECRET to .env.local.',
        description_ko:
          '.env.local에 AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET을 추가합니다.',
        code_snippet: `# .env.local
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_SECRET=$(openssl rand -hex 32)
APP_BASE_URL=http://localhost:3000`,
      },
      {
        step: 4,
        title: 'Create Auth0 client instance',
        title_ko: 'Auth0 클라이언트 인스턴스 생성',
        description: 'Create lib/auth0.ts to export the Auth0 client used throughout the app.',
        description_ko:
          '앱 전체에서 사용할 Auth0 클라이언트를 lib/auth0.ts에 생성합니다.',
        code_snippet: `// lib/auth0.ts
import { Auth0Client } from '@auth0/nextjs-auth0/server'

export const auth0 = new Auth0Client()`,
      },
      {
        step: 5,
        title: 'Add route handler and middleware',
        title_ko: '라우트 핸들러와 미들웨어 추가',
        description:
          'Create the catch-all route handler for /auth/* endpoints and add middleware.',
        description_ko:
          '/auth/* 엔드포인트를 처리할 라우트 핸들러와 미들웨어를 추가합니다.',
        code_snippet: `// app/auth/[auth0]/route.ts
import { auth0 } from '@/lib/auth0'
export const GET = auth0.handleAuth()

// middleware.ts
import type { NextRequest } from 'next/server'
import { auth0 } from '@/lib/auth0'

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}`,
      },
    ],
    code_examples: {
      typescript: `// lib/auth0.ts
import { Auth0Client } from '@auth0/nextjs-auth0/server'
export const auth0 = new Auth0Client()

// Server Component에서 세션 확인
import { auth0 } from '@/lib/auth0'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth0.getSession()
  if (!session) redirect('/auth/login')
  return <p>안녕하세요, {session.user.name}!</p>
}

// Client Component에서 세션 접근
'use client'
import { useUser } from '@auth0/nextjs-auth0'

export function Profile() {
  const { user, isLoading } = useUser()
  if (isLoading) return <p>Loading...</p>
  if (!user) return <a href="/auth/login">로그인</a>
  return (
    <>
      <img src={user.picture!} alt={user.name!} />
      <p>{user.email}</p>
      <a href="/auth/logout">로그아웃</a>
    </>
  )
}`,
    },
    common_pitfalls: [
      {
        title: 'Callback URL not configured in Auth0 dashboard',
        title_ko: 'Auth0 대시보드에서 콜백 URL 미설정',
        problem:
          'OAuth login redirects to a callback URL that is not allowed, causing "Callback URL mismatch" error.',
        solution:
          'In Auth0 Dashboard > Application Settings, add http://localhost:3000/auth/callback to Allowed Callback URLs, and http://localhost:3000 to Allowed Logout URLs.',
      },
      {
        title: 'AUTH0_SECRET too short',
        title_ko: 'AUTH0_SECRET이 너무 짧음',
        problem:
          'A short AUTH0_SECRET causes SDK initialization errors and insecure session cookies.',
        solution:
          'Generate at least 32 bytes of random entropy: openssl rand -hex 32',
        code: 'AUTH0_SECRET=$(openssl rand -hex 32)',
      },
      {
        title: 'UserProvider missing in layout',
        title_ko: 'layout에 UserProvider 누락',
        problem:
          'useUser() hook throws "UserContext not found" when UserProvider is not wrapping the component tree.',
        solution:
          'Wrap your root layout with UserProvider from @auth0/nextjs-auth0.',
        code: `// app/layout.tsx
import { UserProvider } from '@auth0/nextjs-auth0'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'nextauth',
        tip: 'Auth0 can replace NextAuth.js for enterprise scenarios requiring MFA, SAML SSO, or advanced user management. Both support the same OAuth flow — Auth0 adds a managed IdP layer on top.',
        tip_ko:
          'Auth0는 MFA, SAML SSO, 고급 사용자 관리가 필요한 엔터프라이즈 시나리오에서 NextAuth.js를 대체할 수 있습니다.',
      },
      {
        with_service_slug: 'vercel',
        tip: 'Add Auth0 env vars to Vercel environment variables. Use your Vercel deployment URL as the Allowed Callback URL in the Auth0 dashboard.',
        tip_ko:
          'Auth0 환경변수를 Vercel에 추가하고, Vercel 배포 URL을 Auth0 대시보드의 Allowed Callback URLs에 등록하세요.',
      },
    ],
    pros: [
      { text: 'Enterprise features: MFA, SAML SSO, anomaly detection out of the box', text_ko: '엔터프라이즈 기능: MFA, SAML SSO, 이상 탐지 기본 제공' },
      { text: 'Universal Login with customizable branding — no custom auth pages needed', text_ko: '브랜딩 커스터마이징 가능한 Universal Login — 별도 인증 페이지 불필요' },
      { text: 'Extensive social connections (50+ providers) with Actions for custom logic', text_ko: '50개 이상 소셜 연결 + Actions로 커스텀 로직 추가' },
    ],
    cons: [
      { text: 'Free tier limited to 25,000 MAU — costs scale steeply beyond that', text_ko: '무료 플랜 25,000 MAU 제한 — 이후 급격히 과금' },
      { text: 'Vendor lock-in: migrating away from Auth0 requires significant effort', text_ko: '벤더 종속: Auth0에서 마이그레이션 시 상당한 작업 필요' },
      { text: 'Complex dashboard — overkill for simple apps that only need basic OAuth', text_ko: '복잡한 대시보드 — 단순 OAuth만 필요한 앱에는 과도함' },
    ],
    api_key_url: 'https://manage.auth0.com/',
    api_key_url_label: 'Auth0 Dashboard',
  },

  // -------------------------------------------------------------------------
  // 3. GitHub OAuth
  // -------------------------------------------------------------------------
  {
    service_id: S.github_oauth,
    quick_start:
      'GitHub Settings > Developer settings에서 OAuth App을 등록하고 Client ID/Secret을 발급받으면 Next.js 앱에 GitHub 소셜 로그인을 추가할 수 있습니다.',
    quick_start_en:
      'Register an OAuth App in GitHub Settings > Developer settings to get a Client ID/Secret and add GitHub social login to your Next.js app.',
    setup_steps: [
      {
        step: 1,
        title: 'Register GitHub OAuth App',
        title_ko: 'GitHub OAuth App 등록',
        description:
          'Go to GitHub > Settings > Developer settings > OAuth Apps > New OAuth App. Set Homepage URL and Authorization callback URL.',
        description_ko:
          'GitHub > Settings > Developer settings > OAuth Apps > New OAuth App으로 이동합니다. Homepage URL과 Authorization callback URL을 설정합니다.',
      },
      {
        step: 2,
        title: 'Copy credentials',
        title_ko: '자격증명 복사',
        description:
          'Copy the Client ID. Click "Generate a new client secret" and save the secret immediately — it is shown only once.',
        description_ko:
          'Client ID를 복사합니다. "Generate a new client secret"을 클릭하고 시크릿을 즉시 저장하세요 — 한 번만 표시됩니다.',
      },
      {
        step: 3,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your .env.local file.',
        description_ko: '.env.local에 GITHUB_CLIENT_ID와 GITHUB_CLIENT_SECRET을 추가합니다.',
        code_snippet: `# .env.local
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret`,
      },
      {
        step: 4,
        title: 'Implement OAuth flow via NextAuth.js',
        title_ko: 'NextAuth.js로 OAuth 흐름 구현',
        description: 'Use the NextAuth.js GitHub provider for a complete OAuth integration.',
        description_ko: 'NextAuth.js GitHub 프로바이더로 완전한 OAuth 통합을 구현합니다.',
        code_snippet: `import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
})`,
      },
    ],
    code_examples: {
      typescript: `import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // 추가 스코프 (기본: read:user, user:email)
      authorization: { params: { scope: 'read:user user:email repo' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.githubId = (profile as { id?: number })?.id
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
})

// GitHub API 호출
async function getGitHubUser(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: \`Bearer \${accessToken}\`,
      Accept: 'application/vnd.github+json',
    },
  })
  return response.json()
}`,
    },
    common_pitfalls: [
      {
        title: 'Callback URL mismatch in production',
        title_ko: '프로덕션에서 콜백 URL 불일치',
        problem:
          'GitHub OAuth App has a single Authorization callback URL — it cannot dynamically handle both localhost and production.',
        solution:
          'Create separate GitHub OAuth Apps for development and production, or use your production URL as the callback and tunnel localhost with ngrok for testing.',
      },
      {
        title: 'Insufficient scope for API access',
        title_ko: '부족한 스코프로 API 접근 실패',
        problem:
          'GitHub API calls return 403 because the default OAuth scope is too limited for repo or org access.',
        solution:
          'Request additional scopes during authorization: read:user, user:email, repo, read:org.',
        code: `GitHub({
  authorization: {
    params: { scope: 'read:user user:email repo' },
  },
})`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'nextauth',
        tip: 'The simplest way to use GitHub OAuth in Next.js is via the NextAuth.js GitHub provider. It handles the OAuth flow, session management, and token refresh automatically.',
        tip_ko:
          'Next.js에서 GitHub OAuth를 가장 쉽게 사용하는 방법은 NextAuth.js GitHub 프로바이더입니다. OAuth 흐름, 세션 관리, 토큰 갱신을 자동으로 처리합니다.',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Supabase Auth supports GitHub OAuth natively. Enable it in Supabase Dashboard > Authentication > Providers > GitHub and add your GitHub App credentials.',
        tip_ko:
          'Supabase Auth는 GitHub OAuth를 기본 지원합니다. Supabase 대시보드 > Authentication > Providers > GitHub에서 활성화하세요.',
      },
    ],
    pros: [
      { text: 'Free with no usage limits for GitHub OAuth Apps', text_ko: 'GitHub OAuth App은 완전 무료, 사용량 제한 없음' },
      { text: 'Automatically provides user profile, email, and avatar', text_ko: '사용자 프로필, 이메일, 아바타 자동 제공' },
      { text: 'Ideal for developer-focused tools and B2D products', text_ko: '개발자 도구 및 B2D 제품에 최적화' },
    ],
    cons: [
      { text: 'Single callback URL per app — requires separate apps for dev/prod', text_ko: '앱당 콜백 URL 1개 제한 — 개발/프로덕션 앱 분리 필요' },
      { text: 'GitHub-only — not suitable for apps targeting non-developer users', text_ko: 'GitHub 전용 — 비개발자 사용자가 있는 앱에 부적합' },
    ],
    api_key_url: 'https://github.com/settings/developers',
    api_key_url_label: 'GitHub Developer Settings',
  },

  // -------------------------------------------------------------------------
  // 4. PlanetScale
  // -------------------------------------------------------------------------
  {
    service_id: S.planetscale,
    quick_start:
      'PlanetScale에서 데이터베이스를 생성하고 @planetscale/database 서버리스 드라이버를 설치하면 Vitess 기반의 MySQL 호환 DB를 엣지/서버리스 환경에서 즉시 사용할 수 있습니다.',
    quick_start_en:
      'Create a PlanetScale database and install the @planetscale/database serverless driver to use a Vitess-powered MySQL-compatible DB in edge and serverless environments.',
    setup_steps: [
      {
        step: 1,
        title: 'Create PlanetScale database',
        title_ko: 'PlanetScale 데이터베이스 생성',
        description: 'Sign up at planetscale.com, create a new database, and select your region.',
        description_ko: 'planetscale.com에서 가입 후 새 데이터베이스를 생성하고 지역을 선택합니다.',
      },
      {
        step: 2,
        title: 'Install serverless driver',
        title_ko: '서버리스 드라이버 설치',
        description: 'Install the PlanetScale serverless JavaScript driver for edge-compatible HTTP connections.',
        description_ko: '엣지 환경 호환 HTTP 연결을 위한 PlanetScale 서버리스 JS 드라이버를 설치합니다.',
        code_snippet: 'npm install @planetscale/database',
      },
      {
        step: 3,
        title: 'Get connection credentials',
        title_ko: '연결 자격증명 획득',
        description:
          'In the PlanetScale dashboard, click "Connect" on your database, select "@planetscale/database", and copy the host, username, and password.',
        description_ko:
          'PlanetScale 대시보드에서 "Connect"를 클릭하고 "@planetscale/database"를 선택하여 host, username, password를 복사합니다.',
        code_snippet: `# .env.local
DATABASE_HOST=aws.connect.psdb.cloud
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password`,
      },
      {
        step: 4,
        title: 'Initialize client',
        title_ko: '클라이언트 초기화',
        description: 'Create a database client using the serverless driver.',
        description_ko: '서버리스 드라이버로 데이터베이스 클라이언트를 생성합니다.',
        code_snippet: `import { connect } from '@planetscale/database'

const db = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
})`,
      },
    ],
    code_examples: {
      typescript: `import { connect } from '@planetscale/database'

const db = connect({
  host: process.env.DATABASE_HOST!,
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
})

// 쿼리 실행 (파라미터 바인딩)
const results = await db.execute('SELECT * FROM users WHERE id = ?', [userId])
console.log(results.rows)

// 트랜잭션
await db.transaction(async (tx) => {
  await tx.execute('INSERT INTO orders (user_id, total) VALUES (?, ?)', [userId, total])
  await tx.execute('UPDATE inventory SET stock = stock - 1 WHERE id = ?', [itemId])
})

// Prisma와 함께 사용 시 schema.prisma 설정:
// datasource db {
//   provider     = "mysql"
//   url          = env("DATABASE_URL")
//   relationMode = "prisma"
// }`,
    },
    common_pitfalls: [
      {
        title: 'Foreign key constraints not supported',
        title_ko: '외래 키 제약 미지원',
        problem:
          'PlanetScale (Vitess) does not support foreign key constraints at the database level, breaking schemas that rely on them.',
        solution:
          'Use Prisma\'s "prisma" relationMode to emulate FK constraints at the ORM level.',
        code: `// schema.prisma
datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
}`,
      },
      {
        title: 'Schema changes require deploy requests',
        title_ko: '스키마 변경 시 deploy request 필요',
        problem:
          'Running DDL statements directly on the main branch is blocked. Developers who try ALTER TABLE get an error.',
        solution:
          'Create a schema branch, apply changes there, then open a Deploy Request to merge into main.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'prisma',
        tip: 'Prisma works well with PlanetScale. Set relationMode = "prisma" in schema.prisma to emulate foreign keys, and use prisma db push instead of migrate.',
        tip_ko:
          'Prisma와 PlanetScale은 궁합이 좋습니다. schema.prisma에 relationMode = "prisma"를 설정하고, 스키마 변경에는 db push를 사용하세요.',
      },
      {
        with_service_slug: 'vercel',
        tip: 'Use the PlanetScale Vercel integration to automatically inject DATABASE_HOST, DATABASE_USERNAME, and DATABASE_PASSWORD into your Vercel deployments.',
        tip_ko:
          'PlanetScale Vercel 통합을 사용하면 환경변수가 Vercel 배포에 자동으로 주입됩니다.',
      },
    ],
    pros: [
      { text: 'Vitess-powered horizontal sharding — scales to massive workloads', text_ko: 'Vitess 기반 수평 샤딩 — 대규모 워크로드 처리 가능' },
      { text: 'Non-blocking schema changes via deploy requests', text_ko: 'Deploy Request를 통한 무중단 스키마 변경' },
      { text: 'Serverless HTTP driver compatible with edge/Workers environments', text_ko: '엣지/Workers 환경 호환 서버리스 HTTP 드라이버' },
    ],
    cons: [
      { text: 'No native foreign key constraints — requires ORM-level emulation', text_ko: '네이티브 외래 키 제약 없음 — ORM 레벨 에뮬레이션 필요' },
      { text: 'MySQL-only — no PostgreSQL support', text_ko: 'MySQL 전용 — PostgreSQL 미지원' },
      { text: 'Hobby plan discontinued — paid plan required for production', text_ko: '무료 Hobby 플랜 종료됨 — 프로덕션에 유료 플랜 필요' },
    ],
    api_key_url: 'https://app.planetscale.com/',
    api_key_url_label: 'PlanetScale Dashboard',
  },

  // -------------------------------------------------------------------------
  // 5. Convex
  // -------------------------------------------------------------------------
  {
    service_id: S.convex,
    quick_start:
      'npx convex dev 한 명령으로 백엔드가 세팅되고, TypeScript로 작성한 서버 함수가 실시간으로 React 컴포넌트에 반영되는 리액티브 백엔드 플랫폼입니다.',
    quick_start_en:
      'Run npx convex dev to instantly set up a reactive backend where TypeScript server functions sync in real time to your React components.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Convex',
        title_ko: 'Convex 설치',
        description: 'Install the Convex client library in your Next.js project.',
        description_ko: 'Next.js 프로젝트에 Convex 클라이언트 라이브러리를 설치합니다.',
        code_snippet: 'npm install convex',
      },
      {
        step: 2,
        title: 'Initialize Convex project',
        title_ko: 'Convex 프로젝트 초기화',
        description:
          'Run npx convex dev to log in with GitHub, create a project, and start the dev server. A convex/ directory is created automatically.',
        description_ko:
          'npx convex dev를 실행하면 GitHub으로 로그인하고 프로젝트를 생성한 후 개발 서버가 시작됩니다.',
        code_snippet: 'npx convex dev',
      },
      {
        step: 3,
        title: 'Wrap app with ConvexProvider',
        title_ko: '앱을 ConvexProvider로 감싸기',
        description: 'Add ConvexReactClient and ConvexProvider to your app layout.',
        description_ko: '앱 레이아웃에 ConvexReactClient와 ConvexProvider를 추가합니다.',
        code_snippet: `// app/providers.tsx
'use client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}`,
      },
      {
        step: 4,
        title: 'Define a query function',
        title_ko: '쿼리 함수 정의',
        description: 'Create a query in the convex/ directory. Convex auto-generates TypeScript types.',
        description_ko: 'convex/ 디렉토리에 쿼리를 생성합니다. Convex가 TypeScript 타입을 자동 생성합니다.',
        code_snippet: `// convex/tasks.ts
import { query } from './_generated/server'

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query('tasks').collect(),
})`,
      },
    ],
    code_examples: {
      typescript: `// convex/tasks.ts
import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => ctx.db.query('tasks').order('desc').collect(),
})

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    return await ctx.db.insert('tasks', { text, isCompleted: false })
  },
})

// Client Component에서 실시간 구독
'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function TasksPage() {
  const tasks = useQuery(api.tasks.list)
  const createTask = useMutation(api.tasks.create)

  return (
    <div>
      <button onClick={() => createTask({ text: '새 태스크' })}>추가</button>
      {tasks?.map((task) => <div key={task._id}>{task.text}</div>)}
    </div>
  )
}

// Server Component에서 데이터 로드
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export default async function ServerPage() {
  const tasks = await fetchQuery(api.tasks.list)
  return <ul>{tasks.map((t) => <li key={t._id}>{t.text}</li>)}</ul>
}`,
    },
    common_pitfalls: [
      {
        title: 'useMutation called in Server Components',
        title_ko: 'Server Component에서 useMutation 호출',
        problem:
          'useMutation is a React hook and cannot be called in Server Components, causing "Invalid hook call" errors.',
        solution:
          'Use mutations only in Client Components (with "use client"). For server-side writes, use fetchMutation from "convex/nextjs".',
      },
      {
        title: 'Missing schema definition',
        title_ko: 'schema 정의 누락',
        problem:
          'Without convex/schema.ts, database writes are untyped and errors are caught only at runtime.',
        solution:
          'Define convex/schema.ts with defineSchema and defineTable for full TypeScript type safety.',
        code: `// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
})`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'clerk',
        tip: 'Convex officially supports Clerk for authentication. Install @clerk/nextjs and configure Convex to validate Clerk JWTs — this is the recommended auth setup for Convex.',
        tip_ko:
          'Convex는 Clerk 인증을 공식 지원합니다. @clerk/nextjs를 설치하고 Convex가 Clerk JWT를 검증하도록 설정하면 됩니다.',
        code: `// convex/auth.config.ts
export default {
  providers: [{
    domain: 'https://your-clerk-domain.clerk.accounts.dev',
    applicationID: 'convex',
  }],
}`,
      },
      {
        with_service_slug: 'vercel',
        tip: 'Set NEXT_PUBLIC_CONVEX_URL as a Vercel environment variable pointing to your Convex deployment URL. Convex functions are deployed separately from your Vercel app.',
        tip_ko:
          'NEXT_PUBLIC_CONVEX_URL을 Vercel 환경변수로 설정하세요. Convex 함수는 Vercel 앱과 별도로 배포됩니다.',
      },
    ],
    pros: [
      { text: 'Real-time reactivity — UI automatically updates when data changes', text_ko: '실시간 반응성 — 데이터 변경 시 UI 자동 업데이트' },
      { text: 'End-to-end TypeScript type safety from DB schema to UI', text_ko: 'DB 스키마부터 UI까지 end-to-end TypeScript 타입 안정성' },
      { text: 'Generous free tier — 1M function calls/month, 1GB storage', text_ko: '넉넉한 무료 플랜 — 월 100만 함수 호출, 1GB 스토리지' },
    ],
    cons: [
      { text: 'Vendor lock-in — tight coupling to Convex runtime and API', text_ko: '벤더 종속 — Convex 런타임 및 API에 강하게 결합' },
      { text: 'Document model — complex relational queries require joins in application code', text_ko: '문서 모델 — 복잡한 관계형 쿼리를 애플리케이션 코드에서 처리해야 함' },
      { text: 'Not suitable for existing SQL-based architectures', text_ko: '기존 SQL 기반 아키텍처에 적합하지 않음' },
    ],
    api_key_url: 'https://dashboard.convex.dev/',
    api_key_url_label: 'Convex Dashboard',
  },

  // -------------------------------------------------------------------------
  // 6. Drizzle ORM
  // -------------------------------------------------------------------------
  {
    service_id: S.drizzle,
    quick_start:
      'drizzle-orm과 drizzle-kit을 설치하고 TypeScript로 스키마를 정의하면 SQL에 가장 가까운 타입 안전 쿼리를 작성할 수 있습니다.',
    quick_start_en:
      'Install drizzle-orm and drizzle-kit, define your schema in TypeScript, and write type-safe SQL-like queries with zero runtime overhead.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Drizzle ORM',
        title_ko: 'Drizzle ORM 설치',
        description: 'Install drizzle-orm and the appropriate database driver (example: PostgreSQL with pg).',
        description_ko: 'drizzle-orm과 데이터베이스 드라이버를 설치합니다. 예시는 PostgreSQL + pg 드라이버입니다.',
        code_snippet: 'npm install drizzle-orm pg\nnpm install -D drizzle-kit @types/pg',
      },
      {
        step: 2,
        title: 'Define schema',
        title_ko: '스키마 정의',
        description: 'Create src/db/schema.ts to define tables with full TypeScript types.',
        description_ko: 'src/db/schema.ts를 생성하여 TypeScript 타입이 완전히 추론되는 테이블을 정의합니다.',
        code_snippet: `// src/db/schema.ts
import { pgTable, serial, text, varchar, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})`,
      },
      {
        step: 3,
        title: 'Configure drizzle.config.ts',
        title_ko: 'drizzle.config.ts 설정',
        description: 'Create drizzle.config.ts for migration generation.',
        description_ko: 'drizzle.config.ts를 생성하여 마이그레이션 생성 설정을 합니다.',
        code_snippet: `// drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config`,
      },
      {
        step: 4,
        title: 'Create DB client and run migrations',
        title_ko: 'DB 클라이언트 생성 및 마이그레이션 실행',
        description: 'Initialize the Drizzle client and generate/run migrations.',
        description_ko: 'Drizzle 클라이언트를 초기화하고 마이그레이션을 생성·실행합니다.',
        code_snippet: `// src/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })

// npx drizzle-kit generate
// npx drizzle-kit migrate`,
      },
    ],
    code_examples: {
      typescript: `import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { users } from './schema'
import { eq } from 'drizzle-orm'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle(pool, { schema: { users } })

// SELECT
const allUsers = await db.select().from(users)

// WHERE
const [user] = await db.select().from(users).where(eq(users.email, 'test@example.com')).limit(1)

// INSERT
const [newUser] = await db.insert(users)
  .values({ name: '홍길동', email: 'hong@example.com' })
  .returning()

// UPDATE
await db.update(users).set({ name: '김철수' }).where(eq(users.id, 1))

// DELETE
await db.delete(users).where(eq(users.id, 1))

// 서버리스 최적화 (Neon HTTP 드라이버)
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL!)
export const serverlessDb = drizzle(sql)`,
    },
    common_pitfalls: [
      {
        title: 'Using drizzle-kit push in production',
        title_ko: '프로덕션에서 drizzle-kit push 사용',
        problem:
          '"drizzle-kit push" directly alters the schema without generating migration files, making DB changes untrackable.',
        solution:
          'Use "drizzle-kit push" only for development. In production, always use "drizzle-kit generate" + "drizzle-kit migrate".',
      },
      {
        title: 'Connection pool exhaustion in serverless',
        title_ko: '서버리스 환경에서 연결 풀 고갈',
        problem:
          'Each serverless invocation creates a new TCP connection, quickly exhausting the PostgreSQL connection limit.',
        solution:
          'Use drizzle-orm/neon-http for Neon, or drizzle-orm/libsql for Turso — both use HTTP-based connections without persistent TCP.',
        code: `// Neon HTTP 드라이버 (서버리스 최적화)
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'neon',
        tip: 'Drizzle + Neon is the most popular serverless-optimized stack. Use drizzle-orm/neon-http for HTTP connections — perfect for Vercel/Cloudflare Edge.',
        tip_ko:
          'Drizzle + Neon은 서버리스 최적화 스택의 가장 인기 있는 조합입니다. HTTP 연결을 위해 drizzle-orm/neon-http를 사용하면 Vercel/Cloudflare에 최적입니다.',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Use Drizzle as a type-safe query builder on top of Supabase Postgres. Use Transaction mode connection string (port 6543) for serverless, Session mode (port 5432) for servers.',
        tip_ko:
          'Supabase PostgreSQL 위에 Drizzle을 타입 안전 쿼리 빌더로 사용할 수 있습니다. 서버리스에는 Transaction 모드(6543), 서버에는 Session 모드(5432)를 사용하세요.',
      },
      {
        with_service_slug: 'turso',
        tip: 'Drizzle has a native Turso/libSQL driver. Use drizzle-orm/libsql with @libsql/client for type-safe SQLite at the edge.',
        tip_ko:
          'Drizzle은 Turso/libSQL을 네이티브 지원합니다. drizzle-orm/libsql과 @libsql/client를 조합하세요.',
        code: `import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})
export const db = drizzle(client)`,
      },
    ],
    pros: [
      { text: 'Zero runtime overhead — generates raw SQL with full TypeScript inference', text_ko: '런타임 오버헤드 없음 — 완전한 TypeScript 추론으로 raw SQL 생성' },
      { text: 'Supports PostgreSQL, MySQL, SQLite, and Turso/libSQL', text_ko: 'PostgreSQL, MySQL, SQLite, Turso/libSQL 모두 지원' },
      { text: 'SQL-first — familiarity with SQL means immediate productivity', text_ko: 'SQL 우선 — SQL 지식이 있으면 즉시 생산성 확보' },
    ],
    cons: [
      { text: 'Fewer high-level abstractions than Prisma — more boilerplate for complex queries', text_ko: 'Prisma보다 고수준 추상화 부족 — 복잡한 쿼리에 보일러플레이트 증가' },
      { text: 'Younger ecosystem — fewer third-party adapters and plugins than Prisma', text_ko: '상대적으로 젊은 생태계 — Prisma보다 서드파티 어댑터가 적음' },
    ],
    api_key_url: 'https://orm.drizzle.team/docs/overview',
    api_key_url_label: 'Drizzle ORM 공식 문서',
  },

  // -------------------------------------------------------------------------
  // 7. Prisma ORM
  // -------------------------------------------------------------------------
  {
    service_id: S.prisma,
    quick_start:
      'npm install prisma와 npx prisma init으로 설정을 시작하고 schema.prisma에 모델을 정의하면 자동 생성된 타입 안전 클라이언트로 데이터베이스를 쿼리할 수 있습니다.',
    quick_start_en:
      'Run npm install prisma and npx prisma init, define your models in schema.prisma, and query your database with the auto-generated type-safe client.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Prisma',
        title_ko: 'Prisma 설치',
        description: 'Install Prisma CLI and client. Node.js 20.19+ and TypeScript 5.4+ required.',
        description_ko: 'Prisma CLI와 클라이언트를 설치합니다. Node.js 20.19+ 및 TypeScript 5.4+가 필요합니다.',
        code_snippet: 'npm install prisma @prisma/client\nnpx prisma init',
      },
      {
        step: 2,
        title: 'Define schema',
        title_ko: '스키마 정의',
        description: 'Edit prisma/schema.prisma to define your data models.',
        description_ko: 'prisma/schema.prisma를 편집하여 데이터 모델을 정의합니다.',
        code_snippet: `// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}`,
      },
      {
        step: 3,
        title: 'Generate client and migrate',
        title_ko: '클라이언트 생성 및 마이그레이션',
        description: 'Generate Prisma Client and apply the schema as a migration.',
        description_ko: 'Prisma Client를 생성하고 스키마를 마이그레이션으로 적용합니다.',
        code_snippet: `npx prisma generate
npx prisma migrate dev --name init`,
      },
      {
        step: 4,
        title: 'Create singleton client',
        title_ko: '싱글톤 클라이언트 생성',
        description: 'Use the globalThis singleton pattern to prevent connection pool exhaustion from Next.js hot reloading.',
        description_ko: 'Next.js 핫 리로딩으로 인한 연결 풀 고갈을 방지하기 위해 globalThis 싱글톤 패턴을 사용합니다.',
        code_snippet: `// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`,
      },
    ],
    code_examples: {
      typescript: `import { prisma } from '@/lib/prisma'

// CREATE
const user = await prisma.user.create({
  data: { email: 'test@example.com', name: '홍길동' },
})

// READ with relation
const users = await prisma.user.findMany({
  where: { name: { contains: '길동' } },
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
})

// UPDATE
const updated = await prisma.user.update({
  where: { id: user.id },
  data: { name: '김철수' },
})

// DELETE
await prisma.user.delete({ where: { id: user.id } })

// TRANSACTION
const [post] = await prisma.$transaction([
  prisma.post.create({ data: { title: '새 글', authorId: 1 } }),
])

// Raw SQL
const result = await prisma.$queryRaw\`
  SELECT * FROM "User" WHERE email = \${email}
\``,
    },
    common_pitfalls: [
      {
        title: 'Multiple PrismaClient instances in Next.js dev',
        title_ko: 'Next.js 개발 모드에서 PrismaClient 다중 인스턴스',
        problem:
          'Hot Module Replacement creates a new PrismaClient on every file change, exhausting database connections.',
        solution:
          'Use the globalThis singleton pattern to reuse the existing client between hot reloads.',
        code: `const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma`,
      },
      {
        title: 'Prisma Client not regenerated after schema change',
        title_ko: '스키마 변경 후 클라이언트 미재생성',
        problem:
          'After modifying schema.prisma, TypeScript types are stale and new fields cause type errors.',
        solution:
          'Run npx prisma generate after every schema change. Add it as a postinstall script.',
        code: `// package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use Prisma with Supabase by pointing DATABASE_URL at the Supabase connection string. Use Transaction mode (port 6543) for serverless, Session mode (port 5432) for long-running servers.',
        tip_ko:
          'DATABASE_URL을 Supabase 연결 문자열로 설정하면 Prisma와 Supabase를 함께 사용할 수 있습니다. 서버리스에는 Transaction 모드(6543), 서버에는 Session 모드(5432)를 사용하세요.',
      },
      {
        with_service_slug: 'nextauth',
        tip: 'Use @auth/prisma-adapter to automatically manage user, account, session, and verificationToken tables for NextAuth.js.',
        tip_ko:
          '@auth/prisma-adapter를 사용하면 NextAuth.js에 필요한 user, account, session 테이블을 자동으로 관리합니다.',
        code: `import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
})`,
      },
      {
        with_service_slug: 'planetscale',
        tip: 'Use Prisma with PlanetScale by setting relationMode = "prisma" in datasource to emulate foreign key constraints. Use prisma db push instead of migrate.',
        tip_ko:
          'datasource에 relationMode = "prisma"를 설정하여 FK 제약을 에뮬레이션합니다. 스키마 변경에는 migrate 대신 db push를 사용하세요.',
      },
    ],
    pros: [
      { text: 'Rich schema DSL with auto-generated type-safe client', text_ko: '자동 생성 타입 안전 클라이언트를 갖춘 풍부한 스키마 DSL' },
      { text: 'Prisma Studio — built-in visual database browser', text_ko: 'Prisma Studio — 내장 시각적 데이터베이스 브라우저' },
      { text: 'Excellent Next.js and Vercel integration with Prisma Accelerate', text_ko: 'Prisma Accelerate로 Next.js 및 Vercel과 뛰어난 통합' },
    ],
    cons: [
      { text: 'Runtime overhead from query builder abstraction layer', text_ko: '쿼리 빌더 추상화 레이어로 인한 런타임 오버헤드' },
      { text: 'Raw SQL via $queryRaw loses type safety', text_ko: '$queryRaw로 raw SQL 사용 시 타입 안정성 상실' },
      { text: 'Larger client bundle size compared to lighter alternatives like Drizzle', text_ko: 'Drizzle 같은 경량 대안 대비 큰 클라이언트 번들 크기' },
    ],
    api_key_url: 'https://www.prisma.io/docs',
    api_key_url_label: 'Prisma 공식 문서',
  },

  // -------------------------------------------------------------------------
  // 8. Turso
  // -------------------------------------------------------------------------
  {
    service_id: S.turso,
    quick_start:
      'Turso CLI로 엣지 SQLite 데이터베이스를 생성하고 @libsql/client를 설치하면 전 세계 35개 이상 지역에서 밀리초 이하의 응답속도로 SQLite를 사용할 수 있습니다.',
    quick_start_en:
      'Create an edge SQLite database with the Turso CLI and install @libsql/client to use SQLite with sub-millisecond latency across 35+ regions.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Turso CLI and create database',
        title_ko: 'Turso CLI 설치 및 데이터베이스 생성',
        description: 'Install the Turso CLI and create a new database.',
        description_ko: 'Turso CLI를 설치하고 새 데이터베이스를 생성합니다.',
        code_snippet: `# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

turso auth login
turso db create my-app-db`,
      },
      {
        step: 2,
        title: 'Get database credentials',
        title_ko: '데이터베이스 자격증명 획득',
        description: 'Get the database URL and create an auth token.',
        description_ko: '데이터베이스 URL을 가져오고 인증 토큰을 생성합니다.',
        code_snippet: `turso db show my-app-db --url
turso db tokens create my-app-db

# .env.local
# TURSO_DATABASE_URL=libsql://my-app-db-[user].turso.io
# TURSO_AUTH_TOKEN=your_auth_token`,
      },
      {
        step: 3,
        title: 'Install client library',
        title_ko: '클라이언트 라이브러리 설치',
        description: 'Install @libsql/client to connect to Turso.',
        description_ko: '@libsql/client를 설치합니다.',
        code_snippet: 'npm install @libsql/client',
      },
      {
        step: 4,
        title: 'Initialize client and query',
        title_ko: '클라이언트 초기화 및 쿼리',
        description: 'Create a libSQL client and execute queries.',
        description_ko: 'libSQL 클라이언트를 생성하고 쿼리를 실행합니다.',
        code_snippet: `import { createClient } from '@libsql/client'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const result = await db.execute('SELECT * FROM users')
console.log(result.rows)`,
      },
    ],
    code_examples: {
      typescript: `import { createClient } from '@libsql/client'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

// 테이블 생성
await db.execute(\`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
\`)

// INSERT (파라미터 바인딩)
await db.execute({
  sql: 'INSERT INTO todos (text) VALUES (?)',
  args: ['Turso 사용해보기'],
})

// SELECT
const { rows } = await db.execute('SELECT * FROM todos ORDER BY created_at DESC')

// 배치 트랜잭션
await db.batch([
  { sql: 'UPDATE todos SET done = 1 WHERE id = ?', args: [1] },
  { sql: 'INSERT INTO audit_log (action) VALUES (?)', args: ['todo.complete'] },
], 'write')

// Drizzle ORM과 함께 사용
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export const drizzleDb = drizzle(db, { schema })`,
    },
    common_pitfalls: [
      {
        title: 'Embedded replica missing syncUrl',
        title_ko: '임베디드 레플리카에 syncUrl 누락',
        problem:
          'Using file: URL without setting syncUrl results in a local-only database that is never synced to Turso.',
        solution:
          'For embedded replicas, set url to the local file path and syncUrl to your Turso database URL.',
        code: `const db = createClient({
  url: 'file:local.db',
  syncUrl: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})
await db.sync()`,
      },
      {
        title: 'SQL injection via string interpolation',
        title_ko: '문자열 보간을 통한 SQL 인젝션',
        problem:
          'Concatenating user input directly into SQL strings creates injection vulnerabilities.',
        solution:
          'Always use parameterized queries with the args array.',
        code: `// 위험 (절대 금지)
await db.execute(\`SELECT * FROM users WHERE email = '\${userInput}'\`)

// 안전 (항상 이렇게 사용)
await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [userInput] })`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'drizzle',
        tip: 'Drizzle ORM has native Turso/libSQL support via drizzle-orm/libsql. This is the recommended ORM combination for Turso.',
        tip_ko:
          'Drizzle ORM은 drizzle-orm/libsql로 Turso/libSQL을 네이티브 지원합니다. Turso를 위한 권장 ORM 조합입니다.',
      },
      {
        with_service_slug: 'vercel',
        tip: 'Turso works great on Vercel Edge Functions. Use the HTTP-based libSQL driver — no TCP connection management needed.',
        tip_ko:
          'Turso는 Vercel Edge Functions에서 잘 작동합니다. HTTP 기반 드라이버를 사용하면 TCP 연결 관리가 필요 없습니다.',
      },
    ],
    pros: [
      { text: 'SQLite at the edge — low latency in 35+ regions', text_ko: 'SQLite 엣지 배포 — 35개 이상 지역에서 낮은 지연 시간' },
      { text: 'Generous free tier: 500 databases, 1B row reads/month', text_ko: '넉넉한 무료 플랜: 500개 DB, 월 10억 행 읽기' },
      { text: 'SQLite compatible — familiar syntax with zero migration learning curve', text_ko: 'SQLite 호환 — 익숙한 문법으로 마이그레이션 학습 비용 없음' },
    ],
    cons: [
      { text: 'SQLite limitations: no full-text search by default, limited window functions', text_ko: 'SQLite 제약: 전문 검색 기본 미지원, 윈도우 함수 부분 지원' },
      { text: 'Single write leader — not ideal for very high write throughput', text_ko: '단일 쓰기 리더 — 높은 쓰기 처리량 시나리오에 부적합' },
      { text: 'Relatively new — ecosystem and tooling less mature than PostgreSQL', text_ko: '상대적으로 신생 서비스 — PostgreSQL보다 생태계와 툴링 미성숙' },
    ],
    api_key_url: 'https://app.turso.tech/',
    api_key_url_label: 'Turso Dashboard',
  },

  // -------------------------------------------------------------------------
  // 9. Redis Cloud
  // -------------------------------------------------------------------------
  {
    service_id: S.redis_cloud,
    quick_start:
      'Redis Cloud에서 무료 데이터베이스를 생성하고 ioredis 또는 node-redis로 연결하면 완전 관리형 Redis를 즉시 사용할 수 있습니다.',
    quick_start_en:
      'Create a free Redis Cloud database and connect with ioredis or node-redis to use fully managed Redis instantly.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Redis Cloud database',
        title_ko: 'Redis Cloud 데이터베이스 생성',
        description:
          'Sign up at redis.io/cloud. Create a free subscription and database. Choose your cloud provider and region.',
        description_ko:
          'redis.io/cloud에서 가입합니다. 무료 구독과 데이터베이스를 생성하고 클라우드 제공사 및 지역을 선택합니다.',
      },
      {
        step: 2,
        title: 'Get connection details',
        title_ko: '연결 정보 획득',
        description:
          'In the Redis Cloud console, copy the Public endpoint (host:port) and Access Password.',
        description_ko:
          'Redis Cloud 콘솔에서 Public endpoint(host:port)와 Access Password를 복사합니다.',
        code_snippet: `# .env.local
REDIS_URL=rediss://default:your_password@redis-12345.region.cloud.redislabs.com:12345`,
      },
      {
        step: 3,
        title: 'Install client and connect',
        title_ko: '클라이언트 설치 및 연결',
        description: 'Install ioredis and create a singleton client.',
        description_ko: 'ioredis를 설치하고 싱글톤 클라이언트를 생성합니다.',
        code_snippet: `npm install ioredis

// lib/redis.ts
import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis }

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL!, { tls: {} })

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis`,
      },
    ],
    code_examples: {
      typescript: `import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!, {
  tls: {},
  maxRetriesPerRequest: 3,
})

// String 연산
await redis.set('user:1:name', '홍길동', 'EX', 3600)
const name = await redis.get('user:1:name')

// Hash (객체 저장)
await redis.hset('user:1', { name: '홍길동', email: 'hong@example.com' })
const user = await redis.hgetall('user:1')

// List (큐)
await redis.rpush('queue:emails', JSON.stringify({ to: 'user@example.com' }))
const task = await redis.lpop('queue:emails')

// Sorted Set (랭킹)
await redis.zadd('leaderboard', 1500, 'user:1')
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES')

// 캐싱 패턴
async function getCachedData(key: string, fetcher: () => Promise<unknown>) {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)
  const data = await fetcher()
  await redis.setex(key, 300, JSON.stringify(data))
  return data
}

// 레이트 리미팅
async function rateLimit(ip: string): Promise<boolean> {
  const key = \`rate:\${ip}\`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 60)
  return count <= 100
}`,
    },
    common_pitfalls: [
      {
        title: 'Missing TLS configuration',
        title_ko: 'TLS 설정 누락',
        problem:
          'Redis Cloud requires TLS (rediss://) but developers use the redis:// scheme, causing connection failures.',
        solution:
          'Always use the "rediss://" scheme and pass { tls: {} } option to ioredis.',
        code: `const redis = new Redis(process.env.REDIS_URL!, { tls: {} })
// REDIS_URL=rediss://default:password@host:port`,
      },
      {
        title: 'No error event handler',
        title_ko: '오류 이벤트 핸들러 없음',
        problem:
          'Unhandled Redis connection errors can crash the application in production.',
        solution:
          'Always attach an error event listener and configure retry logic.',
        code: `const redis = new Redis(process.env.REDIS_URL!, { tls: {}, maxRetriesPerRequest: 3 })
redis.on('error', (err) => console.error('Redis Client Error:', err))`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'upstash-redis',
        tip: 'Redis Cloud supports advanced Redis modules (RediSearch, RedisJSON, RedisTimeSeries) while Upstash is HTTP-only and simpler. Choose Redis Cloud for complex use cases, Upstash for serverless caching.',
        tip_ko:
          'Redis Cloud는 RediSearch, RedisJSON 등 모듈을 지원하고, Upstash는 HTTP 기반의 단순 서버리스 캐시입니다. 복잡한 사용 사례에는 Redis Cloud, 단순 캐시에는 Upstash가 적합합니다.',
      },
      {
        with_service_slug: 'nextauth',
        tip: 'Use Redis Cloud as a session store for NextAuth.js. This scales horizontally across multiple server instances.',
        tip_ko:
          'Redis Cloud를 NextAuth.js 세션 스토어로 사용하면 여러 서버 인스턴스에서 수평 확장이 가능합니다.',
      },
    ],
    pros: [
      { text: 'Full Redis feature set including Modules (RediSearch, RedisJSON, RedisTimeSeries)', text_ko: '모듈(RediSearch, RedisJSON, RedisTimeSeries) 포함 전체 Redis 기능 지원' },
      { text: 'Fully managed with automatic failover and replication', text_ko: '자동 장애 조치 및 복제를 갖춘 완전 관리형 서비스' },
      { text: 'Multi-cloud and multi-region support', text_ko: '멀티 클라우드 및 멀티 리전 지원' },
    ],
    cons: [
      { text: 'Free tier limited to 30MB — insufficient for most production workloads', text_ko: '무료 플랜 30MB 제한 — 대부분의 프로덕션 워크로드에 부족' },
      { text: 'TCP-based connection not ideal for serverless/edge environments', text_ko: 'TCP 연결 기반 — 서버리스/엣지 환경에 적합하지 않음' },
    ],
    api_key_url: 'https://cloud.redis.io/',
    api_key_url_label: 'Redis Cloud Console',
  },

  // -------------------------------------------------------------------------
  // 10. Vercel KV
  // -------------------------------------------------------------------------
  {
    service_id: S.vercel_kv,
    quick_start:
      'Vercel 대시보드에서 KV 데이터베이스를 생성하고 프로젝트에 연결하면 @vercel/kv SDK로 엣지와 서버리스 환경에서 Redis 호환 키-값 저장소를 즉시 사용할 수 있습니다.',
    quick_start_en:
      'Create a KV database in the Vercel dashboard, connect it to your project, and use the @vercel/kv SDK for Redis-compatible key-value storage in edge and serverless environments.',
    setup_steps: [
      {
        step: 1,
        title: 'Create KV database in Vercel',
        title_ko: 'Vercel에서 KV 데이터베이스 생성',
        description:
          'In the Vercel dashboard, go to Storage > Create > KV. Select a region and database name.',
        description_ko:
          'Vercel 대시보드에서 Storage > Create > KV로 이동합니다. 지역과 데이터베이스 이름을 선택합니다.',
      },
      {
        step: 2,
        title: 'Connect to project',
        title_ko: '프로젝트 연결',
        description:
          'Connect the KV database to your project. Vercel automatically injects KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN.',
        description_ko:
          'KV 데이터베이스를 프로젝트에 연결합니다. Vercel이 KV_URL 등 환경변수를 자동 주입합니다.',
      },
      {
        step: 3,
        title: 'Install @vercel/kv',
        title_ko: '@vercel/kv 설치',
        description: 'Install the @vercel/kv package and pull environment variables locally.',
        description_ko: '@vercel/kv 패키지를 설치하고 환경변수를 로컬로 가져옵니다.',
        code_snippet: `npm install @vercel/kv
npx vercel env pull .env.development.local`,
      },
      {
        step: 4,
        title: 'Use in API routes',
        title_ko: 'API 라우트에서 사용',
        description: 'Import kv from @vercel/kv and use Redis-compatible commands.',
        description_ko: '@vercel/kv에서 kv를 가져와 Redis 호환 명령어를 사용합니다.',
        code_snippet: `import { kv } from '@vercel/kv'

export async function GET() {
  const views = await kv.incr('page:views')
  return Response.json({ views })
}`,
      },
    ],
    code_examples: {
      typescript: `import { kv } from '@vercel/kv'

// set/get (자동 직렬화)
await kv.set('user:1', { name: '홍길동', email: 'hong@example.com' })
const user = await kv.get<{ name: string; email: string }>('user:1')

// TTL 설정
await kv.set('session:abc', { userId: 1 }, { ex: 3600 })

// 카운터
const count = await kv.incr('visits')

// Hash
await kv.hset('cart:user1', { 'item:1': '2', 'item:2': '1' })
const cart = await kv.hgetall('cart:user1')

// Pipeline (배치 요청)
const pipeline = kv.pipeline()
pipeline.set('key1', 'value1')
pipeline.set('key2', 'value2')
pipeline.incr('counter')
const results = await pipeline.exec()

// Rate limiting in Route Handler
import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const key = \`ratelimit:\${ip}\`
  const requests = await kv.incr(key)
  if (requests === 1) await kv.expire(key, 60)
  if (requests > 10) return NextResponse.json({ error: '요청 한도 초과' }, { status: 429 })
  return NextResponse.json({ ok: true })
}`,
    },
    common_pitfalls: [
      {
        title: 'KV env vars not available locally',
        title_ko: '로컬에서 KV 환경변수 없음',
        problem:
          'Vercel KV environment variables are not available locally without explicit setup.',
        solution:
          'Run "npx vercel env pull" to sync environment variables to your local .env file.',
        code: 'npx vercel env pull .env.development.local',
      },
      {
        title: 'Not using pipeline for bulk operations',
        title_ko: '대량 작업에서 pipeline 미사용',
        problem:
          'Performing many individual KV operations in a loop causes N HTTP requests, degrading performance.',
        solution: 'Use kv.pipeline() to batch multiple operations into a single HTTP request.',
        code: `const pipeline = kv.pipeline()
for (const item of items) pipeline.set(item.key, item.value)
await pipeline.exec()`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Vercel KV is natively integrated with Vercel deployments. KV_URL, KV_REST_API_URL, and KV_REST_API_TOKEN are automatically injected when you connect the store to a project.',
        tip_ko:
          'Vercel KV는 Vercel 배포에 완전 통합됩니다. KV 스토어를 프로젝트에 연결하면 환경변수가 자동 주입됩니다.',
      },
      {
        with_service_slug: 'upstash-redis',
        tip: 'Vercel KV is powered by Upstash Redis under the hood. For more control or lower cost at scale, connect directly to Upstash using @upstash/redis — the API is nearly identical.',
        tip_ko:
          'Vercel KV는 내부적으로 Upstash Redis 기반입니다. 더 많은 제어나 비용 최적화가 필요하다면 @upstash/redis로 직접 연결하세요. API는 거의 동일합니다.',
      },
    ],
    pros: [
      { text: 'Zero-config integration with Vercel — env vars injected automatically', text_ko: 'Vercel과 제로 설정 통합 — 환경변수 자동 주입' },
      { text: 'HTTP REST API — works in Edge Runtime without TCP connections', text_ko: 'HTTP REST API — TCP 연결 없이 Edge Runtime에서 동작' },
      { text: 'Auto-serialization of JavaScript objects — no manual JSON.stringify needed', text_ko: 'JavaScript 객체 자동 직렬화 — JSON.stringify 불필요' },
    ],
    cons: [
      { text: 'Vendor lock-in to Vercel ecosystem — not portable to other platforms', text_ko: 'Vercel 생태계 종속 — 다른 플랫폼으로 이식 불가' },
      { text: 'More expensive than direct Upstash Redis at scale', text_ko: '규모 확장 시 직접 Upstash Redis보다 비용이 높음' },
    ],
    api_key_url: 'https://vercel.com/dashboard/stores',
    api_key_url_label: 'Vercel Storage Dashboard',
  },

  // -------------------------------------------------------------------------
  // 11. Upstash Redis
  // -------------------------------------------------------------------------
  {
    service_id: S.upstash_redis,
    quick_start:
      'Upstash 콘솔에서 Redis 데이터베이스를 생성하고 @upstash/redis를 설치하면 HTTP 기반의 서버리스·엣지 최적화 Redis를 바로 사용할 수 있습니다.',
    quick_start_en:
      'Create a Redis database in the Upstash console and install @upstash/redis to use HTTP-based, serverless and edge-optimized Redis instantly.',
    setup_steps: [
      {
        step: 1,
        title: 'Create Upstash Redis database',
        title_ko: 'Upstash Redis 데이터베이스 생성',
        description:
          'Sign up at console.upstash.com, create a new Redis database, and select your region. Enable "Global" for edge deployments.',
        description_ko:
          'console.upstash.com에서 가입 후 새 Redis 데이터베이스를 생성합니다. 엣지 배포에는 "Global" 옵션을 활성화하세요.',
      },
      {
        step: 2,
        title: 'Install @upstash/redis',
        title_ko: '@upstash/redis 설치',
        description: 'Install the Upstash Redis SDK (HTTP-based, works in all runtimes).',
        description_ko: 'Upstash Redis SDK를 설치합니다 (HTTP 기반, 모든 런타임 호환).',
        code_snippet: 'npm install @upstash/redis',
      },
      {
        step: 3,
        title: 'Set environment variables',
        title_ko: '환경변수 설정',
        description: 'Copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the Upstash console.',
        description_ko: 'Upstash 콘솔에서 UPSTASH_REDIS_REST_URL과 UPSTASH_REDIS_REST_TOKEN을 복사합니다.',
        code_snippet: `# .env.local
UPSTASH_REDIS_REST_URL=https://your-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token`,
      },
      {
        step: 4,
        title: 'Initialize client',
        title_ko: '클라이언트 초기화',
        description: 'Use Redis.fromEnv() for automatic env var loading.',
        description_ko: 'Redis.fromEnv()로 환경변수를 자동 로드하는 클라이언트를 생성합니다.',
        code_snippet: `import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()`,
      },
    ],
    code_examples: {
      typescript: `import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

// 기본 set/get
await redis.set('greeting', 'Hello!', { ex: 3600 })
const greeting = await redis.get<string>('greeting')

// 객체 저장 (자동 직렬화)
await redis.set('user:1', { name: '홍길동', score: 100 })
const user = await redis.get<{ name: string; score: number }>('user:1')

// 카운터 & 레이트 리미팅
const requests = await redis.incr('rate:user:1')
if (requests === 1) await redis.expire('rate:user:1', 60)

// Sorted Set (랭킹)
await redis.zadd('leaderboard', { score: 1500, member: 'user:1' })
const topUsers = await redis.zrange('leaderboard', 0, 9, { rev: true, withScores: true })

// Pipeline (배치 요청)
const pipeline = redis.pipeline()
pipeline.set('key1', 'value1')
pipeline.incr('total')
const [, total] = await pipeline.exec()

// Next.js Route Handler 캐싱 패턴
import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export async function GET() {
  const cacheKey = 'api:stats'
  let stats = await redis.get(cacheKey)
  if (!stats) {
    stats = await fetchStatsFromDB()
    await redis.set(cacheKey, stats, { ex: 60 })
  }
  return NextResponse.json(stats)
}`,
    },
    common_pitfalls: [
      {
        title: 'Using node-redis or ioredis in Edge Runtime',
        title_ko: 'Edge Runtime에서 node-redis 또는 ioredis 사용',
        problem:
          'Traditional Redis clients use TCP which is unavailable in Vercel Edge Runtime or Cloudflare Workers.',
        solution:
          'Always use @upstash/redis for serverless/edge. It uses HTTP REST API instead of TCP.',
      },
      {
        title: 'Creating Redis client inside every handler',
        title_ko: '매 핸들러 내부에서 Redis 클라이언트 생성',
        problem:
          'Calling Redis.fromEnv() inside every route handler creates unnecessary overhead on each invocation.',
        solution: 'Create the Redis client once at module level and reuse it.',
        code: `// 올바른 방법 (모듈 레벨)
import { Redis } from '@upstash/redis'
export const redis = Redis.fromEnv()

// 잘못된 방법 (매 요청마다 생성)
export async function GET() {
  const redis = Redis.fromEnv() // 비효율
}`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'nextauth',
        tip: 'Use @auth/upstash-redis-adapter to store NextAuth.js sessions in Upstash Redis. Ideal for serverless deployments where database connections are expensive.',
        tip_ko:
          '@auth/upstash-redis-adapter로 NextAuth.js 세션을 Upstash Redis에 저장하세요. DB 연결이 비싼 서버리스 배포에 최적입니다.',
        code: `import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter'
import { Redis } from '@upstash/redis'

export const { handlers, auth } = NextAuth({
  adapter: UpstashRedisAdapter(Redis.fromEnv()),
  providers: [],
})`,
      },
      {
        with_service_slug: 'vercel',
        tip: 'Upstash Redis integrates natively with Vercel via the Marketplace. Connect your Upstash database in the Vercel dashboard to auto-inject UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.',
        tip_ko:
          'Upstash Redis는 Vercel Marketplace를 통해 네이티브 통합됩니다. Vercel 대시보드에서 연결하면 환경변수가 자동 주입됩니다.',
      },
      {
        with_service_slug: 'vercel-kv',
        tip: 'Vercel KV is built on Upstash Redis. If you need more control or lower cost, use @upstash/redis directly — the API is nearly identical.',
        tip_ko:
          'Vercel KV는 Upstash Redis 기반입니다. 더 많은 제어나 낮은 비용이 필요하다면 @upstash/redis를 직접 사용하세요. API는 거의 동일합니다.',
      },
    ],
    pros: [
      { text: 'HTTP REST API — compatible with Edge Runtime, Cloudflare Workers, Deno', text_ko: 'HTTP REST API — Edge Runtime, Cloudflare Workers, Deno 모두 호환' },
      { text: 'Generous free tier: 10,000 commands/day, 256MB storage', text_ko: '넉넉한 무료 플랜: 일 10,000 커맨드, 256MB 스토리지' },
      { text: 'Global replication option for low-latency reads worldwide', text_ko: '글로벌 복제 옵션으로 전 세계 낮은 지연 시간 읽기' },
    ],
    cons: [
      { text: 'HTTP overhead per command — higher latency than TCP Redis for high-throughput scenarios', text_ko: '커맨드당 HTTP 오버헤드 — 고처리량 시나리오에서 TCP Redis보다 높은 지연' },
      { text: 'Free tier daily limit resets at midnight UTC — not suited for consistent high traffic', text_ko: '무료 플랜 일일 한도 UTC 자정 초기화 — 일관된 높은 트래픽에 부적합' },
    ],
    api_key_url: 'https://console.upstash.com/',
    api_key_url_label: 'Upstash Console',
  },
];
