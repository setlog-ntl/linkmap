'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ExternalLink,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Download,
  User,
  Settings,
  Rocket,
  Copy,
  type LucideIcon,
} from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  actionLabel: string;
  actionUrl: string;
  secondaryAction?: {
    label: string;
    url: string;
  };
  tips: Array<{ text: string; isCode?: boolean }>;
  estimatedMinutes: number;
  detailUrl?: string;
}

const STEPS: GuideStep[] = [
  {
    id: 0,
    title: 'GitHub 가입',
    subtitle: 'GitHub는 코드를 저장하고 공유하는 공간입니다. 무료 계정을 만드세요.',
    icon: User,
    actionLabel: 'GitHub 가입하기',
    actionUrl: 'https://github.com/signup',
    detailUrl: '/guides/github/git-setup',
    tips: [
      { text: '이메일 주소만 있으면 가입할 수 있습니다 — 구글, 네이버, 카카오 이메일 모두 가능' },
      { text: '사용자 이름은 GitHub URL에 포함됩니다 (예: github.com/my-name). 짧고 기억하기 쉬운 영문+숫자로 정하세요' },
      { text: '비밀번호는 8자 이상, 숫자와 소문자를 포함해야 합니다' },
      { text: '이메일 인증 코드가 발송됩니다 — 스팸 폴더도 확인하세요' },
      { text: '무료 플랜(Free)으로 충분합니다 — Private 저장소, 무제한 협업자 모두 무료' },
      { text: '사용자 이름은 나중에 변경 가능하지만, 연동된 서비스(Vercel 등)에 영향을 줄 수 있으니 신중하게 정하세요' },
    ],
    estimatedMinutes: 3,
  },
  {
    id: 1,
    title: 'Git 설치',
    subtitle: 'Git은 코드 변경 사항을 기록하는 도구입니다. Cursor, VS Code에서 코드를 저장하려면 필요합니다.',
    icon: Download,
    actionLabel: 'Git 다운로드',
    actionUrl: 'https://git-scm.com/downloads',
    detailUrl: '/guides/github/git-setup',
    secondaryAction: {
      label: 'GitHub Desktop (더 쉬움)',
      url: 'https://desktop.github.com',
    },
    tips: [
      { text: '⚡ 명령어가 어렵다면? GitHub Desktop을 설치하면 Git이 자동으로 함께 설치됩니다. 클릭만으로 commit, push가 가능합니다' },
      { text: '— Windows —' },
      { text: 'git-scm.com에서 다운로드 후 설치 파일을 실행하세요. 설정은 모두 기본값으로 "Next"만 누르면 됩니다' },
      { text: '설치 완료 후 Git Bash 또는 터미널에서 확인:' },
      { text: 'git --version', isCode: true },
      { text: '— macOS —' },
      { text: '터미널에서 아래 명령어를 입력하면 자동 설치 프롬프트가 나타납니다:' },
      { text: 'git --version', isCode: true },
      { text: 'Homebrew가 있다면: brew install git' },
      { text: '— Linux (Ubuntu/Debian) —' },
      { text: 'sudo apt update && sudo apt install git', isCode: true },
      { text: '설치 확인: 위 명령어 실행 후 "git version 2.x.x" 같은 출력이 나오면 성공입니다' },
    ],
    estimatedMinutes: 5,
  },
  {
    id: 2,
    title: '첫 저장소(Repository) 만들기',
    subtitle: '저장소는 프로젝트 폴더입니다. 코드를 담을 공간을 만드세요.',
    icon: GitBranch,
    actionLabel: '새 저장소 만들기',
    actionUrl: 'https://github.com/new',
    detailUrl: '/guides/github/first-repo',
    tips: [
      { text: 'Repository name에 프로젝트 이름을 영문으로 입력하세요 (예: my-first-app). 소문자와 하이픈(-) 사용 권장' },
      { text: '"Public"은 누구나 볼 수 있고, "Private"은 나와 초대한 사람만 볼 수 있습니다. 처음에는 Private 추천' },
      { text: '"Add a README file"을 체크하면 프로젝트 설명 페이지가 자동 생성됩니다' },
      { text: '"Add .gitignore"에서 사용할 프레임워크 선택 (예: Node) — 불필요한 파일이 올라가는 것을 방지합니다' },
      { text: '"Create repository" 버튼을 누르면 끝!' },
      { text: '만들어진 저장소 페이지에서 초록색 "Code" 버튼 → SSH 탭의 주소를 복사하면 나중에 clone할 때 사용합니다' },
    ],
    estimatedMinutes: 2,
  },
  {
    id: 3,
    title: '기본 설정',
    subtitle: '커밋할 때 누가 작성했는지 기록하기 위한 설정입니다. 한 번만 하면 됩니다.',
    icon: Settings,
    actionLabel: 'GitHub 프로필 설정',
    actionUrl: 'https://github.com/settings/profile',
    detailUrl: '/guides/github/git-setup',
    tips: [
      { text: '터미널(Windows: Git Bash 또는 명령 프롬프트, Mac: 터미널)을 열고 아래 명령어를 입력하세요:' },
      { text: 'git config --global user.name "내이름"', isCode: true },
      { text: 'git config --global user.email "내이메일@example.com"', isCode: true },
      { text: '⚠️ GitHub에서 사용한 이름과 이메일을 똑같이 입력해야 커밋 기록이 프로필에 연결됩니다' },
      { text: '추가 권장 설정 — 기본 브랜치 이름을 main으로 설정:' },
      { text: 'git config --global init.defaultBranch main', isCode: true },
      { text: 'Windows 사용자 — 줄바꿈 자동 변환 설정:' },
      { text: 'git config --global core.autocrlf true', isCode: true },
      { text: '설정 확인:' },
      { text: 'git config --list', isCode: true },
      { text: 'GitHub Desktop을 사용하면 로그인만 하면 위 설정이 자동으로 됩니다' },
    ],
    estimatedMinutes: 2,
  },
  {
    id: 4,
    title: '바이브 코딩 시작!',
    subtitle: '에디터를 설치하고 저장소를 연결하면 바로 시작할 수 있습니다.',
    icon: Rocket,
    actionLabel: 'Cursor 다운로드 (AI 에디터)',
    actionUrl: 'https://cursor.com',
    secondaryAction: {
      label: 'VS Code 다운로드',
      url: 'https://code.visualstudio.com',
    },
    tips: [
      { text: 'Cursor는 AI가 내장된 에디터로, 바이브 코딩에 가장 적합합니다. 무료 플랜으로 시작하세요' },
      { text: 'VS Code도 무료이며 GitHub Copilot 등 AI 확장을 추가할 수 있습니다' },
      { text: '— 에디터에서 저장소 연결하기 —' },
      { text: '에디터 설치 후 터미널에서 방금 만든 저장소를 clone하세요:' },
      { text: 'git clone git@github.com:내아이디/저장소이름.git', isCode: true },
      { text: '또는 에디터에서 Ctrl+Shift+P → "Git: Clone" → 저장소 URL 붙여넣기' },
      { text: '— 코드 저장하기 (첫 커밋) —' },
      { text: 'git add .', isCode: true },
      { text: 'git commit -m "feat: 초기 프로젝트 설정"', isCode: true },
      { text: 'git push', isCode: true },
      { text: '— AI 코딩 단축키 —' },
      { text: 'Cursor: Cmd+K (Mac) / Ctrl+K (Windows) → AI에게 코드 작성 요청' },
      { text: 'Cursor: Cmd+L (Mac) / Ctrl+L (Windows) → AI 채팅으로 질문하기' },
    ],
    estimatedMinutes: 3,
  },
];

const STORAGE_KEY = 'linkmap-github-guide-progress';

export function GitHubSetupGuide() {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Restore progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompletedSteps(new Set(JSON.parse(saved)));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (completedSteps.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedSteps]));
    }
  }, [completedSteps]);

  const toggleComplete = useCallback((stepId: number, checked: boolean | 'indeterminate') => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (checked === true) {
        next.add(stepId);
      } else {
        next.delete(stepId);
      }
      return next;
    });
  }, []);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(text);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch {
      // fallback: ignore
    }
  };

  const progressPercent = (completedSteps.size / STEPS.length) * 100;
  const allDone = completedSteps.size === STEPS.length;
  const step = STEPS[currentStep];
  const StepIcon = step.icon;

  const motionProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] as const },
      };

  return (
    <div className="py-12 md:py-20">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
            초보자용 · 약 15분
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            GitHub 빠른 설정 가이드
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            바이브 코딩을 시작하기 위한 5단계 설정
          </p>

          {/* Progress */}
          <div className="max-w-md mx-auto mt-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">진행률</span>
              <span className="font-medium">
                {completedSteps.size} / {STEPS.length} 완료
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </ScrollReveal>

      {/* Stepper */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mx-auto mb-10">
          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-center justify-between relative">
            {/* Connection line */}
            <div className="absolute top-5 left-[10%] right-[10%] h-[2px]">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <line
                  x1="0" y1="1" x2="100%" y2="1"
                  stroke="currentColor"
                  className="text-border"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />
              </svg>
            </div>

            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className="relative z-10 flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    completedSteps.has(i)
                      ? 'bg-green-500 text-white'
                      : i === currentStep
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110'
                        : 'bg-muted border-2 border-border text-muted-foreground group-hover:border-primary/50'
                  }`}
                >
                  {completedSteps.has(i) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs whitespace-nowrap ${
                  i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Mobile: horizontal compact */}
          <div className="flex md:hidden items-center justify-between px-2">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    completedSteps.has(i)
                      ? 'bg-green-500 text-white'
                      : i === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border text-muted-foreground'
                  }`}
                >
                  {completedSteps.has(i) ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-[10px] ${
                  i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {s.title.replace('(Repository) ', '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Step Content Card */}
      <div className="max-w-2xl mx-auto px-4 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} {...motionProps}>
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                    <StepIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">
                      단계 {step.id + 1}. {step.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <a href={step.actionUrl} target="_blank" rel="noopener noreferrer">
                      {step.actionLabel}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  {step.secondaryAction && (
                    <Button variant="outline" asChild size="lg">
                      <a href={step.secondaryAction.url} target="_blank" rel="noopener noreferrer">
                        {step.secondaryAction.label}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>

                {/* Completion checkbox */}
                <div className="flex items-center gap-3 py-3 border-t">
                  <Checkbox
                    id={`step-${step.id}`}
                    checked={completedSteps.has(step.id)}
                    onCheckedChange={(checked) => toggleComplete(step.id, checked)}
                  />
                  <label
                    htmlFor={`step-${step.id}`}
                    className="text-sm font-medium cursor-pointer select-none"
                  >
                    이 단계를 완료했습니다
                  </label>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    약 {step.estimatedMinutes}분
                  </Badge>
                </div>

                {/* Tips accordion */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="tips" className="border-none">
                    <AccordionTrigger className="text-sm py-2 hover:no-underline">
                      도움이 필요하신가요?
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2.5 pt-1">
                        {step.tips.map((tip, i) => (
                          <li key={i}>
                            {tip.isCode ? (
                              <div className="flex items-center gap-2">
                                <code className="font-mono text-xs bg-muted px-3 py-1.5 rounded block flex-1">
                                  {tip.text}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 shrink-0"
                                  onClick={() => copyToClipboard(tip.text)}
                                >
                                  {copiedCommand === tip.text ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 text-sm text-muted-foreground">
                                <span className="text-primary shrink-0">•</span>
                                <span>{tip.text}</span>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      {step.detailUrl && (
                        <div className="mt-4 pt-3 border-t">
                          <Button variant="link" asChild className="h-auto p-0 text-sm">
                            <Link prefetch={false} href={step.detailUrl}>
                              더 자세한 설명 보기
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            이전
          </Button>
          <Button
            onClick={goNext}
            disabled={currentStep === STEPS.length - 1}
          >
            다음
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </div>

        {/* Completion card */}
        {allDone && (
          <motion.div
            className="mt-10"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Card className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
              <CardContent className="text-center py-10">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">축하합니다!</h3>
                <p className="text-muted-foreground mb-6">
                  GitHub 설정이 완료되었습니다. 이제 바이브 코딩을 시작하세요!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild>
                    <Link prefetch={false} href="/signup">
                      Linkmap으로 프로젝트 관리 시작하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link prefetch={false} href="/services">서비스 카탈로그 둘러보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
