'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface AppBreadcrumbsProps {
  projectName?: string;
}

const routeLabels: Record<string, string> = {
  dashboard: 'common.dashboard',
  sites: 'nav.sites',
  oneclick: 'nav.sites',
  'my-sites': 'nav.sites',
  services: 'nav.serviceCatalog',
  settings: 'common.settings',
  project: 'commandPalette.project',
  'service-map': 'project.serviceMap',
  integrations: 'project.integrations',
  env: 'project.envVars',
  monitoring: 'project.monitoring',
  overview: 'project.overview',
  profile: 'account.profileInfo',
  accounts: 'account.connectionsTab',
  tokens: 'account.apiTokensTab',
  danger: 'account.dangerZone',
  developer: 'account.developer',
  guides: 'nav.guides',
  pricing: 'nav.pricing',
  account: 'account.myAccount',
};

export function AppBreadcrumbs({ projectName }: AppBreadcrumbsProps) {
  const pathname = usePathname();
  const { locale } = useLocaleStore();

  const segments = pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const crumbs: { label: string; href: string }[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = '/' + segments.slice(0, i + 1).join('/');

    // Skip UUIDs (project IDs) — use project name instead
    if (segment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-/i) || segment.match(/^[0-9a-f]{20,}$/i)) {
      crumbs.push({
        label: projectName || segment.slice(0, 8) + '...',
        href,
      });
      continue;
    }

    const labelKey = routeLabels[segment];
    crumbs.push({
      label: labelKey ? t(locale, labelKey) : segment.charAt(0).toUpperCase() + segment.slice(1),
      // /project 단독 경로는 페이지가 없으므로 대시보드로 연결
      href: segment === 'project' ? '/dashboard' : href,
    });
  }

  if (crumbs.length === 0) return null;

  // Mobile: show only the last crumb
  // Desktop: show all
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={crumb.href} className={`contents ${i < crumbs.length - 1 ? 'hidden md:contents' : ''}`}>
              {i > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
