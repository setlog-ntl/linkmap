'use client';

import Link from 'next/link';
import { ProjectCard } from '@/components/project/project-card';
import { Layers, Puzzle, GitBranch, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProjectWithServices } from '@/types';

interface DemoProjectGridProps {
  projects: ProjectWithServices[];
  isLoggedIn: boolean;
}

function StatCard({ icon: Icon, value, label }: { icon: typeof Layers; value: number; label: string }) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function DemoProjectGrid({ projects, isLoggedIn }: DemoProjectGridProps) {
  const totalServices = projects.reduce((sum, p) => sum + (p.project_services?.length || 0), 0);
  const totalRepos = projects.reduce((sum, p) => sum + (p.project_github_repos?.length ?? 0), 0);

  const noop = () => {};

  return (
    <div className="container py-8 max-w-7xl">
      {/* 페이지 헤더 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">내 프로젝트</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            서비스 연결 현황과 프로젝트를 한눈에 관리하세요
          </p>
        </div>
        {!isLoggedIn && (
          <Button
            className="bg-brand-green text-black hover:bg-brand-green/90 rounded-xl font-bold"
            asChild
          >
            <Link href="/signup">
              무료로 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* 샘플 안내 배너 */}
      <div className="mb-8 rounded-xl border border-brand-blue/25 bg-brand-blue/[0.05] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-brand-blue shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-sm">샘플 미리보기</p>
            <p className="text-xs text-muted-foreground">
              실제 사용자의 프로젝트 대시보드 예시입니다. 로그인하면 내 프로젝트를 관리할 수 있습니다.
            </p>
          </div>
        </div>
        {!isLoggedIn && (
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button size="sm" className="bg-brand-blue text-white hover:bg-brand-blue/90 rounded-xl" asChild>
              <Link href="/signup">
                회원가입
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* 통계 */}
      {projects.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard icon={Layers} value={projects.length} label="전체 프로젝트" />
          <StatCard icon={Puzzle} value={totalServices} label="연결된 서비스" />
          <StatCard icon={GitBranch} value={totalRepos} label="GitHub 저장소" />
        </div>
      )}

      {/* 프로젝트 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={noop}
            onToggleFavorite={noop}
            basePath="/demo/project"
          />
        ))}
      </div>
    </div>
  );
}
