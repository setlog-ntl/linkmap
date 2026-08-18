import type { Metadata } from 'next';
import { ResourcesHub } from '@/components/resources/resources-hub';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import {
  generateBreadcrumbJsonLd,
  generateItemListJsonLd,
} from '@/lib/seo/json-ld';
import { getFreeResources } from '@/data/resources/free-resources';

export const metadata: Metadata = {
  title: '무료배포 자료 — 복사해서 바로 쓰는 지시문·도구 | Linkmap',
  description:
    '영상에서 쓴 지시문과 도구를 무료로 공개합니다. 클로드에 그대로 붙여넣는 복사용 지시문, 설치 없이 바로 쓰는 도구, 오프라인용 HTML 파일까지 가입 없이 받아 가세요.',
  keywords: [
    '무료 자료',
    '무료 배포 자료',
    '클로드 지시문',
    '엑셀 취합',
    '사무직 자동화',
    '바이브코딩',
    'Linkmap',
  ],
  alternates: {
    canonical: 'https://www.linkmap.biz/resources',
  },
  openGraph: {
    title: '무료배포 자료 — 복사해서 바로 쓰는 지시문·도구',
    description: '영상에서 쓴 지시문과 도구를 무료로 공개합니다. 가입 없이 받아 가세요.',
    url: 'https://www.linkmap.biz/resources',
    type: 'website',
  },
};

export const revalidate = false; // 완전 정적: 코드 하드코딩 데이터 → 배포 시에만 변경

export default function ResourcesPage() {
  const resources = getFreeResources();

  const breadcrumb = generateBreadcrumbJsonLd([
    { name: '홈', href: '/' },
    { name: '무료배포 자료', href: '/resources' },
  ]);

  const itemList = generateItemListJsonLd(
    resources.map((r) => ({
      name: r.title,
      url: `https://www.linkmap.biz/resources/${r.slug}`,
      description: r.description,
    }))
  );

  return (
    <>
      <JsonLdScript data={breadcrumb} />
      <JsonLdScript data={itemList} />
      <ResourcesHub resources={resources} />
    </>
  );
}
