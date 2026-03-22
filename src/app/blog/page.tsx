import type { Metadata } from 'next';
import { getPublishedPostsMeta } from '@/data/blog/posts';
import { BlogHub } from '@/components/blog/blog-hub';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '블로그 — 바이브 코딩, 환경변수 관리, 서비스 비교 | Linkmap',
  description:
    '바이브 코딩 트렌드, 환경변수 안전 관리, Doppler·Infisical 비교 등 개발자를 위한 인사이트를 공유합니다.',
  keywords: [
    '블로그',
    '바이브 코딩',
    '환경변수 관리',
    'API 키 관리',
    '서비스 비교',
    'Doppler',
    'Infisical',
    'Linkmap',
  ],
  alternates: {
    canonical: 'https://www.linkmap.biz/blog',
  },
  openGraph: {
    title: '블로그 — 바이브 코딩, 환경변수 관리, 서비스 비교',
    description: '바이브 코딩 트렌드, 환경변수 안전 관리, 서비스 비교 등 인사이트를 공유합니다.',
    url: 'https://www.linkmap.biz/blog',
    type: 'website',
  },
};

export const revalidate = 86400;

export default function BlogPage() {
  const posts = getPublishedPostsMeta();

  const breadcrumb = generateBreadcrumbJsonLd([
    { name: '홈', href: '/' },
    { name: '블로그', href: '/blog' },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumb} />
      <BlogHub posts={posts} />
    </>
  );
}
