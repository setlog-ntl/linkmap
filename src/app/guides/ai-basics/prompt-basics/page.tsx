import type { Metadata } from 'next';
import { PromptBasicsContent } from '@/components/guides/ai-basics-guide/prompt-basics-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: '프롬프트 기초 — AI 기초 가이드 | Linkmap',
  description:
    '좋은 프롬프트의 RCAF 구조, 제로샷/퓨샷/CoT 기법, 시스템 프롬프트와 유저 프롬프트의 차이를 배웁니다.',
  keywords: ['프롬프트 기초', '프롬프트 작성법', '제로샷', '퓨샷', 'CoT', '체인 오브 쏘트', '시스템 프롬프트', 'RCAF'],
};

export const revalidate = false;

export default function PromptBasicsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-basics/prompt-basics',
    title: '프롬프트 기초 — AI 기초 가이드',
    description: '좋은 프롬프트의 RCAF 구조, 제로샷/퓨샷/CoT 기법, 시스템 프롬프트와 유저 프롬프트의 차이를 배웁니다.',
    faqs: [
      { q: '프롬프트를 잘 써야 AI가 좋은 결과를 주나요?', a: '네. 같은 AI라도 프롬프트 품질에 따라 결과가 크게 달라집니다. 역할(Role), 맥락(Context), 작업(Action), 형식(Format) 4가지를 갖추면 훨씬 좋은 결과를 얻을 수 있습니다.' },
      { q: '제로샷과 퓨샷의 차이는 무엇인가요?', a: '제로샷은 예시 없이 직접 지시하는 방법이고, 퓨샷은 원하는 패턴의 예시를 함께 보여주는 방법입니다. 형식이 중요한 작업에는 퓨샷이 더 효과적입니다.' },
      { q: 'CoT(체인 오브 쏘트)란 무엇인가요?', a: '"단계별로 생각해줘"라고 요청하여 AI가 추론 과정을 보여주게 하는 기법입니다. 수학이나 논리 문제에서 정확도가 크게 향상됩니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <PromptBasicsContent />
    </>
  );
}
