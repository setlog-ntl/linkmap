'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { FlowDiagram, type FlowNode } from '../flow-diagram';
import { StepCardWithScreenshot } from '../step-card-with-screenshot';
import { googleSteps } from './google-screenshots';
import {
  Chrome,
  Settings,
  CheckCircle2,
  Shield,
  KeyRound,
  AlertTriangle,
  LogIn,
  ArrowRightLeft,
  LayoutDashboard,
} from 'lucide-react';

const googleFlow: FlowNode[] = [
  { icon: LogIn, label: 'Google 로그인 클릭', sublabel: '앱 로그인 페이지' },
  { icon: Chrome, label: 'Google 인증', sublabel: '계정 선택·동의' },
  { icon: ArrowRightLeft, label: 'Supabase 콜백', sublabel: 'code → token 교환' },
  { icon: LayoutDashboard, label: '대시보드', sublabel: '로그인 완료' },
];

const sectionIcons = [
  { icon: Chrome, label: 'Google Cloud Console', steps: '1~4' },
  { icon: Settings, label: 'Supabase 설정', steps: '5~6' },
  { icon: CheckCircle2, label: '동작 확인', steps: '7' },
];

const troubleshooting = [
  {
    title: 'redirect_uri_mismatch 오류',
    content:
      'Google Cloud Console > 사용자 인증 정보 > 해당 OAuth 클라이언트에서 "승인된 리디렉션 URI"에 Supabase 콜백 URL이 정확히 등록되어 있는지 확인하세요. 프로토콜(http/https), 후행 슬래시에 주의합니다.',
  },
  {
    title: '"이 앱은 차단됨" 경고',
    content:
      'OAuth 동의 화면이 테스트 모드일 때 등록되지 않은 사용자가 로그인하면 나타납니다. 테스트 사용자를 추가하거나, 프로덕션 배포 전에 "프로덕션에 게시"를 클릭하세요. 개발 중에는 "고급" → "앱으로 이동(안전하지 않음)"으로 진행할 수 있습니다.',
  },
  {
    title: '이메일이 null로 저장됨',
    content:
      'OAuth 동의 화면에서 email 스코프가 추가되어 있는지 확인하세요. 또한 클라이언트 설정에서 스코프가 제한되어 있지 않은지 점검합니다.',
  },
  {
    title: '로컬에서 동작하지 않음',
    content:
      'Google Cloud Console의 리디렉션 URI에 http://localhost:3000 관련 URL이 등록되어 있는지 확인하세요. 또한 Supabase URL Configuration의 Redirect URLs에도 로컬 주소가 포함되어 있어야 합니다.',
  },
];

export function GoogleGuideContent() {
  return (
    <div>
      {/* Hero */}
      <ScrollReveal>
        <div className="py-12 md:py-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase">
            <Chrome className="w-3.5 h-3.5" />
            Google Login Setup
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            구글 로그인 설정 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Google Cloud Console에서 OAuth 클라이언트를 만들고 Supabase에 등록하면,
            클릭 한 번으로 구글 로그인을 사용할 수 있습니다.
            각 단계를 스크린샷과 함께 따라해 보세요.
          </p>
        </div>
      </ScrollReveal>

      {/* 3대 구간 요약 */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {sectionIcons.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <Card key={sec.label} className="border-blue-200/50 dark:border-blue-800/30">
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      구간 {String.fromCharCode(65 + i)} · 단계 {sec.steps}
                    </p>
                    <p className="text-sm font-medium">{sec.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* OAuth Flow */}
      <ScrollReveal delay={0.1}>
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Google OAuth 플로우</h2>
          <div className="rounded-xl border bg-card p-6">
            <FlowDiagram nodes={googleFlow} colorScheme="blue" />
          </div>
        </div>
      </ScrollReveal>

      {/* Step-by-Step with screenshots */}
      <ScrollReveal delay={0.15}>
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-6">단계별 설정</h2>
          <div className="space-y-6">
            {googleSteps.map((step) => (
              <StepCardWithScreenshot key={step.step} data={step} colorScheme="blue" />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 주의사항 */}
      <ScrollReveal delay={0.2}>
        <Alert className="mb-10 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-sm">
            <strong>리디렉션 URI는 정확히 일치해야 합니다.</strong> 후행 슬래시(/),
            프로토콜(http vs https), 포트 번호까지 모두 동일해야 합니다.
            가장 흔한 오류 원인입니다.
          </AlertDescription>
        </Alert>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal delay={0.25}>
        <div className="pb-12">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            트러블슈팅
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {troubleshooting.map((item, i) => (
              <AccordionItem
                key={i}
                value={`google-ts-${i}`}
                className="rounded-lg border px-4"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline text-sm">
                  <span className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-muted-foreground shrink-0" />
                    {item.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollReveal>
    </div>
  );
}
