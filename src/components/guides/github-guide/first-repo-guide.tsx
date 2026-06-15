'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { StepCardWithScreenshot } from '../auth-guide/step-card-with-screenshot';
import { firstRepoSteps } from './first-repo-screenshots';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'create-repo', label: '레포 생성' },
  { id: 'git-init', label: 'git init' },
  { id: 'first-commit', label: '첫 커밋' },
  { id: 'push', label: 'git push' },
  { id: 'gitignore', label: '.gitignore' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function FirstRepoGuide() {
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
            <Badge variant="secondary">GitHub</Badge>
            <Badge variant="outline">초보자용</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            첫 저장소 만들기
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GitHub에 저장소(Repository)를 만들고, 로컬 프로젝트를 연결하여 첫 커밋을 push하는
            전체 과정을 단계별로 설명합니다. .gitignore 설정으로 불필요한 파일이 올라가지 않도록 합니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 15분</span>
            <span>·</span>
            <span>Git 설치 선행 필요</span>
            <span>·</span>
            <span>
              <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                github.com/new
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
          <h2 className="text-2xl font-bold mb-4">저장소(Repository)란?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            저장소는 프로젝트의 모든 파일과 변경 히스토리를 담는 컨테이너입니다.
            로컬(내 컴퓨터)과 원격(GitHub) 두 곳에 존재하며, push/pull로 동기화합니다.
            팀 협업 시 Pull Request(PR)를 통해 코드를 리뷰하고 병합합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'git init', desc: '로컬 폴더를 Git 저장소로 초기화' },
              { label: 'git add', desc: '변경 파일을 스테이징 영역에 추가' },
              { label: 'git commit', desc: '스테이징된 파일을 스냅샷으로 저장' },
              { label: 'git push', desc: '로컬 커밋을 GitHub 원격 저장소에 업로드' },
            ].map((m) => (
              <Card key={m.label} className="bg-card shadow-sm">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm font-mono">{m.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 레포 생성 */}
        <section id="create-repo">
          <StepCardWithScreenshot data={firstRepoSteps[0]} colorScheme="blue" />
          <h2 className="text-2xl font-bold mb-4 mt-8">GitHub에서 저장소 생성</h2>
          <div className="space-y-4">
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2 leading-relaxed">
              <li>
                <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="underline">
                  github.com/new
                </a>에 접속
              </li>
              <li>
                <strong>Repository name</strong>에 프로젝트 이름 입력
                (영문 소문자, 하이픈 권장 — 예: my-first-app)
              </li>
              <li>
                공개 범위 선택:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Public</strong> — 누구나 볼 수 있음 (오픈소스)</li>
                  <li><strong>Private</strong> — 나와 초대한 사람만 볼 수 있음</li>
                </ul>
              </li>
              <li>
                <strong>Add a README file</strong> 체크 (선택 사항)
                — 로컬 프로젝트를 연결할 때는 체크하지 않는 것이 편합니다
              </li>
              <li>
                <strong>Add .gitignore</strong>에서 사용 언어/프레임워크 선택 (예: Node)
              </li>
              <li>
                <strong>Create repository</strong> 클릭
              </li>
            </ol>
            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">처음부터 시작 vs 기존 프로젝트 연결</p>
                <p className="text-sm text-muted-foreground">
                  새 프로젝트를 시작한다면 GitHub에서 저장소 생성 후 clone하는 방법이 가장 깔끔합니다.
                  기존 로컬 프로젝트가 있다면 빈 저장소를 만든 뒤 아래 git init 방법으로 연결하세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* git init */}
        <section id="git-init">
          <StepCardWithScreenshot data={firstRepoSteps[1]} colorScheme="emerald" />
          <h2 className="text-2xl font-bold mb-4 mt-8">git init — 로컬 프로젝트 초기화</h2>
          <p className="text-muted-foreground text-sm mb-4">
            기존 로컬 프로젝트를 GitHub에 연결하는 방법입니다.
            GitHub에서 빈 저장소를 먼저 만든 뒤 아래 순서로 진행하세요.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">방법 A: 기존 폴더를 Git 저장소로 초기화</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 프로젝트 폴더로 이동
cd my-project

# Git 저장소 초기화
git init

# GitHub 원격 저장소 연결 (SSH 방식 권장)
git remote add origin git@github.com:username/my-project.git

# 연결 확인
git remote -v`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">방법 B: GitHub 저장소를 먼저 clone</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# SSH 방식으로 clone (SSH 키 설정 완료 후)
git clone git@github.com:username/my-project.git

# clone한 폴더로 이동
cd my-project`}
              </pre>
            </div>
          </div>
        </section>

        {/* 첫 커밋 */}
        <section id="first-commit">
          <StepCardWithScreenshot data={firstRepoSteps[2]} colorScheme="yellow" />
          <h2 className="text-2xl font-bold mb-4 mt-8">첫 커밋 만들기</h2>
          <p className="text-muted-foreground text-sm mb-4">
            커밋은 코드 변경 사항의 스냅샷입니다. 의미 있는 단위로 커밋하면 나중에
            히스토리를 추적하기 쉽습니다.
          </p>
          <div className="space-y-4">
            <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 변경된 모든 파일을 스테이징
git add .

# 특정 파일만 스테이징
git add src/index.ts README.md

# 스테이징 상태 확인
git status

# 커밋 메시지와 함께 커밋
git commit -m "feat: 초기 프로젝트 설정"

# 커밋 히스토리 확인
git log --oneline`}
            </pre>

            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-2">좋은 커밋 메시지 작성법</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><code className="bg-muted px-1 rounded">feat:</code> 새 기능 추가</p>
                  <p><code className="bg-muted px-1 rounded">fix:</code> 버그 수정</p>
                  <p><code className="bg-muted px-1 rounded">docs:</code> 문서 수정</p>
                  <p><code className="bg-muted px-1 rounded">refactor:</code> 코드 리팩토링</p>
                  <p><code className="bg-muted px-1 rounded">chore:</code> 빌드·설정 변경</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* git push */}
        <section id="push">
          <StepCardWithScreenshot data={firstRepoSteps[3]} colorScheme="blue" />
          <h2 className="text-2xl font-bold mb-4 mt-8">GitHub에 push하기</h2>
          <div className="space-y-4">
            <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# main 브랜치로 첫 번째 push (upstream 설정 포함)
git push -u origin main

# 이후부터는 간단히
git push

# 원격 변경사항 가져오기
git pull`}
            </pre>

            <div>
              <h3 className="font-semibold mb-2">일반적인 개발 흐름</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 1. 원격 최신 상태 반영
git pull

# 2. 코드 작업...

# 3. 변경사항 스테이징
git add .

# 4. 커밋
git commit -m "feat: 로그인 기능 추가"

# 5. GitHub에 업로드
git push`}
              </pre>
            </div>
          </div>
        </section>

        {/* .gitignore */}
        <section id="gitignore">
          <StepCardWithScreenshot data={firstRepoSteps[4]} colorScheme="emerald" />
          <h2 className="text-2xl font-bold mb-4 mt-8">.gitignore 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            .gitignore 파일에 패턴을 추가하면 해당 파일은 Git이 추적하지 않습니다.
            환경변수 파일, node_modules, 빌드 결과물은 반드시 gitignore에 추가해야 합니다.
          </p>
          <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# .gitignore

# 환경변수 (절대 커밋하면 안 됨)
.env
.env.local
.env*.local

# 패키지 의존성 (npm install로 재설치 가능)
node_modules/

# 빌드 결과물
.next/
dist/
out/
build/

# 에디터 설정
.vscode/
.idea/
*.swp

# OS 파일
.DS_Store
Thumbs.db`}
          </pre>

          <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800 mt-4">
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1">이미 커밋된 파일은 어떻게 제거하나요?</p>
              <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto">
{`# 추적 목록에서만 제거 (파일은 유지)
git rm --cached .env

# 커밋 후 push
git commit -m "chore: .env 추적 제거"
git push`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ .env 파일을 GitHub에 커밋',
                bad: 'git add .\ngit commit -m "환경변수 추가"\n# .env가 포함되어 API 키 유출',
                good: '# .gitignore에 추가\necho ".env" >> .gitignore\ngit add .gitignore',
                desc: '환경변수 파일(.env)이 GitHub에 올라가면 API 키가 공개됩니다. 가입 직후 .gitignore 설정을 먼저 하세요.',
              },
              {
                title: '❌ node_modules를 push',
                bad: 'git add node_modules\n# 수십만 개 파일이 push됨 → 매우 느림',
                good: '# .gitignore에 node_modules/ 추가\n# 팀원은 npm install로 재설치',
                desc: 'node_modules는 package.json으로 재설치할 수 있습니다. 저장소 용량을 불필요하게 늘리지 마세요.',
              },
              {
                title: '❌ 모든 변경을 한 커밋에 몰아 넣기',
                bad: 'git commit -m "여러 기능 추가"\n# 로그인, 회원가입, DB 연결이 하나의 커밋에',
                good: 'git commit -m "feat: 로그인 기능 추가"\ngit commit -m "feat: 회원가입 기능 추가"\ngit commit -m "feat: DB 연결 설정"',
                desc: '작은 단위로 자주 커밋하면 문제 발생 시 되돌리기 쉽고, 코드 리뷰도 편해집니다.',
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
