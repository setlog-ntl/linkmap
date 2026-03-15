import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/services', '/pricing', '/guides', '/guides/', '/faq', '/glossary'],
        disallow: [
          '/dashboard',
          '/project/',
          '/settings/',
          '/api/',
          '/auth/',
          '/admin/',
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'PerplexityBot',
          'ClaudeBot',
          'Applebot-Extended',
          'Yeti',
        ],
        allow: ['/', '/services', '/pricing', '/guides/', '/faq', '/glossary', '/llms.txt'],
        disallow: ['/dashboard', '/project/', '/settings/', '/api/', '/auth/', '/admin/'],
      },
    ],
    sitemap: 'https://www.linkmap.biz/sitemap.xml',
  };
}
