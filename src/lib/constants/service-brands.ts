/**
 * 서비스별 브랜드 메타데이터 (아이콘, 색상, 이모지)의 단일 소스
 *
 * 서비스 추가 시 이 파일만 업데이트하면 됩니다.
 * - ServiceIcon 컴포넌트가 여기서 아이콘 정보를 읽음
 * - 랜딩 서비스 그리드가 여기서 이모지를 읽음
 * - 서비스맵/벤토카드 등에서 참조
 */

const CDN = 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons';

export interface ServiceBrand {
  slug?: string;        // Simple Icons CDN slug
  localPath?: string;   // /public 로컬 SVG 경로
  color: string;        // 라이트 모드 브랜드 색상
  darkColor: string;    // 다크 모드 브랜드 색상
  emoji: string;        // 서비스 고유 이모지
  multiColor?: boolean; // true이면 mask-image 대신 <img>로 렌더링 (다색 SVG용)
}

export const SERVICE_BRANDS: Record<string, ServiceBrand> = {
  // --- 기존 28개 서비스 (services.ts 등록 서비스) ---
  supabase:        { slug: 'supabase',      color: '#3FCF8E', darkColor: '#3FCF8E', emoji: '🗄️' },
  firebase:        { slug: 'firebase',      color: '#DD2C00', darkColor: '#FFCA28', emoji: '🔥' },
  vercel:          { slug: 'vercel',        color: '#000000', darkColor: '#ffffff', emoji: '▲' },
  netlify:         { slug: 'netlify',       color: '#00C7B7', darkColor: '#00C7B7', emoji: '🌐' },
  stripe:          { slug: 'stripe',        color: '#635BFF', darkColor: '#7A73FF', emoji: '💳' },
  clerk:           { slug: 'clerk',         color: '#6C47FF', darkColor: '#8B6FFF', emoji: '🔐' },
  nextauth:        { localPath: '/icons/authjs.svg', color: '#000000', darkColor: '#ffffff', emoji: '🔑' },
  resend:          { slug: 'resend',        color: '#000000', darkColor: '#ffffff', emoji: '📧' },
  sendgrid:        { localPath: '/icons/sendgrid.svg', color: '#1A82E2', darkColor: '#4DA3EC', emoji: '✉️' },
  openai:          { slug: 'openai',        color: '#412991', darkColor: '#A78BFA', emoji: '🤖' },
  anthropic:       { slug: 'anthropic',     color: '#191919', darkColor: '#D4A574', emoji: '🧠' },
  cloudinary:      { slug: 'cloudinary',    color: '#3448C5', darkColor: '#6B7FE0', emoji: '☁️' },
  sentry:          { slug: 'sentry',        color: '#362D59', darkColor: '#b4a7d6', emoji: '📊' },
  planetscale:     { slug: 'planetscale',   color: '#000000', darkColor: '#ffffff', emoji: '🪐' },
  neon:            { localPath: '/icons/neon.svg', color: '#00E599', darkColor: '#00E599', emoji: '⚡' },
  railway:         { slug: 'railway',       color: '#0B0D0E', darkColor: '#ffffff', emoji: '🚂' },
  'lemon-squeezy': { slug: 'lemonsqueezy', color: '#FFC233', darkColor: '#FFC233', emoji: '🍋' },
  uploadthing:     { localPath: '/icons/uploadthing.svg', color: '#EF4444', darkColor: '#F87171', emoji: '📁' },
  posthog:         { slug: 'posthog',       color: '#000000', darkColor: '#ffffff', emoji: '🦔' },
  'aws-s3':        { slug: 'amazons3',      color: '#569A31', darkColor: '#7BC74D', emoji: '🪣' },
  github:          { slug: 'github',        color: '#181717', darkColor: '#e6edf3', emoji: '🐙' },
  'claude-code':   { slug: 'anthropic',     color: '#D4A27F', darkColor: '#D4A27F', emoji: '🤖' },
  'google-gemini': { slug: 'googlegemini',  color: '#8E75B2', darkColor: '#B39DDB', emoji: '✨' },
  'kakao-login':   { slug: 'kakaotalk',     color: '#FFCD00', darkColor: '#FFCD00', emoji: '💬' },
  'google-oauth':  { localPath: '/icons/google.svg', color: '#4285F4', darkColor: '#8AB4F8', emoji: '🔓', multiColor: true },
  'naver-login':   { slug: 'naver',         color: '#03C75A', darkColor: '#03C75A', emoji: '🟢' },
  'apple-login':   { slug: 'apple',         color: '#000000', darkColor: '#ffffff', emoji: '🍎' },
  'github-oauth':  { slug: 'github',        color: '#181717', darkColor: '#e6edf3', emoji: '🐙' },

  // --- 신규 서비스 (SERVICE_IDS에만 존재, services.ts에 추가 예정) ---
  'github-actions': { slug: 'githubactions',     color: '#2088FF', darkColor: '#58A6FF', emoji: '⚡' },
  twilio:           { slug: 'twilio',             color: '#F22F46', darkColor: '#F22F46', emoji: '📞' },
  onesignal:        { localPath: '/icons/onesignal.svg', color: '#E54B4D', darkColor: '#E54B4D', emoji: '🔔' },
  algolia:          { slug: 'algolia',            color: '#003DFF', darkColor: '#003DFF', emoji: '🔎' },
  sanity:           { slug: 'sanity',             color: '#0D0E12', darkColor: '#ffffff', emoji: '📝' },
  ga4:              { slug: 'googleanalytics',    color: '#E37400', darkColor: '#F59E0B', emoji: '📈' },
  'upstash-redis':  { slug: 'upstash',           color: '#00E9A3', darkColor: '#00E9A3', emoji: '⚡' },
  cloudflare:       { slug: 'cloudflare',         color: '#F38020', darkColor: '#F38020', emoji: '🛡️' },
  'fly-io':         { slug: 'flydotio',           color: '#24175B', darkColor: '#ffffff', emoji: '🪁' },
  datadog:          { slug: 'datadog',            color: '#632CA6', darkColor: '#9B6FDB', emoji: '🐕' },
  mixpanel:         { slug: 'mixpanel',           color: '#7856FF', darkColor: '#9B7FFF', emoji: '📊' },
  contentful:       { slug: 'contentful',         color: '#2478CC', darkColor: '#5BA3E6', emoji: '📄' },
  meilisearch:      { slug: 'meilisearch',        color: '#FF5CAA', darkColor: '#FF5CAA', emoji: '🔍' },
  pusher:           { slug: 'pusher',             color: '#300D4F', darkColor: '#9B6FDB', emoji: '📡' },
  'trigger-dev':    { localPath: '/icons/trigger-dev.svg', color: '#1EE8B7', darkColor: '#1EE8B7', emoji: '⏱️' },
  launchdarkly:     { localPath: '/icons/launchdarkly.svg', color: '#405BFF', darkColor: '#5B73FF', emoji: '🏁' },
  groq:             { localPath: '/icons/groq.svg', color: '#F55036', darkColor: '#F55036', emoji: '⚡' },
  render:           { slug: 'render',             color: '#000000', darkColor: '#ffffff', emoji: '🖥️' },
  logrocket:        { localPath: '/icons/logrocket.svg', color: '#764ABC', darkColor: '#9B7FDB', emoji: '🚀' },
  playwright:       { slug: 'playwright',         color: '#2EAD33', darkColor: '#45D04C', emoji: '🎭' },
  'slack-api':      { slug: 'slack',              color: '#4A154B', darkColor: '#E01E5A', emoji: '💬' },
  'discord-api':    { slug: 'discord',            color: '#5865F2', darkColor: '#5865F2', emoji: '🎮' },
  mapbox:           { slug: 'mapbox',             color: '#000000', darkColor: '#4264FB', emoji: '🗺️' },
  elevenlabs:       { slug: 'elevenlabs',         color: '#000000', darkColor: '#ffffff', emoji: '🎙️' },
  inngest:          { localPath: '/icons/inngest.svg', color: '#4636F5', darkColor: '#6B5FFF', emoji: '🔄' },
  strapi:           { slug: 'strapi',             color: '#4945FF', darkColor: '#6B69FF', emoji: '🧩' },
  plausible:        { slug: 'plausibleanalytics', color: '#5850EC', darkColor: '#7C75F0', emoji: '📊' },
  cypress:          { slug: 'cypress',            color: '#69D3A7', darkColor: '#69D3A7', emoji: '🧪' },
  bullmq:           { localPath: '/icons/bullmq.svg', color: '#E4405F', darkColor: '#E4405F', emoji: '🐂' },
  'shopify-api':    { slug: 'shopify',            color: '#7AB55C', darkColor: '#95BF47', emoji: '🛍️' },

  // --- 도메인 등록 서비스 ---
  namecheap:              { slug: 'namecheap',          color: '#DE3723', darkColor: '#E56453', emoji: '🌐' },
  'cloudflare-registrar': { slug: 'cloudflare',         color: '#F38020', darkColor: '#F38020', emoji: '🌐' },
  godaddy:                { slug: 'godaddy',            color: '#1BDBDB', darkColor: '#1BDBDB', emoji: '🌐' },
  gabia:                  { color: '#2B328C', darkColor: '#5A60B8', emoji: '🌐' },
  'hosting-kr':           { color: '#0055AA', darkColor: '#4D88CC', emoji: '🖥️' },
  dotname:                { color: '#0066CC', darkColor: '#4D99E6', emoji: '🌐' },
  inames:                 { color: '#003399', darkColor: '#4D77CC', emoji: '🌐' },
  whois:                  { color: '#003E7E', darkColor: '#4D7AB3', emoji: '🌐' },

  // --- 광고 네트워크 서비스 ---
  'google-adsense':       { slug: 'googleadsense',      color: '#4285F4', darkColor: '#8AB4F8', emoji: '💰' },
  'kakao-adfit':          { slug: 'kakao',              color: '#FFCD00', darkColor: '#FFCD00', emoji: '💰' },
  criteo:                 { color: '#F46F25', darkColor: '#F48C54', emoji: '📊' },
  taboola:                { color: '#003CFF', darkColor: '#4D6FFF', emoji: '📰' },
  'amazon-aps':           { color: '#FF9900', darkColor: '#FFB84D', emoji: '📢' },
  'google-ad-manager':    { color: '#4285F4', darkColor: '#8AB4F8', emoji: '📢' },

  // --- AI 서비스 Phase 5 ---
  grok:                   { color: '#000000', darkColor: '#ffffff', emoji: '🤖' },
  'mistral-ai':           { slug: 'mistralai',           color: '#000000', darkColor: '#FF7000', emoji: '🌀' },
  cohere:                 { localPath: '/icons/cohere.svg', color: '#39594D', darkColor: '#6BD9A4', emoji: '🧠', multiColor: true },
  deepseek:               { localPath: '/icons/deepseek.svg', color: '#4D6BFE', darkColor: '#7B93FE', emoji: '🔍' },
  perplexity:             { slug: 'perplexity',         color: '#1FB8CD', darkColor: '#1FB8CD', emoji: '🔍' },
  'ai21-labs':            { color: '#5B2EAA', darkColor: '#8B6FDB', emoji: '🧠' },
  midjourney:             { localPath: '/icons/midjourney.svg', color: '#000000', darkColor: '#ffffff', emoji: '🎨' },
  'runway-ml':            { color: '#000000', darkColor: '#ffffff', emoji: '🎬' },
  sora:                   { slug: 'openai',             color: '#412991', darkColor: '#A78BFA', emoji: '🎬' },
  'leonardo-ai':          { localPath: '/icons/leonardo-ai.svg', color: '#A855F7', darkColor: '#C084FC', emoji: '🎨' },
  deepgram:               { slug: 'deepgram',           color: '#13EF93', darkColor: '#13EF93', emoji: '🎙️' },
  assemblyai:             { localPath: '/icons/assemblyai.svg', color: '#2545D3', darkColor: '#566DE8', emoji: '🎤', multiColor: true },
  playht:                 { localPath: '/icons/playht.svg', color: '#7C3AED', darkColor: '#A78BFA', emoji: '🗣️', multiColor: true },
  windsurf:               { slug: 'windsurf',          color: '#09B6A2', darkColor: '#09B6A2', emoji: '🏄' },
  tabnine:                { localPath: '/icons/tabnine.svg', color: '#6B57FF', darkColor: '#8B7AFF', emoji: '⌨️' },
  'amazon-q-developer':   { color: '#232F3E', darkColor: '#FF9900', emoji: '🤖' },
  weaviate:               { color: '#00D1A0', darkColor: '#00D1A0', emoji: '🔷' },
  qdrant:                 { color: '#DC244C', darkColor: '#E45572', emoji: '🔴' },
  chroma:                 { color: '#000000', darkColor: '#ffffff', emoji: '🎨' },
  crewai:                 { slug: 'crewai',            color: '#FF4F00', darkColor: '#FF7A3D', emoji: '👥' },
  dify:                   { localPath: '/icons/dify.svg', color: '#1677FF', darkColor: '#4D9AFF', emoji: '🤖' },
  'together-ai':          { localPath: '/icons/together-ai.svg', color: '#0F6FFF', darkColor: '#4D96FF', emoji: '🤝' },
  'fireworks-ai':         { localPath: '/icons/fireworks-ai.svg', color: '#6B3FA0', darkColor: '#9B6FDB', emoji: '🎆' },
  modal:                  { slug: 'modal',             color: '#28A745', darkColor: '#5BC479', emoji: '☁️' },
  wandb:                  { slug: 'weightsandbiases',   color: '#FFBE00', darkColor: '#FFBE00', emoji: '📈' },

  // --- SNS 플랫폼 서비스 ---
  'instagram-api':        { slug: 'instagram',          color: '#E4405F', darkColor: '#E4405F', emoji: '📸' },
  'youtube-api':          { slug: 'youtube',            color: '#FF0000', darkColor: '#FF0000', emoji: '▶️' },
  'x-api':                { slug: 'x',                  color: '#000000', darkColor: '#ffffff', emoji: '🐦' },
  'tiktok-api':           { slug: 'tiktok',             color: '#000000', darkColor: '#ffffff', emoji: '🎵' },
  'linkedin-api':         { slug: 'linkedin',           color: '#0A66C2', darkColor: '#3D8AD4', emoji: '💼' },
  'threads-api':          { slug: 'threads',            color: '#000000', darkColor: '#ffffff', emoji: '🧵' },
  polar:                  { color: '#0062FF', darkColor: '#4D91FF', emoji: '💰' },

  // --- 기존 v1 서비스 누락분 ---
  auth0:                  { slug: 'auth0',              color: '#EB5424', darkColor: '#EB5424', emoji: '🔐' },
  'aws-ses':              { slug: 'amazonsimpleemailservice', color: '#DD344C', darkColor: '#E56478', emoji: '📨' },
  cafe24:                 { localPath: '/icons/cafe24.svg', color: '#2FC98E', darkColor: '#2FC98E', emoji: '🛒' },
  convex:                 { slug: 'convex',             color: '#EE342F', darkColor: '#EE342F', emoji: '🔄' },
  cursor:                 { slug: 'cursor',             color: '#000000', darkColor: '#ffffff', emoji: '📝' },
  docker:                 { slug: 'docker',             color: '#2496ED', darkColor: '#2496ED', emoji: '🐳' },
  drizzle:                { slug: 'drizzle',            color: '#C5F74F', darkColor: '#C5F74F', emoji: '💧' },
  'github-copilot':       { slug: 'githubcopilot',      color: '#000000', darkColor: '#ffffff', emoji: '🤖' },
  grafana:                { slug: 'grafana',            color: '#F46800', darkColor: '#F46800', emoji: '📊' },
  huggingface:            { slug: 'huggingface',        color: '#FFD21E', darkColor: '#FFD21E', emoji: '🤗' },
  imagekit:               { localPath: '/icons/imagekit.svg', color: '#007BFF', darkColor: '#4DA3FF', emoji: '🖼️' },
  langchain:              { slug: 'langchain',          color: '#1C3C3C', darkColor: '#4ECDC4', emoji: '🔗' },
  'linear-api':           { slug: 'linear',             color: '#5E6AD2', darkColor: '#7B85E0', emoji: '📋' },
  mailchimp:              { slug: 'mailchimp',          color: '#FFE01B', darkColor: '#FFE01B', emoji: '🐵' },
  'new-relic':            { slug: 'newrelic',           color: '#1CE783', darkColor: '#1CE783', emoji: '📊' },
  'notion-api':           { slug: 'notion',             color: '#000000', darkColor: '#ffffff', emoji: '📓' },
  paypal:                 { slug: 'paypal',             color: '#003087', darkColor: '#00457C', emoji: '💳' },
  pinecone:               { localPath: '/icons/pinecone.svg', color: '#000000', darkColor: '#ffffff', emoji: '🌲' },
  prisma:                 { slug: 'prisma',             color: '#2D3748', darkColor: '#ffffff', emoji: '💎' },
  r2:                     { slug: 'cloudflare',         color: '#F38020', darkColor: '#F38020', emoji: '🪣' },
  'redis-cloud':          { slug: 'redis',              color: '#FF4438', darkColor: '#FF4438', emoji: '🔴' },
  replicate:              { slug: 'replicate',          color: '#000000', darkColor: '#ffffff', emoji: '🔁' },
  'stability-ai':         { localPath: '/icons/stability-ai.svg', color: '#000000', darkColor: '#ffffff', emoji: '🎨', multiColor: true },
  storybook:              { slug: 'storybook',          color: '#FF4785', darkColor: '#FF4785', emoji: '📖' },
  'toss-payments':        { localPath: '/icons/toss-payments.svg', color: '#0064FF', darkColor: '#4D91FF', emoji: '💳' },
  turso:                  { slug: 'turso',              color: '#4FF8D2', darkColor: '#4FF8D2', emoji: '🐢' },
  'vercel-kv':            { slug: 'vercel',             color: '#000000', darkColor: '#ffffff', emoji: '🗄️' },
  vitest:                 { slug: 'vitest',             color: '#6E9F18', darkColor: '#A3D547', emoji: '🧪' },

  // --- 광고/미디어 ---
  gwanggo:                { localPath: '/icons/gwanggo.svg', color: '#8B6FFF', darkColor: '#8B6FFF', emoji: '📢', multiColor: true },
  linkmap:                { localPath: '/img/linkmap-logo-dark.svg', color: '#38bdf8', darkColor: '#38bdf8', emoji: '🗺️', multiColor: true },

  // --- 분석 ---
  clarity:                { slug: 'microsoftclarity', color: '#4B53BC', darkColor: '#7B83EB', emoji: '🔍' },

  // --- AI IDE ---
  'google-antigravity':   { slug: 'google',           color: '#4285F4', darkColor: '#8AB4F8', emoji: '🚀' },

  // --- 자동화 ---
  n8n:                    { slug: 'n8n',              color: '#EA4B71', darkColor: '#FF6D8E', emoji: '⚡' },

  // --- slug 매핑 별칭 (seed slug ↔ brand key 불일치 보정) ---
  flyio:                  { slug: 'flydotio',           color: '#24175B', darkColor: '#ffffff', emoji: '🪁' },

  // --- Flow preset 별칭 (flow-presets.ts에서 사용) ---
  nextjs:       { slug: 'nextdotjs',    color: '#000000', darkColor: '#ffffff', emoji: '⚡' },
  backend:      { slug: 'fastapi',      color: '#009688', darkColor: '#4DB6AC', emoji: '🔧' },
  s3:           { slug: 'amazons3',     color: '#569A31', darkColor: '#7BC74D', emoji: '☁️' },
  'naver-api':  { slug: 'naver',        color: '#03C75A', darkColor: '#03C75A', emoji: '📗' },
  aladin:       { emoji: '📚', color: '#2E86C1', darkColor: '#5DADE2' },
  'cloud-run':  { slug: 'googlecloud',  color: '#4285F4', darkColor: '#8AB4F8', emoji: '☁️' },
  readingtree:  { emoji: '🌳', color: '#2ECC71', darkColor: '#58D68D' },
};

/** 서비스 브랜드 정보 조회 (없으면 undefined) */
export function getServiceBrand(serviceId: string): ServiceBrand | undefined {
  return SERVICE_BRANDS[serviceId];
}

/** 서비스 이모지 조회 (없으면 ⚙️) */
export function getServiceEmoji(serviceId: string): string {
  return SERVICE_BRANDS[serviceId]?.emoji ?? '⚙️';
}

/** 서비스 아이콘 SVG URL 조회 (없으면 undefined) */
export function getServiceIconUrl(serviceId: string): string | undefined {
  const brand = SERVICE_BRANDS[serviceId];
  if (!brand) return undefined;
  return brand.slug ? `${CDN}/${brand.slug}.svg` : brand.localPath;
}
