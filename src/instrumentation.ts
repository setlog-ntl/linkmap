import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/logger';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
    logger.info('Instrumentation registered (nodejs)');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
    logger.info('Instrumentation registered (edge)');
  }
}

export function onRequestError(
  error: { digest: string } & Error,
  request: { path: string; method: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string }
) {
  logger.error({
    msg: 'Unhandled request error',
    error: error.message,
    digest: error.digest,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
  });

  Sentry.captureException(error, {
    tags: {
      routePath: context.routePath,
      routeType: context.routeType,
      method: request.method,
    },
    extra: {
      path: request.path,
      renderSource: context.renderSource,
      digest: error.digest,
    },
  });
}
