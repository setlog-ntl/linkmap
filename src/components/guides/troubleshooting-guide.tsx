'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { GuideTLDR, GuideCallout, FaqSection } from '@/components/guides/common';
import { Hammer, Rocket, KeyRound, Globe2, Package, LifeBuoy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ErrorItem {
  symptom: string;
  cause: string;
  fix: string;
  link?: { href: string; label: string };
}

interface ErrorGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  items: ErrorItem[];
}

const groups: ErrorGroup[] = [
  {
    id: 'build',
    label: '빌드 에러',
    icon: Hammer,
    items: [
      {
        symptom: 'Module not found: Can\'t resolve \'...\'',
        cause: '패키지를 설치하지 않았거나, import 경로(대소문자 포함)가 틀렸어요.',
        fix: '먼저 npm install로 설치했는지 확인하고, 파일 경로의 대소문자가 정확한지 보세요(배포 서버는 대소문자를 구분해요).',
        link: { href: '/guides/package-manager/troubleshooting', label: 'npm 에러 해결' },
      },
      {
        symptom: 'Type error: ... is not assignable to ...',
        cause: 'TypeScript 타입이 맞지 않아요. AI가 만든 코드에서 자주 나와요.',
        fix: '에러가 가리키는 파일·줄을 열어 타입을 맞추거나, 값이 없을 수 있으면 옵셔널 처리(?. 또는 기본값)를 추가하세요.',
      },
      {
        symptom: 'Build failed / exited with code 1',
        cause: '로컬에서는 됐지만 빌드 환경에서 실패한 경우예요.',
        fix: '빌드 로그를 위에서부터 읽어 첫 번째 빨간 에러를 찾으세요. 보통 그 한 줄이 진짜 원인이에요.',
      },
    ],
  },
  {
    id: 'deploy',
    label: '배포 에러',
    icon: Rocket,
    items: [
      {
        symptom: '로컬에선 되는데 배포본에서만 안 돼요',
        cause: '거의 항상 환경변수가 배포 플랫폼에 등록되지 않았거나 재배포가 안 된 경우예요.',
        fix: '배포 플랫폼 대시보드에 환경변수를 전부 등록하고, 추가한 뒤 재배포를 트리거하세요.',
        link: { href: '/guides/deploy/post-deploy-checklist', label: '배포 후 첫 점검' },
      },
      {
        symptom: '배포 후 페이지가 500 / 빈 화면',
        cause: '서버에서 코드가 죽었거나, 빌드는 됐지만 런타임 환경변수가 없어요.',
        fix: '플랫폼 런타임 로그를 확인하세요. "undefined" 관련 에러면 환경변수 누락일 확률이 높아요.',
      },
    ],
  },
  {
    id: 'env',
    label: '환경변수 에러',
    icon: KeyRound,
    items: [
      {
        symptom: 'undefined is not ... / process.env.XXX가 undefined',
        cause: '환경변수 이름 오타, NEXT_PUBLIC_ 누락, 또는 등록 후 재시작/재배포를 안 했어요.',
        fix: '변수명을 대소문자까지 정확히 맞추고, 브라우저에서 써야 하면 NEXT_PUBLIC_ 접두사를 붙이세요. 바꾼 뒤엔 서버를 재시작하세요.',
        link: { href: '/guides/env', label: '환경변수 관리' },
      },
      {
        symptom: 'Invalid API key / Unauthorized (401)',
        cause: '키가 틀렸거나, 만료됐거나, 한 번 노출돼 폐기됐을 수 있어요.',
        fix: '서비스 콘솔에서 키를 새로 발급해 교체하세요. .env를 깃에 올린 적이 있다면 반드시 새 키로 바꾸세요.',
        link: { href: '/guides/security/secrets-management', label: '시크릿 관리' },
      },
    ],
  },
  {
    id: 'cors',
    label: 'CORS · 네트워크 에러',
    icon: Globe2,
    items: [
      {
        symptom: 'blocked by CORS policy',
        cause: '브라우저가 다른 출처(도메인)로의 요청을 막은 거예요. API 키를 프런트에서 직접 호출할 때 자주 발생해요.',
        fix: '외부 API는 브라우저가 아니라 내 서버(API Route)에서 호출하세요. 그러면 CORS도, 키 노출도 함께 해결돼요.',
        link: { href: '/guides/security/https-cors', label: 'HTTPS와 CORS' },
      },
      {
        symptom: 'Failed to fetch / Network error',
        cause: 'API 주소 오타, 서버가 안 켜짐, 또는 HTTP/HTTPS 혼용(mixed content)이에요.',
        fix: '요청 URL을 다시 확인하고, 개발 서버가 실행 중인지, https 페이지에서 http 요청을 보내지 않는지 점검하세요.',
      },
    ],
  },
  {
    id: 'package',
    label: '패키지 · 설치 에러',
    icon: Package,
    items: [
      {
        symptom: 'npm ERR! ERESOLVE / peer dependency conflict',
        cause: '패키지들이 서로 요구하는 버전이 충돌해요.',
        fix: '먼저 패키지 버전을 맞춰보고, 정말 안 되면 npm install --legacy-peer-deps로 임시 우회할 수 있어요(근본 해결은 버전 조정).',
        link: { href: '/guides/package-manager/troubleshooting', label: 'npm 에러 해결' },
      },
      {
        symptom: '설치가 꼬였어요 / 이상한 에러가 계속 나요',
        cause: 'node_modules나 lock 파일이 손상됐을 수 있어요.',
        fix: 'node_modules 폴더와 package-lock.json을 지우고 npm install로 새로 받으면 대부분 해결돼요.',
      },
    ],
  },
];

const faqs = [
  {
    q: '에러 메시지가 영어라 무슨 뜻인지 모르겠어요.',
    a: '에러의 첫 줄(보통 가장 위 빨간 글씨)을 그대로 복사해 AI(Claude·ChatGPT)에게 "이 에러 무슨 뜻이고 어떻게 고쳐?"라고 물어보세요. 전체 로그보다 첫 에러 한 줄이 핵심입니다.',
  },
  {
    q: '어디서부터 봐야 할지 모르겠어요.',
    a: '① 콘솔/로그에서 첫 번째 빨간 에러를 찾고 ② 그 에러가 가리키는 파일·줄을 열고 ③ 위 카테고리에서 비슷한 증상을 찾으세요. "마지막으로 무엇을 바꿨는지"를 떠올리는 것도 큰 힌트예요.',
  },
  {
    q: '같은 에러가 계속 나요.',
    a: '코드를 바꿨는데도 그대로면 ① 저장했는지 ② 서버를 재시작했는지 ③ 브라우저 캐시(강력 새로고침) ④ 배포라면 재배포했는지 확인하세요. 변경이 반영 안 된 경우가 의외로 많아요.',
  },
];

const sections = groups.map((g) => ({ id: g.id, label: g.label }));

export function TroubleshootingGuide() {
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
      <section className="py-12 md:py-16">
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">문제 해결</Badge>
            <Badge variant="outline">입문</Badge>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <LifeBuoy className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">흔한 에러 해결 허브</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            바이브코딩을 하다 보면 누구나 에러를 만나요. 자주 마주치는 에러를
            증상 → 원인 → 해결 순서로 정리했습니다. 당황하지 말고 여기서 찾아보세요.
          </p>
        </ScrollReveal>
      </section>

      <div className="max-w-2xl mb-6">
        <GuideTLDR
          level="입문"
          readingTime="훑어보기 5분"
          points={[
            '에러는 "고장"이 아니라 "어디가 틀렸는지 알려주는 메시지"예요 — 겁먹지 마세요.',
            '첫 번째 빨간 에러 한 줄이 거의 항상 진짜 원인이에요.',
            '바꾼 게 반영 안 됐을 땐 저장·서버 재시작·재배포부터 확인하세요.',
          ]}
          youCanDo="자주 나오는 에러를 스스로 진단하고 해결하거나, AI에게 정확히 물어볼 수 있어요."
        />
      </div>

      {/* Sticky nav */}
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

      {/* 사용법 안내 */}
      <ScrollReveal>
        <GuideCallout variant="tip" title="에러를 만났을 때 3단계" className="my-8 max-w-2xl">
          <ol className="list-decimal list-inside space-y-1">
            <li>콘솔/터미널에서 <strong>첫 번째 빨간 에러</strong>를 찾는다</li>
            <li>아래에서 비슷한 <strong>증상</strong>을 찾아 원인·해결을 본다</li>
            <li>그래도 모르면 에러 첫 줄을 복사해 <strong>AI에게 물어본다</strong></li>
          </ol>
        </GuideCallout>
      </ScrollReveal>

      {/* 에러 그룹 */}
      {groups.map((group, idx) => {
        const Icon = group.icon;
        return (
          <section key={group.id} id={group.id} className="scroll-mt-20 py-8 md:py-10 border-t">
            <ScrollReveal delay={idx * 0.03}>
              <h2 className="text-xl md:text-2xl font-bold mb-5 flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {group.label}
              </h2>
            </ScrollReveal>
            <div className="space-y-4 max-w-2xl">
              {group.items.map((item) => (
                <ScrollReveal key={item.symptom} delay={idx * 0.03 + 0.05}>
                  <div className="rounded-xl border bg-card p-5">
                    <p className="font-mono text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded px-2 py-1.5 inline-block mb-3 break-all">
                      {item.symptom}
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-amber-600 dark:text-amber-400">원인 · </span>
                        <span className="text-muted-foreground">{item.cause}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">해결 · </span>
                        <span className="text-muted-foreground">{item.fix}</span>
                      </p>
                    </div>
                    {item.link ? (
                      <Link
                        href={item.link.href}
                        prefetch={false}
                        className="inline-block mt-3 text-xs text-primary hover:underline"
                      >
                        → {item.link.label}
                      </Link>
                    ) : null}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        );
      })}

      <FaqSection
        items={faqs}
        description="에러를 처음 만난 초보자가 가장 많이 묻는 질문이에요."
        footer={
          <div className="mt-10 p-4 rounded-lg bg-muted/50 border max-w-2xl">
            <p className="text-sm text-muted-foreground">
              찾는 에러가 없나요? 보안 관련은{' '}
              <Link href="/guides/security" prefetch={false} className="text-primary hover:underline">보안 기초</Link>,
              배포 점검은{' '}
              <Link href="/guides/deploy/post-deploy-checklist" prefetch={false} className="text-primary hover:underline">배포 후 첫 점검</Link>을 참고하세요.
            </p>
          </div>
        }
      />
    </div>
  );
}
