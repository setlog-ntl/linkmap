import type { Metadata } from 'next';
import { HowToBuyContent } from '@/components/guides/domain-guide/how-to-buy-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '도메인 구매 방법 — 이름 짓기부터 초기 설정까지 | Linkmap',
  description:
    '도메인 이름 짓는 팁, 등록 업체별 가격 비교, 구매 후 체크리스트까지 — 처음 도메인을 구매하는 분을 위한 단계별 가이드입니다.',
  keywords: ['도메인 구매', '도메인 이름', '도메인 가격', '가비아', 'Namecheap', 'Cloudflare', '네임서버', '초보자'],
};

export const revalidate = false;

export default function HowToBuyPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'domain/how-to-buy',
    title: '도메인 구매 방법 — 이름 짓기부터 초기 설정까지',
    description: '처음 도메인을 구매하는 분을 위한 단계별 가이드.',
    faqs: [
      { q: '도메인 구매 후 바로 사이트가 열리나요?', a: '아니요. 도메인을 구매한 뒤 서버와 연결하는 DNS 설정이 필요합니다. 설정 후 전파까지 최대 48시간이 걸릴 수 있지만, 보통 몇 분이면 됩니다.' },
      { q: '도메인을 다른 업체로 이전할 수 있나요?', a: '네. 등록 후 60일이 지나면 다른 Registrar로 이전(Transfer)할 수 있습니다.' },
      { q: '무료 도메인도 있나요?', a: 'Freenom(.tk, .ml 등)이 있지만 신뢰도가 낮습니다. GitHub Student Pack에서 무료 .me 도메인을 받을 수도 있습니다.' },
      { q: '도메인 갱신 안 하면 어떻게 되나요?', a: '만료 후 약 30~45일간 복구 기간이 있고, 이후 누구나 구매할 수 있게 됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <HowToBuyContent />
    </>
  );
}
