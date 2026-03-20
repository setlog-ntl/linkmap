import type { Metadata } from 'next';
import { PromptEngineeringContent } from '@/components/guides/ai-tools-guide/prompt-engineering-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '프롬프트 엔지니어링 — AI 도구 가이드 | Linkmap',
  description:
    'AI에게 좋은 지시를 내리는 방법. 프롬프트 구조, 컨텍스트 관리, 규격 문서 작성법을 배웁니다.',
  keywords: ['프롬프트 엔지니어링', 'AI 프롬프트', '프롬프트 작성법', 'CLAUDE.md', '규격 문서', '바이브코딩'],
};

export const revalidate = false;

export default function PromptEngineeringPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-tools/prompt-engineering',
    title: '프롬프트 엔지니어링 — AI 도구 가이드',
    description: 'AI에게 좋은 지시를 내리는 방법. 프롬프트 구조, 컨텍스트 관리, 규격 문서 작성법을 배웁니다.',
    faqs: [
      { q: '프롬프트를 잘 써야 AI가 좋은 코드를 만들어 주나요?', a: '네. 같은 AI라도 프롬프트 품질에 따라 결과가 크게 달라집니다. 구체적인 요구사항과 맥락을 제공하면 훨씬 정확한 코드를 받을 수 있습니다.' },
      { q: 'CLAUDE.md나 .cursorrules 같은 규격 문서가 왜 필요한가요?', a: '규격 문서는 프로젝트의 규칙을 AI에게 매번 설명할 필요 없이 자동으로 전달합니다. 일관된 코드 품질을 유지하는 핵심입니다.' },
      { q: '프롬프트가 길수록 좋은 건가요?', a: '길이보다 구조가 중요합니다. 역할, 맥락, 요구사항, 출력 형식 4가지를 갖추면 짧아도 효과적입니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PromptEngineeringContent />
    </>
  );
}
