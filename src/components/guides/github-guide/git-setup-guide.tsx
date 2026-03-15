'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  { id: 'overview', label: '개요' },
  { id: 'install-git', label: 'Git 설치' },
  { id: 'signup', label: 'GitHub 가입' },
  { id: 'ssh', label: 'SSH 키 설정' },
  { id: 'config', label: 'git config' },
  { id: 'pitfalls', label: '주의사항' },
] as const;

export function GitSetupGuide() {
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
            Git 설치 + GitHub 가입
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            코드를 저장하고 공유하는 첫 단계입니다. Git을 설치하고 GitHub에 가입한 뒤,
            SSH 키 인증까지 설정하면 안전하게 코드를 push/pull할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-2 mt-6 text-sm text-muted-foreground">
            <span>설정 약 10분</span>
            <span>·</span>
            <span>무료</span>
            <span>·</span>
            <span>
              <a href="https://git-scm.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                git-scm.com
              </a>
            </span>
          </div>
        </div>
      </section>

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
          <h2 className="text-2xl font-bold mb-4">Git과 GitHub의 차이</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Git은 내 컴퓨터에 설치하는 버전 관리 도구입니다. 코드 변경 사항을 스냅샷으로 기록하고
            과거 버전으로 되돌리거나 여러 사람이 동시에 작업할 수 있게 해줍니다.
            GitHub는 Git 저장소를 클라우드에 호스팅하는 플랫폼으로, 팀 협업·코드 공유·이슈 관리를 제공합니다.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Git (로컬 도구)', desc: '내 컴퓨터에 설치. 커밋·브랜치·히스토리 관리' },
              { label: 'GitHub (클라우드)', desc: '저장소 호스팅. 원격 백업, 협업, PR, 이슈 관리' },
              { label: 'SSH 인증', desc: '비밀번호 없이 안전하게 push/pull하는 방법' },
              { label: 'git config', desc: '커밋에 이름·이메일을 기록하는 초기 설정' },
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

        {/* Git 설치 */}
        <section id="install-git">
          <h2 className="text-2xl font-bold mb-4">Git 설치</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Windows</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed mb-3">
                <li>
                  <a href="https://git-scm.com/downloads/win" target="_blank" rel="noopener noreferrer" className="underline">
                    git-scm.com/downloads/win
                  </a>에서 최신 버전 다운로드
                </li>
                <li>설치 파일 실행 후 모든 옵션을 기본값으로 유지하며 Next 클릭</li>
                <li>
                  <strong>Default editor</strong> 단계에서 선호하는 에디터 선택 (VS Code 권장)
                </li>
                <li>설치 완료 후 아래 명령으로 확인</li>
              </ol>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`git --version
# git version 2.49.0.windows.1 같은 출력이 나오면 성공`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">macOS</h3>
              <p className="text-sm text-muted-foreground mb-3">
                터미널에서 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">git --version</code>을 실행하면
                자동 설치 프롬프트가 나타납니다. 또는 Homebrew를 사용하세요.
              </p>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# Homebrew가 없다면 먼저 설치
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Git 설치
brew install git

# 확인
git --version`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Linux (Ubuntu/Debian)</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`sudo apt update
sudo apt install git

git --version`}
              </pre>
            </div>
          </div>
        </section>

        {/* GitHub 가입 */}
        <section id="signup">
          <h2 className="text-2xl font-bold mb-4">GitHub 가입</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">가입 방법</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>
                  <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer" className="underline">
                    github.com/signup
                  </a>에 접속
                </li>
                <li>이메일 주소 입력 후 계속 클릭</li>
                <li>비밀번호 설정 (8자 이상, 숫자·소문자 포함)</li>
                <li>사용자 이름(username) 입력 — 영문 소문자·숫자·하이픈만 사용 권장</li>
                <li>이메일 인증 코드 입력 후 가입 완료</li>
              </ol>
            </div>
            <Card className="bg-card shadow-sm border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">사용자 이름 선택 팁</p>
                <p className="text-sm text-muted-foreground">
                  사용자 이름은 GitHub URL에 포함됩니다 (예: github.com/my-username).
                  짧고 기억하기 쉬운 이름으로 선택하세요. 나중에 변경 가능하지만 연동된 서비스에 영향을 줄 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SSH 키 설정 */}
        <section id="ssh">
          <h2 className="text-2xl font-bold mb-4">SSH 키 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            SSH 키를 설정하면 매번 비밀번호를 입력하지 않고 안전하게 GitHub와 통신할 수 있습니다.
            2021년부터 GitHub는 HTTPS 비밀번호 인증을 지원하지 않으므로 SSH 또는 토큰 방식을 사용해야 합니다.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. SSH 키 생성</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# Ed25519 방식 키 생성 (권장)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 경로와 비밀번호 입력 프롬프트가 나타나면 Enter로 기본값 사용
# (비밀번호는 선택사항)

# 생성된 키 확인
cat ~/.ssh/id_ed25519.pub`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. GitHub에 공개 키 등록</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1.5 leading-relaxed">
                <li>위 명령의 출력값(ssh-ed25519로 시작하는 긴 문자열)을 전체 복사</li>
                <li>
                  GitHub 우측 상단 프로필 → <strong>Settings</strong> →{' '}
                  <strong>SSH and GPG keys</strong> → <strong>New SSH key</strong>
                </li>
                <li>Title에 기기 이름 입력 (예: My MacBook), Key에 복사한 내용 붙여넣기</li>
                <li>
                  <strong>Add SSH key</strong> 클릭
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 연결 테스트</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`ssh -T git@github.com

# 아래와 같이 출력되면 성공
# Hi username! You've successfully authenticated,
# but GitHub does not provide shell access.`}
              </pre>
            </div>

            <Card className="bg-card shadow-sm border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">Windows 사용자 주의</p>
                <p className="text-sm text-muted-foreground">
                  Git Bash(Git 설치 시 함께 설치됨)에서 위 명령을 실행하세요.
                  PowerShell이나 CMD에서는 SSH 명령이 다르게 동작할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* git config */}
        <section id="config">
          <h2 className="text-2xl font-bold mb-4">git config 기본 설정</h2>
          <p className="text-muted-foreground text-sm mb-4">
            커밋할 때 누가 작성했는지 기록하기 위해 이름과 이메일을 설정합니다.
            GitHub에 가입할 때 사용한 이메일과 동일하게 설정해야 커밋이 프로필에 연결됩니다.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">필수 설정</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 이름 설정 (GitHub 프로필 이름과 동일하게 권장)
git config --global user.name "홍길동"

# 이메일 설정 (GitHub 가입 이메일)
git config --global user.email "your-email@example.com"

# 설정 확인
git config --list`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">권장 추가 설정</h3>
              <pre className="bg-muted rounded-lg p-4 text-sm font-mono overflow-x-auto">
{`# 기본 브랜치 이름을 main으로 설정 (GitHub 기본값과 일치)
git config --global init.defaultBranch main

# 줄바꿈 처리 (Windows)
git config --global core.autocrlf true

# 줄바꿈 처리 (macOS/Linux)
git config --global core.autocrlf input

# 한글 파일명 깨짐 방지 (macOS/Linux)
git config --global core.quotepath false`}
              </pre>
            </div>
          </div>
        </section>

        {/* 주의사항 */}
        <section id="pitfalls">
          <h2 className="text-2xl font-bold mb-4">자주 하는 실수</h2>
          <div className="space-y-4">
            {[
              {
                title: '❌ SSH 대신 HTTPS URL 사용 후 인증 오류',
                bad: 'git clone https://github.com/username/repo.git\n# push 시 비밀번호 입력 요청 → 실패',
                good: 'git clone git@github.com:username/repo.git\n# SSH 방식으로 clone → 비밀번호 불필요',
                desc: 'GitHub은 2021년부터 HTTPS 비밀번호 인증을 중단했습니다. SSH 방식으로 clone하거나 Personal Access Token을 사용하세요.',
              },
              {
                title: '❌ git config를 저장소마다 따로 설정',
                bad: 'git config user.name "홍길동"\n# 해당 저장소에만 적용됨',
                good: 'git config --global user.name "홍길동"\n# 모든 저장소에 적용됨',
                desc: '--global 옵션 없이 설정하면 현재 저장소에만 적용됩니다. 보통은 --global로 한 번만 설정하면 됩니다.',
              },
              {
                title: '❌ SSH 공개 키(id_ed25519.pub) 대신 개인 키 등록',
                bad: 'cat ~/.ssh/id_ed25519\n# -----BEGIN OPENSSH PRIVATE KEY----- 로 시작 — 절대 공유 금지',
                good: 'cat ~/.ssh/id_ed25519.pub\n# ssh-ed25519 AAAA... 로 시작 — 이것을 GitHub에 등록',
                desc: '개인 키(id_ed25519)는 절대 외부에 공유하면 안 됩니다. .pub 확장자가 있는 공개 키만 GitHub에 등록하세요.',
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
