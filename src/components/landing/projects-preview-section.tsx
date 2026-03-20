'use client';

import Link from 'next/link';
import { ArrowRight, Lock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from './scroll-reveal';
import type { ProjectWithServices } from '@/types';

interface ProjectsPreviewSectionProps {
  projects: ProjectWithServices[];
  isDemo: boolean;
  isLoggedIn: boolean;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function ProjectPreviewCard({ project }: { project: ProjectWithServices }) {
  const services = project.project_services ?? [];
  const serviceCount = services.length;
  const connectedCount = services.filter((s) => s.status === 'connected').length;
  const progressPercent =
    serviceCount > 0 ? Math.round((connectedCount / serviceCount) * 100) : 0;

  const displayIcon =
    project.icon_type === 'emoji' && project.icon_value
      ? project.icon_value
      : project.name.charAt(0).toUpperCase();

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-4 transition-all duration-200 select-none">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg font-bold text-foreground shrink-0">
          {displayIcon}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate">{project.name}</h3>
          {project.description && (
            <p className="text-xs text-muted-foreground truncate">{project.description}</p>
          )}
        </div>
      </div>

      {/* 메트릭 */}
      <div className="grid grid-cols-3 text-center border rounded-lg overflow-hidden">
        <div className="py-2 border-r">
          <p className="text-base font-mono font-bold">{serviceCount}</p>
          <p className="text-[10px] text-muted-foreground">서비스</p>
        </div>
        <div className="py-2 border-r">
          <p className="text-base font-mono font-bold">{connectedCount}</p>
          <p className="text-[10px] text-muted-foreground">연결됨</p>
        </div>
        <div className="py-2">
          <p className="text-base font-mono font-bold">{progressPercent}%</p>
          <p className="text-[10px] text-muted-foreground">완성도</p>
        </div>
      </div>

      {/* 서비스 상태 도트 */}
      {services.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {services.map((s) => (
            <span
              key={s.id}
              className={`h-2.5 w-2.5 rounded-full ${
                s.status === 'connected'
                  ? 'bg-green-500'
                  : s.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-muted-foreground/30'
              }`}
              title={s.service?.name ?? s.service_id}
            />
          ))}
        </div>
      )}

      {/* 하단 메타 */}
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-auto">
        <Clock className="h-3 w-3" />
        <span>{formatRelativeTime(project.updated_at)}</span>
      </div>
    </div>
  );
}

export function ProjectsPreviewSection({
  projects,
  isDemo,
  isLoggedIn,
}: ProjectsPreviewSectionProps) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 bg-background" id="my-projects">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 헤더 */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-4 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-blue" />
              {isDemo ? 'PREVIEW' : 'MY PROJECTS'}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              {isDemo ? '이런 현황을 한눈에 확인하세요' : '내 프로젝트 현황'}
            </h2>
            {isDemo && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                실제 사용자의 프로젝트 대시보드 예시입니다
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* 미로그인 샘플 배너 */}
        {isDemo && (
          <ScrollReveal>
            <div className="mb-8 rounded-xl border border-brand-blue/25 bg-brand-blue/[0.05] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-brand-blue shrink-0" />
                <div>
                  <p className="font-semibold text-foreground text-sm">샘플 미리보기</p>
                  <p className="text-xs text-muted-foreground">
                    로그인하면 내 실제 프로젝트 현황을 볼 수 있습니다
                  </p>
                </div>
              </div>
              <Button
                className="bg-brand-blue text-white hover:bg-brand-blue/90 shrink-0 rounded-xl"
                size="sm"
                asChild
              >
                <Link href="/signup" prefetch={false}>
                  무료로 시작하기
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        )}

        {/* 프로젝트 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ScrollReveal key={project.id} delay={i * 0.06}>
              <ProjectPreviewCard project={project} />
            </ScrollReveal>
          ))}
        </div>

        {/* 하단 CTA */}
        <ScrollReveal>
          <div className="mt-12 text-center">
            {isDemo ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  className="bg-brand-green text-black hover:bg-brand-green/90 px-8 py-3 h-auto rounded-xl text-sm font-bold"
                  asChild
                >
                  <Link href="/signup" prefetch={false}>
                    내 프로젝트 만들기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="rounded-xl" asChild>
                  <Link href="/login" prefetch={false}>로그인</Link>
                </Button>
              </div>
            ) : isLoggedIn ? (
              <Button variant="outline" className="rounded-xl" asChild>
                <Link href="/dashboard" prefetch={false}>
                  대시보드로 이동
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
