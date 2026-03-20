import type { Metadata } from 'next';
import { SnsApiContent } from '@/components/guides/automation-guide/sns-api-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'SNS API 연동 — 카카오·인스타·유튜브 | Linkmap',
  description:
    '카카오 API, 인스타그램 Basic Display API, YouTube Data API 개요와 OAuth 인증 흐름을 초보자 눈높이로 설명합니다.',
  keywords: ['카카오 API', '인스타그램 API', 'YouTube API', 'OAuth', 'SNS 연동', 'REST API', '초보자'],
};

export const revalidate = false;

export default function SnsApiPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'automation/sns-api',
    title: 'SNS API 연동 — 카카오·인스타·유튜브',
    description: '카카오 API, 인스타그램 Basic Display API, YouTube Data API와 OAuth 인증 흐름.',
    faqs: [
      { q: '카카오 API는 무료인가요?', a: '네, 대부분의 카카오 API는 무료입니다. 카카오 메시지(나에게 보내기)도 무료이고, 비즈니스 API(대량 발송)는 유료입니다.' },
      { q: 'OAuth 인증이란?', a: '사용자가 비밀번호를 직접 넘기지 않고, "이 앱이 내 정보에 접근해도 될까요?" 식으로 권한을 위임하는 안전한 인증 방식입니다.' },
      { q: '인스타그램 API로 자동 포스팅이 가능한가요?', a: '개인 계정은 불가하지만 비즈니스 계정은 Instagram Graph API를 통해 자동 게시가 가능합니다. Meta 앱 검수가 필요합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <SnsApiContent />
    </>
  );
}
