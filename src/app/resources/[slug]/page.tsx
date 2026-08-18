import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { ResourceDetail } from '@/components/resources/resource-detail';
import {
  getFreeResource,
  getFreeResourceSlugs,
  getResourceCanonicalUrl,
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

  // VideoObject는 붙이지 않는다 — 이 페이지는 자료 본문만 다루고 영상을 노출하지
  // 않으므로, 영상이 있다고 선언하면 구조화 데이터가 실제 화면과 어긋난다.
  // 영상 진입점은 허브(/resources) 카드의 유튜브 버튼이 담당한다.
  return (
    <>
      <JsonLdScript data={breadcrumb} />
      <JsonLdScript data={articleJsonLd} />
      <ResourceDetail resource={resource} />
    </>
  );
}
