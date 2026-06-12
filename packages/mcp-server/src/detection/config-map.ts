/**
 * 설정 파일 → Linkmap 서비스 slug 매핑
 *
 * 프로젝트 루트에 해당 파일이 존재하면 서비스 사용으로 간주.
 */
export const CONFIG_FILE_TO_SLUG: Record<string, string> = {
  // Deploy
  'vercel.json': 'vercel',
  'netlify.toml': 'netlify',
  'wrangler.toml': 'cloudflare',
  'wrangler.jsonc': 'cloudflare',
  'wrangler.json': 'cloudflare',
  'fly.toml': 'flyio',
  'railway.json': 'railway',
  'railway.toml': 'railway',
  'render.yaml': 'render',
  'Dockerfile': 'docker',
  'docker-compose.yml': 'docker',
  'docker-compose.yaml': 'docker',

  // Monitoring
  'sentry.properties': 'sentry',
  '.sentryclirc': 'sentry',
  'newrelic.js': 'new-relic',

  // CMS
  'sanity.config.ts': 'sanity',
  'sanity.config.js': 'sanity',
  'sanity.cli.ts': 'sanity',
  'contentful.json': 'contentful',
  'payload.config.ts': 'payload-cms',

  // Testing
  'playwright.config.ts': 'playwright',
  'playwright.config.js': 'playwright',
  'cypress.config.ts': 'cypress',
  'cypress.config.js': 'cypress',
  'vitest.config.ts': 'vitest',
  'vitest.config.js': 'vitest',

  // Database ORM
  'drizzle.config.ts': 'drizzle',
  'drizzle.config.js': 'drizzle',
  'prisma/schema.prisma': 'prisma',

  // Task Queue
  'trigger.config.ts': 'trigger-dev',
  'inngest.config.ts': 'inngest',

  // Grafana
  'grafana.ini': 'grafana',
};

/**
 * 디렉토리 존재 여부로 서비스 탐지
 */
export const CONFIG_DIR_TO_SLUG: Record<string, string> = {
  '.storybook': 'storybook',
  'convex': 'convex',
  '.github/workflows': 'github-actions',
  'supabase': 'supabase',
  'strapi': 'strapi',
};
