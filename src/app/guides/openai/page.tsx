import type { Metadata } from 'next';
import { OpenAIGuide } from '@/components/guides/openai-guide';

export const metadata: Metadata = {
  title: 'OpenAI 연동 가이드 | Linkmap',
  description:
    'GPT-4o, DALL-E, Whisper 등 OpenAI API를 Next.js 프로젝트에 안전하게 연동하는 방법. API 키 보안부터 스트리밍, 비용 관리까지.',
  keywords: ['OpenAI', 'GPT-4o', 'ChatGPT', 'AI API', 'Next.js', '연동', '가이드', 'Linkmap'],
};

export default function OpenAIGuidePage() {
  return <OpenAIGuide />;
}
