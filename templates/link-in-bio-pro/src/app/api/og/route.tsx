import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';
import { getTheme } from '@/lib/themes';

export const dynamic = 'force-static';

export async function GET() {
  const theme = getTheme(siteConfig.theme);

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
          background: `linear-gradient(135deg, ${theme.backgroundFrom}, ${theme.primary}, ${theme.backgroundTo})`,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: theme.primary,
            color: '#fff',
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {siteConfig.siteName.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, color: theme.text }}>
          {siteConfig.siteName}
        </div>
        <div
          style={{
            fontSize: 24,
            color: theme.textMuted,
            marginTop: 12,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          {siteConfig.bio}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
