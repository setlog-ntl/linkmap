'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Shield, Puzzle } from 'lucide-react';

const rows = [
  { label: '목적', appLogin: '내가 Linkmap에 들어가기', serviceAuth: '프로젝트가 외부 서비스와 연결' },
  { label: '언제', appLogin: '로그인/회원가입 화면', serviceAuth: '프로젝트 서비스 맵/설정' },
  { label: '방식', appLogin: '이메일 · Google · GitHub', serviceAuth: 'OAuth 또는 API Key' },
  { label: '담당', appLogin: 'Supabase Auth', serviceAuth: 'Linkmap 자체 API + DB' },
  { label: '환경 변수', appLogin: 'SUPABASE_URL, ANON_KEY', serviceAuth: '서비스별 상이 (GITHUB_CLIENT_ID 등)' },
  { label: '결과', appLogin: '세션 발급 → 보호된 페이지 접근', serviceAuth: '토큰/키 저장 → 외부 API 호출 가능' },
];

export function ComparisonTable() {
  return (
    <section id="comparison" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">한눈에 비교</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          앱 로그인과 서비스 연동, 헷갈리지 않도록 나란히 비교해 보세요.
        </p>
      </ScrollReveal>

      {/* Desktop: table */}
      <ScrollReveal delay={0.1}>
        <div className="hidden sm:block rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium bg-muted/50 w-28" />
                <th className="px-4 py-3 text-left font-medium bg-blue-50/50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">앱 로그인</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300">서비스 연동</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium bg-muted/50">{row.label}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.appLogin}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.serviceAuth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden space-y-4">
        <ScrollReveal delay={0.1}>
          <div className="rounded-xl border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-700 dark:text-blue-300">앱 로그인</h3>
            </div>
            <dl className="space-y-2 text-sm">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="font-medium text-xs text-blue-600/70 dark:text-blue-400/70">{row.label}</dt>
                  <dd className="text-muted-foreground">{row.appLogin}</dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Puzzle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">서비스 연동</h3>
            </div>
            <dl className="space-y-2 text-sm">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="font-medium text-xs text-emerald-600/70 dark:text-emerald-400/70">{row.label}</dt>
                  <dd className="text-muted-foreground">{row.serviceAuth}</dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
