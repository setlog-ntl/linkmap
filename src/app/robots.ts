import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // 공개 페이지: /, /services, /pricing, /guides, /blog, /faq, /glossary,
        //              /oneclick, /showcase, /demo 는 disallow 하지 않으므로 자동 허용
        disallow: [
          '/dashboard',
          '/project/',
          '/settings/',
          '/api/',
          '/auth/',
          '/admin/',
          '/feedback',
          '/my-sites/',
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
        allow: ['/llms.txt'],
        disallow: [
          '/dashboard',
          '/project/',
          '/settings/',
          '/api/',
          '/auth/',
          '/admin/',
          '/feedback',
          '/my-sites/',
          '/demo/',
        ],
      },
    ],
    sitemap: 'https://www.linkmap.biz/sitemap.xml',
  };
}
