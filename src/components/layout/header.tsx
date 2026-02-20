'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LogOut, Settings, LayoutDashboard, Menu, Globe, Rocket, Monitor, Bot, Link2, Search } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';
import { useLocaleStore } from '@/stores/locale-store';
import { t, localeNames } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import type { Profile } from '@/types';

interface HeaderProps {
  profile: Profile | null;
}

export function Header({ profile }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const { sidebarOpen, setSidebarOpen, setCommandOpen } = useUIStore();
  const { locale, setLocale } = useLocaleStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = (
    <>
      {/* Beginner-friendly: 원클릭 배포, 내 사이트 */}
      <Link
        href="/oneclick"
        className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full"
        onClick={() => setSidebarOpen(false)}
      >
        <Rocket className="h-3.5 w-3.5" />
        {t(locale, 'nav.oneclick')}
      </Link>
      {profile && (
        <Link
          href="/my-sites"
          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/5 px-2.5 py-1 rounded-full"
          onClick={() => setSidebarOpen(false)}
        >
          <Monitor className="h-3.5 w-3.5" />
          {t(locale, 'nav.mySites')}
        </Link>
      )}

      {/* Separator */}
      <div className="hidden md:block w-px h-4 bg-border" />

      {/* Advanced: 대시보드, 연결 정보, 서비스 카탈로그 */}
      {profile && (
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          {t(locale, 'common.dashboard')}
        </Link>
      )}
      {profile && (
        <Link
          href="/settings/account"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          onClick={() => setSidebarOpen(false)}
        >
          <Link2 className="h-3.5 w-3.5" />
          {t(locale, 'nav.connectedInfo')}
        </Link>
      )}
      <Link
        href="/services"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setSidebarOpen(false)}
      >
        {t(locale, 'nav.serviceCatalog')}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="relative w-8 h-8">
            <Image
              src="/logo.png"
              alt="Linkmap Logo"
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src="/logo-dark.png"
              alt="Linkmap Logo"
              fill
              className="object-contain hidden dark:block dark:mix-blend-multiply"
            />
          </div>
          <div className="flex items-center">
            <span className="text-primary">Link</span>
            <span>map</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-8 hidden md:flex items-center gap-6">
          {navLinks}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Command Palette Hint */}
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

          {profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || ''} />
                    <AvatarFallback>
                      {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{profile.name || t(locale, 'common.home')}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {t(locale, 'common.dashboard')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-sites">
                    <Monitor className="mr-2 h-4 w-4" />
                    {t(locale, 'nav.mySites')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/account">
                    <Link2 className="mr-2 h-4 w-4" />
                    {t(locale, 'nav.connectedInfo')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t(locale, 'common.settings')}
                  </Link>
                </DropdownMenuItem>
                {profile.is_admin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/ai-config">
                        <Bot className="mr-2 h-4 w-4" />
                        AI 설정 관리
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t(locale, 'common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">{t(locale, 'common.login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t(locale, 'common.signup')}</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 mt-8">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-2.5 mb-1">
                  {t(locale, 'nav.beginnerLabel')}
                </p>
                <Link
                  href="/oneclick"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/5 px-2.5 py-1.5 rounded-lg"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Rocket className="h-3.5 w-3.5" />
                  {t(locale, 'nav.oneclick')}
                </Link>
                {profile && (
                  <Link
                    href="/my-sites"
                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 bg-primary/5 px-2.5 py-1.5 rounded-lg"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    {t(locale, 'nav.mySites')}
                  </Link>
                )}

                <div className="border-t my-2" />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-2.5 mb-1">
                  {t(locale, 'nav.advancedLabel')}
                </p>
                {profile && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t(locale, 'common.dashboard')}
                  </Link>
                )}
                {profile && (
                  <Link
                    href="/settings/account"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-2.5 py-1.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    {t(locale, 'nav.connectedInfo')}
                  </Link>
                )}
                <Link
                  href="/services"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  {t(locale, 'nav.serviceCatalog')}
                </Link>

                <div className="border-t my-2" />
                {!profile && (
                  <>
                    <Link href="/login" className="text-sm font-medium" onClick={() => setSidebarOpen(false)}>
                      {t(locale, 'common.login')}
                    </Link>
                    <Link href="/signup" className="text-sm font-medium" onClick={() => setSidebarOpen(false)}>
                      {t(locale, 'common.signup')}
                    </Link>
                  </>
                )}
                {profile && (
                  <button
                    onClick={() => { handleSignOut(); setSidebarOpen(false); }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground text-left"
                  >
                    {t(locale, 'common.logout')}
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
