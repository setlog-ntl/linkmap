/**
 * 인증 가이드 스크린샷 캡처 — MCP Playwright 기반
 *
 * 이 스크립트는 직접 실행하지 않습니다.
 * Claude Code의 MCP Playwright 도구를 사용하여 아래 단계를 수동으로 진행합니다.
 *
 * ──────────────────────────────────────────
 * 사용 방법 (Claude Code 대화에서):
 * ──────────────────────────────────────────
 *
 * 1. "구글 콘솔 스크린샷 캡처해줘" 라고 요청
 * 2. Claude가 Playwright MCP로 브라우저를 열고 해당 URL로 이동
 * 3. 사용자가 직접 로그인 (2FA/보안 챌린지 처리)
 * 4. 로그인 완료 후 "로그인 했어" 라고 알림
 * 5. Claude가 각 페이지를 순회하며 스크린샷 캡처
 * 6. 캡처 전 키/시크릿 마스킹 CSS 주입
 * 7. 캡처된 파일을 public/img/guides/auth/ 에 저장
 *
 * ──────────────────────────────────────────
 * 키 마스킹 규칙:
 * ──────────────────────────────────────────
 *
 * - Client ID: 앞 12자 표시 + 나머지 "••••••"
 *   예: "123456789-ab••••••.apps.googleusercontent.com"
 *
 * - Client Secret: prefix 표시 + 나머지 "••••••"
 *   예: "GOCSPX-••••••••••••••"
 *
 * - REST API Key: 앞 10자 표시 + 나머지 "••••••"
 *   예: "a1b2c3d4e5••••••••••••"
 *
 * - Admin Key: 완전 마스킹
 *   예: "••••••••••••••••••••••"
 *
 * ──────────────────────────────────────────
 * MCP Playwright 워크플로우 (Claude가 실행):
 * ──────────────────────────────────────────
 */

// ─── 캡처 대상 정의 ───

export interface CaptureTarget {
  id: string;
  provider: 'google' | 'kakao' | 'supabase';
  filename: string;
  url: string;
  description: string;
  maskSelectors?: string[];
  waitForSelector?: string;
}

export const GOOGLE_TARGETS: CaptureTarget[] = [
  {
    id: 'g01-project-dropdown',
    provider: 'google',
    filename: '01-project-dropdown.png',
    url: 'https://console.cloud.google.com',
    description: 'GCP 프로젝트 선택 드롭다운',
    waitForSelector: '[data-header-title]',
  },
  {
    id: 'g02-consent-menu',
    provider: 'google',
    filename: '02-consent-menu.png',
    url: 'https://console.cloud.google.com/apis/credentials/consent',
    description: 'OAuth 동의 화면 메뉴',
    waitForSelector: 'form',
  },
  {
    id: 'g02-external-select',
    provider: 'google',
    filename: '02-external-select.png',
    url: 'https://console.cloud.google.com/apis/credentials/consent',
    description: 'External 유형 선택',
  },
  {
    id: 'g03-credentials',
    provider: 'google',
    filename: '03-credentials-menu.png',
    url: 'https://console.cloud.google.com/apis/credentials',
    description: '사용자 인증 정보 메뉴',
    waitForSelector: '[role="main"]',
  },
  {
    id: 'g03-redirect-uri',
    provider: 'google',
    filename: '03-redirect-uri.png',
    url: 'https://console.cloud.google.com/apis/credentials/oauthclient',
    description: '리디렉션 URI 입력',
    maskSelectors: ['input[name="redirectUri"]'],
  },
  {
    id: 'g04-created-modal',
    provider: 'google',
    filename: '04-created-modal.png',
    url: 'https://console.cloud.google.com/apis/credentials',
    description: 'OAuth 클라이언트 생성 완료 모달',
    maskSelectors: ['.client-id-value', '.client-secret-value'],
  },
];

export const KAKAO_TARGETS: CaptureTarget[] = [
  {
    id: 'k01-console-main',
    provider: 'kakao',
    filename: '01-console-main.png',
    url: 'https://developers.kakao.com/console/app',
    description: '카카오 개발자 콘솔 메인',
    waitForSelector: '.wrap_cont',
  },
  {
    id: 'k01-rest-api-key',
    provider: 'kakao',
    filename: '01-rest-api-key.png',
    url: 'https://developers.kakao.com/console/app',
    description: 'REST API 키',
    maskSelectors: ['.key_value', '.txt_key'],
  },
  {
    id: 'k02-login-toggle',
    provider: 'kakao',
    filename: '02-activation-toggle.png',
    url: 'https://developers.kakao.com/console/app',
    description: '카카오 로그인 활성화',
  },
  {
    id: 'k02-oidc-toggle',
    provider: 'kakao',
    filename: '02-oidc-toggle.png',
    url: 'https://developers.kakao.com/console/app',
    description: 'OpenID Connect 활성화',
  },
  {
    id: 'k03-redirect-uri',
    provider: 'kakao',
    filename: '03-redirect-uri-input.png',
    url: 'https://developers.kakao.com/console/app',
    description: 'Redirect URI 입력',
  },
  {
    id: 'k04-consent',
    provider: 'kakao',
    filename: '04-email-required.png',
    url: 'https://developers.kakao.com/console/app',
    description: '동의항목 이메일 필수',
  },
  {
    id: 'k05-secret',
    provider: 'kakao',
    filename: '05-security-code-gen.png',
    url: 'https://developers.kakao.com/console/app',
    description: 'Client Secret 생성',
    maskSelectors: ['.secret_value'],
  },
];

export const SUPABASE_TARGETS: CaptureTarget[] = [
  {
    id: 's-providers',
    provider: 'supabase',
    filename: 'providers-list.png',
    url: 'https://supabase.com/dashboard/project/_/auth/providers',
    description: 'Supabase Providers 목록',
    waitForSelector: '[role="main"]',
  },
  {
    id: 's-google-settings',
    provider: 'supabase',
    filename: 'google-settings.png',
    url: 'https://supabase.com/dashboard/project/_/auth/providers',
    description: 'Google Provider 설정',
    maskSelectors: ['input[type="password"]', 'input[name="clientId"]'],
  },
  {
    id: 's-url-config',
    provider: 'supabase',
    filename: 'url-config.png',
    url: 'https://supabase.com/dashboard/project/_/auth/url-configuration',
    description: 'URL Configuration',
    waitForSelector: '[role="main"]',
  },
  {
    id: 's-oidc-form',
    provider: 'supabase',
    filename: 'custom-oidc-form.png',
    url: 'https://supabase.com/dashboard/project/_/auth/providers',
    description: 'Custom OIDC Provider 설정',
    maskSelectors: ['input[type="password"]'],
  },
];

// ─── 키 마스킹 JavaScript (browser_evaluate로 주입) ───

export const MASKING_SCRIPT = `
(function maskSensitiveData() {
  // 마스킹 패턴: [prefix regex, visible chars, replacement]
  const patterns = [
    // Google Client ID: 123456789-ab...apps.googleusercontent.com
    { regex: /\\d{10,}-[a-z0-9]+\\.apps\\.googleusercontent\\.com/gi, keep: 12, suffix: '.apps.googleusercontent.com' },
    // Google Client Secret: GOCSPX-...
    { regex: /GOCSPX-[A-Za-z0-9_-]+/g, keep: 7, suffix: '' },
    // Kakao REST API Key (32 hex chars)
    { regex: /[a-f0-9]{32}/gi, keep: 10, suffix: '' },
    // Generic API key pattern (long alphanumeric)
    { regex: /[A-Za-z0-9_-]{20,}/g, keep: 8, suffix: '' },
  ];

  function maskText(text) {
    let result = text;
    for (const p of patterns) {
      result = result.replace(p.regex, (match) => {
        const visible = match.substring(0, p.keep);
        return visible + '\\u2022'.repeat(Math.min(12, match.length - p.keep)) + p.suffix;
      });
    }
    return result;
  }

  // 모든 input/textarea 값 마스킹
  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.value && el.value.length > 16) {
      const masked = maskText(el.value);
      if (masked !== el.value) {
        el.value = masked;
        el.style.color = el.style.color || 'inherit';
      }
    }
  });

  // 텍스트 노드 마스킹 (코드 블록, 키 표시 영역)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent && node.textContent.length > 16) {
      const masked = maskText(node.textContent);
      if (masked !== node.textContent) {
        node.textContent = masked;
      }
    }
  }
})();
`;

// ─── MCP Playwright 워크플로우 가이드 ───
// Claude Code에서 아래 순서로 MCP 도구를 호출합니다:
//
// 1. browser_navigate({ url: target.url })
// 2. (사용자 로그인 대기 — "로그인 완료" 메시지 기다림)
// 3. browser_wait_for({ selector: target.waitForSelector })
// 4. browser_evaluate({ javascript: MASKING_SCRIPT })   ← 키 마스킹
// 5. browser_take_screenshot({ ... })                    ← 캡처
// 6. 파일을 public/img/guides/auth/{provider}/ 에 저장
//
// 반복: 다음 target으로 이동
