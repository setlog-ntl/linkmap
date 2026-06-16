import type { MetadataRoute } from 'next';
import { GUIDE_DATA, SUB_GUIDE_DATA } from '@/data/ui/guide-data';
import { SERVICE_SLUGS } from '@/data/seed/service-slugs';
import { getBlogSitemapEntries } from '@/data/blog/posts';
import { GLOSSARY_ENTRIES } from '@/data/seo/glossary-terms';

const BASE_URL = 'https://www.linkmap.biz';

// 빌드 시점에 고정 — new Date()를 런타임 호출하면 동적 렌더링 트리거됨
const BUILD_DATE = '2026-03-22';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services/compare`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/services/cost-simulator`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guides`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/glossary`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/oneclick`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/showcase`, lastModified: BUILD_DATE, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: BUILD_DATE, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = GUIDE_DATA.map((guide) => ({
    url: `${BASE_URL}${guide.href}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 서브가이드 (overview slug은 부모와 동일 URL이므로 제외)
  const subGuidePages: MetadataRoute.Sitemap = SUB_GUIDE_DATA
    .filter((sg) => sg.slug !== 'overview')
    .map((sg) => ({
      url: `${BASE_URL}${sg.href}`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  const blogPages: MetadataRoute.Sitemap = getBlogSitemapEntries().map((entry) => ({
    url: `${BASE_URL}/blog/${entry.slug}`,
    lastModified: entry.updatedAt ?? entry.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const servicePages: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const glossaryPages: MetadataRoute.Sitemap = GLOSSARY_ENTRIES.map((entry) => ({
    url: `${BASE_URL}/glossary/${entry.slug}`,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...guidePages,
    ...subGuidePages,
    ...blogPages,
    ...servicePages,
    ...glossaryPages,
  ];
}
