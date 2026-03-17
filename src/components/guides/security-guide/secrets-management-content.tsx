'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KeyRound } from 'lucide-react';

const envFiles = [
  { name: '.env', priority: 1, desc: '모든 환경 공통 기본값', commit: '상황에 따라', note: '시크릿이 없는 기본값만' },
  { name: '.env.local', priority: 2, desc: '로컬 개발 전용 시크릿', commit: '절대 금지', note: 'API 키, DB 비밀번호 등' },
  { name: '.env.development', priority: 3, desc: '개발 환경 설정', commit: '가능 (시크릿 없을 때)', note: '개발 서버 URL 등' },
  { name: '.env.production', priority: 4, desc: '프로덕션 환경 설정', commit: '절대 금지', note: '실제 서비스 키 — 배포 플랫폼에서 관리' },
  { name: '.env.example', priority: '-', desc: '환경변수 템플릿', commit: '필수 커밋', note: '키 이름만, 값은 비워둠' },
];

const envSeparation = [
  {
    env: '개발 (dev)',
    emoji: '💻',
    example: 'NEXT_PUBLIC_API_URL=http://localhost:3000/api',
    storage: '.env.local 파일',
    color: 'border-gray-200 dark:border-gray-700',
  },
  {
    env: '스테이징 (staging)',
    emoji: '🧪',
    example: 'NEXT_PUBLIC_API_URL=https://staging.myapp.com/api',
    storage: 'Vercel Preview 환경변수',
    color: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    env: '프로덕션 (prod)',
    emoji: '🌐',
    example: 'NEXT_PUBLIC_API_URL=https://myapp.com/api',
    storage: 'Vercel Production 환경변수',
    color: 'border-green-200 dark:border-green-800',
  },
];

const rotationSchedule = [
  { type: 'API 키 (OpenAI, Stripe 등)', period: '90일마다', method: '새 키 발급 → 환경변수 교체 → 구 키 삭제' },
  { type: 'DB 비밀번호', period: '180일마다', method: 'Supabase Dashboard에서 변경 → 환경변수 업데이트' },
  { type: 'OAuth 시크릿', period: '1년마다', method: '새 시크릿 생성 → 환경변수 교체' },
  { type: '노출 의심 키', period: '즉시', method: '키 무효화 → 새 키 발급 → 전체 환경변수 교체' },
];

export function SecretsManagementContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <KeyRound className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">시크릿 관리</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          API 키, DB 비밀번호 같은 시크릿은 코드에 직접 넣으면 안 됩니다.
          .env 파일 관리부터 키 로테이션까지, 시크릿을 안전하게 다루는 방법을 알아봅니다.
        </p>
      </ScrollReveal>

      {/* .env 파일 종류와 우선순위 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">.env 파일 종류와 우선순위</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            Next.js는 여러 종류의 .env 파일을 지원합니다. 우선순위가 높은 파일의 값이 낮은 파일을 덮어씁니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">우선순위</th>
                  <th className="text-left py-2 px-3 font-semibold">파일명</th>
                  <th className="text-left py-2 px-3 font-semibold">용도</th>
                  <th className="text-left py-2 px-3 font-semibold">Git 커밋</th>
                  <th className="text-left py-2 px-3 font-semibold">비고</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {envFiles.map((file) => (
                  <tr key={file.name} className="border-b">
                    <td className="py-2 px-3 text-center font-mono">{file.priority}</td>
                    <td className="py-2 px-3">
                      <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono font-medium text-foreground">{file.name}</code>
                    </td>
                    <td className="py-2 px-3">{file.desc}</td>
                    <td className="py-2 px-3">
                      <Badge
                        variant="secondary"
                        className={`text-[9px] ${
                          file.commit === '절대 금지'
                            ? 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300'
                            : file.commit === '필수 커밋'
                              ? 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {file.commit}
                      </Badge>
                    </td>
                    <td className="py-2 px-3">{file.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* .gitignore 설정 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">.gitignore 필수 설정</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl">
            <pre className="text-xs bg-muted/50 border rounded-xl p-4 overflow-x-auto leading-relaxed">
              <code>{`# .gitignore — 시크릿 파일 제외
.env
.env.local
.env.*.local
.env.development.local
.env.production.local

# 절대 커밋하면 안 되는 파일
*.pem
*.key
credentials.json
service-account.json`}</code>
            </pre>
            <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">중요:</strong> 이미 커밋된 .env 파일은 .gitignore에 추가해도 히스토리에 남아있습니다.
                <code className="bg-muted px-1 rounded font-mono text-[10px]">git rm --cached .env</code>로 추적을 해제하고,
                노출된 키는 즉시 교체하세요.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 환경별 시크릿 분리 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">환경별 시크릿 분리</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            개발·스테이징·프로덕션 환경마다 별도의 시크릿을 사용합니다.
            프로덕션 키를 개발에서 사용하면 실수로 실제 데이터에 영향을 줄 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl">
            {envSeparation.map((env) => (
              <div key={env.env} className={`rounded-xl border p-4 ${env.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{env.emoji}</span>
                  <span className="text-sm font-bold">{env.env}</span>
                </div>
                <pre className="text-[10px] bg-muted/50 border rounded-lg p-2 mb-2 overflow-x-auto">
                  <code>{env.example}</code>
                </pre>
                <div className="text-[10px] text-muted-foreground">
                  저장 위치: <strong className="text-foreground">{env.storage}</strong>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 키 로테이션 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">키 로테이션 주기와 방법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            API 키와 비밀번호는 정기적으로 교체(로테이션)해야 합니다.
            키가 유출되어도 피해를 최소화할 수 있습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-3 max-w-2xl">
            {rotationSchedule.map((item) => (
              <Card key={item.type}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {item.type}
                    <Badge variant="secondary" className="text-[10px]">{item.period}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.method}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">팁:</strong> Linkmap의 환경변수 관리 기능을 사용하면
              여러 서비스의 키를 한곳에서 관리하고, 로테이션 알림을 받을 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
