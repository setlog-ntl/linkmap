import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { ResourceDetail } from '@/components/resources/resource-detail';
import { getResourceCanonicalUrl } from '@/data/resources/free-resources';
import { getPublishedResource, getPublishedResources } from '@/lib/resources/queries';

// ISR: 빌드 시점에 발행된 slug를 프리렌더하고, 이후 관리자가 추가한 slug는 첫 요청 시
// 렌더한 뒤 60초 캐시한다(dynamicParams 기본 true). 미발행·없는 slug는 notFound().
export const revalidate = 60;

// generateStaticParams가 없으면 Next가 이 라우트를 요청마다 렌더하는 완전 동적(ƒ)으로
// 취급해 ISR 캐시를 타지 않는다 — 빈 배열이라도 반드시 둔다. 빌드 중 DB 조회 실패는
// getPublishedResources()가 빈 목록으로 폴백하므로 빌드가 깨지지 않는다.
export async function generateStaticParams() {
  const resources = await getPublishedResources();
  return resources.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getPublishedResource(slug);
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
  const resource = await getPublishedResource(slug);
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
