/**
 * 배포한 사이트가 어떤 외부 서비스를 쓰는지 알아낸다 (Phase 3 — 퍼널 브릿지).
 *
 * 왜 별도 감지가 필요한가: 기존 `/api/mcp/detect`는 npm 패키지명·환경변수 키를 서비스로
 * 매핑한다. 그런데 바이브코더가 AI에게 받아 올리는 페이지는 빌드 도구 없이
 * `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js">` 같은 CDN 태그를 쓴다.
 * 그래서 **배포된 콘텐츠 자체**에서 흔적을 찾는 감지가 따로 필요하다.
 *
 * 이 감지의 목적은 자동 등록이 아니라 **제안**이다. 사용자가 "내 사이트가 뭘 쓰는지"를
 * 보고 서비스맵에 담을지 직접 고르게 한다 — 코어 컨셉의 "배우다 보니 관리가 되어 있는" 경험.
 */

/** 서비스 카탈로그에 실제로 존재하는 slug만 쓴다 (2026-08-02 확인) */
export interface ServiceSignature {
  slug: string;
  label: string;
  /** 콘텐츠에서 찾을 흔적 — 하나라도 걸리면 감지 */
  patterns: RegExp[];
  /** package.json 의존성 이름 (빌드형 저장소용) */
  packages?: string[];
}

const SIGNATURES: ServiceSignature[] = [
  {
    slug: 'supabase',
    label: 'Supabase',
    // `\b`가 supabase.com을 걸러낸다 — "co" 뒤에 m이 오면 단어 경계가 아니다.
    // 이걸 놓치면 블로그에 supabase.com 링크 한 줄만 있어도 사용 중으로 오탐한다.
    patterns: [
      /@supabase\/supabase-js/i,
      /[a-z0-9-]+\.supabase\.co\b/i,
      /createClient\s*\(\s*['"]https:\/\/[a-z0-9-]+\.supabase\.co\b/i,
    ],
    packages: ['@supabase/supabase-js', '@supabase/ssr', '@supabase/auth-helpers-nextjs'],
  },
  {
    slug: 'ga4',
    label: 'GA4 (Google Analytics)',
    // 측정 ID(G-XXXXXXXX)만으로는 판단하지 않는다 — 주문번호 같은 문자열과 구분되지 않는다.
    // 반드시 gtag 로딩·호출 문맥이 함께 있어야 한다.
    patterns: [/googletagmanager\.com\/gtag\/js/i, /gtag\s*\(\s*['"]config['"]/i],
    packages: ['react-ga4'],
  },
  {
    slug: 'firebase',
    label: 'Firebase',
    // `initializeApp(`은 사용자가 직접 만든 동명 함수에도 걸리므로 쓰지 않는다
    patterns: [/firebasejs/i, /firebaseapp\.com/i, /from\s+['"]firebase\//i, /require\(\s*['"]firebase\//i],
    packages: ['firebase', 'firebase-admin'],
  },
  {
    slug: 'stripe',
    label: 'Stripe',
    patterns: [/js\.stripe\.com/i, /Stripe\s*\(\s*['"]pk_/],
    packages: ['stripe', '@stripe/stripe-js'],
  },
  {
    slug: 'toss-payments',
    label: '토스페이먼츠',
    patterns: [/js\.tosspayments\.com/i, /TossPayments\s*\(/],
    packages: ['@tosspayments/payment-sdk', '@tosspayments/tosspayments-sdk'],
  },
  {
    slug: 'kakao-login',
    label: 'Kakao Login',
    patterns: [/developers\.kakao\.com\/sdk/i, /kakao\.min\.js/i, /Kakao\.init\s*\(/],
  },
  {
    slug: 'kakao-adfit',
    label: 'Kakao AdFit',
    patterns: [/t1\.daumcdn\.net\/kas\/static\/ba\.min\.js/i, /kakao_ad_area/i],
  },
  {
    slug: 'google-maps-platform',
    label: 'Google Maps Platform',
    patterns: [/maps\.googleapis\.com\/maps\/api/i, /google\.maps\./],
    packages: ['@googlemaps/js-api-loader'],
  },
  {
    slug: 'mapbox',
    label: 'Mapbox',
    patterns: [/api\.mapbox\.com/i, /mapbox-gl/i],
    packages: ['mapbox-gl', 'react-map-gl'],
  },
  {
    slug: 'google-adsense',
    label: 'Google AdSense',
    patterns: [/pagead2\.googlesyndication\.com/i, /adsbygoogle/i],
  },
  {
    slug: 'clarity',
    label: 'Microsoft Clarity',
    patterns: [/clarity\.ms\/tag/i, /window\.clarity/],
  },
  {
    slug: 'sentry',
    label: 'Sentry',
    patterns: [/browser\.sentry-cdn\.com/i, /@sentry\/browser/i, /Sentry\.init\s*\(/],
    packages: ['@sentry/browser', '@sentry/react', '@sentry/nextjs'],
  },
  {
    slug: 'posthog',
    label: 'PostHog',
    patterns: [/posthog\.com\/static\/array\.js/i, /posthog\.init\s*\(/i],
    packages: ['posthog-js'],
  },
  {
    slug: 'plausible',
    label: 'Plausible',
    patterns: [/plausible\.io\/js\//i],
  },
  {
    slug: 'mixpanel',
    label: 'Mixpanel',
    patterns: [/cdn\.mxpnl\.com/i, /mixpanel\.init\s*\(/i],
    packages: ['mixpanel-browser'],
  },
  {
    slug: 'openai',
    label: 'OpenAI',
    patterns: [/api\.openai\.com/i],
    packages: ['openai'],
  },
  {
    slug: 'anthropic',
    label: 'Anthropic (Claude)',
    patterns: [/api\.anthropic\.com/i],
    packages: ['@anthropic-ai/sdk'],
  },
];

/** 검사할 파일 — 텍스트로 읽을 수 있고 서비스 호출이 담길 만한 것만 */
const SCANNABLE = /\.(html?|js|mjs|jsx|ts|tsx|json)$/i;

/** 파일 하나에서 읽을 최대 길이 — 거대 번들 전체를 훑지 않는다 */
const MAX_SCAN_CHARS = 300_000;

export interface DetectedService {
  slug: string;
  label: string;
  /** 어디에서 찾았는지 — 사용자에게 근거를 보여주기 위해 */
  foundIn: string[];
}

export interface ScanInput {
  path: string;
  /** utf-8 텍스트. base64 파일은 호출부에서 제외한다 */
  content: string;
}

/**
 * 배포 파일에서 서비스 흔적을 찾는다.
 * 자동 등록이 아니라 제안용이므로, 확신이 낮아도 근거(foundIn)를 함께 돌려준다.
 */
export function scanFilesForServices(files: ScanInput[]): DetectedService[] {
  const hits = new Map<string, Set<string>>();

  for (const file of files) {
    if (!SCANNABLE.test(file.path)) continue;
    const text = file.content.length > MAX_SCAN_CHARS
      ? file.content.slice(0, MAX_SCAN_CHARS)
      : file.content;

    for (const sig of SIGNATURES) {
      if (sig.patterns.some((p) => p.test(text))) {
        if (!hits.has(sig.slug)) hits.set(sig.slug, new Set());
        hits.get(sig.slug)!.add(file.path);
      }
    }
  }

  return toResults(hits);
}

/** package.json 의존성에서 서비스를 찾는다 (빌드형 저장소용) */
export function scanPackagesForServices(
  dependencies: Record<string, unknown> | undefined,
  devDependencies?: Record<string, unknown>,
): DetectedService[] {
  const names = new Set([
    ...Object.keys(dependencies ?? {}),
    ...Object.keys(devDependencies ?? {}),
  ]);
  const hits = new Map<string, Set<string>>();

  for (const sig of SIGNATURES) {
    const matched = (sig.packages ?? []).filter((p) => names.has(p));
    if (matched.length > 0) {
      hits.set(sig.slug, new Set(matched.map((m) => `package.json (${m})`)));
    }
  }

  return toResults(hits);
}

/** 두 감지 결과를 합친다 — 같은 서비스는 근거를 모은다 */
export function mergeDetections(...groups: DetectedService[][]): DetectedService[] {
  const hits = new Map<string, Set<string>>();
  for (const group of groups) {
    for (const d of group) {
      if (!hits.has(d.slug)) hits.set(d.slug, new Set());
      d.foundIn.forEach((f) => hits.get(d.slug)!.add(f));
    }
  }
  return toResults(hits);
}

function toResults(hits: Map<string, Set<string>>): DetectedService[] {
  const bySlug = new Map(SIGNATURES.map((s) => [s.slug, s]));
  return [...hits.entries()]
    .map(([slug, paths]) => ({
      slug,
      label: bySlug.get(slug)?.label ?? slug,
      // 근거는 몇 개만 보여줘도 충분하다
      foundIn: [...paths].slice(0, 3),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'ko'));
}

/** 감지 대상 서비스 목록 — 테스트·문서에서 참조 */
export const DETECTABLE_SLUGS = SIGNATURES.map((s) => s.slug);
