'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { FlowDiagram, type FlowNode } from '../flow-diagram';
import { StepCardWithScreenshot } from '../step-card-with-screenshot';
import { kakaoSteps } from './kakao-screenshots';
import {
  MessageCircle,
  Shield,
  KeyRound,
  AlertTriangle,
  ArrowRightLeft,
  LayoutDashboard,
  LogIn,
  Info,
} from 'lucide-react';

const kakaoFlow: FlowNode[] = [
  { icon: LogIn, label: '카카오 로그인 클릭', sublabel: '앱 로그인 페이지' },
  { icon: MessageCircle, label: '카카오 인증', sublabel: '계정 로그인·동의' },
  { icon: ArrowRightLeft, label: 'Supabase 콜백', sublabel: 'code → token 교환' },
  { icon: LayoutDashboard, label: '대시보드', sublabel: '로그인 완료' },
];

const approaches = [
  {
    title: 'Supabase Custom OIDC Provider',
    badge: '권장',
    desc: 'Supabase가 카카오 인증을 대행합니다. 코드 변경 최소, 세션 관리 자동화.',
  },
  {
    title: '앱 자체 OAuth 직접 구현',
    badge: '대안',
    desc: '카카오 REST API를 직접 호출합니다. 더 많은 제어가 가능하지만 구현 복잡도가 높습니다.',
  },
];

const keyTypes = [
  { name: 'JavaScript 키', usage: '프론트엔드 SDK 전용', exposure: '브라우저 노출 가능' },
  { name: 'REST API 키', usage: 'OAuth 인가 요청 (Client ID)', exposure: '서버 권장' },
  { name: 'Admin 키', usage: '서버 전용 관리자 키', exposure: '절대 클라이언트 노출 금지' },
];

const troubleshooting = [
  {
    title: 'KOE006: Redirect URI 불일치',
    content:
      '카카오 개발자 콘솔의 Redirect URI와 실제 요청의 redirect_uri가 정확히 일치하는지 확인하세요. 프로토콜(http/https), 후행 슬래시, 포트 번호를 모두 점검합니다.',
  },
  {
    title: '이메일 정보가 넘어오지 않음',
    content:
      '동의 항목에서 이메일이 "선택"으로 되어 있거나, 비즈 앱 전환이 안 된 경우입니다. 앱 설정 > 비즈니스 > 개인 개발자 비즈 앱 전환 후 이메일을 "필수 동의"로 변경하세요.',
  },
  {
    title: 'OpenID Connect 토큰 오류',
    content:
      '카카오 로그인 설정에서 OpenID Connect가 활성화되어 있는지 확인하세요. Supabase Provider 설정에서 "Skip nonce check"를 ON으로 설정하면 nonce 관련 오류를 해결할 수 있습니다.',
  },
  {
    title: '카카오톡으로 로그인이 안 됨',
    content:
      'PC 브라우저에서는 카카오 계정(이메일/비밀번호)으로만 로그인됩니다. 카카오톡 앱 연동은 모바일 환경에서만 동작하며, 웹에서는 QR 코드 로그인을 사용할 수 있습니다.',
  },
];

export function KakaoGuideContent() {
  return (
    <div>
      {/* Hero */}
      <ScrollReveal>
        <div className="py-12 md:py-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-2 tracking-wide uppercase">
            <MessageCircle className="w-3.5 h-3.5" />
            Kakao Login Setup
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            카카오 로그인 설정 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            한국에서 가장 많이 쓰이는 소셜 로그인. 카카오 개발자 콘솔에서 앱을 만들고
            Supabase OIDC Provider로 연결하는 전체 과정을 스크린샷과 함께 안내합니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 접근 방식 카드 */}
      <ScrollReveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {approaches.map((a) => (
            <Card
              key={a.title}
              className={
                a.badge === '권장'
                  ? 'border-yellow-300 dark:border-yellow-700/50 bg-yellow-50/30 dark:bg-yellow-950/10'
                  : ''
              }
            >
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-sm">{a.title}</h3>
                  <Badge variant={a.badge === '권장' ? 'default' : 'secondary'} className="text-xs">
                    {a.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollReveal>

      {/* OAuth Flow */}
      <ScrollReveal delay={0.1}>
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">카카오 OAuth 플로우</h2>
          <div className="rounded-xl border bg-card p-6">
            <FlowDiagram nodes={kakaoFlow} colorScheme="blue" />
          </div>
        </div>
      </ScrollReveal>

      {/* 카카오 키 종류 설명 */}
      <ScrollReveal delay={0.12}>
        <Alert className="mb-10 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription>
            <p className="font-medium text-sm mb-2">카카오 앱 키 종류 구분</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1.5 pr-3 font-medium">키</th>
                    <th className="text-left py-1.5 pr-3 font-medium">용도</th>
                    <th className="text-left py-1.5 font-medium">노출</th>
                  </tr>
                </thead>
                <tbody>
                  {keyTypes.map((k) => (
                    <tr key={k.name} className="border-b last:border-b-0">
                      <td className="py-1.5 pr-3 font-medium">{k.name}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{k.usage}</td>
                      <td className="py-1.5 text-muted-foreground">{k.exposure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AlertDescription>
        </Alert>
      </ScrollReveal>

      {/* Step-by-Step with screenshots */}
      <ScrollReveal delay={0.15}>
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-6">단계별 설정</h2>
          <div className="space-y-6">
            {kakaoSteps.map((step) => (
              <StepCardWithScreenshot key={step.step} data={step} colorScheme="yellow" />
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 주의사항 */}
      <ScrollReveal delay={0.2}>
        <Alert className="mb-10 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-sm">
            <strong>이메일 필수 수집은 비즈 앱 전환이 필요합니다.</strong>{' '}
            카카오 개발자 콘솔 → 앱 설정 → 비즈니스 → 개인 개발자 비즈 앱 전환을
            완료해야 이메일을 필수 동의로 받을 수 있습니다.
          </AlertDescription>
        </Alert>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal delay={0.25}>
        <div className="pb-12">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            트러블슈팅
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {troubleshooting.map((item, i) => (
              <AccordionItem
                key={i}
                value={`kakao-ts-${i}`}
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
