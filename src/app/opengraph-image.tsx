import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Linkmap - 3분 만에 배포하세요';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;800&display=swap',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
        },
      }
    ).then((r) => r.text());

    const urls = Array.from(css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+\.woff2)\)/g))
      .map((m) => m[1]);

    if (urls.length === 0) return null;
    return fetch(urls[0]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const fontData = await loadKoreanFont();

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: fontData ? 'Noto Sans KR' : 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 그로우 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '600px',
            background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        {/* 점 그리드 패턴 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(51,65,85,0.5) 0.8px, transparent 0.8px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* 로고 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              background: 'linear-gradient(135deg, #10b981, #3b82f6)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                background: '#fff',
                borderRadius: '5px',
                opacity: 0.9,
              }}
            />
          </div>
          <span
            style={{
              color: '#f1f5f9',
              fontSize: '36px',
              fontWeight: 700,
              letterSpacing: '0.04em',
            }}
          >
            Linkmap
          </span>
        </div>

        {/* 부제목 */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: '30px',
            fontWeight: 500,
            marginBottom: '18px',
          }}
        >
          초보자부터 개발자까지
        </div>

        {/* 메인 헤드라인 */}
        <div
          style={{
            color: '#10b981',
            fontSize: '84px',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '36px',
            letterSpacing: '-0.02em',
          }}
        >
          3분 만에 배포하세요
        </div>

        {/* 설명 */}
        <div
          style={{
            color: '#64748b',
            fontSize: '24px',
            textAlign: 'center',
            maxWidth: '820px',
            lineHeight: 1.5,
          }}
        >
          Google 계정 하나면 GitHub 가입부터 홈페이지 배포까지 자동으로
        </div>

        {/* 하단 신뢰 배지 */}
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            display: 'flex',
            gap: '32px',
          }}
        >
          {['무료 시작', '카드 불필요', 'AES-256 암호화'].map((badge) => (
            <div
              key={badge}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#64748b',
                fontSize: '20px',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  background: 'rgba(16,185,129,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '9px',
                    height: '9px',
                    background: '#10b981',
                    borderRadius: '50%',
                  }}
                />
              </div>
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: 'Noto Sans KR',
              data: fontData,
              style: 'normal',
              weight: 800,
            },
          ]
        : [],
    }
  );
}
