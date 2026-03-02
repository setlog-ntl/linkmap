'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LinkmapLogo } from '@/components/icons/linkmap-logo';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Globe, Search, BookOpen, ChevronDown, Settings, LogOut, Bot, User, GitBranch, Wrench, ArrowRight, Rocket } from 'lucide-react';
import { GUIDE_CATEGORIES, getGuidesByCategory } from '@/data/ui/guide-meta';
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
      <Link
        href="/sites/new"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        onClick={() => setSidebarOpen(false)}
      >
        <Rocket className="h-3.5 w-3.5" />
        원클릭 배포
      </Link>
      <Link
        href="/demo"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setSidebarOpen(false)}
      >
        샘플 프로젝트
      </Link>
      {profile && (
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          {t(locale, 'common.dashboard')}
        </Link>
      )}
      <Link
        href="/pricing"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setSidebarOpen(false)}
      >
        {t(locale, 'nav.pricing')}
      </Link>
      <Link
        href="/services"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setSidebarOpen(false)}
      >
        {t(locale, 'nav.serviceCatalog')}
      </Link>
      <Link
        href="/feedback"
        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setSidebarOpen(false)}
      >
        기능 요청
      </Link>

      {/* Guides dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 outline-none">
          <BookOpen className="h-3.5 w-3.5" />
          {t(locale, 'nav.guides')}
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {(['concept', 'service'] as const).map((catKey, idx) => {
            const cat = GUIDE_CATEGORIES[catKey];
            const CatIcon = cat.icon;
            const guides = getGuidesByCategory(catKey);
            return (
              <div key={catKey}>
                {idx > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="flex items-center gap-1.5 text-xs">
                  <CatIcon className="h-3.5 w-3.5" />
                  {cat.label}
                </DropdownMenuLabel>
                {guides.map((guide) => (
                  <DropdownMenuItem key={guide.slug} asChild>
                    <Link href={guide.href} onClick={() => setSidebarOpen(false)}>
                      {guide.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/guides" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between">
              전체 보기
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <LinkmapLogo size={32} />
          <div className="flex items-center">
            <span className="text-[#38bdf8]">Link</span>
            <span className="text-foreground">map</span>
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

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {profile ? (
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
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">{t(locale, 'common.login')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">{t(locale, 'common.signup')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 mt-8">
                <Link
                  href="/sites/new"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 flex items-center gap-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Rocket className="h-4 w-4" />
                  원클릭 배포
                </Link>
                <Link
                  href="/demo"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  샘플 프로젝트
                </Link>
                {profile && (
                  <>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 mb-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatar_url || undefined} alt={profile.name || ''} />
                        <AvatarFallback className="text-xs">
                          {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{profile.name || t(locale, 'common.home')}</span>
                        <span className="text-xs text-muted-foreground">{profile.email}</span>
                      </div>
                    </div>
                    <div className="border-t my-1" />
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium text-foreground px-2.5 py-1.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {t(locale, 'common.dashboard')}
                    </Link>
                  </>
                )}
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  {t(locale, 'nav.pricing')}
                </Link>
                <Link
                  href="/services"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5"
                  onClick={() => setSidebarOpen(false)}
                >
                  {t(locale, 'nav.serviceCatalog')}
                </Link>

                <div className="border-t my-2" />
                {(['concept', 'service'] as const).map((catKey) => {
                  const cat = GUIDE_CATEGORIES[catKey];
                  const guides = getGuidesByCategory(catKey);
                  return (
                    <div key={catKey}>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-2.5 mb-1 mt-2">
                        {cat.label}
                      </p>
                      {guides.map((guide) => (
                        <Link
                          key={guide.slug}
                          href={guide.href}
                          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 block"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {guide.title}
                        </Link>
                      ))}
                    </div>
                  );
                })}
                <Link
                  href="/guides"
                  className="text-sm font-medium text-brand-blue hover:text-brand-blue/80 transition-colors px-2.5 py-1.5 flex items-center gap-1 mt-1"
                  onClick={() => setSidebarOpen(false)}
                >
                  전체 보기
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="border-t my-2" />
                {!profile ? (
                  <>
                    <Link href="/login" className="text-sm font-medium px-2.5 py-1.5" onClick={() => setSidebarOpen(false)}>
                      {t(locale, 'common.login')}
                    </Link>
                    <Link href="/signup" className="text-sm font-medium px-2.5 py-1.5" onClick={() => setSidebarOpen(false)}>
                      {t(locale, 'common.signup')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/settings"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 flex items-center gap-2"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      {t(locale, 'common.settings')}
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setSidebarOpen(false); }}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground text-left px-2.5 py-1.5 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {t(locale, 'common.logout')}
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
