'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LinkmapLogo } from '@/components/icons/linkmap-logo';
import {
  Rocket, Search, Map as MapIcon,
  List, Link2, Key, Settings, BookOpen, ChevronDown, ChevronRight,
  LogOut, Bot, User, GitBranch, Wrench, FolderKanban, Plus, LayoutDashboard,
  Globe, ExternalLink, Loader2, AlertTriangle, Pencil, Star, ArrowRight, Trash2,
} from 'lucide-react';
import { GUIDE_CATEGORIES, getGuidesByCategory, type GuideCategory } from '@/data/ui/guide-meta';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useProjects, useToggleFavoriteProject } from '@/lib/queries/projects';
import { useMyDeployments, type HomepageDeploy } from '@/lib/queries/oneclick';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Profile } from '@/types';

const MAX_VISIBLE_PROJECTS = 15;
const MAX_VISIBLE_SITES = 10;

interface AppSidebarProps {
  profile: Profile | null;
}

function getProjectSubNav(projectId: string) {
  return [
    { labelKey: 'project.overview', href: `/project/${projectId}`, icon: LayoutDashboard, exact: true },
    { labelKey: 'project.services', href: `/project/${projectId}/services`, icon: List },
    { labelKey: 'project.connections', href: `/project/${projectId}/connections`, icon: Link2 },
    { labelKey: 'project.envVars', href: `/project/${projectId}/env`, icon: Key },
    { labelKey: 'project.serviceMap', href: `/project/${projectId}/service-map`, icon: MapIcon },
    { labelKey: 'project.settings', href: `/project/${projectId}/settings`, icon: Settings },
  ];
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocaleStore();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const { data: deployments, isLoading: isDeploymentsLoading } = useMyDeployments();
  const { mutate: toggleFavorite } = useToggleFavoriteProject();

  // Extract active project ID from URL
  const activeProjectId = pathname.match(/^\/project\/([^/]+)/)?.[1] ?? null;

  // Track which projects are expanded
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(
    () => new Set(activeProjectId ? [activeProjectId] : [])
  );

  // Auto-expand active project when URL changes
  useEffect(() => {
    if (activeProjectId) {
      setExpandedProjects((prev) => {
        if (prev.has(activeProjectId)) return prev;
        const next = new Set(prev);
        next.add(activeProjectId);
        return next;
      });
    }
  }, [activeProjectId]);

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const mainNav: { labelKey: string; label?: string; href: string; icon: React.ElementType }[] = [
    { labelKey: 'nav.serviceCatalog', href: '/services', icon: Search },
    { labelKey: 'nav.trash', label: '휴지통', href: '/trash', icon: Trash2 },
  ];

  const guideCategoryOrder: GuideCategory[] = ['concept', 'service'];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  // 프로젝트 → 배포 매핑 (프로젝트당 가장 최근 배포 1개)
  const deployByProjectId = useMemo(() => {
    const map = new Map<string, HomepageDeploy>();
    deployments?.forEach((d) => {
      if (d.project_id && !map.has(d.project_id)) {
        map.set(d.project_id, d);
      }
    });
    return map;
  }, [deployments]);

  // 사이트 active 판별 (/sites/{deployId}/edit)
  const activeDeployId = pathname.startsWith('/sites/')
    ? pathname.split('/')[2] ?? null
    : null;

  // 즐겨찾기 프로젝트를 최상단으로 정렬
  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects].sort((a, b) => {
      if (a.is_favorited && !b.is_favorited) return -1;
      if (!a.is_favorited && b.is_favorited) return 1;
      return 0;
    });
  }, [projects]);

  const visibleProjects = sortedProjects.slice(0, MAX_VISIBLE_PROJECTS);
  const hasMoreProjects = (projects?.length ?? 0) > MAX_VISIBLE_PROJECTS;

  const visibleSites = deployments?.slice(0, MAX_VISIBLE_SITES) ?? [];
  const hasMoreSites = (deployments?.length ?? 0) > MAX_VISIBLE_SITES;

  // 원클릭 배포 여부: ready 상태 사이트가 하나라도 있으면 배포됨
  const hasReadySite = deployments?.some((d) => d.deploy_status === 'ready') ?? false;
  const oneclickColorClass = !isDeploymentsLoading && hasReadySite ? 'text-green-500' : 'text-yellow-500';

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Logo */}
      <SidebarHeader className="px-3 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg px-1">
          <LinkmapLogo size={32} className="shrink-0" />
          {!isCollapsed && (
            <span className="flex items-center">
              <span className="text-[#38bdf8]">Link</span>
              <span className="text-foreground">map</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* ① 원클릭 배포 */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="원클릭 배포">
                      <Rocket className={`h-4 w-4 ${oneclickColorClass}`} />
                      <span className={oneclickColorClass}>원클릭 배포</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* 사이트 만들기 — 최상단 */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/sites/new">
                            <Plus className="h-3.5 w-3.5" />
                            <span>사이트 만들기</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Loading state */}
                      {isDeploymentsLoading && (
                        <>
                          <SidebarMenuSubItem><SidebarMenuSkeleton /></SidebarMenuSubItem>
                          <SidebarMenuSubItem><SidebarMenuSkeleton /></SidebarMenuSubItem>
                          <SidebarMenuSubItem><SidebarMenuSkeleton /></SidebarMenuSubItem>
                        </>
                      )}

                      {/* Empty state */}
                      {!isDeploymentsLoading && visibleSites.length === 0 && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href="/sites/new" className="text-muted-foreground text-xs">
                              <span>배포된 사이트 없음</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}

                      {/* Site list */}
                      {visibleSites.map((deploy) => {
                        const isReady = deploy.deploy_status === 'ready';
                        const isBuilding = ['building', 'creating', 'pending'].includes(deploy.deploy_status);
                        const isError = deploy.deploy_status === 'error';
                        const siteUrl = deploy.pages_url || deploy.deployment_url;
                        const hasSubMenu = (isReady && siteUrl) || deploy.project_id;

                        const StatusIcon = isReady
                          ? Globe
                          : isBuilding
                            ? Loader2
                            : isError
                              ? AlertTriangle
                              : Globe;

                        const statusClass = isReady
                          ? 'text-green-500'
                          : isBuilding
                            ? 'animate-spin text-yellow-500'
                            : isError
                              ? 'text-red-500'
                              : '';

                        if (hasSubMenu) {
                          return (
                            <Collapsible key={deploy.id} className="group/site">
                              <SidebarMenuSubItem>
                                <div className="flex items-center">
                                  <CollapsibleTrigger asChild>
                                    <button
                                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm hover:bg-sidebar-accent"
                                      aria-label={`Toggle ${deploy.site_name}`}
                                    >
                                      <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]/site:rotate-90" />
                                    </button>
                                  </CollapsibleTrigger>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={activeDeployId === deploy.id}
                                    className="flex-1 min-w-0"
                                  >
                                    <Link href={`/sites/${deploy.id}/edit`}>
                                      <StatusIcon className={`h-3.5 w-3.5 ${statusClass}`} />
                                      <span className="truncate">{deploy.site_name}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </div>
                                <CollapsibleContent>
                                  <SidebarMenuSub>
                                    {isReady && siteUrl && (
                                      <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                          <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            <span>사이트 열기</span>
                                          </a>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    )}
                                    {deploy.project_id && (
                                      <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild isActive={activeProjectId === deploy.project_id}>
                                          <Link href={`/project/${deploy.project_id}`}>
                                            <FolderKanban className="h-3.5 w-3.5" />
                                            <span>프로젝트 관리</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    )}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          );
                        }

                        return (
                          <SidebarMenuSubItem key={deploy.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={activeDeployId === deploy.id}
                            >
                              <Link href={`/sites/${deploy.id}/edit`}>
                                <StatusIcon className={`h-3.5 w-3.5 ${statusClass}`} />
                                <span className="truncate">{deploy.site_name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}

                      {/* View all link */}
                      {hasMoreSites && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href="/sites/manage" className="text-muted-foreground">
                              <span>전체 보기</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ② 내 프로젝트 */}
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="내 프로젝트">
                      <FolderKanban className="h-4 w-4" />
                      <span>내 프로젝트</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* + 새 프로젝트 만들기 — 최상단 */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/dashboard">
                            <Plus className="h-3.5 w-3.5" />
                            <span>+ 새 프로젝트 만들기</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      {/* Loading state */}
                      {isProjectsLoading && (
                        <>
                          <SidebarMenuSubItem><SidebarMenuSkeleton /></SidebarMenuSubItem>
                          <SidebarMenuSubItem><SidebarMenuSkeleton /></SidebarMenuSubItem>
                          <SidebarMenuSubItem><SidebarMenuSkeleton /></SidebarMenuSubItem>
                        </>
                      )}

                      {/* Empty state */}
                      {!isProjectsLoading && visibleProjects.length === 0 && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href="/dashboard" className="text-muted-foreground text-xs">
                              <span>{t(locale, 'dashboard.noProjects')}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}

                      {/* Project list */}
                      {visibleProjects.map((project) => {
                        const isExpanded = expandedProjects.has(project.id);
                        const isActiveProject = activeProjectId === project.id;
                        const subNav = getProjectSubNav(project.id);
                        const latestDeploy = deployByProjectId.get(project.id);
                        const deploySiteUrl = latestDeploy
                          ? latestDeploy.pages_url || latestDeploy.deployment_url
                          : null;

                        return (
                          <Collapsible
                            key={project.id}
                            open={isExpanded}
                            onOpenChange={() => toggleProject(project.id)}
                            className="group/project"
                          >
                            <SidebarMenuSubItem>
                              <div className="flex items-center group/project-row">
                                <CollapsibleTrigger asChild>
                                  <button
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm hover:bg-sidebar-accent"
                                    aria-label={`Toggle ${project.name}`}
                                  >
                                    <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                  </button>
                                </CollapsibleTrigger>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActiveProject && pathname === `/project/${project.id}`}
                                  className="flex-1 min-w-0"
                                >
                                  <Link href={`/project/${project.id}`}>
                                    <span className="truncate">{project.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                                {/* 원클릭 배포 아이콘 */}
                                {latestDeploy && (
                                  <span
                                    className="flex h-5 w-5 shrink-0 items-center justify-center"
                                    title={`원클릭 배포 · ${latestDeploy.deploy_status === 'ready' ? '배포됨' : latestDeploy.deploy_status === 'error' ? '오류' : '배포 중'}`}
                                  >
                                    <Rocket className={`h-3 w-3 ${latestDeploy.deploy_status === 'ready' ? 'text-green-500' : latestDeploy.deploy_status === 'error' ? 'text-red-500' : 'text-yellow-500 animate-pulse'}`} />
                                  </span>
                                )}
                              {/* 즐겨찾기 버튼 */}
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite({ id: project.id, isFavorited: !project.is_favorited });
                                  }}
                                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm hover:bg-sidebar-accent transition-opacity ${project.is_favorited ? 'opacity-100' : 'opacity-0 group-hover/project-row:opacity-100'}`}
                                  title={project.is_favorited ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                                >
                                  <Star className={`h-3 w-3 ${project.is_favorited ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                </button>
                              </div>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {subNav.map((item) => (
                                    <SidebarMenuSubItem key={item.href}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isActive(item.href, item.exact)}
                                      >
                                        <Link href={item.href}>
                                          <item.icon className="h-3.5 w-3.5" />
                                          <span>{t(locale, item.labelKey)}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                  {/* 배포 연결 시 추가 서브메뉴 */}
                                  {latestDeploy && (
                                    <>
                                      {latestDeploy.deploy_status === 'ready' && deploySiteUrl && (
                                        <SidebarMenuSubItem>
                                          <SidebarMenuSubButton asChild>
                                            <a href={deploySiteUrl} target="_blank" rel="noopener noreferrer">
                                              <ExternalLink className="h-3.5 w-3.5" />
                                              <span>사이트 열기</span>
                                            </a>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      )}
                                      <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild isActive={activeDeployId === latestDeploy.id}>
                                          <Link href={`/sites/${latestDeploy.id}/edit`}>
                                            <Pencil className="h-3.5 w-3.5" />
                                            <span>사이트 편집</span>
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    </>
                                  )}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </SidebarMenuSubItem>
                          </Collapsible>
                        );
                      })}

                      {/* View all link */}
                      {hasMoreProjects && (
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton asChild>
                            <Link href="/dashboard" className="text-muted-foreground">
                              <span>전체 보기</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ③ 서비스탐색 + 휴지통 */}
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const label = item.label ?? t(locale, item.labelKey);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      tooltip={label}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ④ 가이드 */}
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(locale, 'nav.guides')}>
                      <BookOpen className="h-4 w-4" />
                      <span>{t(locale, 'nav.guides')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {guideCategoryOrder.map((catKey) => {
                        const cat = GUIDE_CATEGORIES[catKey];
                        const guides = getGuidesByCategory(catKey);
                        return (
                          <div key={catKey}>
                            <li className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-2 pt-2 pb-1">
                              {cat.label}
                            </li>
                            {guides.map((guide) => (
                              <SidebarMenuSubItem key={guide.href}>
                                <SidebarMenuSubButton asChild isActive={isActive(guide.href)}>
                                  <Link href={guide.href}>
                                    <span>{guide.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </div>
                        );
                      })}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/guides'}>
                          <Link href="/guides" className="text-muted-foreground">
                            <ArrowRight className="h-3.5 w-3.5" />
                            <span>전체 보기</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: User */}
      <SidebarFooter>
        {profile && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-7 w-7 rounded-md">
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || ''} />
                      <AvatarFallback className="rounded-md text-xs">
                        {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{profile.name || t(locale, 'common.home')}</span>
                        <span className="truncate text-xs text-muted-foreground">{profile.email}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side={isCollapsed ? 'right' : 'top'}
                  align="start"
                >
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || ''} />
                      <AvatarFallback>{profile.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{profile.name || t(locale, 'common.home')}</span>
                      <span className="text-xs text-muted-foreground">{profile.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings/account">
                      <User className="mr-2 h-4 w-4" />
                      {t(locale, 'nav.settingsAccount')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/github">
                      <GitBranch className="mr-2 h-4 w-4" />
                      {t(locale, 'nav.settingsGithub')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings/developer">
                      <Wrench className="mr-2 h-4 w-4" />
                      {t(locale, 'nav.settingsDeveloper')}
                    </Link>
                  </DropdownMenuItem>
                  {profile.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/ai-config">
                        <Bot className="mr-2 h-4 w-4" />
                        {t(locale, 'nav.adminAi')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t(locale, 'common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
