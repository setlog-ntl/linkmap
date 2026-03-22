import type { Metadata } from 'next';
import { GuidesHub } from '@/components/guides/guides-hub';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateBreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { GUIDE_DATA } from '@/data/ui/guide-data';

export const revalidate = false;

export const metadata: Metadata = {
  title: '가이드 — 바이브 코딩 개념부터 서비스 설정까지 | Linkmap',
  description:
    '환경변수, 인증, 프론트엔드, 백엔드, 배포 등 핵심 개념과 GitHub, Cloudflare, OpenAI 서비스 설정 가이드를 제공합니다.',
  keywords: ['가이드', '바이브 코딩', '환경변수', 'GitHub', 'Cloudflare', 'OpenAI', '초보자', 'Linkmap'],
  alternates: {
    canonical: 'https://www.linkmap.biz/guides',
  },
  openGraph: {
    title: '가이드 — 바이브 코딩 개념부터 서비스 설정까지',
    description: '환경변수, 인증, 프론트엔드, 백엔드, 배포 등 핵심 개념과 서비스 설정 가이드를 제공합니다.',
    url: 'https://www.linkmap.biz/guides',
    type: 'website',
  },
};

export default function GuidesPage() {
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: '홈', href: '/' },
    { name: '가이드', href: '/guides' },
  ]);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '바이브 코딩 가이드 목록',
    itemListElement: GUIDE_DATA.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.title,
      url: `https://www.linkmap.biz${g.href}`,
      description: g.description,
    })),
  };

  return (
    <>
      <JsonLdScript data={breadcrumb} />
      <JsonLdScript data={itemList} />
      <GuidesHub />
    </>
  );
}
