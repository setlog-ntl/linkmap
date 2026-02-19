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
  onesignal:        { slug: 'onesignal',          color: '#E54B4D', darkColor: '#E54B4D', emoji: '🔔' }, // TODO: Simple Icons 미등록, 로컬 SVG 필요
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
  'trigger-dev':    { slug: 'triggerdotdev',      color: '#1EE8B7', darkColor: '#1EE8B7', emoji: '⏱️' }, // TODO: Simple Icons 미등록, 로컬 SVG 필요
  launchdarkly:     { slug: 'launchdarkly',       color: '#405BFF', darkColor: '#5B73FF', emoji: '🏁' }, // TODO: Simple Icons 미등록, 로컬 SVG 필요
  groq:             { slug: 'groq',               color: '#F55036', darkColor: '#F55036', emoji: '⚡' }, // TODO: Simple Icons 미등록, 로컬 SVG 필요
  render:           { slug: 'render',             color: '#000000', darkColor: '#ffffff', emoji: '🖥️' },
  logrocket:        { slug: 'logrocket',          color: '#764ABC', darkColor: '#9B7FDB', emoji: '🚀' }, // TODO: Simple Icons 미등록, 로컬 SVG 필요
  playwright:       { slug: 'playwright',         color: '#2EAD33', darkColor: '#45D04C', emoji: '🎭' },
  'slack-api':      { slug: 'slack',              color: '#4A154B', darkColor: '#E01E5A', emoji: '💬' },
  'discord-api':    { slug: 'discord',            color: '#5865F2', darkColor: '#5865F2', emoji: '🎮' },
  mapbox:           { slug: 'mapbox',             color: '#000000', darkColor: '#4264FB', emoji: '🗺️' },
  elevenlabs:       { slug: 'elevenlabs',         color: '#000000', darkColor: '#ffffff', emoji: '🎙️' },
  inngest:          { slug: 'inngest',            color: '#4636F5', darkColor: '#6B5FFF', emoji: '🔄' }, // TODO: Simple Icons 미등록, 로컬 SVG 필요
  strapi:           { slug: 'strapi',             color: '#4945FF', darkColor: '#6B69FF', emoji: '🧩' },
  plausible:        { slug: 'plausibleanalytics', color: '#5850EC', darkColor: '#7C75F0', emoji: '📊' },
  cypress:          { slug: 'cypress',            color: '#69D3A7', darkColor: '#69D3A7', emoji: '🧪' },
  bullmq:           { slug: 'bull',               color: '#E4405F', darkColor: '#E4405F', emoji: '🐂' }, // TODO: Simple Icons 미등록, 로컬 SVG 필요
  'shopify-api':    { slug: 'shopify',            color: '#7AB55C', darkColor: '#95BF47', emoji: '🛍️' },

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
