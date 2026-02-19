'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
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
  Brain,
  Loader2,
  Sparkles,
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
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/ui-store';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { commandOpen, setCommandOpen, aiCommandMode, setAiCommandMode } = useUIStore();
  const { locale, setLocale } = useLocaleStore();
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setAiCommandMode(false);
    setAiResponse(null);
    router.push(href);
  };

  const handleAiCommand = async () => {
    if (!aiInput.trim() || aiLoading) return;
    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: aiInput,
          project_id: activeProjectId || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setAiResponse(data.message);

      // Execute actions
      if (data.actions?.length > 0) {
        for (const action of data.actions) {
          if (action.action === 'navigate' && action.data?.path) {
            setTimeout(() => navigate(action.data.path as string), 1000);
          }
        }
        toast.success(t(locale, 'ai.command.executed'));
      }

      setAiInput('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t(locale, 'ai.command.error'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAiCommand();
    }
    if (e.key === 'Escape') {
      setAiCommandMode(false);
      setAiResponse(null);
    }
  };

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={(open) => {
        setCommandOpen(open);
        if (!open) { setAiCommandMode(false); setAiResponse(null); }
      }}
      title={t(locale, 'commandPalette.placeholder')}
      description={t(locale, 'commandPalette.placeholder')}
    >
      {aiCommandMode ? (
        /* AI Command Mode */
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="gap-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
              <Brain className="h-3 w-3" />
              {t(locale, 'ai.command.mode')}
            </Badge>
            <button
              onClick={() => { setAiCommandMode(false); setAiResponse(null); }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ESC
            </button>
          </div>
          <div className="relative">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
            <input
              ref={inputRef}
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={handleAiKeyDown}
              placeholder={t(locale, 'ai.command.placeholder')}
              className="w-full pl-10 pr-4 py-3 bg-muted/50 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              autoFocus
              disabled={aiLoading}
            />
            {aiLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-violet-500" />
            )}
          </div>
          {aiResponse && (
            <div className="p-3 bg-violet-50/50 dark:bg-violet-950/20 rounded-lg border border-violet-200/50 dark:border-violet-800/30 text-sm">
              {aiResponse}
            </div>
          )}
        </div>
      ) : (
        /* Normal Command Mode */
        <>
          <CommandInput placeholder={t(locale, 'commandPalette.placeholder')} />
          <CommandList>
            <CommandEmpty>{t(locale, 'commandPalette.empty')}</CommandEmpty>

            {/* AI Mode toggle */}
            <CommandGroup heading="AI">
              <CommandItem onSelect={() => setAiCommandMode(true)}>
                <Brain className="mr-2 h-4 w-4 text-violet-500" />
                {t(locale, 'ai.command.mode')}
                <Badge variant="outline" className="ml-auto text-[10px]">AI</Badge>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

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
        </>
      )}
    </CommandDialog>
  );
}
