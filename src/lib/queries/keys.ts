export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  services: {
    byProject: (projectId: string) => ['services', 'project', projectId] as const,
  },
  envVars: {
    byProject: (projectId: string) => ['env-vars', 'project', projectId] as const,
    stats: (projectId: string) => ['env-vars', 'stats', projectId] as const,
    conflicts: (projectId: string) => ['env-vars', 'conflicts', projectId] as const,
  },
  catalog: {
    all: ['catalog'] as const,
  },
  connections: {
    byProject: (projectId: string) => ['connections', 'project', projectId] as const,
  },
  dependencies: {
    all: ['dependencies'] as const,
  },
  auditLogs: {
    byProject: (projectId: string) => ['audit-logs', 'project', projectId] as const,
  },
  healthChecks: {
    byProjectService: (projectServiceId: string) =>
      ['health-checks', projectServiceId] as const,
    latestByProject: (projectId: string) =>
      ['health-checks', 'latest', projectId] as const,
  },
  serviceAccounts: {
    byProject: (projectId: string) => ['service-accounts', 'project', projectId] as const,
  },
  github: {
    repos: (projectId: string) => ['github', 'repos', projectId] as const,
    linkedRepos: (projectId: string) => ['github', 'linked-repos', projectId] as const,
    secrets: (projectId: string, owner: string, repo: string) =>
      ['github', 'secrets', projectId, owner, repo] as const,
  },
  linkedAccounts: {
    byProject: (projectId: string) => ['linked-accounts', 'project', projectId] as const,
    byService: (projectId: string, serviceSlug: string) =>
      ['linked-accounts', 'project', projectId, 'service', serviceSlug] as const,
  },
  linkedResources: {
    byType: (projectId: string, resourceType: string) =>
      ['linked-resources', 'project', projectId, resourceType] as const,
  },
  dashboard: {
    all: (projectId: string) => ['dashboard', projectId] as const,
  },
  oneclick: {
    templates: ['oneclick', 'templates'] as const,
    status: (deployId: string) => ['oneclick', 'status', deployId] as const,
    deployments: ['oneclick', 'deployments'] as const,
    files: (deployId: string) => ['oneclick', 'files', deployId] as const,
    fileContent: (deployId: string, path: string) => ['oneclick', 'files', deployId, path] as const,
  },
  account: {
    connectedAccounts: ['account', 'connected-accounts'] as const,
  },
  ai: {
    stackRecommend: ['ai', 'stack-recommend'] as const,
    envDoctor: (projectId: string) => ['ai', 'env-doctor', projectId] as const,
    compare: (slugs: string[]) => ['ai', 'compare', ...slugs] as const,
  },
  aiConfig: {
    global: ['ai-config', 'global'] as const,
    personas: ['ai-config', 'personas'] as const,
    persona: (id: string) => ['ai-config', 'personas', id] as const,
    providers: ['ai-config', 'providers'] as const,
    guardrails: ['ai-config', 'guardrails'] as const,
    templates: ['ai-config', 'templates'] as const,
    template: (id: string) => ['ai-config', 'templates', id] as const,
    usage: (period?: string) => ['ai-config', 'usage', period ?? 'today'] as const,
  },
} as const;
