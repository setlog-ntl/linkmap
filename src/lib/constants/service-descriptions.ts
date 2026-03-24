/**
 * 서비스별 한 줄 설명 중앙 저장소
 *
 * SERVICE_BRANDS 키와 1:1 매핑. 50자 이내 짧은 설명.
 * ServiceTooltip 등에서 참조.
 */

export const SERVICE_DESCRIPTIONS: Record<string, string> = {
  // --- 기존 28개 서비스 (services.ts 등록) ---
  supabase: '오픈소스 Firebase 대안 — DB, 인증, 실시간 API',
  firebase: 'Google 지원 BaaS — NoSQL, 인증, 호스팅',
  vercel: 'Next.js 최적화 프론트엔드 배포 플랫폼',
  netlify: '정적 사이트 배포 + 서버리스 함수 플랫폼',
  stripe: '글로벌 결제 처리 플랫폼 — 구독, 인보이스',
  clerk: '사전 구축 UI 제공 인증·사용자 관리 솔루션',
  nextauth: 'Next.js용 오픈소스 인증 라이브러리',
  resend: '개발자 친화적 이메일 API — React Email 통합',
  sendgrid: 'Twilio 이메일 API — 대량 발송·마케팅',
  openai: 'GPT·DALL-E·Whisper 등 AI 모델 API',
  anthropic: 'Claude AI 모델 API — 안전한 AI 어시스턴트',
  cloudinary: '이미지·영상 관리 + CDN 자동 최적화',
  sentry: '실시간 오류 추적·성능 모니터링 플랫폼',
  planetscale: '서버리스 MySQL — 브랜치 기반 스키마 관리',
  neon: '서버리스 Postgres — 브랜치·자동 스케일링',
  railway: '인프라 자동 관리 풀스택 배포 플랫폼',
  'lemon-squeezy': '디지털 상품·구독 결제 — MoR 내장',
  uploadthing: 'Next.js 최적화 파일 업로드 서비스',
  posthog: '제품 분석·세션 리플레이·피처 플래그',
  'aws-s3': 'AWS 객체 스토리지 — 대용량 파일 저장',
  github: '코드 호스팅·협업·CI/CD — Git 플랫폼',
  'claude-code': 'Claude 기반 AI 코딩 어시스턴트 CLI',
  'google-gemini': 'Google 멀티모달 AI 플랫폼 — 텍스트·이미지·비디오 생성 & 이해',
  'kakao-login': '카카오계정 소셜 로그인 — 한국 최다 사용',
  'google-oauth': 'Google 계정 기반 OAuth 인증',
  'naver-login': '네이버 계정 소셜 로그인',
  'apple-login': 'Apple ID 기반 소셜 로그인',
  'github-oauth': 'GitHub 계정 OAuth 인증',

  // --- 신규 서비스 (SERVICE_BRANDS 등록) ---
  'github-actions': 'GitHub 내장 CI/CD — 워크플로우 자동화',
  twilio: '전화·SMS·영상 커뮤니케이션 API',
  onesignal: '크로스 플랫폼 푸시 알림 서비스',
  algolia: '초고속 검색·추천 API — 타이핑 즉시 결과',
  sanity: '실시간 협업 헤드리스 CMS',
  ga4: 'Google Analytics 4 — 웹·앱 통합 분석',
  'upstash-redis': '서버리스 Redis — REST API 기반 캐시',
  cloudflare: 'CDN·보안·Workers — 글로벌 엣지 플랫폼',
  'fly-io': '컨테이너 기반 글로벌 엣지 배포 플랫폼',
  datadog: '인프라·APM·로그 통합 모니터링',
  mixpanel: '이벤트 기반 제품 분석·사용자 추적',
  contentful: '헤드리스 CMS — API-first 콘텐츠 관리',
  meilisearch: '오픈소스 초고속 검색 엔진',
  pusher: '실시간 웹소켓 채널 + 푸시 알림 API',
  'trigger-dev': '장시간 백그라운드 작업 오케스트레이션',
  launchdarkly: '피처 플래그·실험·점진적 배포 관리',
  groq: '초저지연 AI 추론 API — LPU 기반',
  render: '풀스택 클라우드 배포 — Docker·DB 통합',
  logrocket: '프론트엔드 세션 리플레이·오류 추적',
  playwright: '크로스 브라우저 E2E 테스트 프레임워크',
  'slack-api': 'Slack 워크스페이스 연동 — 봇·메시지 API',
  'discord-api': 'Discord 봇·웹훅 통합 API',
  mapbox: '커스텀 지도·위치 서비스 API',
  elevenlabs: 'AI 음성 합성·텍스트-투-스피치 API',
  inngest: '이벤트 기반 백그라운드 함수 실행 플랫폼',
  strapi: '오픈소스 헤드리스 CMS — 자체 호스팅',
  plausible: '프라이버시 우선 경량 웹 분석 도구',
  cypress: '프론트엔드 E2E·컴포넌트 테스트 도구',
  bullmq: 'Node.js Redis 기반 작업 큐 라이브러리',
  'shopify-api': 'Shopify 스토어 연동 — 커머스 API',

  // --- 도메인 등록 서비스 ---
  namecheap: '글로벌 도메인 등록·관리 서비스',
  'cloudflare-registrar': 'Cloudflare 도메인 등록 — 원가 제공',
  godaddy: '세계 최대 도메인 등록 서비스',
  gabia: '한국 대표 도메인·호스팅 서비스',
  'hosting-kr': '한국 호스팅·도메인 등록 서비스',
  dotname: '한국 도메인 등록 전문 서비스',
  inames: '한국 도메인 등록·관리 서비스',
  whois: '도메인 등록·조회 서비스',

  // --- 광고 네트워크 서비스 ---
  'google-adsense': 'Google 웹사이트 광고 수익화 플랫폼',
  'kakao-adfit': '카카오 모바일·웹 광고 수익화 플랫폼',
  criteo: '리타겟팅 특화 퍼포먼스 광고 플랫폼',
  taboola: '네이티브 콘텐츠 디스커버리 광고 플랫폼',
  'amazon-aps': 'Amazon 퍼블리셔 광고 수익화 서비스',
  'google-ad-manager': 'Google 광고 인벤토리 통합 관리 플랫폼',

  // --- AI 서비스 Phase 5 ---
  grok: 'xAI의 대화형 AI 모델 — X(Twitter) 통합',
  'mistral-ai': '유럽 오픈소스 LLM — 고효율 경량 모델',
  cohere: '엔터프라이즈 NLP — RAG·임베딩·분류 API',
  deepseek: '중국 오픈소스 LLM — 코딩·추론 특화',
  perplexity: 'AI 검색 엔진 — 실시간 소스 기반 답변',
  'ai21-labs': 'Jurassic·Jamba 모델 — 엔터프라이즈 LLM',
  midjourney: 'AI 이미지 생성 — 예술·디자인 특화',
  'runway-ml': 'AI 영상 생성·편집 크리에이티브 도구',
  sora: 'OpenAI 텍스트-투-비디오 생성 모델',
  'leonardo-ai': 'AI 이미지 생성 — 게임·3D 에셋 특화',
  deepgram: 'AI 음성 인식(STT) — 실시간 트랜스크립션',
  assemblyai: 'AI 음성 인식·요약·감정 분석 API',
  playht: 'AI 텍스트-투-스피치 — 초자연스러운 음성',
  windsurf: 'AI 코드 에디터 — 에이전틱 IDE',
  tabnine: 'AI 코드 자동완성 — 프라이버시 중심',
  'amazon-q-developer': 'AWS AI 코딩 어시스턴트',
  weaviate: '오픈소스 벡터 데이터베이스 — AI 검색',
  qdrant: '고성능 벡터 유사도 검색 엔진',
  chroma: '오픈소스 AI 임베딩 데이터베이스',
  crewai: '멀티 에이전트 AI 오케스트레이션 프레임워크',
  dify: 'LLM 앱 개발 플랫폼 — 노코드 워크플로우',
  'together-ai': '오픈소스 모델 클라우드 추론 플랫폼',
  'fireworks-ai': '초고속 AI 모델 추론 API 플랫폼',
  modal: '서버리스 GPU 컴퓨팅 — AI 워크로드 특화',
  wandb: 'ML 실험 추적·모델 관리 플랫폼',

  // --- SNS 플랫폼 서비스 ---
  'instagram-api': 'Instagram 콘텐츠·인사이트 API',
  'youtube-api': 'YouTube 데이터·업로드·라이브 API',
  'x-api': 'X(Twitter) 포스트·검색·분석 API',
  'tiktok-api': 'TikTok 콘텐츠·크리에이터 API',
  'linkedin-api': 'LinkedIn 프로필·포스트 연동 API',
  'threads-api': 'Threads 포스트·미디어 API',
  polar: '오픈소스 후원·구독 결제 플랫폼',

  // --- 기존 v1 서비스 누락분 ---
  auth0: '엔터프라이즈 인증 플랫폼 — SSO, MFA',
  'aws-ses': 'AWS 이메일 전송 서비스 — 대량 발송',
  cafe24: '한국 이커머스 플랫폼 — 쇼핑몰 호스팅',
  convex: '리액티브 서버리스 DB — 실시간 동기화',
  cursor: 'AI 코드 에디터 — GPT 기반 자동완성',
  docker: '컨테이너 빌드·배포·관리 플랫폼',
  drizzle: 'TypeScript ORM — 경량·타입 안전',
  'github-copilot': 'GitHub AI 페어 프로그래머',
  grafana: '오픈소스 메트릭·로그 시각화 대시보드',
  huggingface: 'AI 모델 허브 — 모델·데이터셋 공유',
  imagekit: '실시간 이미지 최적화 + CDN 서비스',
  langchain: 'LLM 앱 개발 프레임워크 — 체인·에이전트',
  'linear-api': 'Linear 이슈 트래커 — 프로젝트 관리 API',
  mailchimp: '이메일 마케팅·자동화·뉴스레터 플랫폼',
  'new-relic': '풀스택 옵저버빌리티 — APM·인프라 모니터링',
  'notion-api': 'Notion 워크스페이스 연동 API',
  paypal: '글로벌 온라인 결제·송금 플랫폼',
  pinecone: '관리형 벡터 데이터베이스 — AI 검색',
  prisma: 'Node.js/TS ORM — 자동 마이그레이션',
  r2: 'Cloudflare 객체 스토리지 — S3 호환',
  'redis-cloud': 'Redis Labs 관리형 인메모리 DB',
  replicate: '오픈소스 AI 모델 클라우드 실행 플랫폼',
  'stability-ai': 'Stable Diffusion 이미지 생성 API',
  storybook: 'UI 컴포넌트 독립 개발·문서화 도구',
  'toss-payments': '토스 결제 API — 한국 간편결제 통합',
  turso: 'SQLite 엣지 DB — 글로벌 복제',
  'vercel-kv': 'Vercel 관리형 Redis KV 스토어',
  vitest: 'Vite 기반 초고속 단위 테스트 프레임워크',

  // --- 광고/미디어 ---
  gwanggo: '광고 네트워크 통합 관리 서비스',
  linkmap: '서비스 연결 시각화 + API 키 관리 플랫폼',

  // --- 분석 ---
  clarity: 'Microsoft 무료 히트맵·세션 리플레이',

  // --- AI IDE ---
  'google-antigravity': 'Google AI 개발 도구 프로젝트',

  // --- 자동화 ---
  n8n: '오픈소스 워크플로우 자동화 플랫폼',

  // --- slug 매핑 별칭 ---
  flyio: '컨테이너 기반 글로벌 엣지 배포 플랫폼',

  // --- Flow preset 별칭 ---
  nextjs: 'React 풀스택 프레임워크 — SSR·SSG·ISR',
  backend: '서버사이드 API·비즈니스 로직 서비스',
  s3: 'AWS 객체 스토리지 — 대용량 파일 저장',
  'naver-api': '네이버 오픈 API — 검색·지도·번역',
  aladin: '알라딘 도서 검색·상품 API',
  'cloud-run': 'Google Cloud 서버리스 컨테이너 실행',
  readingtree: '독서 기록·추천 서비스',
};

/** 서비스 한 줄 설명 조회 (없으면 undefined) */
export function getServiceDescription(slug: string): string | undefined {
  return SERVICE_DESCRIPTIONS[slug];
}
