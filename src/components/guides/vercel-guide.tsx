'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'signup', label: '계정·프로젝트 연결' },
  { id: 'envvars', label: '환경변수 설정' },
  { id: 'deploy', label: '배포 설정' },
  { id: 'domain', label: '도메인 연결' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function VercelGuide() {
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
      {/* Hero */}
      <section className="py-12 md:py-20 border-b">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">배포</Badge>
            <Badge variant="outline">단계별</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Vercel 배포 가이드
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Vercel은 Next.js를 만든 팀이 운영하는 배포 플랫폼으로, GitHub 연동만으로
            자동 CI/CD, 프리뷰 배포, 글로벌 CDN을 무료로 사용할 수 있습니다.
            계정 생성부터 첫 배포까지 15분이면 충분합니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>⏱ 설정 약 15분</span>
            <span>·</span>
            <span>💳 Hobby 플랜 무료</span>
            <span>·</span>
            <span>🔗 <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">vercel.com</a></span>
          </div>
        </div>
      </section>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
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
          <h2 className="text-2xl font-bold mb-4">Vercel이란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Vercel은 프론트엔드·풀스택 애플리케이션을 위한 클라우드 배포 플랫폼입니다.
            GitHub 저장소를 연결하면 코드 푸시 시 자동으로 빌드하고 배포합니다.
            PR마다 고유한 프리뷰 URL을 생성해 팀 리뷰가 쉬워집니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: '자동 CI/CD', desc: 'main 브랜치 푸시 시 자동 프로덕션 배포' },
              { label: '프리뷰 배포', desc: 'PR마다 고유 URL 자동 생성 및 팀 공유' },
              { label: '글로벌 CDN', desc: '엣지 네트워크로 전 세계 빠른 응답' },
              { label: '환경변수 관리', desc: '프로덕션/프리뷰/개발 환경별 변수 분리' },
              { label: '서버리스 함수', desc: 'Next.js API Route 자동 Functions 변환' },
              { label: '도메인 연결', desc: '커스텀 도메인 + 자동 HTTPS 설정' },
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

        {/* 계정·프로젝트 연결 */}
        <section id="signup">
          <h2 className="text-2xl font-bold mb-4">계정 가입 및 프로젝트 연결</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. 계정 가입</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline">vercel.com</a>에 접속해
                <strong> Sign Up</strong>을 클릭합니다. GitHub 계정으로 가입하면 저장소 연동이 가장 간편합니다.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. 새 프로젝트 추가</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>대시보드에서 <strong>Add New → Project</strong> 클릭</li>
                <li>GitHub 저장소 목록에서 배포할 저장소 선택</li>
                <li>프레임워크 자동 감지 확인 (Next.js 자동 인식)</li>
                <li>환경변수 입력 (아래 환경변수 설정 참조)</li>
                <li><strong>Deploy</strong> 클릭 → 첫 배포 시작</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Vercel CLI로 배포 (선택사항)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 배포
vercel

# 프로덕션 배포
vercel --prod`}
              </pre>
            </div>
          </div>
        </section>

        {/* 환경변수 설정 */}
        <section id="envvars">
          <h2 className="text-2xl font-bold mb-4">환경변수 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Vercel 대시보드에서 환경변수를 관리하면 로컬 <code>.env.local</code>을 커밋하지 않아도 됩니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">대시보드에서 추가</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed mb-4">
                <li>프로젝트 대시보드 → <strong>Settings → Environment Variables</strong></li>
                <li>Key, Value 입력</li>
                <li>적용 환경 선택: Production / Preview / Development</li>
                <li><strong>Save</strong> 클릭</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">CLI로 로컬 동기화</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# Vercel에 저장된 환경변수를 .env.local로 내려받기
vercel env pull .env.local

# 특정 환경 지정
vercel env pull --environment=preview .env.preview.local`}
              </pre>
            </div>
            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">💡 Supabase + Vercel 통합</p>
                <p className="text-sm text-muted-foreground">
                  Vercel 대시보드 → Integrations → Supabase를 연결하면
                  Supabase 환경변수가 자동으로 Vercel에 동기화됩니다.
                  수동으로 복사할 필요가 없습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 배포 설정 */}
        <section id="deploy">
          <h2 className="text-2xl font-bold mb-4">배포 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            <code>vercel.json</code>으로 빌드 명령, 출력 디렉토리, 리다이렉트 등을 설정할 수 있습니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">vercel.json 예시</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">배포 브랜치 전략</h3>
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
          </div>
        </section>

        {/* 도메인 연결 */}
        <section id="domain">
          <h2 className="text-2xl font-bold mb-4">커스텀 도메인 연결</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. 도메인 추가</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>프로젝트 대시보드 → <strong>Settings → Domains</strong></li>
                <li>도메인 입력 (예: <code>my-app.com</code>)</li>
                <li>Vercel이 제공하는 DNS 레코드 확인</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. DNS 레코드 설정</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 루트 도메인 (A 레코드)
Type: A
Name: @
Value: 76.76.21.21

# www 서브도메인 (CNAME 레코드)
Type: CNAME
Name: www
Value: cname.vercel-dns.com`}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                DNS 전파는 최대 48시간이 걸릴 수 있지만 보통 수 분 내 완료됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ 환경변수 불일치',
                bad: '로컬: NEXT_PUBLIC_API_URL=http://localhost:3000\n(Vercel에 설정 누락)',
                good: 'vercel env pull로 동기화하거나\nVercel 대시보드에서 모든 환경변수 직접 추가',
                desc: '로컬과 Vercel의 환경변수가 다르면 "로컬에서는 되는데 배포하면 안 돼요" 문제가 발생합니다.',
              },
              {
                title: '❌ Hobby 플랜 10초 타임아웃',
                bad: '// API Route에서 오래 걸리는 작업\nawait longRunningTask()  // 10초 이상 → 504 오류',
                good: '// 백그라운드 작업은 큐(Queue) 또는 Cron으로 분리\n// 또는 Pro 플랜(최대 300초) 업그레이드',
                desc: 'Vercel Hobby 플랜의 서버리스 함수는 최대 10초로 제한됩니다. 긴 작업은 설계를 바꿔야 합니다.',
              },
              {
                title: '❌ .env 파일을 GitHub에 커밋',
                bad: 'git add .env\ngit commit -m "환경변수 추가"',
                good: '# .gitignore에 반드시 추가\n.env\n.env.local\n.env*.local',
                desc: '비밀 키가 GitHub에 올라가면 즉시 유출됩니다. .gitignore로 환경변수 파일을 제외하고 Vercel 대시보드에서 관리하세요.',
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
