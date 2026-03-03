import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/services', '/pricing', '/guides', '/guides/'],
        disallow: [
          '/dashboard',
          '/project/',
          '/settings/',
          '/api/',
          '/auth/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://www.linkmap.biz/sitemap.xml',
  };
}
