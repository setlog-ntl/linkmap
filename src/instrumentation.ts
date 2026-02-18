import { logger } from '@/lib/logger';

export async function register() {
  const runtime = process.env.NEXT_RUNTIME;
  if (runtime) {
    logger.info(`Instrumentation registered (${runtime})`);
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
}
