import { logger } from '@/lib/logger';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    logger.info('Instrumentation registered', {
      runtime: 'nodejs',
      env: process.env.NODE_ENV,
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    logger.info('Instrumentation registered', {
      runtime: 'edge',
    });
  }
}

export function onRequestError(
  error: { digest: string } & Error,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string }
) {
  logger.error('Unhandled request error', {
    error: error.message,
    digest: error.digest,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  });
}
