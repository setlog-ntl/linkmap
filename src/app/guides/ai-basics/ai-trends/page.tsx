import type { Metadata } from 'next';
import { AiTrendsContent } from '@/components/guides/ai-basics-guide/ai-trends-content';
import { JsonLdScript } from '@/components/seo/json-ld-script';
import { generateGuideJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'AI 트렌드 — AI 기초 가이드 | Linkmap',
  description:
    '2026년 AI 트렌드: AI 에이전트, MCP(Model Context Protocol), 코딩 에이전트, 바이브코딩의 진화를 살펴봅니다.',
  keywords: ['AI 트렌드 2026', 'AI 에이전트', 'MCP', 'Model Context Protocol', '코딩 에이전트', 'Claude Code', 'Cursor', '바이브코딩'],
};

export const revalidate = false;

export default function AiTrendsPage() {
  const jsonLd = generateGuideJsonLd({
    slug: 'ai-basics/ai-trends',
    title: 'AI 트렌드 — AI 기초 가이드',
    description: '2026년 AI 트렌드: AI 에이전트, MCP, 코딩 에이전트, 바이브코딩의 진화를 살펴봅니다.',
    faqs: [
      { q: 'AI 에이전트란 무엇인가요?', a: '사용자가 목표만 제시하면 스스로 계획을 세우고, 도구를 사용하며, 결과를 평가하고 수정하여 목표를 달성하는 자율적 AI 시스템입니다. 기존 챗봇이 "안내데스크"라면, AI 에이전트는 "개인 비서"입니다.' },
      { q: 'MCP(Model Context Protocol)란 무엇인가요?', a: 'AI 앱이 외부 시스템(데이터베이스, API 등)과 통신하는 방식을 표준화한 프로토콜입니다. USB-C가 다양한 기기를 하나의 규격으로 연결하듯, MCP는 AI와 도구를 하나의 표준으로 연결합니다.' },
      { q: 'Claude Code와 Cursor 중 어떤 것을 써야 하나요?', a: '두 도구는 병행 사용이 일반적입니다. 일상 코딩의 80%는 Cursor(IDE 환경)로, 대규모 리팩토링이나 복잡한 디버깅은 Claude Code(터미널 에이전트)로 처리합니다.' },
    ],
  });

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <AiTrendsContent />
    </>
  );
}
