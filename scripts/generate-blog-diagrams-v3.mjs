/**
 * 블로그 도식 V3 — ASCII 코드블록 대체용 4개
 * node scripts/generate-blog-diagrams-v3.mjs
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

const T = (text, size = 14, color = '#1f2937', extra = {}) => ({ type: 'div', props: { style: { fontSize: `${size}px`, fontWeight: 700, color, textAlign: 'center', lineHeight: 1.3, ...extra }, children: text } });
const Badge = (text, color, bg) => ({ type: 'div', props: { style: { fontSize: '11px', fontWeight: 700, color, background: bg, padding: '3px 10px', borderRadius: '20px', display: 'flex' }, children: text } });
const Arr = () => ({ type: 'div', props: { style: { fontSize: '20px', color: '#9ca3af', display: 'flex', alignItems: 'center' }, children: '▶' } });
const Title = (text) => T(text, 18, '#1f2937', { marginBottom: '14px' });
const wrap = (w, h, children) => ({ type: 'div', props: { style: { display: 'flex', flexDirection: 'column', width: `${w}px`, height: `${h}px`, background: '#ffffff', padding: '28px', fontFamily: 'NotoSansKR' }, children } });

// 1. what-is-vibe-coding — 코드 영역 vs 인프라 영역 아키텍처
function vibeCodingArchitecture() {
  return { name: 'vibe-coding-architecture', width: 800, height: 320, element: wrap(800, 320, [
    Title('바이브 코딩 워크플로 — 코드 영역 vs 인프라 영역'),
    { type: 'div', props: { style: { display: 'flex', gap: '20px', flex: 1, justifyContent: 'center', alignItems: 'center' }, children: [
      // 코드 영역
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#eff6ff', border: '2px solid #2563eb', borderRadius: '16px', padding: '20px', width: '280px', gap: '10px' }, children: [
        Badge('AI 에디터 (Cursor / Claude)', '#2563eb', '#dbeafe'),
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }, children: [
          { type: 'div', props: { style: { background: '#dbeafe', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#2563eb', textAlign: 'center' }, children: '코드 생성' } },
          { type: 'div', props: { style: { background: '#dbeafe', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#2563eb', textAlign: 'center' }, children: '컴포넌트 작성' } },
          { type: 'div', props: { style: { background: '#dbeafe', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#2563eb', textAlign: 'center' }, children: 'API 라우트' } },
          { type: 'div', props: { style: { background: '#dbeafe', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#2563eb', textAlign: 'center' }, children: '테스트 코드' } },
        ] } },
        T('코드 영역', 12, '#6b7280'),
      ] } },
      Arr(),
      // 인프라 영역
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ecfdf5', border: '2px solid #059669', borderRadius: '16px', padding: '20px', width: '280px', gap: '10px' }, children: [
        Badge('Linkmap (linkmap.biz)', '#059669', '#dcfce7'),
        { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }, children: [
          { type: 'div', props: { style: { background: '#dcfce7', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#059669', textAlign: 'center' }, children: '서비스 연결 관리' } },
          { type: 'div', props: { style: { background: '#dcfce7', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#059669', textAlign: 'center' }, children: '환경변수 암호화 저장' } },
          { type: 'div', props: { style: { background: '#dcfce7', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#059669', textAlign: 'center' }, children: 'GitHub Secrets 동기화' } },
          { type: 'div', props: { style: { background: '#dcfce7', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', fontWeight: 700, color: '#059669', textAlign: 'center' }, children: '서비스맵 시각화' } },
        ] } },
        T('인프라 영역', 12, '#6b7280'),
      ] } },
    ] } },
  ]) };
}

// 2. vibe-coding-can-you-build-saas — Linkmap 규모 인포그래픽
function linkmapSaasScale() {
  const codeItems = [
    { value: '70+', label: 'DB 마이그레이션' },
    { value: '45+', label: 'API 라우트' },
    { value: '128', label: '서비스 카탈로그' },
    { value: '102+', label: '테스트 케이스' },
    { value: '10', label: '교육 가이드' },
    { value: '6', label: '배포 템플릿' },
  ];
  const infraItems = [
    { text: 'Cloudflare Workers', color: '#f59e0b' },
    { text: 'Supabase (DB + Auth)', color: '#059669' },
    { text: 'GitHub 연동 (13 모듈)', color: '#1f2937' },
    { text: 'AES-256-GCM 암호화', color: '#dc2626' },
    { text: '원클릭 배포 시스템', color: '#2563eb' },
  ];
  return { name: 'linkmap-saas-scale', width: 800, height: 340, element: wrap(800, 340, [
    Title('Linkmap 현재 규모 — 바이브 코딩으로 구축'),
    { type: 'div', props: { style: { display: 'flex', gap: '20px', flex: 1 }, children: [
      // 코드베이스
      { type: 'div', props: { style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#eff6ff', border: '2px solid #bfdbfe', borderRadius: '14px', padding: '14px', gap: '6px' }, children: [
        Badge('코드베이스', '#2563eb', '#dbeafe'),
        ...codeItems.map((item) => ({
          type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }, children: [
            { type: 'div', props: { style: { fontSize: '18px', fontWeight: 700, color: '#2563eb', width: '50px', textAlign: 'right' }, children: item.value } },
            T(item.label, 12, '#374151', { textAlign: 'left' }),
          ] }
        })),
      ] } },
      // 인프라
      { type: 'div', props: { style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#ecfdf5', border: '2px solid #bbf7d0', borderRadius: '14px', padding: '14px', gap: '6px' }, children: [
        Badge('인프라', '#059669', '#dcfce7'),
        ...infraItems.map((item) => ({
          type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '8px', background: `${item.color}10`, borderRadius: '8px', padding: '8px 12px' }, children: [
            { type: 'div', props: { style: { width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }, children: ' ' } },
            T(item.text, 12, '#374151', { textAlign: 'left' }),
          ] }
        })),
      ] } },
    ] } },
  ]) };
}

// 3. service-map-tutorial — 내 앱의 서비스 연결 (트리 대체)
function serviceConnectionTree() {
  const services = [
    { name: 'Supabase', sub: 'DB + Auth', color: '#059669', vars: 3 },
    { name: 'Vercel', sub: '배포', color: '#000000', vars: 2 },
    { name: 'OpenAI', sub: 'AI 기능', color: '#2563eb', vars: 2 },
    { name: 'Stripe', sub: '결제', color: '#7c3aed', vars: 4 },
    { name: 'Resend', sub: '이메일', color: '#ea580c', vars: 2 },
    { name: 'PostHog', sub: '분석', color: '#dc2626', vars: 5 },
  ];
  return { name: 'service-connection-tree', width: 800, height: 340, element: wrap(800, 340, [
    Title('내 프로젝트의 외부 서비스 연결'),
    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flex: 1 }, children: [
      // 내 앱
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }, children: [
        { type: 'div', props: { style: { background: '#1f2937', color: 'white', borderRadius: '14px', padding: '14px 20px', fontSize: '16px', fontWeight: 700 }, children: '내 앱' } },
        { type: 'div', props: { style: { display: 'flex', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '6px 12px' }, children: [T('환경변수 18개', 11, '#dc2626')] } },
        { type: 'div', props: { style: { display: 'flex', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '6px 12px' }, children: [T('각각 다른 대시보드', 11, '#d97706')] } },
      ] } },
      // 연결선
      { type: 'div', props: { style: { display: 'flex', alignItems: 'center', fontSize: '24px', color: '#d1d5db' }, children: '▶' } },
      // 서비스 그리드
      { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '6px' }, children: [
        { type: 'div', props: { style: { display: 'flex', gap: '6px' }, children: services.slice(0, 3).map((s) => ({
          type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${s.color}08`, border: `2px solid ${s.color}30`, borderRadius: '10px', padding: '10px', width: '120px', gap: '2px' }, children: [
            T(s.name, 14, s.color), T(s.sub, 10, '#6b7280'),
          ] }
        })) } },
        { type: 'div', props: { style: { display: 'flex', gap: '6px' }, children: services.slice(3, 6).map((s) => ({
          type: 'div', props: { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: `${s.color}08`, border: `2px solid ${s.color}30`, borderRadius: '10px', padding: '10px', width: '120px', gap: '2px' }, children: [
            T(s.name, 14, s.color), T(s.sub, 10, '#6b7280'),
          ] }
        })) } },
      ] } },
    ] } },
    T('전체 구조가 머릿속에만 있음 → 서비스맵으로 시각화하면 한눈에 파악 가능', 11, '#9ca3af', { marginTop: '4px' }),
  ]) };
}

// 4. vibe-coding-can-you-build-saas — AI 잘하는 것 vs 못하는 것 (테이블 대체)
// 이미 ai-capability-matrix.png가 있으므로 스킵, 대신 추천 스택 도식 생성

// 4. vibe-coding-can-you-build-saas — 추천 스택 아키텍처
function vibeCodingTechStack() {
  const layers = [
    { label: 'AI 에디터', items: ['Cursor', 'Claude Code'], color: '#7c3aed', bg: '#f5f3ff' },
    { label: '프레임워크', items: ['Next.js', 'React'], color: '#2563eb', bg: '#eff6ff' },
    { label: 'DB + 인증', items: ['Supabase'], color: '#059669', bg: '#ecfdf5' },
    { label: '배포', items: ['Vercel', 'Cloudflare'], color: '#000000', bg: '#f9fafb' },
    { label: '서비스 관리', items: ['Linkmap'], color: '#059669', bg: '#ecfdf5' },
  ];
  return { name: 'vibe-coding-tech-stack', width: 800, height: 300, element: wrap(800, 300, [
    Title('바이브 코딩 추천 기술 스택'),
    { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center', padding: '0 40px' }, children: layers.map((layer) => ({
      type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [
        { type: 'div', props: { style: { width: '100px', fontSize: '12px', fontWeight: 700, color: layer.color, textAlign: 'right' }, children: layer.label } },
        { type: 'div', props: { style: { flex: 1, display: 'flex', gap: '8px' }, children: layer.items.map((item) => ({
          type: 'div', props: { style: { background: layer.bg, border: `2px solid ${layer.color}30`, borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, color: layer.color }, children: item }
        })) } },
      ] }
    })) } },
  ]) };
}

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
  const diagrams = [vibeCodingArchitecture(), linkmapSaasScale(), serviceConnectionTree(), vibeCodingTechStack()];
  console.log(`🎨 도식 이미지 ${diagrams.length}장 생성...\n`);
  for (const d of diagrams) {
    try { await renderDiagram(d, fontData); console.log(`  ✅ ${d.name}.png (${d.width}x${d.height})`); }
    catch (err) { console.error(`  ❌ ${d.name}: ${err.message}`); }
  }
  console.log(`\n🎉 완료!`);
}
main().catch(console.error);
