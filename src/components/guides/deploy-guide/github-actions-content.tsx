'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

const coreConceptItems = [
  {
    name: 'Workflow',
    nameKr: '워크플로우',
    desc: '자동화 전체 흐름을 정의하는 YAML 파일입니다. .github/workflows/ 폴더에 저장합니다.',
    analogy: '요리 레시피 전체',
    icon: '📋',
    color: 'border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Job',
    nameKr: '잡',
    desc: '워크플로우 안에서 독립적으로 실행되는 작업 단위입니다. 여러 Job이 병렬로 실행될 수 있습니다.',
    analogy: '요리의 "준비", "조리", "플레이팅" 각 과정',
    icon: '📦',
    color: 'border-green-200 dark:border-green-800',
  },
  {
    name: 'Step',
    nameKr: '스텝',
    desc: 'Job 안의 개별 명령입니다. 순서대로 실행됩니다.',
    analogy: '"양파를 썰어라", "팬에 볶아라" 같은 개별 동작',
    icon: '▶️',
    color: 'border-yellow-200 dark:border-yellow-800',
  },
  {
    name: 'Action',
    nameKr: '액션',
    desc: '다른 사람이 만들어둔 재사용 가능한 Step입니다. Marketplace에서 수천 개를 찾을 수 있습니다.',
    analogy: '"밥 짓기"를 전기밥솥(남이 만든 도구)에 맡기는 것',
    icon: '🔧',
    color: 'border-purple-200 dark:border-purple-800',
  },
];

const yamlSyntax = [
  { key: 'name', desc: '워크플로우의 이름 (GitHub Actions 탭에 표시)', example: 'name: CI Pipeline' },
  { key: 'on', desc: '언제 실행할지 트리거 설정', example: 'on: push, pull_request' },
  { key: 'jobs', desc: '실행할 작업(Job) 목록', example: 'jobs: build, test, deploy' },
  { key: 'runs-on', desc: '실행 환경 (OS) 지정', example: 'runs-on: ubuntu-latest' },
  { key: 'steps', desc: '각 Job의 실행 단계 나열', example: 'steps: checkout, install, build' },
  { key: 'uses', desc: '미리 만들어진 Action 사용', example: 'uses: actions/checkout@v4' },
  { key: 'run', desc: '쉘 명령어 직접 실행', example: 'run: npm ci' },
];

const lintBuildExample = `# .github/workflows/ci.yml
name: CI — 린트 + 빌드 검사

on:
  pull_request:          # PR이 생성/업데이트될 때
    branches: [main]
  push:
    branches: [main]     # main 브랜치에 push될 때

jobs:
  lint-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: 코드 가져오기
        uses: actions/checkout@v4

      - name: Node.js 설정
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 린트 검사
        run: npm run lint

      - name: 타입 검사
        run: npm run typecheck

      - name: 빌드 테스트
        run: npm run build`;

const vercelDeployExample = `# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 코드 가져오기
        uses: actions/checkout@v4

      - name: Node.js 설정
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 의존성 설치
        run: npm ci

      - name: 빌드
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: \${{ secrets.SUPABASE_ANON_KEY }}

      - name: Vercel 배포
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}`;

const secretsSteps = [
  'GitHub 저장소 페이지로 이동',
  '상단 탭에서 "Settings" 클릭',
  '왼쪽 메뉴에서 "Secrets and variables" → "Actions" 클릭',
  '"New repository secret" 클릭',
  'Name에 키 이름 (예: SUPABASE_URL), Secret에 값 입력',
  '"Add secret" 클릭으로 저장',
];

const commonMistakes = [
  {
    mistake: 'YAML 들여쓰기 오류',
    emoji: '📐',
    desc: 'YAML은 들여쓰기(스페이스 2칸)가 문법입니다. 탭(Tab)을 사용하면 에러가 납니다.',
    fix: 'VS Code에서 "Indent Using Spaces: 2"로 설정하고, YAML 확장 프로그램을 설치하세요.',
  },
  {
    mistake: 'Secrets 이름 오타',
    emoji: '🔑',
    desc: 'secrets.SUPABASE_URL과 등록한 이름이 정확히 같아야 합니다.',
    fix: 'Settings → Secrets에서 등록한 이름을 복사해서 사용하세요. 대소문자를 구분합니다.',
  },
  {
    mistake: 'on 트리거 설정 실수',
    emoji: '🎯',
    desc: 'push만 설정하면 PR에서는 실행되지 않고, pull_request만 설정하면 직접 push할 때는 실행되지 않습니다.',
    fix: '보통은 push와 pull_request 모두 설정하는 것이 좋습니다.',
  },
  {
    mistake: 'npm ci 대신 npm install 사용',
    emoji: '📦',
    desc: 'npm install은 package-lock.json을 수정할 수 있어서 CI 환경에서 예상치 못한 문제가 발생할 수 있습니다.',
    fix: 'CI 환경에서는 항상 npm ci를 사용하세요. 더 빠르고 안정적입니다.',
  },
];

export function GithubActionsContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <GitBranch className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">GitHub Actions 가이드</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          GitHub Actions는 GitHub에서 무료로 제공하는 CI/CD 도구입니다.
          코드를 push하면 자동으로 검사하고 배포하는 파이프라인을 만들 수 있습니다.
        </p>
      </ScrollReveal>

      {/* GitHub Actions란? */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">GitHub Actions란?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm leading-relaxed">
            GitHub Actions는 GitHub 저장소에서 코드 변경이 발생했을 때
            자동으로 원하는 작업을 실행해주는 도구입니다.
            마치 <strong className="text-foreground">로봇 비서</strong>가 &quot;코드 올라왔어? 그럼 검사하고 배포할게!&quot;
            해주는 것과 같습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-8">
            {[
              { icon: '🤖', title: '완전 자동화', desc: 'git push 한 번이면 끝. 검사, 빌드, 배포가 자동 실행됩니다.' },
              { icon: '🆓', title: '무료로 충분', desc: '공개 저장소는 무제한, 비공개도 월 2000분 무료입니다.' },
              { icon: '🧩', title: '풍부한 마켓플레이스', desc: '다른 개발자가 만든 수천 개의 Action을 바로 사용할 수 있습니다.' },
              { icon: '📊', title: 'GitHub 통합', desc: 'PR에 검사 결과가 자동으로 표시됩니다. 별도 도구가 필요 없습니다.' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="text-xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold mb-1">{item.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 핵심 개념 4가지 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">핵심 개념 4가지</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            GitHub Actions를 이해하려면 4가지 핵심 개념만 알면 됩니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3 mb-8">
            {coreConceptItems.map((item) => (
              <Card key={item.name} className={item.color}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">({item.nameKr})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                  <p className="text-[10px] text-muted-foreground">
                    🏠 <strong className="text-foreground">비유:</strong> {item.analogy}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        {/* 구조 도식 */}
        <ScrollReveal delay={0.15}>
          <div className="max-w-xl mb-8">
            <div className="rounded-lg border bg-card shadow-sm p-4">
              <div className="text-xs font-semibold mb-3">Workflow 구조 한눈에 보기</div>
              <div className="space-y-2 text-[11px] font-mono text-muted-foreground">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-2 border border-blue-200 dark:border-blue-800">
                  📋 <span className="text-foreground font-semibold">Workflow</span> (deploy.yml)
                  <div className="ml-4 mt-2 space-y-2">
                    <div className="bg-green-50 dark:bg-green-950/30 rounded p-2 border border-green-200 dark:border-green-800">
                      📦 <span className="text-foreground font-semibold">Job</span> (build)
                      <div className="ml-4 mt-1 space-y-1">
                        <div className="flex items-center gap-1">▶️ <span className="text-foreground">Step 1:</span> uses: actions/checkout@v4 <span className="text-purple-500">(Action)</span></div>
                        <div className="flex items-center gap-1">▶️ <span className="text-foreground">Step 2:</span> run: npm ci</div>
                        <div className="flex items-center gap-1">▶️ <span className="text-foreground">Step 3:</span> run: npm run build</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* YAML 문법 기초 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">워크플로우 YAML 문법 기초</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            YAML은 설정 파일을 작성하는 형식입니다. 들여쓰기(스페이스 2칸)로 구조를 표현합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl overflow-x-auto mb-8">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 font-semibold">키워드</th>
                  <th className="text-left py-2 px-3 font-semibold">설명</th>
                  <th className="text-left py-2 px-3 font-semibold text-muted-foreground">예시</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {yamlSyntax.map((row) => (
                  <tr key={row.key} className="border-b">
                    <td className="py-2 px-3">
                      <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px]">{row.key}</code>
                    </td>
                    <td className="py-2 px-3">{row.desc}</td>
                    <td className="py-2 px-3 font-mono text-[10px]">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* 실전 예제 1: 린트+빌드 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">실전 예제 1: 린트 + 빌드 자동 검사</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            가장 기본적인 CI 워크플로우입니다. 코드를 push하면 린트, 타입 검사, 빌드를 자동으로 실행합니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b flex items-center gap-2">
                <Badge variant="secondary" className="text-[9px] bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300">예제 1</Badge>
                <span className="text-xs text-muted-foreground font-mono">.github/workflows/ci.yml</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {lintBuildExample}
              </pre>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground">
                💡 이 워크플로우는 PR이나 push가 발생할 때마다 코드 품질을 자동으로 검사합니다.
                검사에 실패하면 GitHub PR에 ❌ 표시가 나타납니다.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 실전 예제 2: Vercel 배포 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">실전 예제 2: Vercel 자동 배포</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            main 브랜치에 push하면 자동으로 Vercel에 배포하는 워크플로우입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="rounded-lg border bg-muted/50">
              <div className="px-4 py-2 border-b flex items-center gap-2">
                <Badge variant="secondary" className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">예제 2</Badge>
                <span className="text-xs text-muted-foreground font-mono">.github/workflows/deploy.yml</span>
              </div>
              <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {vercelDeployExample}
              </pre>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* GitHub Secrets 등록 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">GitHub Secrets 등록 방법</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            API 키 같은 민감한 정보는 GitHub Secrets에 등록해서 안전하게 사용합니다.
            코드에 직접 넣으면 절대 안 됩니다!
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3 mb-6">
            {secretsSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm rounded-lg border bg-card shadow-sm p-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 font-bold">
                  {i + 1}
                </span>
                <span className="text-xs text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mb-8">
            <h4 className="text-sm font-semibold mb-3">자주 등록하는 Secrets</h4>
            <div className="space-y-2">
              {[
                { key: 'SUPABASE_URL', value: 'Supabase 프로젝트 URL' },
                { key: 'SUPABASE_ANON_KEY', value: 'Supabase 익명 키 (ANON KEY)' },
                { key: 'VERCEL_TOKEN', value: 'Vercel API 토큰 (vercel.com → Settings → Tokens)' },
                { key: 'VERCEL_ORG_ID', value: 'Vercel 조직 ID (.vercel/project.json에서 확인)' },
                { key: 'VERCEL_PROJECT_ID', value: 'Vercel 프로젝트 ID (.vercel/project.json에서 확인)' },
              ].map((s) => (
                <div key={s.key} className="flex items-center gap-3 text-xs rounded border bg-card px-3 py-2">
                  <code className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] shrink-0">{s.key}</code>
                  <span className="text-muted-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 무료 한도 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">무료 한도</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 text-[10px]">공개 저장소</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">무제한</div>
                  <p className="text-xs text-muted-foreground">실행 시간 제한 없이 무료입니다.</p>
                </CardContent>
              </Card>
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px]">비공개 저장소</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">2,000분/월</div>
                  <p className="text-xs text-muted-foreground">대부분의 프로젝트에 충분합니다.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 흔한 실수와 해결법 */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">흔한 실수와 해결법</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-4 mb-8">
            {commonMistakes.map((item) => (
              <div key={item.mistake} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-semibold text-sm">{item.mistake}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                <div className="px-3 py-2 rounded bg-muted/50 text-xs text-muted-foreground">
                  ✅ <strong className="text-foreground">해결:</strong> {item.fix}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <h2 className="text-xl md:text-2xl font-bold mb-3">자주 묻는 질문</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-2xl space-y-3">
            {[
              { q: 'Vercel 자동 배포와 GitHub Actions, 뭘 써야 하나요?', a: 'Vercel에 GitHub 저장소를 연결하면 자동 배포가 됩니다. 추가로 린트 검사, 테스트 실행 등이 필요하면 GitHub Actions를 함께 사용하세요. 둘은 경쟁 관계가 아니라 보완 관계입니다.' },
              { q: 'YAML 파일은 어디에 만들어야 하나요?', a: '프로젝트 루트의 .github/workflows/ 폴더에 .yml 파일을 만들면 됩니다. 파일 이름은 자유롭게 정할 수 있습니다 (예: ci.yml, deploy.yml).' },
              { q: '워크플로우가 실패했을 때 어떻게 확인하나요?', a: 'GitHub 저장소 → Actions 탭에서 실행 결과와 로그를 확인할 수 있습니다. 실패한 Step을 클릭하면 상세 로그가 표시됩니다.' },
              { q: '로컬에서 GitHub Actions를 테스트할 수 있나요?', a: '네. act라는 도구를 사용하면 로컬에서 워크플로우를 실행해볼 수 있습니다. 다만 완벽한 재현은 아니므로 참고용으로 사용하세요.' },
            ].map((faq) => (
              <div key={faq.q} className="rounded-lg border bg-card shadow-sm p-4">
                <div className="text-sm font-medium mb-2">Q. {faq.q}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
