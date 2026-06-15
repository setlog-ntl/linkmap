'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'signup', label: '가입 + GitHub 연동' },
  { id: 'import', label: 'Import Project' },
  { id: 'auto-deploy', label: '자동 배포' },
  { id: 'preview', label: '프리뷰 배포' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function VercelGithubDeployGuide() {
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    for (const el of els) observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>
      <section className="py-12 md:py-20 border-b">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Vercel</Badge>
            <Badge variant="outline">배포</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            GitHub 연동 + 첫 배포
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Vercel에 GitHub 저장소를 연결하고 첫 배포를 완료하는 방법을 설명합니다.
            자동 배포 파이프라인과 PR마다 생성되는 프리뷰 URL 기능도 함께 다룹니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 7분</span>
            <span>·</span>
            <span>Hobby 플랜 무료</span>
            <span>·</span>
            <span>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                vercel.com
              </a>
            </span>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none [mask-image:linear-gradient(to_right,black_85%,transparent)] md:[mask-image:none]">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-3xl py-10 space-y-16">

        {/* 개요 */}
        <section id="overview">
          <h2 className="text-2xl font-bold mb-4">Vercel + GitHub 자동 배포 흐름</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            GitHub 저장소를 Vercel에 연결하면 코드를 push할 때마다 자동으로 빌드·배포됩니다.
            main 브랜치는 프로덕션, 그 외 브랜치는 고유한 프리뷰 URL로 배포됩니다.
          </p>
          <div className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto mb-6">
            <p className="text-muted-foreground">git push → GitHub → Vercel Webhook → 빌드 → 배포 → URL 생성</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: '자동 CI/CD', desc: 'main 브랜치 push 시 자동 프로덕션 배포' },
              { label: '프리뷰 배포', desc: 'PR·기능 브랜치마다 고유 URL 자동 생성' },
              { label: '롤백', desc: '이전 배포 버전으로 1클릭 롤백' },
              { label: '빌드 로그', desc: '빌드 오류 실시간 확인, Slack 알림 설정 가능' },
            ].map((m) => (
              <Card key={m.label} className="bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm">{m.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 가입 + GitHub 연동 */}
        <section id="signup">
          <h2 className="text-2xl font-bold mb-4">Vercel 가입 및 GitHub 연동</h2>
          <div className="space-y-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
              <li>
                <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer" className="underline">
                  vercel.com/signup
                </a>에 접속
              </li>
              <li>
                <strong>Continue with GitHub</strong>으로 가입 — GitHub 계정 연동이 가장 편리합니다
              </li>
              <li>Vercel에서 GitHub 접근 권한 요청 시 <strong>Authorize Vercel</strong> 클릭</li>
              <li>계정 유형 선택: <strong>Personal Account</strong> (개인 프로젝트)</li>
            </ol>
            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">저장소 접근 권한 설정</p>
                <p className="text-sm text-muted-foreground">
                  GitHub 연동 시 모든 저장소 또는 선택한 저장소에만 접근을 허용할 수 있습니다.
                  보안을 위해 <strong>Only select repositories</strong>를 선택하고 배포할 저장소만 지정하는 것을 권장합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Import Project */}
        <section id="import">
          <h2 className="text-2xl font-bold mb-4">프로젝트 Import</h2>
          <div className="space-y-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
              <li>Vercel 대시보드 → <strong>Add New... → Project</strong></li>
              <li>GitHub 저장소 목록에서 배포할 저장소 선택 → <strong>Import</strong></li>
              <li>
                프레임워크 자동 감지 확인 — Next.js는 자동으로 인식됩니다
                <ul className="list-disc list-inside ml-4 mt-1 text-xs space-y-1">
                  <li>Build Command: <code className="bg-muted px-1 rounded">npm run build</code></li>
                  <li>Output Directory: <code className="bg-muted px-1 rounded">.next</code></li>
                </ul>
              </li>
              <li>
                환경변수 추가: <strong>Environment Variables</strong> 섹션에서 .env.local의 값들 입력
              </li>
              <li><strong>Deploy</strong> 클릭 → 첫 빌드 시작 (2~5분 소요)</li>
            </ol>

            <div>
              <h3 className="font-semibold mb-2">환경변수 추가 방법</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>Import 화면 또는 배포 후 Settings → Environment Variables</li>
                <li>Key, Value 입력</li>
                <li>적용 환경: Production, Preview, Development 선택</li>
                <li>Add 클릭</li>
              </ol>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto mt-3">
{`# 추가해야 할 주요 환경변수
NEXT_PUBLIC_SUPABASE_URL         → Production, Preview
NEXT_PUBLIC_SUPABASE_ANON_KEY    → Production, Preview
SUPABASE_SERVICE_ROLE_KEY        → Production, Preview
OPENAI_API_KEY                   → Production, Preview`}
              </pre>
            </div>
          </div>
        </section>

        {/* 자동 배포 */}
        <section id="auto-deploy">
          <h2 className="text-2xl font-bold mb-4">자동 배포 파이프라인</h2>
          <p className="text-muted-foreground text-sm mb-4">
            GitHub 저장소 연결 후 main 브랜치에 push하면 자동으로 프로덕션 배포가 시작됩니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">배포 브랜치 설정</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">브랜치</th>
                      <th className="text-left p-3 font-medium">배포 환경</th>
                      <th className="text-left p-3 font-medium">URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { branch: 'main', env: 'Production', url: 'your-app.vercel.app' },
                      { branch: 'feat/*, fix/*', env: 'Preview', url: 'your-app-git-feat-*.vercel.app' },
                      { branch: 'local', env: 'Development', url: 'localhost:3000' },
                    ].map((r) => (
                      <tr key={r.branch} className="hover:bg-muted/50">
                        <td className="p-3 font-mono text-xs">{r.branch}</td>
                        <td className="p-3">{r.env}</td>
                        <td className="p-3 text-muted-foreground text-xs">{r.url}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">배포 후 확인</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>배포 완료 시 Vercel 대시보드에서 URL 확인</li>
                <li>Deployments 탭에서 빌드 로그 확인 가능</li>
                <li>오류 발생 시 빌드 로그에서 원인 확인 후 수정 → push → 재배포</li>
              </ol>
            </div>
          </div>
        </section>

        {/* 프리뷰 배포 */}
        <section id="preview">
          <h2 className="text-2xl font-bold mb-4">프리뷰 배포</h2>
          <p className="text-muted-foreground text-sm mb-4">
            main이 아닌 브랜치에 push하거나 PR을 열면 자동으로 고유한 프리뷰 URL이 생성됩니다.
            팀원이 배포 전에 변경사항을 직접 확인할 수 있어 코드 리뷰 품질이 높아집니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">프리뷰 배포 URL 형식</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# PR 기반 프리뷰
https://my-app-git-feat-login-username.vercel.app

# 커밋 기반 프리뷰
https://my-app-abc1234-username.vercel.app`}
              </pre>
            </div>

            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">GitHub PR 자동 코멘트</p>
                <p className="text-sm text-muted-foreground">
                  PR을 열면 Vercel Bot이 자동으로 프리뷰 URL과 빌드 상태를 코멘트로 남깁니다.
                  팀원은 이 URL로 바로 접속하여 변경사항을 확인할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ 환경변수를 Vercel에 등록하지 않음',
                bad: '# 로컬에서는 .env.local로 동작\n# Vercel에 등록 안 함 → 배포 후 API 오류',
                good: '# Vercel 대시보드 → Settings → Environment Variables\n# 모든 환경변수 등록 후 Redeploy',
                desc: 'Vercel은 로컬의 .env.local을 읽지 못합니다. 배포 환경에 필요한 모든 환경변수를 Vercel 대시보드에서 별도로 등록해야 합니다.',
              },
              {
                title: '❌ Hobby 플랜 10초 타임아웃 미고려',
                bad: `// API Route에서 30초 이상 걸리는 작업
export async function GET() {
  const result = await slowOperation() // 10초 초과 → 504
  return Response.json(result)
}`,
                good: `// 작업을 분리하거나 백그라운드 처리
// 또는 Pro 플랜 (최대 300초) 사용
export async function GET() {
  // 10초 내에 응답 가능한 작업만
  return Response.json({ status: 'queued' })
}`,
                desc: 'Vercel Hobby 플랜의 서버리스 함수는 10초로 제한됩니다. 오래 걸리는 작업은 별도 서비스로 분리하거나 Pro 플랜을 고려하세요.',
              },
              {
                title: '❌ .env 파일을 GitHub에 커밋',
                bad: 'git add .env.local\ngit commit -m "환경변수 추가"\ngit push\n# GitHub에 API 키 노출!',
                good: '# .gitignore에 반드시 포함\n.env\n.env.local\n.env*.local',
                desc: '.env 파일이 GitHub에 올라가면 API 키가 공개됩니다. .gitignore에 추가했는지 반드시 확인하세요.',
              },
            ].map((p) => (
              <Card key={p.title} className="bg-card shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-destructive font-medium mb-1">나쁜 예</p>
                      <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{p.bad}</pre>
                    </div>
                    <div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">좋은 예</p>
                      <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{p.good}</pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
