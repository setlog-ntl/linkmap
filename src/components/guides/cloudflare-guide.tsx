'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { Cloud, Terminal, Key, GitBranch, CheckCircle2 } from 'lucide-react';

const sections = [
  { id: 'overview', labelKey: 'cloudflareGuide.navOverview' as const },
  { id: 'account', labelKey: 'cloudflareGuide.navAccount' as const },
  { id: 'build-deploy', labelKey: 'cloudflareGuide.navBuildDeploy' as const },
  { id: 'env-vars', labelKey: 'cloudflareGuide.navEnvVars' as const },
  { id: 'git-build', labelKey: 'cloudflareGuide.navGitBuild' as const },
  { id: 'summary', labelKey: 'cloudflareGuide.navSummary' as const },
] as const;

export function CloudflareGuide() {
  const { locale } = useLocaleStore();
  const [activeSection, setActiveSection] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    for (const el of elements) {
      observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-4">
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
              {t(locale, 'cloudflareGuide.badge')}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {t(locale, 'cloudflareGuide.heroTitle')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {t(locale, 'cloudflareGuide.heroDesc')}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === s.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {t(locale, s.labelKey)}
            </button>
          ))}
        </div>
      </nav>

      <div className="space-y-16 pb-20">
        {/* Overview */}
        <section id="overview" className="scroll-mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-[#f38020]" />
              {t(locale, 'cloudflareGuide.overviewTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">{t(locale, 'cloudflareGuide.overviewDesc')}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>{t(locale, 'cloudflareGuide.overviewItem1')}</li>
              <li>{t(locale, 'cloudflareGuide.overviewItem2')}</li>
              <li>{t(locale, 'cloudflareGuide.overviewItem3')}</li>
            </ul>
          </ScrollReveal>
        </section>

        {/* Account setup */}
        <section id="account" className="scroll-mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Cloud className="w-6 h-6 text-[#f38020]" />
              {t(locale, 'cloudflareGuide.accountTitle')}
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>{t(locale, 'cloudflareGuide.accountStep1')}</li>
              <li>{t(locale, 'cloudflareGuide.accountStep2')}</li>
              <li>
                {t(locale, 'cloudflareGuide.accountStep3')}
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>{t(locale, 'cloudflareGuide.accountStep3a')}</li>
                  <li>{t(locale, 'cloudflareGuide.accountStep3b')}</li>
                </ul>
              </li>
            </ol>
            <p className="mt-4 text-sm text-amber-600 dark:text-amber-500">
              {t(locale, 'cloudflareGuide.accountWarning')}
            </p>
          </ScrollReveal>
        </section>

        {/* Build & Deploy */}
        <section id="build-deploy" className="scroll-mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-6 h-6" />
              {t(locale, 'cloudflareGuide.buildTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">{t(locale, 'cloudflareGuide.buildDesc')}</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">{t(locale, 'cloudflareGuide.buildLogin')}</p>
                <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
                  <code>npx wrangler login</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t(locale, 'cloudflareGuide.buildCmd')}</p>
                <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
                  <code>npm run build:cf</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t(locale, 'cloudflareGuide.deployCmd')}</p>
                <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
                  <code>npx wrangler deploy</code>
                </pre>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t(locale, 'cloudflareGuide.buildNote')}</p>
          </ScrollReveal>
        </section>

        {/* Env vars / Secrets */}
        <section id="env-vars" className="scroll-mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Key className="w-6 h-6" />
              {t(locale, 'cloudflareGuide.envTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">{t(locale, 'cloudflareGuide.envDesc')}</p>
            <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto space-y-1">
              <code>
                {`# Supabase (필수)
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# 암호화 (필수)
npx wrangler secret put ENCRYPTION_KEY

# GitHub OAuth
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET

# Stripe (필요 시)
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET`}
              </code>
            </pre>
            <p className="mt-4 text-sm text-muted-foreground">{t(locale, 'cloudflareGuide.envSource')}</p>
          </ScrollReveal>
        </section>

        {/* Git build command */}
        <section id="git-build" className="scroll-mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              {t(locale, 'cloudflareGuide.gitTitle')}
            </h2>
            <p className="text-muted-foreground mb-4">{t(locale, 'cloudflareGuide.gitDesc')}</p>
            <div className="rounded-lg border bg-muted/30 p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">{t(locale, 'cloudflareGuide.gitColStep')}</th>
                    <th className="text-left py-2 font-medium text-red-600 dark:text-red-400">{t(locale, 'cloudflareGuide.gitColWrong')}</th>
                    <th className="text-left py-2 font-medium text-green-600 dark:text-green-400">{t(locale, 'cloudflareGuide.gitColCorrect')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">{t(locale, 'cloudflareGuide.gitBuildLabel')}</td>
                    <td className="py-2 font-mono text-red-600 dark:text-red-400">npm run build</td>
                    <td className="py-2 font-mono text-green-600 dark:text-green-400 font-bold">npm run build:cf</td>
                  </tr>
                  <tr>
                    <td className="py-2">{t(locale, 'cloudflareGuide.gitDeployLabel')}</td>
                    <td className="py-2 font-mono" colSpan={2}>npx wrangler deploy</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t(locale, 'cloudflareGuide.gitWhy')}</p>
            <p className="mt-2 text-sm font-medium">{t(locale, 'cloudflareGuide.gitCommitFiles')}</p>
            <ul className="list-disc list-inside mt-1 text-sm text-muted-foreground">
              <li>package.json</li>
              <li>wrangler.jsonc</li>
              <li>open-next.config.ts</li>
            </ul>
          </ScrollReveal>
        </section>

        {/* Summary */}
        <section id="summary" className="scroll-mt-24">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              {t(locale, 'cloudflareGuide.summaryTitle')}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>{t(locale, 'cloudflareGuide.summary1')}</li>
              <li>{t(locale, 'cloudflareGuide.summary2')}</li>
              <li>{t(locale, 'cloudflareGuide.summary3')}</li>
              <li>{t(locale, 'cloudflareGuide.summary4')}</li>
              <li>{t(locale, 'cloudflareGuide.summary5')}</li>
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">
              {t(locale, 'cloudflareGuide.summaryDoc')} <code className="rounded bg-muted px-1 py-0.5 text-xs">docs/cloudflare-migration.md</code>
            </p>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
