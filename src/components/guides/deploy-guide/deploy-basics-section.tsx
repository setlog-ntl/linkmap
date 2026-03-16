'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const manualVsAuto = [
  {
    type: '수동 배포 (옛날 방식)',
    emoji: '📂',
    method: 'FTP로 파일 업로드',
    steps: ['코드 수정', '빌드 실행', 'FTP 프로그램 실행', '파일 하나씩 업로드', '혹시 빠진 파일 없나 확인...'],
    risk: '높음',
    riskColor: 'text-red-500',
    desc: '파일을 직접 서버에 올리는 방식입니다. 실수로 파일 하나를 빠뜨리면 사이트가 깨질 수 있습니다.',
    tagColor: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  {
    type: '자동 배포 (현대 방식)',
    emoji: '🚀',
    method: 'Git push → 자동 배포',
    steps: ['코드 수정', 'git push', '(자동) 빌드 + 테스트', '(자동) 서버에 배포', '끝!'],
    risk: '낮음',
    riskColor: 'text-green-500',
    desc: 'git push 한 번이면 빌드부터 배포까지 전부 자동입니다. 실수할 여지가 거의 없습니다.',
    tagColor: 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
  },
];

const environments = [
  {
    name: '로컬 (Local)',
    alias: '개발 환경',
    emoji: '💻',
    url: 'localhost:3000',
    db: '개발용 DB (또는 로컬 DB)',
    envVars: '.env.local 파일',
    access: '나만 접속 가능',
    purpose: '코드 작성 + 실시간 테스트',
    color: 'border-gray-200 dark:border-gray-700',
    badgeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  },
  {
    name: '스테이징 (Staging)',
    alias: '테스트 환경',
    emoji: '🧪',
    url: 'staging.my-app.com',
    db: '테스트용 DB (실제와 유사)',
    envVars: 'Vercel Preview 환경변수',
    access: '팀원만 접속 가능',
    purpose: '배포 전 최종 검증',
    color: 'border-yellow-200 dark:border-yellow-800',
    badgeColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    name: '프로덕션 (Production)',
    alias: '실서비스 환경',
    emoji: '🌐',
    url: 'my-app.com',
    db: '실제 사용자 데이터 DB',
    envVars: '프로덕션 환경변수 (보안 주의)',
    access: '전 세계 누구나 접속',
    purpose: '실제 사용자가 쓰는 서비스',
    color: 'border-green-200 dark:border-green-800',
    badgeColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

export function DeployBasicsSection() {
  return (
    <section id="deploy-basics" className="scroll-mt-24 py-12 md:py-16">
      {/* 배포란 무엇인가? */}
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">배포란 무엇인가?</h2>
        <p className="text-muted-foreground mb-4 max-w-2xl leading-relaxed">
          <strong className="text-foreground">배포(Deploy)</strong>란 내 컴퓨터에서 만든 코드를
          서버에 올려서 다른 사람도 접속할 수 있게 만드는 과정입니다.
        </p>
        <div className="max-w-2xl mb-10">
          <div className="rounded-lg border bg-card shadow-sm p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🏠 <strong className="text-foreground">실생활 비유:</strong> 집에서 요리한 음식(코드)을
              식당(서버)에 가져다 놓으면 손님(사용자)이 먹을 수 있게 됩니다.
              배포는 &quot;내 요리를 식당 메뉴에 올리는 과정&quot;이라고 생각하면 됩니다.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 수동 배포 vs 자동 배포 */}
      <ScrollReveal delay={0.1}>
        <h3 className="text-lg font-semibold mb-4">수동 배포 vs 자동 배포</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl">
          {manualVsAuto.map((item) => (
            <div key={item.type} className={`rounded-xl border p-5 ${item.tagColor}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <div className="font-bold text-sm">{item.type}</div>
                  <div className="text-[10px] text-muted-foreground">{item.method}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
              <div className="space-y-1.5">
                {item.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-4 h-4 rounded-full bg-background/50 text-[9px] flex items-center justify-center shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-current/10 text-xs">
                <span className="text-muted-foreground">실수 위험: </span>
                <span className={`font-semibold ${item.riskColor}`}>{item.risk}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 배포 환경 3가지 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-2">배포 환경 3가지</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          실제 서비스를 운영할 때는 3가지 환경을 분리해서 사용합니다.
          마치 요리사가 연습(로컬) → 시식회(스테이징) → 오픈(프로덕션) 순서로 진행하는 것과 같습니다.
        </p>

        {/* 흐름 도식 */}
        <div className="flex items-center justify-center gap-0 mb-6 overflow-x-auto pb-2">
          {environments.map((env, i) => (
            <div key={env.name} className="flex items-center">
              <div className={`rounded-xl border bg-card shadow-sm p-4 w-40 text-center ${env.color}`}>
                <div className="text-2xl mb-1">{env.emoji}</div>
                <div className="text-xs font-bold">{env.name}</div>
                <div className="text-[10px] text-muted-foreground">{env.alias}</div>
              </div>
              {i < environments.length - 1 && (
                <div className="px-1 shrink-0">
                  <svg className="w-5 h-4 text-muted-foreground/40" viewBox="0 0 20 16" fill="none">
                    <path d="M0 8h14m0 0-5-4m5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 환경별 차이점 표 */}
        <div className="max-w-3xl overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-semibold text-muted-foreground">구분</th>
                {environments.map((env) => (
                  <th key={env.name} className="text-left py-2 px-3 font-semibold">
                    <Badge variant="secondary" className={`text-[9px] ${env.badgeColor}`}>
                      {env.emoji} {env.name.split(' ')[0]}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">URL</td>
                {environments.map((env) => (
                  <td key={env.name} className="py-2 px-3">
                    <code className="text-[10px] bg-muted px-1 rounded font-mono">{env.url}</code>
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">데이터베이스</td>
                {environments.map((env) => (
                  <td key={env.name} className="py-2 px-3">{env.db}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">환경변수</td>
                {environments.map((env) => (
                  <td key={env.name} className="py-2 px-3">{env.envVars}</td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-2 px-3 font-medium text-foreground">접근 권한</td>
                {environments.map((env) => (
                  <td key={env.name} className="py-2 px-3">{env.access}</td>
                ))}
              </tr>
              <tr>
                <td className="py-2 px-3 font-medium text-foreground">용도</td>
                {environments.map((env) => (
                  <td key={env.name} className="py-2 px-3">{env.purpose}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-3 rounded-lg bg-muted/50 border max-w-2xl">
          <p className="text-xs text-muted-foreground">
            💡 <strong className="text-foreground">초보자 팁:</strong> 처음에는 로컬 + 프로덕션 2개만 사용해도 충분합니다.
            팀으로 개발하거나 서비스가 커지면 스테이징 환경을 추가하세요.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
