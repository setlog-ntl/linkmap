'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { FlowDiagram, type FlowNode } from './flow-diagram';
import {
  Chrome,
  Settings,
  Shield,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';

interface SetupStep {
  step: number;
  title: string;
  where: string;
  whereUrl?: string;
  what: string;
  why: string;
}

const googleSteps: SetupStep[] = [
  {
    step: 1,
    title: 'Google Cloud 프로젝트 생성',
    where: 'Google Cloud Console',
    whereUrl: 'https://console.cloud.google.com',
    what: '새 프로젝트를 만들거나 기존 프로젝트를 선택합니다.',
    why: 'OAuth 인증 정보가 이 프로젝트 안에 생성됩니다.',
  },
  {
    step: 2,
    title: 'OAuth 동의 화면 설정',
    where: 'API 및 서비스 > OAuth 동의 화면',
    what: 'External 선택 → 앱 이름, 지원 이메일 입력 → 범위에 email, profile, openid 추가',
    why: '사용자가 로그인할 때 보게 되는 동의 화면의 내용을 정합니다.',
  },
  {
    step: 3,
    title: 'OAuth 클라이언트 ID 생성',
    where: 'API 및 서비스 > 사용자 인증 정보',
    what: '사용자 인증 정보 만들기 > OAuth 클라이언트 ID > 웹 애플리케이션 → 승인된 리디렉션 URI에 Supabase 콜백 URL 추가',
    why: 'Client ID와 Client Secret을 발급받기 위한 핵심 단계입니다.',
  },
  {
    step: 4,
    title: 'Client ID / Secret 복사',
    where: '생성된 OAuth 클라이언트 상세 페이지',
    what: 'Client ID와 Client Secret 값을 복사해 둡니다.',
    why: '다음 단계에서 Supabase에 붙여넣어야 합니다.',
  },
  {
    step: 5,
    title: 'Supabase Google Provider 활성화',
    where: 'Supabase Dashboard > Authentication > Providers',
    what: 'Google 토글 ON → Client ID, Client Secret 붙여넣기',
    why: 'Supabase가 구글 로그인을 대행할 수 있도록 연결합니다.',
  },
  {
    step: 6,
    title: 'URL Configuration 설정',
    where: 'Supabase Dashboard > Authentication > URL Configuration',
    what: 'Site URL 입력 + Redirect URLs에 앱 도메인/auth/callback 추가',
    why: '로그인 성공 후 앱으로 안전하게 돌아오기 위한 주소를 등록합니다.',
  },
  {
    step: 7,
    title: '동작 확인',
    where: '로컬 개발 환경',
    what: 'npm run dev → 로그인 페이지 → Google 로그인 클릭 → 대시보드 도착 확인',
    why: '설정이 올바른지 실제로 테스트합니다.',
  },
];

const googleFlow: FlowNode[] = [
  { icon: LogIn, label: 'Google 로그인 클릭', sublabel: '앱 로그인 페이지' },
  { icon: Chrome, label: 'Google 인증', sublabel: '계정 선택·동의' },
  { icon: ArrowRightLeft, label: 'Supabase 콜백', sublabel: 'code → token 교환' },
  { icon: LayoutDashboard, label: '대시보드', sublabel: '로그인 완료' },
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
];

const sectionIcons = [
  { icon: Chrome, label: 'Google Cloud Console' },
  { icon: Settings, label: 'Supabase 설정' },
  { icon: CheckCircle2, label: '동작 확인' },
];

export function GoogleLoginSection() {
  return (
    <section id="google-login" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase">
            <Chrome className="w-3.5 h-3.5" />
            Google Login Setup
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            구글 로그인 설정 가이드
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Google Cloud Console에서 OAuth 클라이언트를 만들고 Supabase에
            등록하면, 클릭 한 번으로 구글 로그인을 사용할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 3대 구간 요약 */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {sectionIcons.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <Card
                key={sec.label}
                className="border-blue-200/50 dark:border-blue-800/30"
              >
                <CardContent className="pt-5 pb-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      구간 {String.fromCharCode(65 + i)}
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
          <h3 className="text-lg font-semibold mb-4">Google OAuth 플로우</h3>
          <div className="rounded-xl border bg-card p-6">
            <FlowDiagram nodes={googleFlow} colorScheme="blue" />
          </div>
        </div>
      </ScrollReveal>

      {/* Step-by-Step */}
      <ScrollReveal delay={0.15}>
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-6">단계별 설정</h3>
          <div className="space-y-4">
            {googleSteps.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border bg-card p-5 flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 text-sm font-bold text-blue-700 dark:text-blue-300">
                  {s.step}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-2">{s.title}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground font-medium">
                        어디서?{' '}
                      </span>
                      {s.whereUrl ? (
                        <a
                          href={s.whereUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          {s.where}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span>{s.where}</span>
                      )}
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">
                        무엇을?{' '}
                      </span>
                      <span>{s.what}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-medium">
                        왜?{' '}
                      </span>
                      <span className="text-muted-foreground">{s.why}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 주의사항 */}
      <ScrollReveal delay={0.2}>
        <Alert className="mb-10 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-sm">
            <strong>리디렉션 URI는 정확히 일치해야 합니다.</strong> 후행
            슬래시(/), 프로토콜(http vs https), 포트 번호까지 모두 동일해야
            합니다. 가장 흔한 오류 원인입니다.
          </AlertDescription>
        </Alert>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal delay={0.25}>
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            트러블슈팅
          </h3>
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
    </section>
  );
}
