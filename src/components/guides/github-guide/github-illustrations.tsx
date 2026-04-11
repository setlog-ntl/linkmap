'use client';

import type { ReactNode } from 'react';
import { ConsoleFrame } from '../auth-guide/console-frame';

/* ── Shared annotation helpers ── */

function ClickMarker({ cx, cy, num }: { cx: number; cy: number; num: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="14" fill="#ef4444" opacity="0.2"
        style={{ animation: 'pulse-ring 1.5s ease-out infinite' }} />
      <circle cx={cx} cy={cy} r="10" fill="#ef4444" />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="10" fontWeight="bold">{num}</text>
    </g>
  );
}

function InputField({ x, y, w, h, label, value }: {
  x: number; y: number; w: number; h: number; label: string; value?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#1e293b" stroke="#3b82f6"
        strokeWidth="1.5" strokeDasharray="5,3" rx="3" />
      <text x={x + 6} y={y - 4} fill="#3b82f6" fontSize="9" fontWeight="600">
        INPUT: {label}
      </text>
      {value && (
        <text x={x + 8} y={y + h / 2 + 1} fill="#9aa0a6" fontSize="9"
          dominantBaseline="central">{value}</text>
      )}
    </g>
  );
}

const pulseKeyframes = `
@keyframes pulse-ring {
  0% { r: 10; opacity: 0.3; }
  100% { r: 20; opacity: 0; }
}
`;

/* ── Terminal Line Helper ── */
function TLine({ y, children }: { y: number; children: ReactNode }) {
  return (
    <text x="16" y={y} fill="#e8eaed" fontSize="11" fontFamily="monospace">
      {children}
    </text>
  );
}

function TComment({ y, children }: { y: number; children: ReactNode }) {
  return (
    <text x="16" y={y} fill="#6a9955" fontSize="10" fontFamily="monospace">
      {children}
    </text>
  );
}

function TPrompt({ y, cmd }: { y: number; cmd: string }) {
  return (
    <g>
      <text x="16" y={y} fill="#6bdf6b" fontSize="11" fontFamily="monospace">$</text>
      <text x="30" y={y} fill="#e8eaed" fontSize="11" fontFamily="monospace">{cmd}</text>
    </g>
  );
}

function TOutput({ y, text, color = '#9aa0a6' }: { y: number; text: string; color?: string }) {
  return (
    <text x="16" y={y} fill={color} fontSize="10" fontFamily="monospace">{text}</text>
  );
}

/* ══════════════════════════════════════════════════
   1. GitHub 가입 폼
   ══════════════════════════════════════════════════ */
function SignupIllustration() {
  return (
    <ConsoleFrame url="github.com/signup">
      <svg viewBox="0 0 500 280" className="w-full">
        <style>{pulseKeyframes}</style>
        {/* Background */}
        <rect width="500" height="280" fill="#0d1117" />
        {/* GitHub logo */}
        <text x="250" y="35" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
          GitHub
        </text>
        <text x="250" y="58" textAnchor="middle" fill="#8b949e" fontSize="12">
          Welcome to GitHub! Let&apos;s begin the adventure
        </text>
        {/* Form */}
        <text x="130" y="90" fill="#c9d1d9" fontSize="11">Enter your email *</text>
        <InputField x={130} y={96} w={240} h={30} label="이메일" value="your-email@example.com" />
        <ClickMarker cx={370} cy={111} num={1} />

        <text x="130" y="148" fill="#c9d1d9" fontSize="11">Create a password *</text>
        <InputField x={130} y={154} w={240} h={30} label="비밀번호" value="••••••••" />

        <text x="130" y="206" fill="#c9d1d9" fontSize="11">Enter a username *</text>
        <InputField x={130} y={212} w={240} h={30} label="사용자 이름" value="my-username" />

        {/* Continue button */}
        <rect x={130} y={252} width={240} height={22} rx="6" fill="#238636" />
        <text x="250" y="267" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
          Continue
        </text>
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   2. Git 다운로드 페이지
   ══════════════════════════════════════════════════ */
function GitDownloadIllustration() {
  return (
    <ConsoleFrame url="git-scm.com/downloads">
      <svg viewBox="0 0 500 260" className="w-full">
        <style>{pulseKeyframes}</style>
        <rect width="500" height="260" fill="#f5f0eb" />
        {/* Header */}
        <rect width="500" height="45" fill="#f05033" />
        <text x="20" y="29" fill="white" fontSize="16" fontWeight="bold">Git</text>
        <text x="55" y="29" fill="#ffd5cc" fontSize="11">Downloads</text>
        {/* Main content */}
        <text x="250" y="80" textAnchor="middle" fill="#333" fontSize="16" fontWeight="bold">
          Downloads
        </text>
        {/* OS Cards */}
        <rect x="40" y="100" width="120" height="80" rx="8" fill="white" stroke="#ddd" />
        <text x="100" y="130" textAnchor="middle" fill="#333" fontSize="12" fontWeight="600">
          Windows
        </text>
        <text x="100" y="150" textAnchor="middle" fill="#888" fontSize="9">64-bit / 32-bit</text>
        <ClickMarker cx={100} cy={168} num={1} />

        <rect x="190" y="100" width="120" height="80" rx="8" fill="white" stroke="#ddd" />
        <text x="250" y="130" textAnchor="middle" fill="#333" fontSize="12" fontWeight="600">
          macOS
        </text>
        <text x="250" y="150" textAnchor="middle" fill="#888" fontSize="9">Universal Binary</text>

        <rect x="340" y="100" width="120" height="80" rx="8" fill="white" stroke="#ddd" />
        <text x="400" y="130" textAnchor="middle" fill="#333" fontSize="12" fontWeight="600">
          Linux
        </text>
        <text x="400" y="150" textAnchor="middle" fill="#888" fontSize="9">apt / yum / dnf</text>

        {/* Version info */}
        <text x="250" y="215" textAnchor="middle" fill="#666" fontSize="10">
          Latest source Release: 2.49.0
        </text>
        <text x="250" y="235" textAnchor="middle" fill="#888" fontSize="9">
          Release Notes (2025-03-24)
        </text>
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   3. SSH 키 생성 터미널
   ══════════════════════════════════════════════════ */
function SshKeygenIllustration() {
  return (
    <ConsoleFrame url="Terminal — ssh-keygen">
      <svg viewBox="0 0 500 220" className="w-full">
        <rect width="500" height="220" fill="#1e1e1e" />
        <TComment y={24}>{'# Ed25519 방식 키 생성 (권장)'}</TComment>
        <TPrompt y={44} cmd='ssh-keygen -t ed25519 -C "your-email@example.com"' />
        <TOutput y={64} text="Generating public/private ed25519 key pair." />
        <TOutput y={80} text="Enter file in which to save the key (/c/Users/you/.ssh/id_ed25519):" />
        <TOutput y={96} text="Enter passphrase (empty for no passphrase):" />
        <TOutput y={112} text="Your identification has been saved in /c/Users/you/.ssh/id_ed25519" />
        <TOutput y={128} text="Your public key has been saved in /c/Users/you/.ssh/id_ed25519.pub" />
        <TOutput y={148} text="" />
        <TComment y={168}>{'# 생성된 공개 키 확인 — 이 내용을 GitHub에 등록합니다'}</TComment>
        <TPrompt y={188} cmd="cat ~/.ssh/id_ed25519.pub" />
        <TOutput y={206} text="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... your-email@example.com" color="#58a6ff" />
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   4. GitHub SSH 키 등록 화면
   ══════════════════════════════════════════════════ */
function SshGithubIllustration() {
  return (
    <ConsoleFrame url="github.com/settings/ssh/new">
      <svg viewBox="0 0 500 260" className="w-full">
        <style>{pulseKeyframes}</style>
        <rect width="500" height="260" fill="#0d1117" />
        {/* Header */}
        <text x="20" y="30" fill="#c9d1d9" fontSize="14" fontWeight="bold">
          SSH and GPG keys / Add new SSH key
        </text>
        <rect x="20" y="40" width="460" height="1" fill="#30363d" />
        {/* Title field */}
        <text x="20" y="68" fill="#c9d1d9" fontSize="11">Title</text>
        <InputField x={20} y={74} w={460} h={28} label="기기 이름" value="My Windows PC" />
        <ClickMarker cx={460} cy={88} num={1} />
        {/* Key type */}
        <text x="20" y="126" fill="#c9d1d9" fontSize="11">Key type</text>
        <rect x="20" y="132" width="120" height="24" rx="6" fill="#21262d" stroke="#30363d" />
        <text x="30" y="148" fill="#c9d1d9" fontSize="10">Authentication Key ▾</text>
        {/* Key textarea */}
        <text x="20" y="178" fill="#c9d1d9" fontSize="11">Key</text>
        <rect x="20" y="184" width="460" height="40" rx="6" fill="#0d1117" stroke="#3b82f6"
          strokeWidth="1.5" strokeDasharray="5,3" />
        <text x="26" y="186" fill="#3b82f6" fontSize="9" fontWeight="600">INPUT: 공개 키 붙여넣기</text>
        <text x="30" y="208" fill="#484f58" fontSize="9" fontFamily="monospace">
          ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...
        </text>
        <ClickMarker cx={460} cy={204} num={2} />
        {/* Add button */}
        <rect x="20" y="232" width="120" height="24" rx="6" fill="#238636" />
        <text x="80" y="248" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
          Add SSH key
        </text>
        <ClickMarker cx={80} cy={244} num={3} />
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   5. SSH 연결 테스트 터미널
   ══════════════════════════════════════════════════ */
function SshTestIllustration() {
  return (
    <ConsoleFrame url="Terminal — ssh test">
      <svg viewBox="0 0 500 120" className="w-full">
        <rect width="500" height="120" fill="#1e1e1e" />
        <TComment y={24}>{'# GitHub 연결 테스트'}</TComment>
        <TPrompt y={44} cmd="ssh -T git@github.com" />
        <TOutput y={68} text="Hi username! You've successfully authenticated," color="#6bdf6b" />
        <TOutput y={84} text="but GitHub does not provide shell access." color="#6bdf6b" />
        <TOutput y={104} text="↑ 이 메시지가 나오면 SSH 설정 완료!" color="#f59e0b" />
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   6. git config 설정 터미널
   ══════════════════════════════════════════════════ */
function GitConfigIllustration() {
  return (
    <ConsoleFrame url="Terminal — git config">
      <svg viewBox="0 0 500 220" className="w-full">
        <rect width="500" height="220" fill="#1e1e1e" />
        <TComment y={24}>{'# 이름 설정 (GitHub 프로필 이름과 동일하게)'}</TComment>
        <TPrompt y={44} cmd='git config --global user.name "홍길동"' />
        <TComment y={68}>{'# 이메일 설정 (GitHub 가입 이메일)'}</TComment>
        <TPrompt y={88} cmd='git config --global user.email "your-email@example.com"' />
        <TComment y={112}>{'# 기본 브랜치 이름을 main으로 설정'}</TComment>
        <TPrompt y={132} cmd="git config --global init.defaultBranch main" />
        <TComment y={156}>{'# 설정 확인'}</TComment>
        <TPrompt y={176} cmd="git config --list" />
        <TOutput y={196} text="user.name=홍길동" />
        <TOutput y={210} text="user.email=your-email@example.com" />
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   7. GitHub 새 저장소 생성 폼
   ══════════════════════════════════════════════════ */
function NewRepoIllustration() {
  return (
    <ConsoleFrame url="github.com/new">
      <svg viewBox="0 0 500 300" className="w-full">
        <style>{pulseKeyframes}</style>
        <rect width="500" height="300" fill="#0d1117" />
        <text x="250" y="28" textAnchor="middle" fill="#c9d1d9" fontSize="14" fontWeight="bold">
          Create a new repository
        </text>
        <rect x="30" y="38" width="440" height="1" fill="#30363d" />
        {/* Owner / Repo name */}
        <text x="30" y="62" fill="#c9d1d9" fontSize="11">Owner</text>
        <text x="200" y="62" fill="#c9d1d9" fontSize="11">Repository name *</text>
        <rect x="30" y="68" width="150" height="26" rx="6" fill="#21262d" stroke="#30363d" />
        <text x="40" y="85" fill="#c9d1d9" fontSize="10">my-username ▾</text>
        <text x="190" y="82" fill="#8b949e" fontSize="14">/</text>
        <InputField x={200} y={68} w={200} h={26} label="저장소 이름" value="my-first-app" />
        <ClickMarker cx={400} cy={81} num={1} />
        {/* Visibility */}
        <text x="30" y="118" fill="#c9d1d9" fontSize="11">Visibility</text>
        {/* Public */}
        <circle cx="44" cy="136" r="7" fill="none" stroke="#30363d" strokeWidth="2" />
        <text x="58" y="140" fill="#c9d1d9" fontSize="10" fontWeight="600">Public</text>
        <text x="58" y="154" fill="#8b949e" fontSize="9">
          Anyone on the internet can see this repository.
        </text>
        {/* Private - selected */}
        <circle cx="44" cy="174" r="7" fill="#58a6ff" stroke="#58a6ff" strokeWidth="2" />
        <circle cx="44" cy="174" r="3" fill="white" />
        <text x="58" y="178" fill="#c9d1d9" fontSize="10" fontWeight="600">Private</text>
        <text x="58" y="192" fill="#8b949e" fontSize="9">
          You choose who can see and commit to this repository.
        </text>
        <ClickMarker cx={44} cy={174} num={2} />
        {/* README checkbox */}
        <rect x="30" y="208" width="440" height="1" fill="#30363d" />
        <text x="30" y="228" fill="#c9d1d9" fontSize="11">Initialize this repository with:</text>
        <rect x="30" y="238" width="14" height="14" rx="3" fill="#58a6ff" stroke="#58a6ff" />
        <text x="32" y="249" fill="white" fontSize="10" fontWeight="bold">✓</text>
        <text x="50" y="249" fill="#c9d1d9" fontSize="10">Add a README file</text>
        <ClickMarker cx={37} cy={245} num={3} />
        {/* Create button */}
        <rect x="30" y="268" width="160" height="26" rx="6" fill="#238636" />
        <text x="110" y="285" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
          Create repository
        </text>
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   8. 첫 커밋 흐름 터미널
   ══════════════════════════════════════════════════ */
function FirstCommitIllustration() {
  return (
    <ConsoleFrame url="Terminal — first commit">
      <svg viewBox="0 0 500 280" className="w-full">
        <rect width="500" height="280" fill="#1e1e1e" />
        <TComment y={20}>{'# 1. 프로젝트 폴더로 이동'}</TComment>
        <TPrompt y={38} cmd="cd my-first-app" />
        <TComment y={58}>{'# 2. Git 저장소 초기화'}</TComment>
        <TPrompt y={76} cmd="git init" />
        <TOutput y={92} text="Initialized empty Git repository in /Users/you/my-first-app/.git/" />
        <TComment y={112}>{'# 3. GitHub 원격 저장소 연결'}</TComment>
        <TPrompt y={130} cmd="git remote add origin git@github.com:username/my-first-app.git" />
        <TComment y={150}>{'# 4. 모든 파일 스테이징'}</TComment>
        <TPrompt y={168} cmd="git add ." />
        <TComment y={188}>{'# 5. 첫 커밋'}</TComment>
        <TPrompt y={206} cmd='git commit -m "feat: 초기 프로젝트 설정"' />
        <TOutput y={222} text="[main (root-commit) a1b2c3d] feat: 초기 프로젝트 설정" />
        <TOutput y={238} text=" 3 files changed, 42 insertions(+)" />
        <TComment y={258}>{'# 6. GitHub에 push'}</TComment>
        <TPrompt y={274} cmd="git push -u origin main" />
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   9. .gitignore 에디터
   ══════════════════════════════════════════════════ */
function GitignoreIllustration() {
  return (
    <ConsoleFrame url=".gitignore — my-first-app">
      <svg viewBox="0 0 500 260" className="w-full">
        <rect width="500" height="260" fill="#1e1e1e" />
        {/* Line numbers gutter */}
        <rect x="0" y="0" width="32" height="260" fill="#1a1a1a" />
        {[
          { n: 1, text: '# 환경변수 (절대 커밋하면 안 됨)', color: '#6a9955' },
          { n: 2, text: '.env', color: '#ce9178' },
          { n: 3, text: '.env.local', color: '#ce9178' },
          { n: 4, text: '.env*.local', color: '#ce9178' },
          { n: 5, text: '', color: '#e8eaed' },
          { n: 6, text: '# 패키지 의존성', color: '#6a9955' },
          { n: 7, text: 'node_modules/', color: '#ce9178' },
          { n: 8, text: '', color: '#e8eaed' },
          { n: 9, text: '# 빌드 결과물', color: '#6a9955' },
          { n: 10, text: '.next/', color: '#ce9178' },
          { n: 11, text: 'dist/', color: '#ce9178' },
          { n: 12, text: 'build/', color: '#ce9178' },
          { n: 13, text: '', color: '#e8eaed' },
          { n: 14, text: '# 에디터 설정', color: '#6a9955' },
          { n: 15, text: '.vscode/', color: '#ce9178' },
          { n: 16, text: '.idea/', color: '#ce9178' },
        ].map((line) => (
          <g key={line.n}>
            <text x="22" y={line.n * 16} textAnchor="end" fill="#858585" fontSize="10"
              fontFamily="monospace">{line.n}</text>
            <text x="40" y={line.n * 16} fill={line.color} fontSize="10"
              fontFamily="monospace">{line.text}</text>
          </g>
        ))}
      </svg>
    </ConsoleFrame>
  );
}

/* ══════════════════════════════════════════════════
   Export — keyed by usage context
   ══════════════════════════════════════════════════ */

export const githubIllustrations: Record<string, ReactNode> = {
  signup: <SignupIllustration />,
  'git-download': <GitDownloadIllustration />,
  'ssh-keygen': <SshKeygenIllustration />,
  'ssh-github': <SshGithubIllustration />,
  'ssh-test': <SshTestIllustration />,
  'git-config': <GitConfigIllustration />,
  'new-repo': <NewRepoIllustration />,
  'first-commit': <FirstCommitIllustration />,
  gitignore: <GitignoreIllustration />,
};
