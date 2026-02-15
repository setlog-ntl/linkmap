'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { FlowDiagram, type FlowNode } from './flow-diagram';
import {
  Map,
  ExternalLink,
  Database,
  KeyRound,
  ShieldCheck,
  Settings,
} from 'lucide-react';

const oauthNodes: FlowNode[] = [
  { icon: Map, label: '서비스 맵', sublabel: '"연결하기" 클릭' },
  { icon: ExternalLink, label: '외부 인증', sublabel: 'GitHub 로그인' },
  { icon: Database, label: '토큰 저장', sublabel: '암호화 보관' },
];

const apiKeyNodes: FlowNode[] = [
  { icon: Settings, label: '설정 페이지', sublabel: 'API Key 입력' },
  { icon: KeyRound, label: '키 입력', sublabel: '복사 · 붙여넣기' },
  { icon: ShieldCheck, label: '암호화 저장', sublabel: 'AES-256-GCM' },
];

const serviceTable = [
  { service: 'GitHub (레포 연동)', method: 'OAuth', note: '"GitHub 계정 연결" 버튼' },
  { service: 'Vercel', method: 'API Key', note: 'Vercel Token 입력' },
  { service: 'Stripe', method: 'API Key', note: 'Secret Key' },
  { service: 'OpenAI', method: 'API Key', note: 'API Key' },
  { service: 'Anthropic', method: 'API Key', note: 'API Key' },
  { service: 'Supabase (프로젝트)', method: 'API Key', note: 'Project URL + Anon Key' },
];

export function ServiceAuthSection() {
  return (
    <section id="service-auth" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Layer 2
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">서비스 연동</h2>
          <p className="text-muted-foreground max-w-2xl">
            프로젝트에서 외부 서비스(GitHub, Vercel 등)와 연결하는 인증입니다.
            연동 방식은 OAuth와 API Key 두 가지가 있습니다.
          </p>
        </div>
      </ScrollReveal>

      {/* Two flow diagrams side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <ScrollReveal delay={0.1}>
          <Card className="border-emerald-200/50 dark:border-emerald-800/30 h-full">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-1">OAuth 연동</h3>
              <p className="text-sm text-muted-foreground mb-5">
                버튼 클릭 → 외부 로그인 → 토큰 자동 저장
              </p>
              <FlowDiagram nodes={oauthNodes} colorScheme="emerald" />
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <Card className="border-emerald-200/50 dark:border-emerald-800/30 h-full">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-1">API Key 입력</h3>
              <p className="text-sm text-muted-foreground mb-5">
                키를 복사해 붙여넣기 → 암호화 저장
              </p>
              <FlowDiagram nodes={apiKeyNodes} colorScheme="emerald" />
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>

      {/* Service table */}
      <ScrollReveal delay={0.2}>
        <div>
          <h3 className="text-lg font-semibold mb-4">서비스별 연동 방식</h3>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">서비스</th>
                  <th className="px-4 py-3 text-left font-medium">방식</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">비고</th>
                </tr>
              </thead>
              <tbody>
                {serviceTable.map((row) => (
                  <tr key={row.service} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium">{row.service}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.method === 'OAuth'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}
                      >
                        {row.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {row.note}
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
