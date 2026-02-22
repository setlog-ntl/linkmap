'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Globe, Settings, LogOut, Bot, User, GitBranch, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { useUIStore } from '@/stores/ui-store';
import { useLocaleStore } from '@/stores/locale-store';
import { t, localeNames } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { Profile } from '@/types';
import { AppBreadcrumbs } from './breadcrumbs';

interface AppHeaderProps {
  projectName?: string;
  profile?: Profile | null;
}

export function AppHeader({ projectName, profile }: AppHeaderProps) {
  const router = useRouter();
  const { setCommandOpen } = useUIStore();
  const { locale, setLocale } = useLocaleStore();

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Breadcrumbs */}
      <AppBreadcrumbs projectName={projectName} />

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-1.5">
        {/* Command Palette */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 h-8 px-2 text-muted-foreground"
          onClick={() => setCommandOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">{t(locale, 'commandPalette.search')}</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(localeNames) as Locale[]).map((loc) => (
              <DropdownMenuItem
                key={loc}
                onClick={() => setLocale(loc)}
                className={locale === loc ? 'font-bold' : ''}
              >
                {localeNames[loc]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        {/* Avatar dropdown */}
        {profile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || ''} />
                  <AvatarFallback className="text-xs">
                    {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
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
        )}
      </div>
    </header>
  );
}
