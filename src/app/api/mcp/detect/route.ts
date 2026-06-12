import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateByApiToken, hasScope } from '@/lib/api/token-auth';
import { unauthorizedError, apiError, serverError } from '@/lib/api/errors';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/audit';
import type { Service } from '@/types';

const detectSchema = z.object({
  hints: z.array(
    z.object({
      type: z.enum(['package', 'env_var', 'config_file']),
      value: z.string().min(1),
    })
  ).min(1).max(500),
});

interface DetectResult {
  type: string;
  value: string;
  slug: string | null;
  service_name: string | null;
  confidence: 'exact' | 'prefix' | 'none';
}

/**
 * POST /api/mcp/detect
 *
 * 패키지명, 환경변수 키, 설정 파일명을 Linkmap 서비스 slug로 매핑한다.
 * MCP의 detect_services 도구에서 호출.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateByApiToken(request);
  if (!auth) return unauthorizedError();
  if (!hasScope(auth, 'read')) return apiError('read 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = detectSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  try {
    const supabase = createAdminClient();

    // 서비스 카탈로그 로드
    const { data: services, error } = await supabase
      .from('services')
      .select('id, slug, name, required_env_vars, official_sdks')
      .eq('is_custom', false);

    if (error) return serverError(error.message);

    const catalog = (services || []) as Pick<Service, 'id' | 'slug' | 'name' | 'required_env_vars' | 'official_sdks'>[];

    // 매핑 테이블 구축
    const slugByName = new Map<string, { slug: string; name: string }>();
    const envExact = new Map<string, { slug: string; name: string }>();
    const envPrefix = new Map<string, { slug: string; name: string }>();
    const npmToSlug = new Map<string, { slug: string; name: string }>();

    for (const svc of catalog) {
      slugByName.set(svc.slug, { slug: svc.slug, name: svc.name });

      // npm 패키지 매핑 (official_sdks에서 npm URL 파싱)
      if (svc.official_sdks) {
        for (const [, url] of Object.entries(svc.official_sdks as Record<string, string>)) {
          const npmMatch = url.match(/npmjs\.com\/package\/(.+)/);
          if (npmMatch) {
            npmToSlug.set(npmMatch[1], { slug: svc.slug, name: svc.name });
          }
        }
      }

      // env 매핑
      if (svc.required_env_vars?.length) {
        for (const envTemplate of svc.required_env_vars) {
          if (!envTemplate.name) continue;
          envExact.set(envTemplate.name, { slug: svc.slug, name: svc.name });
          const stripped = envTemplate.name
            .replace(/^(NEXT_PUBLIC_|REACT_APP_|VITE_|NUXT_PUBLIC_)/, '');
          const firstSegment = stripped.split('_')[0];
          if (firstSegment && firstSegment.length >= 2 && !envPrefix.has(firstSegment)) {
            envPrefix.set(firstSegment, { slug: svc.slug, name: svc.name });
          }
        }
      }
    }

    // 힌트 매칭
    const results: DetectResult[] = parsed.data.hints.map((hint) => {
      if (hint.type === 'package') {
        // npm 패키지명으로 매칭
        const match = npmToSlug.get(hint.value);
        if (match) {
          return { type: hint.type, value: hint.value, slug: match.slug, service_name: match.name, confidence: 'exact' };
        }
        // slug 직접 매칭 시도
        const slugMatch = slugByName.get(hint.value);
        if (slugMatch) {
          return { type: hint.type, value: hint.value, slug: slugMatch.slug, service_name: slugMatch.name, confidence: 'exact' };
        }
        return { type: hint.type, value: hint.value, slug: null, service_name: null, confidence: 'none' };
      }

      if (hint.type === 'env_var') {
        // 정확 매칭
        const exact = envExact.get(hint.value);
        if (exact) {
          return { type: hint.type, value: hint.value, slug: exact.slug, service_name: exact.name, confidence: 'exact' };
        }
        // 접두사 매칭
        const stripped = hint.value.replace(/^(NEXT_PUBLIC_|REACT_APP_|VITE_|NUXT_PUBLIC_)/, '');
        const firstSegment = stripped.split('_')[0];
        if (firstSegment) {
          const prefix = envPrefix.get(firstSegment);
          if (prefix) {
            return { type: hint.type, value: hint.value, slug: prefix.slug, service_name: prefix.name, confidence: 'prefix' };
          }
        }
        return { type: hint.type, value: hint.value, slug: null, service_name: null, confidence: 'none' };
      }

      if (hint.type === 'config_file') {
        // 설정 파일은 slug 매핑 없이 slug_list에서 검색
        // 파일명에서 서비스명 추출 시도
        for (const svc of catalog) {
          const svcSlug = svc.slug.toLowerCase();
          const fileName = hint.value.toLowerCase();
          if (fileName.includes(svcSlug) || fileName.includes(svcSlug.replace(/-/g, ''))) {
            return { type: hint.type, value: hint.value, slug: svc.slug, service_name: svc.name, confidence: 'prefix' };
          }
        }
        return { type: hint.type, value: hint.value, slug: null, service_name: null, confidence: 'none' };
      }

      return { type: hint.type, value: hint.value, slug: null, service_name: null, confidence: 'none' };
    });

    const matchedCount = results.filter((r) => r.slug !== null).length;

    await logAudit(auth.userId, {
      action: 'mcp.detect',
      resourceType: 'detection',
      details: {
        total_hints: parsed.data.hints.length,
        matched: matchedCount,
        not_found: results.length - matchedCount,
      },
    });

    return NextResponse.json({ results });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
