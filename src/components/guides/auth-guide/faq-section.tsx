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
    q: 'GitHub 로그인이 안 돼요',
    a: 'Supabase 대시보드 → Authentication → Providers에서 GitHub을 활성화했는지 확인하세요. Client ID와 Secret이 올바르게 입력되어 있어야 하며, Redirect URL에 앱 도메인이 등록되어 있어야 합니다.',
  },
  {
    q: '리다이렉트 오류가 발생해요',
    a: 'Supabase 대시보드 → Authentication → URL Configuration에서 사이트 URL과 Redirect URLs가 올바르게 설정되어 있는지 확인하세요. 로컬 개발 시 http://localhost:3000도 추가해야 합니다.',
  },
  {
    q: '앱 로그인 GitHub과 서비스 연동 GitHub은 뭐가 다른가요?',
    a: '앱 로그인의 GitHub은 "Linkmap에 들어오기 위한 인증"이고, 서비스 연동의 GitHub은 "프로젝트에서 레포/시크릿을 관리하기 위한 연결"입니다. 서로 다른 OAuth 앱과 콜백 URL을 사용합니다.',
  },
  {
    q: 'API Key는 어디서 발급하나요?',
    a: '각 서비스의 설정 페이지에서 발급합니다. 예: Vercel → Settings → Tokens, OpenAI → API keys 페이지. Linkmap 서비스 카탈로그에서 서비스를 선택하면 체크리스트로 발급 방법을 안내합니다.',
  },
  {
    q: '환경변수에 무엇을 넣어야 하나요?',
    a: '앱 로그인에는 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다. 서비스 연동은 서비스마다 다르며, Linkmap이 프로젝트별로 필요한 환경변수를 자동으로 안내합니다.',
  },
  {
    q: 'API Key는 안전하게 저장되나요?',
    a: '네, Linkmap은 모든 API Key와 시크릿을 AES-256-GCM 알고리즘으로 암호화해 저장합니다. 원문은 서버 메모리에만 일시적으로 존재하며, DB에는 암호문만 보관됩니다.',
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">자주 묻는 질문</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          인증 관련해서 가장 많이 궁금해하시는 부분을 정리했습니다.
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
            인증 설정이 이해되셨다면, 지금 바로 시작해 보세요!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                지금 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/services">서비스 카탈로그 둘러보기</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
