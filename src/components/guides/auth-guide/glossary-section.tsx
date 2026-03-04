'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import {
  KeyRound,
  Fingerprint,
  IdCard,
  Lock,
  Undo2,
  Building2,
  Ticket,
  ScanEye,
  ShieldCheck,
  ShieldAlert,
  TableProperties,
  ArrowRightLeft,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface GlossaryItem {
  term: string;
  icon: LucideIcon;
  metaphor: string;
  description: string;
}

const glossary: GlossaryItem[] = [
  {
    term: 'OAuth',
    icon: KeyRound,
    metaphor: '대리 열쇠',
    description:
      '비밀번호를 알려주지 않고 권한만 위임하는 인증 방식. "Google로 로그인"이 대표적.',
  },
  {
    term: 'API Key',
    icon: Fingerprint,
    metaphor: '건물 출입증',
    description:
      '외부 서비스에 접근할 수 있는 고유 문자열. 발급받아 환경변수에 저장합니다.',
  },
  {
    term: 'Client ID',
    icon: IdCard,
    metaphor: '앱 주민등록번호',
    description:
      '내 앱을 식별하는 공개 ID. 카카오에서는 REST API 키가 이 역할을 합니다.',
  },
  {
    term: 'Client Secret',
    icon: Lock,
    metaphor: '앱 비밀번호',
    description:
      'Client ID와 짝을 이루는 비밀키. 서버에만 보관하며 절대 클라이언트에 노출하면 안 됩니다.',
  },
  {
    term: '콜백 URL',
    icon: Undo2,
    metaphor: '반송 주소',
    description:
      '인증이 끝나면 사용자가 돌아올 주소. 미리 등록해야 하며, 정확히 일치해야 합니다.',
  },
  {
    term: 'Provider',
    icon: Building2,
    metaphor: '인증 대행사',
    description:
      '인증을 제공하는 외부 서비스. Google, 카카오, GitHub 등이 해당됩니다.',
  },
  {
    term: '세션 (Session)',
    icon: Ticket,
    metaphor: '놀이공원 팔찌',
    description:
      '로그인 상태를 유지하는 임시 정보. 브라우저를 닫거나 시간이 지나면 만료됩니다.',
  },
  {
    term: '스코프 (Scope)',
    icon: ScanEye,
    metaphor: '접근 범위',
    description:
      'OAuth 시 요청하는 정보 범위. email, profile 등 필요한 것만 요청합니다.',
  },
  {
    term: 'JWT',
    icon: ShieldCheck,
    metaphor: '디지털 신분증',
    description:
      'JSON Web Token. 사용자 정보를 암호화한 토큰으로, 서버 없이도 인증 상태를 확인할 수 있습니다.',
  },
  {
    term: 'PKCE',
    icon: ShieldAlert,
    metaphor: '보안 강화 인증',
    description:
      'Proof Key for Code Exchange. 모바일/SPA 환경에서 인가 코드 가로채기를 방지하는 보안 메커니즘.',
  },
  {
    term: 'RLS',
    icon: TableProperties,
    metaphor: '행 수준 보안',
    description:
      'Row Level Security. DB 테이블의 각 행에 접근 정책을 설정해 사용자별 데이터를 보호합니다.',
  },
  {
    term: '리디렉션',
    icon: ArrowRightLeft,
    metaphor: '자동 이동',
    description:
      '인증 과정에서 페이지를 자동으로 이동시키는 것. 로그인 → 외부 인증 → 콜백 순으로 일어납니다.',
  },
];

export function GlossarySection() {
  return (
    <section id="glossary" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            Glossary
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            인증 용어 사전
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            인증 관련 용어가 헷갈릴 때 참고하세요. 일상적인 비유와 함께
            설명합니다.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {glossary.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.term}
                className="rounded-xl border bg-card p-5 flex flex-col gap-3"
              >
                <dt className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm">{item.term}</span>
                    <span className="ml-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                      {item.metaphor}
                    </span>
                  </div>
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </dd>
              </div>
            );
          })}
        </dl>
      </ScrollReveal>
    </section>
  );
}
