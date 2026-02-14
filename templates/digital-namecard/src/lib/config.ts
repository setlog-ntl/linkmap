export interface SocialItem {
  platform: string;
  url: string;
}

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '홍길동',
  title: process.env.NEXT_PUBLIC_TITLE || '프리랜서 개발자',
  company: process.env.NEXT_PUBLIC_COMPANY || null,
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@example.com',
  phone: process.env.NEXT_PUBLIC_PHONE || '010-1234-5678',
  address: process.env.NEXT_PUBLIC_ADDRESS || null,
  website: process.env.NEXT_PUBLIC_WEBSITE || null,
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, []),
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || null,
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#3b82f6',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;
