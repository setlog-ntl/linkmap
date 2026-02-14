import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: siteConfig.accentColor,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: siteConfig.accentColor,
            color: '#fff',
            fontSize: 40,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          {siteConfig.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#111827' }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 28, color: '#6b7280', marginTop: 8 }}>
          {siteConfig.title}
        </div>
        {siteConfig.company && (
          <div style={{ fontSize: 22, color: '#9ca3af', marginTop: 4 }}>
            {siteConfig.company}
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
