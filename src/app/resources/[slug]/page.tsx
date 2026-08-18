import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { ResourceDetail } from '@/components/resources/resource-detail';
import {
  getFreeResource,
  getFreeResourceSlugs,
  getResourceCanonicalUrl,
  getYoutubeWatchUrl,
} from '@/data/resources/free-resources';

// 완전 정적: generateStaticParams가 모든 자료를 프리렌더, 그 외 slug는 notFound()
// (blog/[slug]·glossary/[slug]와 동일한 Workers-safe 패턴)
export const revalidate = false;

export function generateStaticParams() {
  return getFreeResourceSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getFreeResource(slug);
  if (!resource) return {};

  const canonical = getResourceCanonicalUrl(resource.slug);

  return {
    title: `${resource.title} — 무료배포 자료 ${resource.order}번 | Linkmap`,
    description: resource.description.slice(0, 155),
    keywords: [...resource.tags, '무료 자료', '복사용 지시문', 'Linkmap'],
    alternates: { canonical },
    openGraph: {
      title: resource.title,
      description: resource.description,
      url: canonical,
      type: 'article',
      publishedTime: resource.publishedAt,
      modifiedTime: resource.updatedAt ?? resource.publishedAt,
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getFreeResource(slug);
  if (!resource) notFound();

  const canonical = getResourceCanonicalUrl(resource.slug);

  const breadcrumb = generateBreadcrumbJsonLd([
    { name: '홈', href: '/' },
    { name: '무료배포 자료', href: '/resources' },
    { name: resource.title, href: `/resources/${resource.slug}` },
  ]);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.title,
    description: resource.description,
    url: canonical,
    datePublished: resource.publishedAt,
    dateModified: resource.updatedAt ?? resource.publishedAt,
    isAccessibleForFree: true,
    keywords: resource.tags.join(', '),
    author: { '@type': 'Organization', name: 'Linkmap' },
    publisher: { '@type': 'Organization', name: 'Linkmap' },
  };

  // 영상이 발행된 뒤에만 VideoObject를 붙인다 — 자료 페이지와 영상이
  // 검색엔진 수준에서도 한 쌍으로 인식되게 하는 상호연결의 마지막 고리
  const watchUrl = getYoutubeWatchUrl(resource.youtube);
  const videoJsonLd =
    watchUrl && resource.youtube.videoId && resource.youtube.publishedAt
      ? {
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: resource.youtube.title,
          description: resource.description,
          uploadDate: resource.youtube.publishedAt,
          thumbnailUrl: `https://i.ytimg.com/vi/${resource.youtube.videoId}/maxresdefault.jpg`,
          contentUrl: watchUrl,
          embedUrl: `https://www.youtube.com/embed/${resource.youtube.videoId}`,
        }
      : null;

  return (
    <>
      <JsonLdScript data={breadcrumb} />
      <JsonLdScript data={articleJsonLd} />
      {videoJsonLd && <JsonLdScript data={videoJsonLd} />}
      <ResourceDetail resource={resource} />
    </>
  );
}
