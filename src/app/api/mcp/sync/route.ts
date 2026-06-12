import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateByApiToken, hasScope } from '@/lib/api/token-auth';
import { unauthorizedError, apiError, serverError, notFoundError } from '@/lib/api/errors';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/audit';

const syncSchema = z.object({
  project_id: z.string().uuid('유효한 프로젝트 ID가 필요합니다'),
  detected_services: z.array(
    z.object({
      slug: z.string().min(1),
      confidence: z.enum(['high', 'medium', 'low']).default('medium'),
      source: z.string().default(''),
      env_vars: z.array(z.string()).optional(),
    })
  ).min(1).max(200),
  create_custom_for_unmatched: z.boolean().default(false),
});

interface SyncResultItem {
  slug: string;
  service_id: string;
  service_name?: string;
}

/**
 * POST /api/mcp/sync
 *
 * 감지된 서비스를 Linkmap 프로젝트에 동기화한다.
 * - 기존 project_services와 비교하여 차분만 추가
 * - 글로벌 카탈로그에 없는 slug는 not_found로 반환
 * - create_custom_for_unmatched=true면 커스텀 서비스 자동 생성
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateByApiToken(request);
  if (!auth) return unauthorizedError();
  if (!hasScope(auth, 'write')) return apiError('write 권한이 필요합니다', 403);

  const body = await request.json();
  const parsed = syncSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  const { project_id, detected_services, create_custom_for_unmatched } = parsed.data;

  try {
    const supabase = createAdminClient();

    // 프로젝트 소유권 확인
    const { data: project, error: projErr } = await supabase
      .from('projects')
      .select('id, user_id, name')
      .eq('id', project_id)
      .single();

    if (projErr || !project) return notFoundError('프로젝트');
    if (project.user_id !== auth.userId) {
      return apiError('프로젝트 접근 권한이 없습니다', 403);
    }

    // 요청된 slug 목록
    const requestedSlugs = detected_services.map((s) => s.slug);

    // 글로벌 카탈로그에서 slug로 서비스 조회
    const { data: catalogServices, error: catErr } = await supabase
      .from('services')
      .select('id, slug, name')
      .in('slug', requestedSlugs)
      .eq('is_custom', false);

    if (catErr) return serverError(catErr.message);

    const slugToService = new Map(
      (catalogServices || []).map((s) => [s.slug, { id: s.id, name: s.name }])
    );

    // 기존 project_services 조회
    const { data: existingPS, error: psErr } = await supabase
      .from('project_services')
      .select('service_id')
      .eq('project_id', project_id);

    if (psErr) return serverError(psErr.message);

    const existingServiceIds = new Set(
      (existingPS || []).map((ps) => ps.service_id)
    );

    // 결과 분류
    const added: SyncResultItem[] = [];
    const alreadyExists: SyncResultItem[] = [];
    const notFound: string[] = [];
    const customCreated: SyncResultItem[] = [];

    // 신규 추가할 project_services 레코드
    const toInsert: { project_id: string; service_id: string; status: string; notes: string }[] = [];

    for (const detected of detected_services) {
      const service = slugToService.get(detected.slug);

      if (!service) {
        // 글로벌 카탈로그에 없는 slug
        if (create_custom_for_unmatched) {
          // 커스텀 서비스 자동 생성
          const customSlug = `custom-${auth.userId.slice(0, 8)}-${detected.slug}`;
          const { data: customSvc, error: customErr } = await supabase
            .from('services')
            .insert({
              name: detected.slug,
              slug: customSlug,
              category: 'integration',
              is_custom: true,
              user_id: auth.userId,
              description_ko: `MCP 동기화로 자동 생성: ${detected.slug}`,
            })
            .select('id, slug, name')
            .single();

          if (!customErr && customSvc) {
            toInsert.push({
              project_id,
              service_id: customSvc.id,
              status: 'in_progress',
              notes: `MCP sync: ${detected.source}`,
            });
            customCreated.push({
              slug: detected.slug,
              service_id: customSvc.id,
              service_name: customSvc.name,
            });
          } else {
            notFound.push(detected.slug);
          }
        } else {
          notFound.push(detected.slug);
        }
        continue;
      }

      if (existingServiceIds.has(service.id)) {
        alreadyExists.push({
          slug: detected.slug,
          service_id: service.id,
          service_name: service.name,
        });
        continue;
      }

      // 신규 추가
      toInsert.push({
        project_id,
        service_id: service.id,
        status: 'in_progress',
        notes: `MCP sync: ${detected.source}`,
      });
      added.push({
        slug: detected.slug,
        service_id: service.id,
        service_name: service.name,
      });
    }

    // 일괄 INSERT
    if (toInsert.length > 0) {
      const { error: insertErr } = await supabase
        .from('project_services')
        .insert(toInsert);

      if (insertErr) return serverError(insertErr.message);
    }

    // 최종 카운트 조회
    const { count: totalCount } = await supabase
      .from('project_services')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', project_id);

    // 감사 로그
    await logAudit(auth.userId, {
      action: 'mcp.sync_services',
      resourceType: 'project',
      resourceId: project_id,
      details: {
        added: added.length,
        already_exists: alreadyExists.length,
        not_found: notFound.length,
        custom_created: customCreated.length,
        slugs: requestedSlugs,
      },
    });

    return NextResponse.json({
      added,
      already_exists: alreadyExists,
      not_found: notFound,
      custom_created: customCreated,
      total_project_services: totalCount ?? 0,
    });
  } catch (err) {
    return serverError((err as Error).message);
  }
}
