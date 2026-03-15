import { ImageResponse } from 'next/og';

// 빌드 시 prerender 방지 (폰트 외부 fetch 필요)
export const dynamic = 'force-dynamic';

export const alt = 'Linkmap - 서비스 연결을 한눈에';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    // 구버전 UA → woff 형식 반환 (woff2는 satori 미지원)
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap',
      {
        headers: {
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
        },
      }
    ).then((r) => r.text());

    const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.(?:woff|ttf))\)/);
    if (!urlMatch) return null;
    return fetch(urlMatch[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const fontData = await loadKoreanFont();
  const fontFamily = fontData ? 'Noto Sans KR' : 'sans-serif';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0c0f1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 그라디언트 오브 */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-40px',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-100px',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 60%)',
            borderRadius: '50%',
          }}
        />
        {/* 미세한 그리드 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(51,65,85,0.3) 0.6px, transparent 0.6px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* 콘텐츠 중앙 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 80px',
            gap: '28px',
          }}
        >
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* 노드 그래프 아이콘 */}
              <div style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '1px', right: '1px', width: '6px', height: '6px', background: 'rgba(255,255,255,0.75)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '1px', left: '2px', width: '6px', height: '6px', background: 'rgba(255,255,255,0.75)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: '6px', left: '0px', width: '5px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '4px', right: '0px', width: '5px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '50%' }} />
              </div>
            </div>
            <span
              style={{
                color: '#f1f5f9',
                fontSize: '40px',
                fontWeight: 700,
                letterSpacing: '0.03em',
              }}
            >
              Linkmap
            </span>
          </div>

          {/* 부제목 */}
          <div style={{ color: '#94a3b8', fontSize: '28px', fontWeight: 400 }}>
            서비스 연결을 한눈에, 배포는 3분 만에
          </div>

          {/* 메인 헤드라인 */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #60a5fa, #34d399)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            연결하고 관리하고 배포하세요
          </div>

          {/* 설명 */}
          <div
            style={{
              color: '#64748b',
              fontSize: '22px',
              textAlign: 'center',
              maxWidth: '780px',
              lineHeight: 1.6,
            }}
          >
            API 키 · 환경변수 · 서비스 연결 시각화 · 원클릭 배포까지
          </div>
        </div>

        {/* 하단 신뢰 배지 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '36px',
            paddingBottom: '44px',
          }}
        >
          {[
            { icon: '✦', text: '무료 시작' },
            { icon: '⊘', text: '카드 불필요' },
            { icon: '◈', text: 'AES-256 암호화' },
            { icon: '⚡', text: '3분 배포' },
          ].map((badge) => (
            <div
              key={badge.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#64748b',
                fontSize: '17px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  background: 'rgba(59,130,246,0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: '#60a5fa',
                }}
              >
                {badge.icon}
              </div>
              {badge.text}
            </div>
          ))}
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
        ? [
            {
              name: 'Noto Sans KR',
              data: fontData,
              style: 'normal' as const,
              weight: 800 as const,
            },
          ]
        : [],
    }
  );
}
