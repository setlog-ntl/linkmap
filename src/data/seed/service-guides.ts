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
  // Advertising
  google_adsense: '10000000-0000-4000-a000-000000000097',
  kakao_adfit: '10000000-0000-4000-a000-000000000098',
  criteo: '10000000-0000-4000-a000-000000000099',
  taboola: '10000000-0000-4000-a000-000000000100',
  amazon_aps: '10000000-0000-4000-a000-000000000101',
  google_ad_manager: '10000000-0000-4000-a000-000000000102',
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
  },
];
