import type { Metadata } from 'next';
import { ErrorHandlingContent } from '@/components/guides/api-basics-guide/error-handling-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '에러 핸들링 — API 연동 기초 | Linkmap',
  description:
    'HTTP 상태 코드(401/403/404/500) 의미, try/catch 패턴, 재시도 전략.',
  keywords: ['에러 핸들링', 'HTTP 상태 코드', 'try catch', '재시도', '지수 백오프', 'API 에러'],
};

export default function ErrorHandlingPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'api-basics/error-handling',
    title: '에러 핸들링 — API 연동 기초',
    description: 'HTTP 상태 코드 의미, try/catch 패턴, 재시도 전략을 설명합니다.',
    faqs: [
      { q: '404와 400 에러의 차이는?', a: '404는 요청한 리소스(URL)가 존재하지 않을 때, 400은 요청 형식이 잘못되었을 때 발생합니다. 404는 URL을 확인하고, 400은 요청 바디나 파라미터를 점검하세요.' },
      { q: '429 에러가 나면 어떻게 해야 하나요?', a: 'Too Many Requests 에러입니다. 일정 시간 기다린 후 재시도해야 합니다. 지수 백오프 전략(1초, 2초, 4초...)으로 간격을 늘려가며 재시도하세요.' },
      { q: 'try/catch만 쓰면 모든 에러를 잡을 수 있나요?', a: '네트워크 에러는 잡을 수 있지만, HTTP 4xx/5xx 에러는 fetch에서 자동으로 throw하지 않습니다. response.ok를 반드시 체크해야 합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <ErrorHandlingContent />
    </>
  );
}
