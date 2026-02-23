'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Rocket, Search, Map as MapIcon,
  List, Link2, Key, Settings, BookOpen, ChevronDown, ChevronRight,
  LogOut, Bot, User, GitBranch, Wrench, FolderKanban, Plus, LayoutDashboard,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useProjects } from '@/lib/queries/projects';
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

  const mainNav = [
    { labelKey: 'nav.serviceCatalog', href: '/services', icon: Search },
    { labelKey: 'nav.oneclick', href: '/sites', icon: Rocket },
  ];

  const guideLinks = [
    { labelKey: 'landing.guideEnv', href: '/guides/env' },
    { labelKey: 'landing.guideGitHub', href: '/guides/github' },
    { labelKey: 'landing.guideAuth', href: '/guides/auth' },
    { labelKey: 'landing.guideCloudflare', href: '/guides/cloudflare' },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const visibleProjects = projects?.slice(0, MAX_VISIBLE_PROJECTS) ?? [];
  const hasMoreProjects = (projects?.length ?? 0) > MAX_VISIBLE_PROJECTS;

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Logo */}
      <SidebarHeader className="px-3 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg px-1">
          <div className="relative w-7 h-7 shrink-0">
            <Image
              src="/logo.png"
              alt="Linkmap"
              fill
              className="object-contain dark:brightness-0 dark:invert"
            />
          </div>
          {!isCollapsed && (
            <span className="flex items-center">
              <span className="text-primary">Link</span>
              <span>map</span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={t(locale, item.labelKey)}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(locale, item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Project Tree */}
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(locale, 'common.dashboard')}>
                      <FolderKanban className="h-4 w-4" />
                      <span>{t(locale, 'common.dashboard')}</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
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

                        return (
                          <Collapsible
                            key={project.id}
                            open={isExpanded}
                            onOpenChange={() => toggleProject(project.id)}
                            className="group/project"
                          >
                            <SidebarMenuSubItem>
                              <div className="flex items-center">
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

                      {/* New project link */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href="/dashboard">
                            <Plus className="h-3.5 w-3.5" />
                            <span>새 프로젝트</span>
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

        {/* Resources */}
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
                      {guideLinks.map((link) => (
                        <SidebarMenuSubItem key={link.href}>
                          <SidebarMenuSubButton asChild isActive={isActive(link.href)}>
                            <Link href={link.href}>
                              <span>{t(locale, link.labelKey)}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
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
