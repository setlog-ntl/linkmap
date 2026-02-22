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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, Globe, Search, BookOpen, ChevronDown } from 'lucide-react';
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

      {/* Guides dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 outline-none">
          <BookOpen className="h-3.5 w-3.5" />
          {t(locale, 'nav.guides')}
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem asChild>
            <Link href="/guides/env" onClick={() => setSidebarOpen(false)}>
              {t(locale, 'landing.guideEnv')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/guides/github" onClick={() => setSidebarOpen(false)}>
              {t(locale, 'landing.guideGitHub')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/guides/auth" onClick={() => setSidebarOpen(false)}>
              {t(locale, 'landing.guideAuth')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/guides/cloudflare" onClick={() => setSidebarOpen(false)}>
              {t(locale, 'landing.guideCloudflare')}
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
          <div className="relative w-8 h-8">
            <Image
              src="/logo.png"
              alt="Linkmap Logo"
              fill
              className="object-contain dark:brightness-0 dark:invert"
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

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {profile ? (
              <Button variant="default" size="sm" asChild>
                <Link href="/dashboard">{t(locale, 'common.dashboard')}</Link>
              </Button>
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
                {profile && (
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-foreground px-2.5 py-1.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {t(locale, 'common.dashboard')}
                  </Link>
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
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-2.5 mb-1">
                  {t(locale, 'nav.guides')}
                </p>
                <Link href="/guides/env" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5" onClick={() => setSidebarOpen(false)}>
                  {t(locale, 'landing.guideEnv')}
                </Link>
                <Link href="/guides/github" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5" onClick={() => setSidebarOpen(false)}>
                  {t(locale, 'landing.guideGitHub')}
                </Link>
                <Link href="/guides/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5" onClick={() => setSidebarOpen(false)}>
                  {t(locale, 'landing.guideAuth')}
                </Link>
                <Link href="/guides/cloudflare" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5" onClick={() => setSidebarOpen(false)}>
                  {t(locale, 'landing.guideCloudflare')}
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
                  <button
                    onClick={() => { handleSignOut(); setSidebarOpen(false); }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground text-left px-2.5 py-1.5"
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
