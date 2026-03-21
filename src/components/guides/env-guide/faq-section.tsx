'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';

const faqs = [
  {
    q: '.env와 .env.local의 차이는?',
    a: '.env는 git에 포함될 수 있는 기본값 파일이고, .env.local은 로컬 전용 파일로 .gitignore에 자동 포함됩니다. Next.js는 .env.local을 우선 로드하므로, 비밀 키는 반드시 .env.local에 넣으세요.',
  },
  {
    q: '환경변수를 잘못 입력하면 어떻게 되나요?',
    a: '대부분 앱이 시작은 되지만 해당 기능이 작동하지 않습니다. 예를 들어 Supabase URL이 틀리면 로그인이 안 되고, OpenAI 키가 잘못되면 AI 기능에서 에러가 납니다. 콘솔에서 "unauthorized"나 "invalid key" 에러를 확인하세요.',
  },
  {
    q: '이미 GitHub에 .env를 올렸으면 어떻게 하나요?',
    a: '1) 해당 서비스에서 즉시 키를 교체(rotate)하세요. 2) git rm --cached .env로 추적 해제 후 3) .gitignore에 추가하고 4) 새로 커밋하세요. 이미 노출된 키는 봇이 탐지했을 가능성이 높으므로 반드시 새 키를 발급받아야 합니다.',
  },
  {
    q: 'console.log로 환경변수를 확인해도 되나요?',
    a: '로컬 개발 중에는 괜찮지만, 배포된 앱에서는 절대 안 됩니다. 특히 NEXT_PUBLIC_ 변수는 브라우저 콘솔에 노출되고, 서버 환경변수도 로그 서비스에 기록될 수 있습니다. 디버깅 후 반드시 console.log를 삭제하세요.',
  },
  {
    q: '.env.example은 GitHub에 올려도 되나요?',
    a: '네, 올려야 합니다! .env.example에는 실제 값 대신 설명이나 빈 값을 넣어두면 팀원이 어떤 환경변수가 필요한지 쉽게 알 수 있습니다. 예: OPENAI_API_KEY=sk-your-key-here',
  },
  {
    q: '배포 후 환경변수 에러가 나면 어떻게 하나요?',
    a: '1) 배포 플랫폼 대시보드에서 모든 환경변수가 등록되어 있는지 확인하세요. 2) 변수명 오타가 없는지 확인하세요 (대소문자 구분됨). 3) 새로 추가한 환경변수가 있다면 배포를 다시 트리거하세요 — 대부분 재배포가 필요합니다.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">자주 묻는 질문</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          환경변수에 관해 가장 많이 궁금해하시는 부분을 정리했습니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-lg border px-4"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.2}>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            환경변수가 이해되셨다면, Linkmap으로 더 편하게 관리해 보세요!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link prefetch={false} href="/signup">
                Linkmap으로 프로젝트 관리 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link prefetch={false} href="/services">서비스 카탈로그 보기</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
