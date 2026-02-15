'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { FlowDiagram, type FlowNode } from './flow-diagram';
import { Mail, Chrome, Github, LogIn, ArrowRightLeft, LayoutDashboard } from 'lucide-react';

const methods = [
  {
    icon: Mail,
    name: '이메일 · 비밀번호',
    desc: '가장 기본적인 방법. 이메일과 비밀번호로 가입 후 로그인합니다.',
  },
  {
    icon: Chrome,
    name: 'Google 로그인',
    desc: '구글 계정을 클릭 한 번으로 사용. 별도 비밀번호 불필요.',
  },
  {
    icon: Github,
    name: 'GitHub 로그인',
    desc: '개발자라면 이미 있는 GitHub 계정으로 바로 시작.',
  },
];

const oauthFlow: FlowNode[] = [
  { icon: LogIn, label: '로그인 클릭', sublabel: 'Google / GitHub' },
  { icon: ArrowRightLeft, label: 'Provider 인증', sublabel: '외부 로그인 화면' },
  { icon: ArrowRightLeft, label: '콜백 처리', sublabel: '/auth/callback' },
  { icon: LayoutDashboard, label: '대시보드', sublabel: '로그인 완료' },
];

const settingRows = [
  { item: '담당', value: 'Supabase Auth' },
  { item: '콜백 URL', value: 'https://도메인/auth/callback' },
  { item: '설정 위치', value: 'Supabase 대시보드 → Authentication → Providers' },
  { item: '환경 변수', value: 'NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY' },
];

export function AppLoginSection() {
  return (
    <section id="app-login" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Layer 1
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">앱 로그인</h2>
          <p className="text-muted-foreground max-w-2xl">
            Linkmap 서비스 자체에 들어오기 위한 인증입니다.
            이메일, Google, GitHub 중 하나로 로그인할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 3 Method Cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {methods.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.name} className="border-blue-200/50 dark:border-blue-800/30">
                <CardContent className="pt-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-1">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollReveal>

      {/* OAuth Flow Diagram */}
      <ScrollReveal delay={0.15}>
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">
            소셜 로그인(OAuth) 플로우
          </h3>
          <div className="rounded-xl border bg-card p-6">
            <FlowDiagram nodes={oauthFlow} colorScheme="blue" />
          </div>
        </div>
      </ScrollReveal>

      {/* Settings Table */}
      <ScrollReveal delay={0.2}>
        <div>
          <h3 className="text-lg font-semibold mb-4">설정 요약</h3>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {settingRows.map((row) => (
                  <tr key={row.item} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium bg-muted/50 w-32 sm:w-40">
                      {row.item}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground break-all">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
