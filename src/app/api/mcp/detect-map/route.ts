import { NextRequest, NextResponse } from 'next/server';
import { authenticateByApiToken, hasScope } from '@/lib/api/token-auth';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Service } from '@/types';

/**
 * GET /api/mcp/detect-map
 *
 * MCP 서버가 서비스 탐지에 사용할 매핑 테이블을 반환한다.
 * - env_exact: 환경변수 키명 → 서비스 slug (정확 매칭)
 * - env_prefix: 환경변수 접두사 → 서비스 slug (접두사 매칭)
 * - slug_list: 등록된 모든 서비스 slug 목록
 */
export async function GET(request: NextRequest) {
  const auth = await authenticateByApiToken(request);
  if (!auth) return unauthorizedError();
  if (!hasScope(auth, 'read')) return apiError('read 권한이 필요합니다', 403);

  try {
    const supabase = createAdminClient();

    const { data: services, error } = await supabase
      .from('services')
      .select('id, slug, name, required_env_vars')
      .eq('is_custom', false);

    if (error) return serverError(error.message);

    const envExact: Record<string, string> = {};
    const envPrefix: Record<string, string> = {};
    const slugList: string[] = [];

    for (const svc of (services || []) as Pick<Service, 'id' | 'slug' | 'name' | 'required_env_vars'>[]) {
      slugList.push(svc.slug);

      if (!svc.required_env_vars?.length) continue;

      for (const envTemplate of svc.required_env_vars) {
        if (!envTemplate.name) continue;

        // 정확 매칭
        envExact[envTemplate.name] = svc.slug;

        // 접두사 매칭: 프레임워크 접두사 제거 후 첫 세그먼트
        const stripped = envTemplate.name
          .replace(/^(NEXT_PUBLIC_|REACT_APP_|VITE_|NUXT_PUBLIC_)/, '');
        const firstSegment = stripped.split('_')[0];
        if (firstSegment && firstSegment.length >= 2 && !envPrefix[firstSegment]) {
          envPrefix[firstSegment] = svc.slug;
        }
      }
    }

    return NextResponse.json(
      { env_exact: envExact, env_prefix: envPrefix, slug_list: slugList },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    );
  } catch (err) {
    return serverError((err as Error).message);
  }
}
