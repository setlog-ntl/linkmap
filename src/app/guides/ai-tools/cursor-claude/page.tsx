import type { Metadata } from 'next';
import { CursorClaudeContent } from '@/components/guides/ai-tools-guide/cursor-claude-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Cursor / Claude Code 활용법 — AI 도구 가이드 | Linkmap',
  description:
    'Cursor와 Claude Code 설치부터 설정, 실전 워크플로우까지. AI 코딩 도구를 200% 활용하는 방법.',
  keywords: ['Cursor', 'Claude Code', 'AI 코드 에디터', 'AI 코딩 도구', '바이브코딩', 'Windsurf'],
};

export default function CursorClaudePage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-tools/cursor-claude',
    title: 'Cursor / Claude Code 활용법 — AI 도구 가이드',
    description: 'Cursor와 Claude Code 설치부터 설정, 실전 워크플로우까지.',
    faqs: [
      { q: 'Cursor는 무료인가요?', a: 'Hobby 요금제는 월 500회 AI 완성이 무료입니다. Pro는 월 $20이며 무제한 완성을 제공합니다.' },
      { q: 'Claude Code는 어떻게 설치하나요?', a: 'npm install -g @anthropic-ai/claude-code 명령어로 설치합니다. Node.js 18 이상이 필요합니다.' },
      { q: 'Cursor와 Claude Code를 같이 쓸 수 있나요?', a: '네. Cursor로 파일 단위 작업을, Claude Code로 프로젝트 전체 리팩토링이나 멀티 파일 작업을 하면 좋습니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <CursorClaudeContent />
    </>
  );
}
