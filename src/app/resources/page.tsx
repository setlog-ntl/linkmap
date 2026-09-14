import type { Metadata } from 'next';
import { ResourcesHub } from '@/components/resources/resources-hub';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import {
  generateBreadcrumbJsonLd,
  generateItemListJsonLd,
} from '@/lib/seo/json-ld';
import { getPublishedResources } from '@/lib/resources/queries';

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

// ISR: 자료는 DB(free_resources)에서 읽는다 — 관리자가 /admin/resources 에서 추가·발행한
// 내용이 1분 내 공개 페이지에 반영된다. revalidatePath는 OpenNext tagCache 미설정으로
// 동작하지 않으므로 시간 기반 재검증만 쓴다.
export const revalidate = 60;

export default async function ResourcesPage() {
  const resources = await getPublishedResources();

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
