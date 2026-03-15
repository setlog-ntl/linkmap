/**
 * OG 이미지 생성 스크립트 (Method A: satori + sharp)
 *
 * 사용법: node scripts/generate-og-images.mjs
 * 출력: public/blog/og/{slug}.png (1200x630)
 */

import satori from 'satori';
import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'blog', 'og');

// 카테고리별 그라데이션 & 이모지
const CATEGORY_THEMES = {
  'vibe-coding': {
    gradient: ['#4338ca', '#7c3aed'],
    label: '바이브 코딩',
  },
  'env-management': {
    gradient: ['#047857', '#0d9488'],
    label: '환경변수 관리',
  },
  comparison: {
    gradient: ['#7c3aed', '#8b5cf6'],
    label: '비교 분석',
  },
  tutorial: {
    gradient: ['#0d9488', '#06b6d4'],
    label: '튜토리얼',
  },
  insight: {
    gradient: ['#2563eb', '#4338ca'],
    label: '인사이트',
  },
};

// 포스트별 커스텀 테마 (카테고리 기본값 오버라이드)
const POST_THEMES = {
  'supabase-rls-vibe-coding-risk': { gradient: ['#7f1d1d', '#dc2626'] },
  'ai-agent-reads-your-env': { gradient: ['#78350f', '#f59e0b'] },
  'ai-code-security-reality': { gradient: ['#1e3a5f', '#3b82f6'] },
  'env-file-exposure-crisis': { gradient: ['#064e3b', '#10b981'] },
  'ai-coding-tools-security-comparison': { gradient: ['#581c87', '#a78bfa'] },
  'vibe-coding-secret-leak-crisis': { gradient: ['#1e1b4b', '#4338ca'] },
  'vibe-coding-security-checklist': { gradient: ['#0f766e', '#5eead4'] },
};

// 전체 포스트 목록 (slug, title, category)
const POSTS = [
  { slug: 'ai-coding-tools-security-comparison', title: '2026 AI 코딩 도구 비교\n보안과 환경변수 관점에서', category: 'comparison' },
  { slug: 'ai-code-security-reality', title: 'AI가 만든 코드의 45%는\n보안 결함이 있다', category: 'insight' },
  { slug: 'vibe-coding-security-checklist', title: '바이브 코딩 보안 체크리스트\n배포 전 반드시 확인할 15가지', category: 'tutorial' },
  { slug: 'supabase-rls-vibe-coding-risk', title: 'Supabase RLS 미설정\n바이브 코딩의 가장 위험한 실수', category: 'vibe-coding' },
  { slug: 'ai-agent-reads-your-env', title: 'AI 코딩 에이전트가\n당신의 .env를 읽고 있다', category: 'env-management' },
  { slug: 'env-file-exposure-crisis', title: '1,200만 개의 .env 파일이\n인터넷에 노출되어 있다', category: 'env-management' },
  { slug: 'vibe-coding-secret-leak-crisis', title: '바이브 코딩 시대\n2,380만 시크릿이 유출되고 있다', category: 'vibe-coding' },
  { slug: 'doppler-vs-infisical-vs-linkmap-comparison', title: 'Doppler vs Infisical vs Linkmap\n환경변수 관리 도구 비교 2026', category: 'comparison' },
  { slug: 'microservice-dependency-service-map', title: '마이크로서비스 의존성 관리\n서비스맵이 필요한 이유', category: 'insight' },
  { slug: 'api-key-leak-incident-response', title: 'API 키 유출 사고 대응\n5단계 긴급 프로토콜', category: 'env-management' },
  { slug: 'what-is-vibe-coding', title: '바이브 코딩이란 무엇인가\nAI 시대의 새로운 개발 방식', category: 'vibe-coding' },
  { slug: 'why-dotenv-is-dangerous', title: '.env 파일은 왜 위험한가\n환경변수 보안의 기본', category: 'env-management' },
  { slug: 'vibe-coding-can-you-build-saas', title: '바이브 코딩으로 SaaS 만들기\n진짜 가능할까?', category: 'vibe-coding' },
  { slug: 'service-map-tutorial', title: 'Linkmap 서비스맵\n3분 튜토리얼', category: 'tutorial' },
  { slug: 'dotenv-safe-management-tips', title: '.env 안전하게 관리하는\n5가지 방법', category: 'env-management' },
  { slug: 'github-secrets-automation', title: 'GitHub Secrets 자동화\n수동 설정은 이제 그만', category: 'tutorial' },
];

// 폰트 로드 (Google Fonts CSS → TTF URL 추출)
async function loadFont() {
  // Noto Sans KR Bold TTF (satori는 TTF/WOFF만 지원, OTF 불가)
  // Google Fonts API에서 TTF 직접 요청 (User-Agent로 TTF 유도)
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&display=swap';
  const cssRes = await fetch(cssUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 11.0)' }, // TTF fallback
  });
  const css = await cssRes.text();
  // CSS에서 TTF/WOFF URL 추출
  const urls = [...css.matchAll(/url\(([^)]+)\)\s+format/g)].map((m) => m[1]);
  if (urls.length > 0) {
    // 첫 번째 URL 사용
    const res = await fetch(urls[0]);
    if (res.ok) return await res.arrayBuffer();
  }
  // Fallback: fontsource CDN
  const ttfUrl = 'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.ttf';
  const res = await fetch(ttfUrl);
  if (!res.ok) {
    // Fallback 2: Noto Sans (Latin only, 한글 깨질 수 있음)
    const latin = await fetch('https://fonts.gstatic.com/s/notosans/v38/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A-9a6Vc.ttf');
    return await latin.arrayBuffer();
  }
  return await res.arrayBuffer();
}

async function generateOGImage(post, fontData) {
  const theme = POST_THEMES[post.slug] || CATEGORY_THEMES[post.category];
  const catLabel = CATEGORY_THEMES[post.category].label;
  const [color1, color2] = theme.gradient;

  const lines = post.title.split('\n');

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
          fontFamily: 'NotoSansKR',
          color: 'white',
        },
        children: [
          // Top: Category label
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      background: 'rgba(255,255,255,0.2)',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '20px',
                      fontWeight: 700,
                    },
                    children: catLabel,
                  },
                },
              ],
            },
          },
          // Center: Title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              },
              children: lines.map((line) => ({
                type: 'div',
                props: {
                  style: {
                    fontSize: lines.some((l) => l.length > 18) ? '44px' : '52px',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  },
                  children: line,
                },
              })),
            },
          },
          // Bottom: Linkmap branding
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '24px',
                      fontWeight: 700,
                      opacity: 0.9,
                    },
                    children: 'linkmap.biz/blog',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.15)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '28px',
                            height: '28px',
                            background: 'white',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: color1,
                          },
                          children: 'L',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '20px', fontWeight: 700 },
                          children: 'Linkmap',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSansKR',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  // SVG → PNG
  const png = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
  const outPath = join(OUT_DIR, `${post.slug}.png`);
  await sharp(png).toFile(outPath);
  return outPath;
}

async function main() {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('📦 폰트 로딩 중...');
  const fontData = await loadFont();
  console.log('✅ 폰트 로드 완료\n');

  console.log(`🎨 OG 이미지 ${POSTS.length}장 생성 시작...\n`);

  for (const post of POSTS) {
    try {
      const path = await generateOGImage(post, fontData);
      console.log(`  ✅ ${post.slug}.png`);
    } catch (err) {
      console.error(`  ❌ ${post.slug}: ${err.message}`);
    }
  }

  console.log(`\n🎉 완료! ${OUT_DIR}`);
}

main().catch(console.error);
