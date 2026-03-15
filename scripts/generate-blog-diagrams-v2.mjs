/**
 * 블로그 도식 이미지 V2 — 나머지 11편용 12개 도식
 * node scripts/generate-blog-diagrams-v2.mjs
 */
import satori from 'satori';
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'blog', 'diagrams');

async function loadFont() {
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap';
  const cssRes = await fetch(cssUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 11.0)' } });
  const css = await cssRes.text();
  const urls = [...css.matchAll(/url\(([^)]+)\)\s+format/g)].map((m) => m[1]);
  if (urls.length > 0) { const r = await fetch(urls[0]); if (r.ok) return await r.arrayBuffer(); }
  const r = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.ttf');
  return await r.arrayBuffer();
}

// ─── Helpers ───
const T = (text, size = 18, color = '#1f2937', extra = {}) => ({ type: 'div', props: { style: { fontSize: `${size}px`, fontWeight: 700, color, textAlign: 'center', lineHeight: 1.3, ...extra }, children: text } });
const Box = (text, color, bg, sub, w = '120px') => ({ type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: bg, border: `2px solid ${color}`, borderRadius: '12px', padding: '10px 14px', width: w, gap: '3px' }, children: [T(text, 14, color), sub ? T(sub, 10, '#6b7280') : null].filter(Boolean) } });
const Arr = (d = 'right', c = '#9ca3af') => ({ type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: d === 'down' ? '2px 0' : '0 2px' }, children: [T(d === 'down' ? '▼' : '▶', 16, c)] } });
const Stat = (value, label, color) => ({ type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${color}10`, border: `2px solid ${color}30`, borderRadius: '14px', padding: '14px 10px', width: '140px', gap: '4px' }, children: [T(value, 28, color), T(label, 11, '#4b5563', { whiteSpace: 'pre-wrap' })] } });
const Badge = (text, color, bg) => ({ type: 'div', props: { style: { fontSize: '11px', fontWeight: 700, color, background: bg, padding: '3px 10px', borderRadius: '20px' }, children: text } });
const Step = (num, text, sub, color) => ({ type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${color}10`, border: `2px solid ${color}40`, borderRadius: '14px', padding: '10px', width: '130px', gap: '4px' }, children: [{ type: 'div', props: { style: { width: '24px', height: '24px', borderRadius: '50%', background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }, children: num } }, T(text, 13, color), T(sub, 10, '#6b7280')] } });
const Title = (text) => T(text, 18, '#1f2937', { marginBottom: '14px' });
const wrap = (w, h, children) => ({ type: 'div', props: { style: { display: 'flex', flexDirection: 'column', width: `${w}px`, height: `${h}px`, background: '#ffffff', padding: '28px', fontFamily: 'NotoSansKR' }, children } });

// ─── Diagrams ───

// 1. #13 env-file-exposure-crisis — Unit 42 공격 규모
function envLeakCampaignScale() {
  return { name: 'env-leak-campaign-scale', width: 800, height: 300, element: wrap(800, 300, [
    Title('Unit 42 추적: 클라우드 갈취 캠페인 규모'),
    { type: 'div', props: { style: { display: 'flex', gap: '14px', justifyContent: 'center', flex: 1, alignItems: 'center' }, children: [
      Stat('2.3억', 'IP 스캔\n타겟 수', '#dc2626'),
      Stat('11만', '도메인\n대상', '#ea580c'),
      Stat('9만+', '환경변수\n탈취', '#d97706'),
      Stat('1,185', 'AWS 키\n탈취', '#2563eb'),
      Stat('333', 'PayPal\n토큰', '#7c3aed'),
    ] } },
    T('출처: Palo Alto Unit 42 Cloud Extortion Report', 11, '#9ca3af', { marginTop: '6px' }),
  ]) };
}

// 2. #13 — 시크릿 관리 진화 3단계
function secretManagementEvolution() {
  return { name: 'secret-management-evolution', width: 800, height: 280, element: wrap(800, 280, [
    Title('시크릿 관리의 3단계 진화'),
    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 }, children: [
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '14px', padding: '14px', width: '200px', gap: '6px' }, children: [
        Badge('1단계', '#dc2626', '#fee2e2'), T('.env 파일', 16, '#dc2626'), T('평문 저장 · 암호화 없음\n팀 공유 어려움 · 감사 불가', 11, '#6b7280', { whiteSpace: 'pre-wrap' })
      ] } },
      Arr('right', '#d1d5db'),
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '14px', padding: '14px', width: '200px', gap: '6px' }, children: [
        Badge('2단계', '#d97706', '#fef3c7'), T('플랫폼 네이티브', 16, '#d97706'), T('Vercel · Cloudflare 설정\n환경별 분리 · 마스킹', 11, '#6b7280', { whiteSpace: 'pre-wrap' })
      ] } },
      Arr('right', '#d1d5db'),
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ecfdf5', border: '2px solid #86efac', borderRadius: '14px', padding: '14px', width: '200px', gap: '6px' }, children: [
        Badge('3단계', '#16a34a', '#dcfce7'), T('전용 관리 플랫폼', 16, '#16a34a'), T('AES-256-GCM · RBAC\n감사 로그 · 자동 동기화', 11, '#6b7280', { whiteSpace: 'pre-wrap' })
      ] } },
    ] } },
  ]) };
}

// 3. #8 MSA — 장애 전파 캐스케이드
function cascadeFailurePropagation() {
  const nodes = [
    { text: '외부 결제 API', sub: '타임아웃', color: '#dc2626' },
    { text: 'payment-service', sub: '응답 지연', color: '#ea580c' },
    { text: 'order-service', sub: '스레드 포화', color: '#d97706' },
    { text: 'api-gateway', sub: '503 에러', color: '#b45309' },
    { text: '사용자 홈화면', sub: '전체 장애', color: '#991b1b' },
  ];
  return { name: 'cascade-failure-propagation', width: 800, height: 280, element: wrap(800, 280, [
    Title('마이크로서비스 장애 전파 — 캐스케이드 시나리오'),
    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flex: 1 }, children: nodes.flatMap((n, i) => [
      Box(n.text, n.color, `${n.color}10`, n.sub, '125px'),
      i < nodes.length - 1 ? Arr('right', '#dc2626') : null
    ]).filter(Boolean) } },
    T('하나의 외부 API 장애가 전체 시스템으로 연쇄 전파 — 서비스맵으로 의존성을 사전에 파악해야 합니다', 11, '#9ca3af', { marginTop: '6px' }),
  ]) };
}

// 4. #9 Doppler vs Infisical vs Linkmap — 선택 플로우
function toolSelectionFlowchart() {
  return { name: 'tool-selection-flowchart', width: 800, height: 360, element: wrap(800, 360, [
    Title('환경변수 관리 도구 선택 가이드'),
    { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }, children: [
      Box('DevOps 팀이 있고\n엔터프라이즈 규모인가?', '#6b7280', '#f9fafb', '', '300px'),
      { type: 'div', props: { style: { display: 'flex', gap: '40px', alignItems: 'flex-start' }, children: [
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }, children: [
          Badge('YES', '#16a34a', '#dcfce7'),
          Box('데이터를 자체 서버에\n보관해야 하는가?', '#6b7280', '#f9fafb', '', '220px'),
          { type: 'div', props: { style: { display: 'flex', gap: '20px' }, children: [
            { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }, children: [Badge('YES', '#16a34a', '#dcfce7'), Box('Infisical', '#7c3aed', '#f5f3ff', '오픈소스 · 셀프호스팅', '130px')] } },
            { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }, children: [Badge('NO', '#dc2626', '#fef2f2'), Box('Doppler', '#2563eb', '#eff6ff', '완전 관리형 SaaS', '130px')] } },
          ] } },
        ] } },
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }, children: [
          Badge('NO', '#dc2626', '#fef2f2'),
          Box('Linkmap', '#059669', '#ecfdf5', '시각화 · 한국어 · 무료', '180px'),
          T('인디 개발자 · 바이브 코더\n소규모 팀에 최적', 11, '#6b7280', { whiteSpace: 'pre-wrap' }),
        ] } },
      ] } },
    ] } },
  ]) };
}

// 5. #7 API 키 유출 — 5단계 대응 타임라인
function incidentResponseTimeline() {
  const steps = [
    { num: '1', text: '즉시 키 폐기', sub: '0~5분', color: '#dc2626' },
    { num: '2', text: '사용 로그 점검', sub: '5~15분', color: '#ea580c' },
    { num: '3', text: 'Git 히스토리 정리', sub: '15~30분', color: '#d97706' },
    { num: '4', text: '새 키 배포', sub: '30~60분', color: '#059669' },
    { num: '5', text: '원인 분석 공유', sub: '1~24시간', color: '#2563eb' },
  ];
  return { name: 'incident-response-timeline', width: 800, height: 260, element: wrap(800, 260, [
    Title('API 키 유출 — 5단계 긴급 대응 타임라인'),
    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flex: 1 }, children: steps.flatMap((s, i) => [
      Step(s.num, s.text, s.sub, s.color),
      i < steps.length - 1 ? Arr('right', '#d1d5db') : null
    ]).filter(Boolean) } },
    T('가장 중요한 것: 삭제보다 교체가 먼저 — 키를 폐기하고 새 키를 발급하세요', 11, '#9ca3af', { marginTop: '4px' }),
  ]) };
}

// 6. #16 체크리스트 — 취약점 패턴 차트
function vulnerabilityPatternsChart() {
  const items = [
    { label: 'XSS 방어 누락', pct: 86, color: '#dc2626' },
    { label: '인증 없는 API', pct: 50, color: '#ea580c' },
    { label: 'SQL 인젝션', pct: 20, color: '#d97706' },
    { label: '환경변수 노출', pct: 30, color: '#7c3aed' },
    { label: 'RLS 미설정', pct: 10, color: '#2563eb' },
  ];
  return { name: 'vulnerability-patterns-chart', width: 800, height: 320, element: wrap(800, 320, [
    Title('바이브 코딩 앱 — 가장 흔한 취약점 5가지'),
    { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'center', padding: '0 40px' }, children: items.map((item) => ({
      type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [
        T(item.label, 13, '#374151', { width: '120px', textAlign: 'right' }),
        { type: 'div', props: { style: { flex: 1, height: '28px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden', position: 'relative', display: 'flex' }, children: [
          { type: 'div', props: { style: { width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px' }, children: [
            T(`${item.pct}%`, 12, 'white'),
          ] } },
        ] } },
      ] }
    })) } },
    T('출처: Invicti 2025 — 바이브 코딩 앱 15개, 취약점 69개 분석', 11, '#9ca3af'),
  ]) };
}

// 7. #1 what-is-vibe-coding — 워크플로 3단계
function vibeCodingWorkflow() {
  return { name: 'vibe-coding-workflow', width: 800, height: 280, element: wrap(800, 280, [
    Title('바이브 코딩 워크플로 3단계'),
    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flex: 1 }, children: [
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#eff6ff', border: '2px solid #2563eb', borderRadius: '16px', padding: '16px', width: '200px', gap: '6px' }, children: [
        T('1단계', 12, '#2563eb'), T('AI에게 설명', 20, '#2563eb'), T('"로그인이 있는\nSaaS를 만들어줘"', 11, '#6b7280', { whiteSpace: 'pre-wrap' })
      ] } },
      Arr('right', '#d1d5db'),
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f5f3ff', border: '2px solid #7c3aed', borderRadius: '16px', padding: '16px', width: '200px', gap: '6px' }, children: [
        T('2단계', 12, '#7c3aed'), T('AI가 코드 생성', 20, '#7c3aed'), T('Next.js + Supabase\n+ Tailwind 코드 완성', 11, '#6b7280', { whiteSpace: 'pre-wrap' })
      ] } },
      Arr('right', '#d1d5db'),
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ecfdf5', border: '2px solid #059669', borderRadius: '16px', padding: '16px', width: '200px', gap: '6px' }, children: [
        T('3단계', 12, '#059669'), T('서비스 연결', 20, '#059669'), T('API 키 · 환경변수\n배포 설정 (직접!)', 11, '#6b7280', { whiteSpace: 'pre-wrap' })
      ] } },
    ] } },
    T('1~2단계는 AI가 처리하지만, 3단계 서비스 연결은 개발자가 직접 해야 합니다', 11, '#9ca3af', { marginTop: '4px' }),
  ]) };
}

// 8. #2 why-dotenv-is-dangerous — .env vs Linkmap 비교
function envVsLinkmapComparison() {
  const items = [
    { label: '암호화', env: '없음 (평문)', lm: 'AES-256-GCM' },
    { label: '접근 제어', env: '없음', lm: 'RBAC' },
    { label: '감사 로그', env: '없음', lm: '전체 기록' },
    { label: '자동 동기화', env: '수동 복사', lm: 'GitHub Secrets' },
    { label: '팀 공유', env: '카톡 / 슬랙', lm: '초대 링크' },
    { label: '시각화', env: '없음', lm: '서비스맵' },
  ];
  return { name: 'env-vs-linkmap-comparison', width: 800, height: 340, element: wrap(800, 340, [
    Title('.env 파일 vs 전용 관리 도구 — 무엇이 다른가'),
    { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center', padding: '0 30px' }, children: [
      // Header
      { type: 'div', props: { style: { display: 'flex', gap: '8px', marginBottom: '4px' }, children: [
        T('항목', 12, '#6b7280', { width: '100px', textAlign: 'left' }),
        { type: 'div', props: { style: { flex: 1, display: 'flex', justifyContent: 'center' }, children: [Badge('.env 파일', '#dc2626', '#fef2f2')] } },
        { type: 'div', props: { style: { flex: 1, display: 'flex', justifyContent: 'center' }, children: [Badge('Linkmap', '#059669', '#ecfdf5')] } },
      ] } },
      ...items.map((item) => ({
        type: 'div', props: { style: { display: 'flex', gap: '8px', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }, children: [
          T(item.label, 12, '#374151', { width: '100px', textAlign: 'left' }),
          { type: 'div', props: { style: { flex: 1, display: 'flex', justifyContent: 'center' }, children: [T(item.env, 12, '#dc2626')] } },
          { type: 'div', props: { style: { flex: 1, display: 'flex', justifyContent: 'center' }, children: [T(item.lm, 12, '#059669')] } },
        ] }
      })),
    ] } },
  ]) };
}

// 9. #3 vibe-coding-can-you-build-saas — AI 능력 매트릭스
function aiCapabilityMatrix() {
  const good = [
    { text: 'UI 컴포넌트', sub: 'React, Tailwind' },
    { text: 'CRUD API', sub: 'REST, GraphQL' },
    { text: '디버깅', sub: '에러 해석, 수정 제안' },
  ];
  const bad = [
    { text: '서비스 연결', sub: 'API 키, OAuth 설정' },
    { text: '보안 설정', sub: 'RLS, 인증 흐름' },
    { text: '인프라 운영', sub: '배포, 모니터링' },
  ];
  return { name: 'ai-capability-matrix', width: 800, height: 340, element: wrap(800, 340, [
    Title('바이브 코딩 — AI가 잘하는 것 vs 직접 해야 할 것'),
    { type: 'div', props: { style: { display: 'flex', gap: '20px', flex: 1, justifyContent: 'center' }, children: [
      { type: 'div', props: { style: { flex: 1, background: '#ecfdf5', border: '2px solid #86efac', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }, children: [
        Badge('AI가 잘하는 것', '#059669', '#dcfce7'),
        ...good.map((g) => Box(g.text, '#059669', '#f0fdf4', g.sub, '100%'))
      ] } },
      { type: 'div', props: { style: { flex: 1, background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }, children: [
        Badge('직접 해야 할 것', '#dc2626', '#fee2e2'),
        ...bad.map((b) => Box(b.text, '#dc2626', '#fff1f2', b.sub, '100%'))
      ] } },
    ] } },
  ]) };
}

// 10. #6 github-secrets-automation — 수동 vs 자동 비교
function manualVsAutoSecrets() {
  return { name: 'manual-vs-auto-secrets', width: 800, height: 360, element: wrap(800, 360, [
    Title('GitHub Secrets — 수동 관리 vs Linkmap 자동화'),
    { type: 'div', props: { style: { display: 'flex', gap: '20px', flex: 1 }, children: [
      // Manual
      { type: 'div', props: { style: { flex: 1, background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }, children: [
        Badge('수동 관리', '#dc2626', '#fee2e2'),
        Box('Settings → Secrets', '#dc2626', '#fff1f2', '', '180px'),
        Arr('down', '#dc2626'),
        Box('변수 하나씩 입력', '#dc2626', '#fff1f2', '×10개 반복', '180px'),
        Arr('down', '#dc2626'),
        Box('변경 시 다시 수동', '#dc2626', '#fff1f2', '누락 → 배포 실패', '180px'),
      ] } },
      // Auto
      { type: 'div', props: { style: { flex: 1, background: '#ecfdf5', border: '2px solid #86efac', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }, children: [
        Badge('Linkmap 자동화', '#059669', '#dcfce7'),
        Box('Linkmap에서 저장', '#059669', '#f0fdf4', 'AES-256-GCM 암호화', '180px'),
        Arr('down', '#059669'),
        Box('GitHub 동기화 클릭', '#059669', '#f0fdf4', '1클릭 자동 배포', '180px'),
        Arr('down', '#059669'),
        Box('항상 최신 상태', '#059669', '#f0fdf4', '변경 시 자동 반영', '180px'),
      ] } },
    ] } },
  ]) };
}

// 11. #5 dotenv-safe-management-tips — NEXT_PUBLIC 보안 레벨
function nextPublicSecurityLevels() {
  return { name: 'next-public-security-levels', width: 800, height: 300, element: wrap(800, 300, [
    Title('NEXT_PUBLIC_ 접두사 — 공개 vs 비공개 환경변수'),
    { type: 'div', props: { style: { display: 'flex', gap: '20px', flex: 1, justifyContent: 'center', alignItems: 'center' }, children: [
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ecfdf5', border: '2px solid #86efac', borderRadius: '16px', padding: '16px', width: '320px', gap: '8px' }, children: [
        Badge('공개 가능 (브라우저 노출)', '#059669', '#dcfce7'),
        Box('NEXT_PUBLIC_SUPABASE_URL', '#059669', '#f0fdf4', '', '280px'),
        Box('NEXT_PUBLIC_SUPABASE_ANON_KEY', '#059669', '#f0fdf4', '', '280px'),
      ] } },
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '16px', padding: '16px', width: '320px', gap: '8px' }, children: [
        Badge('절대 공개 금지 (서버 전용)', '#dc2626', '#fee2e2'),
        Box('SUPABASE_SERVICE_ROLE_KEY', '#dc2626', '#fff1f2', '', '280px'),
        Box('OPENAI_API_KEY', '#dc2626', '#fff1f2', '', '280px'),
        Box('STRIPE_SECRET_KEY', '#dc2626', '#fff1f2', '', '280px'),
      ] } },
    ] } },
  ]) };
}

// 12. #4 service-map-tutorial — 서비스맵 예시
function serviceMapExample() {
  const services = [
    { text: 'Supabase', color: '#059669', x: 0, y: 0 },
    { text: 'Vercel', color: '#000000', x: 1, y: 0 },
    { text: 'OpenAI', color: '#2563eb', x: 2, y: 0 },
    { text: 'Stripe', color: '#7c3aed', x: 0, y: 1 },
    { text: 'Resend', color: '#ea580c', x: 1, y: 1 },
    { text: 'PostHog', color: '#dc2626', x: 2, y: 1 },
  ];
  return { name: 'service-map-example', width: 800, height: 340, element: wrap(800, 340, [
    Title('프로젝트의 외부 서비스 연결 — 서비스맵으로 시각화'),
    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flex: 1 }, children: [
      // Center: My Project
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }, children: [
        { type: 'div', props: { style: { background: '#1f2937', color: 'white', borderRadius: '16px', padding: '16px 24px', fontSize: '16px', fontWeight: 700 }, children: 'My Project' } },
        T('환경변수 18개 · 서비스 6개', 11, '#6b7280'),
      ] } },
      // Right: Services grid
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '10px' }, children: [
        { type: 'div', props: { style: { display: 'flex', gap: '10px' }, children: services.slice(0, 3).map((s) => Box(s.text, s.color, `${s.color}10`, '', '110px')) } },
        { type: 'div', props: { style: { display: 'flex', gap: '10px' }, children: services.slice(3, 6).map((s) => Box(s.text, s.color, `${s.color}10`, '', '110px')) } },
      ] } },
    ] } },
    T('각 서비스별 API 키가 어디서 사용되는지 서비스맵으로 한눈에 파악', 11, '#9ca3af', { marginTop: '4px' }),
  ]) };
}

// ─── Generate All ───
async function renderDiagram(d, fontData) {
  const svg = await satori(d.element, { width: d.width, height: d.height, fonts: [{ name: 'NotoSansKR', data: fontData, weight: 700, style: 'normal' }] });
  const outPath = join(OUT_DIR, `${d.name}.png`);
  await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outPath);
  return outPath;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  console.log('📦 폰트 로딩 중...');
  const fontData = await loadFont();
  console.log('✅ 폰트 로드 완료\n');
  const diagrams = [
    envLeakCampaignScale(), secretManagementEvolution(), cascadeFailurePropagation(),
    toolSelectionFlowchart(), incidentResponseTimeline(), vulnerabilityPatternsChart(),
    vibeCodingWorkflow(), envVsLinkmapComparison(), aiCapabilityMatrix(),
    manualVsAutoSecrets(), nextPublicSecurityLevels(), serviceMapExample(),
  ];
  console.log(`🎨 도식 이미지 ${diagrams.length}장 생성 시작...\n`);
  for (const d of diagrams) {
    try { await renderDiagram(d, fontData); console.log(`  ✅ ${d.name}.png (${d.width}x${d.height})`); }
    catch (err) { console.error(`  ❌ ${d.name}: ${err.message}`); }
  }
  console.log(`\n🎉 완료! ${OUT_DIR}`);
}
main().catch(console.error);
