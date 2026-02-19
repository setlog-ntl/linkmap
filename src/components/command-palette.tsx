'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Map,
  List,
  Key,
  Activity,
  Settings,
  Home,
  Rocket,
  Monitor,
  Link2,
  Sun,
  Moon,
  Laptop,
  Globe,
  Search,
} from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { useUIStore } from '@/stores/ui-store';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { commandOpen, setCommandOpen } = useUIStore();
  const { locale, setLocale } = useLocaleStore();

  // Detect project context from pathname
  const projectMatch = pathname.match(/^\/project\/([^/]+)/);
  const activeProjectId = projectMatch ? projectMatch[1] : null;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandOpen, setCommandOpen]);

  const navigate = (href: string) => {
    setCommandOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      title={t(locale, 'commandPalette.placeholder')}
      description={t(locale, 'commandPalette.placeholder')}
    >
      <CommandInput placeholder={t(locale, 'commandPalette.placeholder')} />
      <CommandList>
        <CommandEmpty>{t(locale, 'commandPalette.empty')}</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading={t(locale, 'commandPalette.navigation')}>
          <CommandItem onSelect={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            {t(locale, 'common.home')}
          </CommandItem>
          <CommandItem onSelect={() => navigate('/dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {t(locale, 'common.dashboard')}
          </CommandItem>
          <CommandItem onSelect={() => navigate('/services')}>
            <Search className="mr-2 h-4 w-4" />
            {t(locale, 'nav.serviceCatalog')}
          </CommandItem>
          <CommandItem onSelect={() => navigate('/oneclick')}>
            <Rocket className="mr-2 h-4 w-4" />
            {t(locale, 'nav.oneclick')}
          </CommandItem>
          <CommandItem onSelect={() => navigate('/my-sites')}>
            <Monitor className="mr-2 h-4 w-4" />
            {t(locale, 'nav.mySites')}
          </CommandItem>
          <CommandItem onSelect={() => navigate('/settings/account')}>
            <Link2 className="mr-2 h-4 w-4" />
            {t(locale, 'nav.connectedInfo')}
          </CommandItem>
          <CommandItem onSelect={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            {t(locale, 'common.settings')}
          </CommandItem>
        </CommandGroup>

        {/* Project context commands */}
        {activeProjectId && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t(locale, 'commandPalette.project')}>
              <CommandItem onSelect={() => navigate(`/project/${activeProjectId}`)}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                {t(locale, 'project.overview')}
              </CommandItem>
              <CommandItem onSelect={() => navigate(`/project/${activeProjectId}/service-map`)}>
                <Map className="mr-2 h-4 w-4" />
                {t(locale, 'project.serviceMap')}
              </CommandItem>
              <CommandItem onSelect={() => navigate(`/project/${activeProjectId}/integrations`)}>
                <List className="mr-2 h-4 w-4" />
                {t(locale, 'project.integrations')}
              </CommandItem>
              <CommandItem onSelect={() => navigate(`/project/${activeProjectId}/env`)}>
                <Key className="mr-2 h-4 w-4" />
                {t(locale, 'project.envVars')}
              </CommandItem>
              <CommandItem onSelect={() => navigate(`/project/${activeProjectId}/monitoring`)}>
                <Activity className="mr-2 h-4 w-4" />
                {t(locale, 'project.monitoring')}
              </CommandItem>
              <CommandItem onSelect={() => navigate(`/project/${activeProjectId}/settings`)}>
                <Settings className="mr-2 h-4 w-4" />
                {t(locale, 'project.settings')}
              </CommandItem>
            </CommandGroup>
          </>
        )}

        {/* Theme */}
        <CommandSeparator />
        <CommandGroup heading={t(locale, 'commandPalette.theme')}>
          <CommandItem onSelect={() => { setTheme('light'); setCommandOpen(false); }}>
            <Sun className="mr-2 h-4 w-4" />
            {t(locale, 'commandPalette.lightTheme')}
          </CommandItem>
          <CommandItem onSelect={() => { setTheme('dark'); setCommandOpen(false); }}>
            <Moon className="mr-2 h-4 w-4" />
            {t(locale, 'commandPalette.darkTheme')}
          </CommandItem>
          <CommandItem onSelect={() => { setTheme('system'); setCommandOpen(false); }}>
            <Laptop className="mr-2 h-4 w-4" />
            {t(locale, 'commandPalette.systemTheme')}
          </CommandItem>
        </CommandGroup>

        {/* Language */}
        <CommandSeparator />
        <CommandGroup heading={t(locale, 'commandPalette.language')}>
          <CommandItem onSelect={() => { setLocale('ko'); setCommandOpen(false); }}>
            <Globe className="mr-2 h-4 w-4" />
            한국어
          </CommandItem>
          <CommandItem onSelect={() => { setLocale('en'); setCommandOpen(false); }}>
            <Globe className="mr-2 h-4 w-4" />
            English
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
