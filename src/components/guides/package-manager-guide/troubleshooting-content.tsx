'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const eresolveSteps = [
  {
    step: 1,
    title: '에러 메시지 확인',
    desc: '어떤 패키지끼리 충돌하는지 확인합니다.',
    code: 'npm ERR! ERESOLVE unable to resolve dependency tree\nnpm ERR! peer react@"^18.0.0" from some-library@1.0.0',
  },
  {
    step: 2,
    title: '--legacy-peer-deps로 우회',
    desc: '급한 경우 peer dependency 검사를 건너뜁니다.',
    code: 'npm install --legacy-peer-deps',
  },
  {
    step: 3,
    title: '근본 해결: 버전 맞추기',
    desc: '충돌하는 패키지를 호환되는 버전으로 변경합니다.',
    code: 'npm install some-library@latest\n# 또는 충돌 패키지의 호환 버전 확인\nnpm view some-library peerDependencies',
  },
];

const auditSeverity = [
  {
    level: 'critical',
    color: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    action: '즉시 해결 필수',
    desc: '원격 코드 실행 등 심각한 보안 취약점. 반드시 업데이트하세요.',
  },
  {
    level: 'high',
    color: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    action: '가능한 빨리 해결',
    desc: '심각한 취약점이지만 특정 조건에서만 발생합니다.',
  },
  {
    level: 'moderate',
    color: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
    action: '상황에 따라 판단',
    desc: '제한적인 영향. devDependencies에만 해당하면 무시 가능합니다.',
  },
  {
    level: 'low',
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    action: '대부분 무시 가능',
    desc: '영향이 거의 없는 수준의 이슈입니다.',
  },
];

const cleanReinstall = [
  { step: 1, cmd: 'rm -rf node_modules', desc: 'node_modules 폴더 삭제' },
  { step: 2, cmd: 'rm package-lock.json', desc: 'lock 파일 삭제 (선택)' },
  { step: 3, cmd: 'npm cache clean --force', desc: 'npm 캐시 초기화' },
  { step: 4, cmd: 'npm install', desc: '처음부터 다시 설치' },
];

const commonErrors = [
  {
    error: 'EACCES: permission denied',
    cause: '권한 부족 (주로 글로벌 설치 시)',
    solution: 'sudo npm install -g (Mac/Linux) 또는 관리자 권한 터미널 (Windows)',
  },
  {
    error: 'ERESOLVE unable to resolve dependency tree',
    cause: 'peer dependency 버전 충돌',
    solution: 'npm install --legacy-peer-deps 또는 충돌 패키지 버전 조정',
  },
  {
    error: 'ERR! code ENOENT',
    cause: 'package.json이 없거나 경로가 잘못됨',
    solution: '올바른 프로젝트 폴더에서 실행했는지 확인. npm init으로 생성',
  },
  {
    error: 'ERR! code ELIFECYCLE',
    cause: 'scripts 실행 중 에러 (빌드 실패 등)',
    solution: '에러 로그 위쪽을 확인. 주로 TypeScript 에러나 환경변수 누락',
  },
  {
    error: 'npm WARN deprecated',
    cause: '더 이상 관리되지 않는 패키지',
    solution: '대체 패키지 확인. 동작에 문제없으면 당장은 무시 가능',
  },
  {
    error: 'ETARGET: No matching version found',
    cause: '존재하지 않는 패키지 버전 요청',
    solution: 'npm view 패키지명 versions로 사용 가능한 버전 확인',
  },
  {
    error: 'MODULE_NOT_FOUND',
    cause: '패키지가 설치되지 않았거나 node_modules 손상',
    solution: 'npm install 재실행. 안 되면 node_modules 삭제 후 재설치',
  },
];

export function TroubleshootingContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">npm 에러 해결</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          npm을 쓰다 보면 반드시 만나게 되는 에러들. 당황하지 말고 여기서 해결법을 찾으세요.
        </p>
      </ScrollReveal>

      {/* ERESOLVE 에러 해결 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">ERESOLVE 에러 (peer dependency)</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            가장 흔한 npm 에러입니다. 패키지 A가 요구하는 다른 패키지의 버전과 실제 설치된 버전이 다를 때 발생합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-4 max-w-2xl mb-8">
            {eresolveSteps.map((s) => (
              <div key={s.step} className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-bold">
                    {s.step}
                  </span>
                  <span className="text-sm font-semibold">{s.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2 pl-9">{s.desc}</p>
                <div className="rounded bg-muted/50 px-3 py-2 ml-9">
                  <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap">{s.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* npm audit 경고 대응 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">npm audit 경고 대응</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            <code className="text-xs font-mono bg-muted px-1 rounded">npm audit</code>은 설치된 패키지의 보안 취약점을 검사합니다.
            심각도(severity)에 따라 대응 방법이 다릅니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="space-y-2 max-w-2xl mb-6">
            {auditSeverity.map((s) => (
              <div key={s.level} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                <Badge variant="secondary" className={`text-[10px] shrink-0 mt-0.5 ${s.color}`}>
                  {s.level}
                </Badge>
                <div>
                  <div className="text-xs font-semibold mb-0.5">{s.action}</div>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <Card className="max-w-2xl mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">자동 수정 시도</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded bg-muted/50 px-3 py-2">
                <code className="text-xs font-mono text-primary">npm audit fix</code>
                <span className="text-[10px] text-muted-foreground ml-2">— 호환 가능한 범위에서 자동 수정</span>
              </div>
              <div className="rounded bg-muted/50 px-3 py-2">
                <code className="text-xs font-mono text-primary">npm audit fix --force</code>
                <span className="text-[10px] text-muted-foreground ml-2">— major 버전 업도 포함 (주의 필요)</span>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </section>

      {/* node_modules 삭제 + 재설치 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">node_modules 삭제 + 재설치</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            원인 불명의 에러가 발생하면 &quot;컴퓨터 재부팅&quot;처럼 node_modules를 처음부터 다시 설치하는 것이 가장 확실합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-md mb-8">
            <div className="rounded-xl border bg-card shadow-sm p-5">
              <div className="space-y-3">
                {cleanReinstall.map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 font-bold mt-0.5">
                      {s.step}
                    </span>
                    <div>
                      <code className="text-xs font-mono text-primary">{s.cmd}</code>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl mb-8">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">Windows 팁:</strong> Windows에서는{' '}
              <code className="text-xs bg-muted px-1 rounded font-mono">rmdir /s /q node_modules</code>
              또는 PowerShell에서{' '}
              <code className="text-xs bg-muted px-1 rounded font-mono">Remove-Item -Recurse -Force node_modules</code>를
              사용하세요.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 흔한 에러 메시지 → 해결법 매핑 표 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">에러 메시지 해결 가이드</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            자주 만나는 npm 에러 메시지와 해결 방법을 정리했습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">에러 메시지</th>
                  <th className="text-left py-2 px-3 font-semibold">원인</th>
                  <th className="text-left py-2 px-3 font-semibold">해결 방법</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {commonErrors.map((err) => (
                  <tr key={err.error} className="border-b">
                    <td className="py-2 px-3">
                      <code className="font-mono text-[10px] text-red-500 bg-red-50 dark:bg-red-950/30 px-1 rounded break-all">
                        {err.error}
                      </code>
                    </td>
                    <td className="py-2 px-3">{err.cause}</td>
                    <td className="py-2 px-3 text-foreground">{err.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="p-3 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-xs text-muted-foreground">
              💡 <strong className="text-foreground">마지막 수단:</strong> 위 방법으로도 해결이 안 되면
              에러 메시지를 그대로 복사해서 검색하세요. Stack Overflow나 GitHub Issues에서
              같은 에러를 겪은 사람의 해결법을 찾을 수 있습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
