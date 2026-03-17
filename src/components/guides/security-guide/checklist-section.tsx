'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Shield, ShieldCheck, Globe } from 'lucide-react';

interface CheckItem {
  label: string;
  description: string;
}

interface CheckCategory {
  title: string;
  icon: typeof KeyRound;
  color: string;
  bgColor: string;
  items: CheckItem[];
}

const categories: CheckCategory[] = [
  {
    title: '시크릿 관리',
    icon: KeyRound,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    items: [
      { label: '.env 파일이 .gitignore에 포함되어 있는가?', description: '.env, .env.local, .env.*.local 모두 포함' },
      { label: 'API 키가 코드에 하드코딩되어 있지 않은가?', description: 'process.env 또는 환경변수 관리 서비스 사용' },
      { label: '키 로테이션 주기가 설정되어 있는가?', description: '최소 90일마다 키 교체, 노출 의심 시 즉시 교체' },
    ],
  },
  {
    title: '인증·인가',
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    items: [
      { label: 'API 라우트에 인증 체크가 있는가?', description: 'getUser() 또는 세션 검증을 모든 API에서 수행' },
      { label: '인증 조건문이 올바른 방향인가?', description: 'if (!user) return error — 반전 실수 주의' },
      { label: 'DB에 RLS 정책이 적용되어 있는가?', description: '다른 사용자의 데이터에 접근할 수 없도록 user_id 기반 제한' },
    ],
  },
  {
    title: '입력 검증',
    icon: ShieldCheck,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    items: [
      { label: '모든 API 입력에 Zod 검증을 적용했는가?', description: 'safeParse 사용 (parse 금지 — throw → 500 에러)' },
      { label: 'HTML에 사용자 입력을 직접 삽입하지 않는가?', description: 'dangerouslySetInnerHTML 금지, React 자동 이스케이프 활용' },
    ],
  },
  {
    title: '네트워크·통신',
    icon: Globe,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    items: [
      { label: 'HTTPS가 적용되어 있는가?', description: 'Vercel, Cloudflare는 자동 적용. 직접 서버는 Let\'s Encrypt 사용' },
      { label: 'CORS가 허용 출처만 지정되어 있는가?', description: 'Access-Control-Allow-Origin: * 금지, 도메인 명시' },
    ],
  },
];

export function ChecklistSection() {
  return (
    <section id="checklist" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">배포 전 보안 체크리스트</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          배포 전에 아래 10가지 항목을 반드시 확인하세요.
          하나라도 빠지면 보안 사고로 이어질 수 있습니다.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        {categories.map((cat, catIdx) => (
          <ScrollReveal key={cat.title} delay={catIdx * 0.08}>
            <Card className={`h-full ${cat.bgColor} border`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <cat.icon className={`h-4 w-4 ${cat.color}`} />
                  <CardTitle className="text-sm">{cat.title}</CardTitle>
                  <span className="text-[10px] text-muted-foreground ml-auto">{cat.items.length}항목</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {cat.items.map((item) => (
                    <li key={item.label} className="flex items-start gap-2.5">
                      <div className="mt-0.5 w-4 h-4 rounded border-2 border-current/20 shrink-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-sm bg-current/10" />
                      </div>
                      <div>
                        <div className="text-xs font-medium text-foreground leading-snug">{item.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{item.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      {/* 마무리 팁 */}
      <ScrollReveal delay={0.3}>
        <div className="mt-8 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">팁:</strong> 이 체크리스트를 팀 PR 리뷰 템플릿에 추가하면
            배포 전 보안 점검을 자동화할 수 있습니다.
            각 항목을 하나씩 확인한 뒤 배포 버튼을 누르세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
