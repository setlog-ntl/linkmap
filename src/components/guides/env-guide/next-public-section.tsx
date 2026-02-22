'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Server, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const variables = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', browser: true, reason: '브라우저에서 DB 연결 필요' },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', browser: true, reason: '공개용 키 (RLS가 보호)' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', browser: false, reason: 'RLS 우회 가능 — 서버 전용' },
  { name: 'OPENAI_API_KEY', browser: false, reason: '요금 발생 — 서버에서만 사용' },
  { name: 'NEXT_PUBLIC_GA_MEASUREMENT_ID', browser: true, reason: '브라우저 분석 코드에 필요' },
  { name: 'STRIPE_SECRET_KEY', browser: false, reason: '결제 처리 — 절대 노출 금지' },
];

export function NextPublicSection() {
  return (
    <section id="next-public" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">NEXT_PUBLIC_ 접두사</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Next.js에서 환경변수 이름 앞에 <code className="text-sm bg-muted px-1.5 py-0.5 rounded">NEXT_PUBLIC_</code>을 붙이면 브라우저에서도 접근할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 시각 설명: 브라우저 vs 서버 */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl">
          <Card className="border-2 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">브라우저 (사용자에게 보임)</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <code className="text-xs bg-blue-500/10 px-2 py-1 rounded">NEXT_PUBLIC_*</code>
              </div>
              <p className="text-sm text-muted-foreground">
                개발자 도구(F12)에서 누구나 볼 수 있습니다.
                <br />
                공개해도 안전한 값만 넣으세요.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Server className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">서버 (안전하게 숨겨짐)</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <EyeOff className="h-4 w-4 text-green-500" />
                <code className="text-xs bg-green-500/10 px-2 py-1 rounded">접두사 없음</code>
              </div>
              <p className="text-sm text-muted-foreground">
                서버에서만 접근 가능하며 사용자에게 절대 노출되지 않습니다.
                <br />
                비밀 키는 여기에 보관하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollReveal>

      {/* 비교 테이블 */}
      <ScrollReveal delay={0.15}>
        <div className="max-w-3xl mb-8">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">변수명</th>
                  <th className="text-center px-4 py-3 font-medium">브라우저</th>
                  <th className="text-left px-4 py-3 font-medium">이유</th>
                </tr>
              </thead>
              <tbody>
                {variables.map((v) => (
                  <tr key={v.name} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded break-all">
                        {v.name}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {v.browser ? (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          O 접근 가능
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-500/10 text-red-600 dark:text-red-400">
                          X 서버 전용
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{v.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>

      {/* 황금 규칙 카드 */}
      <ScrollReveal delay={0.2}>
        <Card className="border-amber-500/50 bg-amber-500/5 max-w-3xl">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">
                  황금 규칙: 돈이 나가는 키는 절대 NEXT_PUBLIC_ 붙이지 마세요!
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  OpenAI, Stripe Secret, Supabase Service Role 등 요금이 발생하거나
                  관리자 권한을 가진 키에 NEXT_PUBLIC_을 붙이면 누구나 사용할 수 있게 됩니다.
                  이런 키는 반드시 서버 사이드(API Route, Server Action)에서만 사용하세요.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </section>
  );
}
