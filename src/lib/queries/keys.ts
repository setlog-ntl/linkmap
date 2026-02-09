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
  },
  catalog: {
    all: ['catalog'] as const,
  },
} as const;
