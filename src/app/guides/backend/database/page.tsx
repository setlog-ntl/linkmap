import type { Metadata } from 'next';
import { DatabaseContent } from '@/components/guides/backend-guide/database-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '데이터베이스 기초 — RDB·NoSQL·CRUD·스키마 | Linkmap',
  description:
    '관계형 DB(SQL)와 NoSQL의 차이, CRUD 작업, 스키마 개념을 초보자 눈높이로 설명합니다. Supabase JS SDK 코드 예시 포함.',
  keywords: ['데이터베이스', 'SQL', 'NoSQL', 'CRUD', '스키마', 'PostgreSQL', 'Supabase', '초보자'],
};

export const revalidate = false;

export default function DatabasePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'backend/database',
    title: '데이터베이스 기초 — RDB·NoSQL·CRUD·스키마',
    description: '관계형 DB와 NoSQL의 차이, CRUD 작업, 스키마 개념 설명.',
    faqs: [
      { q: 'SQL과 NoSQL 중 무엇을 선택해야 하나요?', a: '대부분의 웹 앱에는 SQL(관계형 DB)이 적합합니다. 사용자 정보, 주문, 게시글 등 정형화된 데이터에 강합니다. Supabase가 PostgreSQL 기반이므로 SQL을 사용합니다.' },
      { q: 'CRUD가 뭔가요?', a: 'Create(생성), Read(조회), Update(수정), Delete(삭제)의 약자로, 모든 앱의 데이터 처리는 이 4가지로 이루어집니다.' },
      { q: '스키마를 반드시 미리 정의해야 하나요?', a: 'SQL DB는 테이블 구조를 미리 정의해야 합니다. NoSQL은 스키마 없이 유연하게 저장할 수 있지만, 데이터 일관성 관리가 어렵습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <DatabaseContent />
    </>
  );
}
