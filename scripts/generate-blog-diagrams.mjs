/**
 * 블로그 도식 이미지 생성 스크립트
 * satori + sharp (OG 이미지와 동일한 파이프라인)
 *
 * 사용법: node scripts/generate-blog-diagrams.mjs
 * 출력: public/blog/diagrams/*.png (800x450)
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
  const cssRes = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 11.0)' },
  });
  const css = await cssRes.text();
  const urls = [...css.matchAll(/url\(([^)]+)\)\s+format/g)].map((m) => m[1]);

  if (urls.length > 0) {
    const res = await fetch(urls[0]);
    if (res.ok) return await res.arrayBuffer();
  }
  const ttfUrl = 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.ttf';
  const res = await fetch(ttfUrl);
  return await res.arrayBuffer();
}

// ─── Helper: Box component ───
function Box({ text, color = '#2563eb', bg = '#eff6ff', width = 'auto', icon = '', sub = '' }) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: bg,
        border: `2px solid ${color}`,
        borderRadius: '12px',
        padding: '12px 20px',
        minWidth: width,
        gap: '4px',
      },
      children: [
        icon ? { type: 'div', props: { style: { fontSize: '20px' }, children: icon } } : null,
        { type: 'div', props: { style: { fontSize: '15px', fontWeight: 700, color, textAlign: 'center', lineHeight: 1.3 }, children: text } },
        sub ? { type: 'div', props: { style: { fontSize: '11px', color: '#6b7280', textAlign: 'center' }, children: sub } } : null,
      ].filter(Boolean),
    },
  };
}

function Arrow({ direction = 'right', color = '#9ca3af', label = '' }) {
  const isDown = direction === 'down';
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: isDown ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        padding: isDown ? '4px 0' : '0 4px',
      },
      children: [
        label ? { type: 'div', props: { style: { fontSize: '10px', color: '#6b7280' }, children: label } } : null,
        { type: 'div', props: { style: { fontSize: '18px', color }, children: isDown ? '▼' : '▶' } },
      ].filter(Boolean),
    },
  };
}

function DiagramTitle({ text }) {
  return {
    type: 'div',
    props: {
      style: { fontSize: '18px', fontWeight: 700, color: '#1f2937', textAlign: 'center', marginBottom: '16px' },
      children: text,
    },
  };
}

function Badge({ text, color = '#dc2626', bg = '#fef2f2' }) {
  return {
    type: 'div',
    props: {
      style: { fontSize: '11px', fontWeight: 700, color, background: bg, padding: '3px 10px', borderRadius: '20px' },
      children: text,
    },
  };
}

// ─── Diagram Definitions ───

// 1. RLS ON vs OFF 비교 (#11)
function rlsComparison() {
  return {
    name: 'rls-on-off-comparison',
    width: 800,
    height: 420,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '420px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: 'Supabase RLS ON vs OFF 비교' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: '24px', flex: 1 },
              children: [
                // LEFT: RLS OFF
                {
                  type: 'div',
                  props: {
                    style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '16px', padding: '20px', gap: '12px' },
                    children: [
                      { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [
                        Badge({ text: 'RLS OFF', color: '#dc2626', bg: '#fee2e2' }),
                        { type: 'div', props: { style: { fontSize: '13px', color: '#dc2626', fontWeight: 700 }, children: '위험' } },
                      ] } },
                      Box({ text: '브라우저 요청', color: '#6b7280', bg: '#f9fafb', icon: '🌐' }),
                      Arrow({ direction: 'down', color: '#dc2626' }),
                      Box({ text: 'anon key로 접근', color: '#dc2626', bg: '#fff1f2', sub: '인증 없이 통과' }),
                      Arrow({ direction: 'down', color: '#dc2626' }),
                      Box({ text: 'SELECT * FROM users', color: '#dc2626', bg: '#fff1f2', sub: '전체 데이터 노출' }),
                    ],
                  },
                },
                // RIGHT: RLS ON
                {
                  type: 'div',
                  props: {
                    style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '20px', gap: '12px' },
                    children: [
                      { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [
                        Badge({ text: 'RLS ON', color: '#16a34a', bg: '#dcfce7' }),
                        { type: 'div', props: { style: { fontSize: '13px', color: '#16a34a', fontWeight: 700 }, children: '안전' } },
                      ] } },
                      Box({ text: '브라우저 요청', color: '#6b7280', bg: '#f9fafb', icon: '🌐' }),
                      Arrow({ direction: 'down', color: '#16a34a' }),
                      Box({ text: 'JWT + auth.uid()', color: '#16a34a', bg: '#f0fdf4', sub: '인증된 사용자만' }),
                      Arrow({ direction: 'down', color: '#16a34a' }),
                      Box({ text: 'WHERE user_id = auth.uid()', color: '#16a34a', bg: '#f0fdf4', sub: '본인 데이터만 반환' }),
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  };
}

// 2. API 5단계 파이프라인 (#11, #12)
function api5StepPipeline() {
  const steps = [
    { text: 'getUser()', sub: '인증 확인', color: '#2563eb', bg: '#eff6ff', icon: '🔐' },
    { text: 'Zod safeParse', sub: '입력 검증', color: '#7c3aed', bg: '#f5f3ff', icon: '✅' },
    { text: '소유권 확인', sub: 'user_id 대조', color: '#0891b2', bg: '#ecfeff', icon: '👤' },
    { text: '비즈니스 로직', sub: '실제 처리', color: '#059669', bg: '#ecfdf5', icon: '⚙️' },
    { text: 'logAudit()', sub: '감사 로그', color: '#d97706', bg: '#fffbeb', icon: '📋' },
  ];
  return {
    name: 'api-5step-pipeline',
    width: 800,
    height: 280,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '280px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: 'API 라우트 보안 5단계 패턴' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flex: 1 },
              children: steps.flatMap((s, i) => [
                Box({ text: s.text, sub: s.sub, color: s.color, bg: s.bg, icon: s.icon, width: '120px' }),
                i < steps.length - 1 ? Arrow({ direction: 'right', color: '#d1d5db' }) : null,
              ]).filter(Boolean),
            },
          },
          { type: 'div', props: { style: { fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }, children: '모든 API 라우트에 이 순서를 적용 — 하나라도 빠지면 보안 사각지대' } },
        ],
      },
    },
  };
}

// 3. 환경변수 분리 아키텍처 (#14)
function envSeparationArchitecture() {
  return {
    name: 'env-separation-architecture',
    width: 800,
    height: 400,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '400px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: '환경변수 분리 아키텍처 — AI 도구 컨텍스트 밖으로' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: '24px', flex: 1 },
              children: [
                // BAD
                {
                  type: 'div',
                  props: {
                    style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: '16px', padding: '20px', gap: '10px' },
                    children: [
                      Badge({ text: '위험한 구조', color: '#dc2626', bg: '#fee2e2' }),
                      Box({ text: 'my-project/', color: '#6b7280', bg: '#f9fafb', sub: 'AI 도구 작업 디렉토리' }),
                      { type: 'div', props: { style: { display: 'flex', gap: '8px', justifyContent: 'center' }, children: [
                        Box({ text: '.env', color: '#dc2626', bg: '#fff1f2', sub: 'AI가 읽음!' }),
                        Box({ text: 'src/', color: '#6b7280', bg: '#f9fafb' }),
                      ] } },
                      Arrow({ direction: 'down', color: '#dc2626', label: 'AI 컨텍스트에 포함' }),
                      Box({ text: 'LLM 추론', color: '#dc2626', bg: '#fff1f2', sub: '시크릿 노출 위험' }),
                    ],
                  },
                },
                // GOOD
                {
                  type: 'div',
                  props: {
                    style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '16px', padding: '20px', gap: '10px' },
                    children: [
                      Badge({ text: '안전한 구조', color: '#16a34a', bg: '#dcfce7' }),
                      Box({ text: 'my-project/', color: '#6b7280', bg: '#f9fafb', sub: 'AI 도구 작업 디렉토리' }),
                      { type: 'div', props: { style: { display: 'flex', gap: '8px', justifyContent: 'center' }, children: [
                        Box({ text: '.claudeignore', color: '#16a34a', bg: '#f0fdf4', sub: '.env* 제외' }),
                        Box({ text: 'src/', color: '#6b7280', bg: '#f9fafb' }),
                      ] } },
                      Arrow({ direction: 'down', color: '#16a34a', label: '시크릿 완전 분리' }),
                      Box({ text: 'Linkmap 암호화 저장소', color: '#16a34a', bg: '#ecfdf5', sub: 'AES-256-GCM + GitHub Secrets 동기화' }),
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  };
}

// 4. AI 코드 보안 통계 (#12)
function aiCodeSecurityStats() {
  const stats = [
    { label: 'AI 코드\n보안 결함', value: '45%', color: '#dc2626', bg: '#fef2f2' },
    { label: 'XSS\n방어 실패', value: '86%', color: '#ea580c', bg: '#fff7ed' },
    { label: 'SQL 인젝션\n취약점', value: '20%', color: '#d97706', bg: '#fffbeb' },
    { label: 'Java\n보안 실패', value: '70%+', color: '#dc2626', bg: '#fef2f2' },
    { label: '보안 이슈\n배수', value: '2.74x', color: '#7c3aed', bg: '#f5f3ff' },
  ];
  return {
    name: 'ai-code-security-stats',
    width: 800,
    height: 300,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '300px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: 'AI 생성 코드 보안 현실 — Veracode 2025 보고서' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: '16px', justifyContent: 'center', flex: 1, alignItems: 'center' },
              children: stats.map((s) => ({
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: s.bg, border: `2px solid ${s.color}30`, borderRadius: '16px', padding: '16px 12px', width: '130px', gap: '6px' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '32px', fontWeight: 700, color: s.color, lineHeight: 1 }, children: s.value } },
                    { type: 'div', props: { style: { fontSize: '12px', color: '#4b5563', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-wrap' }, children: s.label } },
                  ],
                },
              })),
            },
          },
          { type: 'div', props: { style: { fontSize: '11px', color: '#9ca3af', textAlign: 'center' }, children: '출처: Veracode GenAI Code Security Report 2025 (100+ LLM 분석)' } },
        ],
      },
    },
  };
}

// 5. 보안 검증 4단계 (#12)
function securityVerificationPipeline() {
  const steps = [
    { num: '1', text: '입력 검증', sub: 'Zod safeParse 필수', color: '#2563eb', bg: '#eff6ff' },
    { num: '2', text: '인증 + 소유권', sub: 'getUser() → user_id 대조', color: '#7c3aed', bg: '#f5f3ff' },
    { num: '3', text: 'RLS 이중 방어', sub: 'DB + API 레벨 이중 체크', color: '#059669', bg: '#ecfdf5' },
    { num: '4', text: '정적 분석 연동', sub: 'git-secrets, trufflehog', color: '#d97706', bg: '#fffbeb' },
  ];
  return {
    name: 'security-verification-pipeline',
    width: 800,
    height: 280,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '280px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: '바이브 코더의 보안 검증 파이프라인 4단계' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flex: 1 },
              children: steps.flatMap((s, i) => [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: s.bg, border: `2px solid ${s.color}`, borderRadius: '16px', padding: '16px', width: '160px', gap: '6px' },
                    children: [
                      { type: 'div', props: { style: { width: '28px', height: '28px', borderRadius: '50%', background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }, children: s.num } },
                      { type: 'div', props: { style: { fontSize: '15px', fontWeight: 700, color: s.color, textAlign: 'center' }, children: s.text } },
                      { type: 'div', props: { style: { fontSize: '11px', color: '#6b7280', textAlign: 'center' }, children: s.sub } },
                    ],
                  },
                },
                i < steps.length - 1 ? Arrow({ direction: 'right', color: '#d1d5db' }) : null,
              ]).filter(Boolean),
            },
          },
        ],
      },
    },
  };
}

// 6. AI 에이전트 .env 접근 경로 (#15)
function aiAgentEnvAccess() {
  return {
    name: 'ai-agent-env-access',
    width: 800,
    height: 380,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '380px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: 'AI 코딩 에이전트의 .env 파일 접근 경로' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flex: 1 },
              children: [
                Box({ text: '개발자', color: '#6b7280', bg: '#f9fafb', icon: '👨‍💻', sub: '"이 코드 분석해줘"' }),
                Arrow({ direction: 'right', color: '#d1d5db', label: '프롬프트' }),
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px dashed #f59e0b', borderRadius: '16px', padding: '16px', gap: '8px', background: '#fffbeb' },
                    children: [
                      Badge({ text: 'AI 에이전트 컨텍스트', color: '#d97706', bg: '#fef3c7' }),
                      { type: 'div', props: { style: { display: 'flex', gap: '8px' }, children: [
                        Box({ text: 'src/', color: '#6b7280', bg: '#f9fafb' }),
                        Box({ text: '.env', color: '#dc2626', bg: '#fff1f2', sub: '자동 로드!' }),
                        Box({ text: 'package.json', color: '#6b7280', bg: '#f9fafb' }),
                      ] } },
                    ],
                  },
                },
                Arrow({ direction: 'right', color: '#dc2626', label: '시크릿 포함' }),
                Box({ text: 'LLM API', color: '#dc2626', bg: '#fef2f2', icon: '☁️', sub: '외부 서버 전송' }),
              ],
            },
          },
          { type: 'div', props: { style: { display: 'flex', justifyContent: 'center', marginTop: '12px' }, children: [
            { type: 'div', props: { style: { fontSize: '12px', color: '#dc2626', background: '#fef2f2', padding: '6px 16px', borderRadius: '8px', border: '1px solid #fca5a5' }, children: '⚠️ .env의 API 키, DB 비밀번호가 AI 에이전트 컨텍스트를 통해 외부 서버로 전송될 수 있음' } },
          ] } },
        ],
      },
    },
  };
}

// 7. 시크릿 유출 통계 (#10)
function secretLeakStats() {
  const stats = [
    { label: 'GitHub 연간\n시크릿 유출', value: '2,380만', color: '#dc2626' },
    { label: 'AI 도구 사용 시\n유출률 증가', value: '+40%', color: '#ea580c' },
    { label: '유출 시크릿\n2년 후 활성', value: '70%', color: '#d97706' },
    { label: '교정\n평균 소요', value: '94일', color: '#7c3aed' },
  ];
  return {
    name: 'secret-leak-stats',
    width: 800,
    height: 280,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '280px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: '바이브 코딩 시대의 시크릿 유출 현실' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', gap: '20px', justifyContent: 'center', flex: 1, alignItems: 'center' },
              children: stats.map((s) => ({
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${s.color}08`, border: `2px solid ${s.color}30`, borderRadius: '16px', padding: '20px 16px', width: '160px', gap: '8px' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '28px', fontWeight: 700, color: s.color, lineHeight: 1 }, children: s.value } },
                    { type: 'div', props: { style: { fontSize: '12px', color: '#4b5563', textAlign: 'center', lineHeight: 1.4, whiteSpace: 'pre-wrap' }, children: s.label } },
                  ],
                },
              })),
            },
          },
          { type: 'div', props: { style: { fontSize: '11px', color: '#9ca3af', textAlign: 'center' }, children: '출처: GitGuardian, Knostic, GitHub 2025~2026' } },
        ],
      },
    },
  };
}

// 8. 시크릿 관리 5단계 (#10)
function secretManagement5Steps() {
  const steps = [
    { num: '1', text: '.env 제거', sub: '평문 파일 삭제', color: '#dc2626' },
    { num: '2', text: '암호화 저장', sub: 'AES-256-GCM', color: '#ea580c' },
    { num: '3', text: '접근 제어', sub: 'RBAC + 감사 로그', color: '#d97706' },
    { num: '4', text: '자동 동기화', sub: 'GitHub Secrets', color: '#059669' },
    { num: '5', text: '사전 탐지', sub: 'Pre-commit 훅', color: '#2563eb' },
  ];
  return {
    name: 'secret-management-5steps',
    width: 800,
    height: 260,
    element: {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '800px', height: '260px', background: '#ffffff', padding: '30px', fontFamily: 'NotoSansKR' },
        children: [
          DiagramTitle({ text: '바이브 코더를 위한 시크릿 관리 5단계' }),
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flex: 1 },
              children: steps.flatMap((s, i) => [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${s.color}10`, border: `2px solid ${s.color}40`, borderRadius: '14px', padding: '12px', width: '125px', gap: '4px' },
                    children: [
                      { type: 'div', props: { style: { width: '26px', height: '26px', borderRadius: '50%', background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }, children: s.num } },
                      { type: 'div', props: { style: { fontSize: '14px', fontWeight: 700, color: s.color }, children: s.text } },
                      { type: 'div', props: { style: { fontSize: '11px', color: '#6b7280', textAlign: 'center' }, children: s.sub } },
                    ],
                  },
                },
                i < steps.length - 1 ? Arrow({ direction: 'right', color: '#d1d5db' }) : null,
              ]).filter(Boolean),
            },
          },
        ],
      },
    },
  };
}

// ─── Generate All ───
async function renderDiagram(diagram, fontData) {
  const svg = await satori(diagram.element, {
    width: diagram.width,
    height: diagram.height,
    fonts: [{ name: 'NotoSansKR', data: fontData, weight: 700, style: 'normal' }],
  });
  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
  const outPath = join(OUT_DIR, `${diagram.name}.png`);
  await sharp(png).toFile(outPath);
  return outPath;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  console.log('📦 폰트 로딩 중...');
  const fontData = await loadFont();
  console.log('✅ 폰트 로드 완료\n');

  const diagrams = [
    rlsComparison(),
    api5StepPipeline(),
    envSeparationArchitecture(),
    aiCodeSecurityStats(),
    securityVerificationPipeline(),
    aiAgentEnvAccess(),
    secretLeakStats(),
    secretManagement5Steps(),
  ];

  console.log(`🎨 도식 이미지 ${diagrams.length}장 생성 시작...\n`);

  for (const d of diagrams) {
    try {
      await renderDiagram(d, fontData);
      console.log(`  ✅ ${d.name}.png (${d.width}x${d.height})`);
    } catch (err) {
      console.error(`  ❌ ${d.name}: ${err.message}`);
    }
  }

  console.log(`\n🎉 완료! ${OUT_DIR}`);
}

main().catch(console.error);
