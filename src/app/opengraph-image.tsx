import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const alt = 'Linkmap - 서비스 연결을 한눈에';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.linkmap.biz';

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap',
      { headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)' } }
    ).then((r) => r.text());
    const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.(?:woff|ttf))\)/);
    if (!urlMatch) return null;
    return fetch(urlMatch[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

async function loadImage(path: string): Promise<string | null> {
  try {
    const res = await fetch(`${SITE_URL}${path}`);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}

export default async function Image() {
  const [fontData, logoSrc] = await Promise.all([
    loadKoreanFont(),
    loadImage('/og-logo.png'),
  ]);
  const fontFamily = fontData ? 'Noto Sans KR' : 'sans-serif';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0e1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          fontFamily,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 그라디언트 오브 — 우상단 */}
        <div
          style={{
            position: 'absolute',
            top: '-160px',
            right: '-100px',
            width: '650px',
            height: '650px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        {/* 배경 그라디언트 오브 — 좌하단 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-180px',
            left: '-120px',
            width: '550px',
            height: '550px',
            background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        {/* 미세 그리드 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(51,65,85,0.25) 0.5px, transparent 0.5px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* 좌측: 텍스트 영역 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 0 60px 72px',
            gap: '24px',
            maxWidth: '680px',
          }}
        >
          {/* 로고 이미지 */}
          {logoSrc ? (
            <img
              src={logoSrc}
              width={220}
              height={64}
              style={{ objectFit: 'contain', objectPosition: 'left' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', background: '#fff', borderRadius: '50%' }} />
              </div>
              <span style={{ color: '#e2e8f0', fontSize: '32px', fontWeight: 700 }}>Linkmap</span>
            </div>
          )}

          {/* 메인 카피 */}
          <div
            style={{
              color: '#f1f5f9',
              fontSize: '48px',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginTop: '8px',
            }}
          >
            서비스 연결을 한눈에,
            <br />
            안전하게 관리하세요
          </div>

          {/* 서브 카피 */}
          <div style={{ color: '#94a3b8', fontSize: '21px', lineHeight: 1.6 }}>
            API 키 · 환경변수 · 서비스 맵 · 원클릭 배포
          </div>

          {/* 기능 태그 */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            {['무료 시작', 'AES-256 암호화', '3분 배포'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.18)',
                  borderRadius: '20px',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* 우측: 서비스맵 비주얼 */}
        <div
          style={{
            width: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* 중앙 큰 노드 */}
          <div
            style={{
              width: '96px',
              height: '96px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 60px rgba(59,130,246,0.3)',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.9)', borderRadius: '50%' }} />
          </div>

          {/* 위성 노드들 — 연결선과 함께 */}
          {[
            { x: -140, y: -120, size: 40, color: '#8b5cf6', shadow: 'rgba(139,92,246,0.3)' },
            { x: 130, y: -100, size: 44, color: '#06b6d4', shadow: 'rgba(6,182,212,0.3)' },
            { x: -120, y: 80, size: 36, color: '#10b981', shadow: 'rgba(16,185,129,0.3)' },
            { x: 150, y: 90, size: 38, color: '#f59e0b', shadow: 'rgba(245,158,11,0.3)' },
            { x: 0, y: -160, size: 32, color: '#ef4444', shadow: 'rgba(239,68,68,0.3)' },
            { x: -180, y: -10, size: 30, color: '#3b82f6', shadow: 'rgba(59,130,246,0.3)' },
            { x: 170, y: -10, size: 34, color: '#ec4899', shadow: 'rgba(236,72,153,0.3)' },
          ].map((node, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${240 + node.x - node.size / 2}px`,
                top: `${315 + node.y - node.size / 2}px`,
                width: `${node.size}px`,
                height: `${node.size}px`,
                background: node.color,
                borderRadius: '50%',
                boxShadow: `0 0 24px ${node.shadow}`,
                zIndex: 5,
              }}
            />
          ))}

          {/* 연결선 오버레이 (점선으로 표현) */}
          {[
            { x1: 240, y1: 315, x2: 100, y2: 195 },
            { x1: 240, y1: 315, x2: 370, y2: 215 },
            { x1: 240, y1: 315, x2: 120, y2: 395 },
            { x1: 240, y1: 315, x2: 390, y2: 405 },
            { x1: 240, y1: 315, x2: 240, y2: 155 },
            { x1: 240, y1: 315, x2: 60, y2: 305 },
            { x1: 240, y1: 315, x2: 410, y2: 305 },
          ].map((line, i) => {
            const dx = line.x2 - line.x1;
            const dy = line.y2 - line.y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return (
              <div
                key={`line-${i}`}
                style={{
                  position: 'absolute',
                  left: `${line.x1}px`,
                  top: `${line.y1}px`,
                  width: `${len}px`,
                  height: '2px',
                  background: `linear-gradient(90deg, rgba(59,130,246,0.4), rgba(6,182,212,0.15))`,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 0',
                  zIndex: 1,
                }}
              />
            );
          })}
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '72px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }} />
          <span style={{ color: '#64748b', fontSize: '16px' }}>linkmap.biz</span>
        </div>

        {/* 하단 악센트 라인 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Noto Sans KR', data: fontData, style: 'normal' as const, weight: 800 as const }]
        : [],
    }
  );
}
