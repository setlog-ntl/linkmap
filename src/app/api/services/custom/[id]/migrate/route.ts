import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, notFoundError, validationError, serverError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';

type RouteContext = { params: Promise<{ id: string }> };

const migrateSchema = z.object({
  globalServiceId: z.string().uuid('유효한 서비스 ID가 아닙니다'),
});

/**
 * POST /api/services/custom/[id]/migrate
 * 커스텀 서비스를 글로벌 서비스로 전환 (FK 이관 + 삭제)
 */
export async function POST(request: NextRequest, context: RouteContext) {
  const { id: customServiceId } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Zod 검증
  const body = await request.json();
  const parsed = migrateSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);
  const { globalServiceId } = parsed.data;

  // 소유권 확인: 커스텀 서비스
  const { data: customService, error: customErr } = await supabase
    .from('services')
    .select('id, name, user_id, is_custom')
    .eq('id', customServiceId)
    .eq('is_custom', true)
    .eq('user_id', user.id)
    .single();

  if (customErr || !customService) return notFoundError('커스텀 서비스');

  // 글로벌 서비스 존재 확인
  const { data: globalService, error: globalErr } = await supabase
    .from('services')
    .select('id, name, is_custom')
    .eq('id', globalServiceId)
    .eq('is_custom', false)
    .single();

  if (globalErr || !globalService) return notFoundError('글로벌 서비스');

  // 같은 서비스로 전환 방지
  if (customServiceId === globalServiceId) {
    return apiError('같은 서비스로 전환할 수 없습니다', 400);
  }

  // Admin Client 사용 — RLS 무시하여 FK 이관
  const admin = createAdminClient();

  try {
    // ── 1. project_services: UNIQUE(project_id, service_id) 충돌 처리 ──
    const { data: customPS } = await admin
      .from('project_services')
      .select('id, project_id')
      .eq('service_id', customServiceId);

    if (customPS && customPS.length > 0) {
      for (const ps of customPS) {
        // 같은 project에 globalServiceId가 이미 있는지 확인
        const { data: existing } = await admin
          .from('project_services')
          .select('id')
          .eq('project_id', ps.project_id)
          .eq('service_id', globalServiceId)
          .single();

        if (existing) {
          // 충돌 → 커스텀쪽 레코드 삭제
          await admin.from('project_services').delete().eq('id', ps.id);
        } else {
          // UPDATE
          await admin
            .from('project_services')
            .update({ service_id: globalServiceId })
            .eq('id', ps.id);
        }
      }
    }

    // ── 2. environment_variables: service_id (nullable, no UNIQUE) ──
    await admin
      .from('environment_variables')
      .update({ service_id: globalServiceId })
      .eq('service_id', customServiceId);

    // ── 3. user_connections: source_service_id, target_service_id ──
    // source_service_id
    const { data: srcConns } = await admin
      .from('user_connections')
      .select('id, project_id, target_service_id')
      .eq('source_service_id', customServiceId);

    if (srcConns && srcConns.length > 0) {
      for (const conn of srcConns) {
        const { data: existing } = await admin
          .from('user_connections')
          .select('id')
          .eq('project_id', conn.project_id)
          .eq('source_service_id', globalServiceId)
          .eq('target_service_id', conn.target_service_id)
          .single();

        if (existing) {
          await admin.from('user_connections').delete().eq('id', conn.id);
        } else {
          await admin
            .from('user_connections')
            .update({ source_service_id: globalServiceId })
            .eq('id', conn.id);
        }
      }
    }

    // target_service_id
    const { data: tgtConns } = await admin
      .from('user_connections')
      .select('id, project_id, source_service_id')
      .eq('target_service_id', customServiceId);

    if (tgtConns && tgtConns.length > 0) {
      for (const conn of tgtConns) {
        const { data: existing } = await admin
          .from('user_connections')
          .select('id')
          .eq('project_id', conn.project_id)
          .eq('source_service_id', conn.source_service_id)
          .eq('target_service_id', globalServiceId)
          .single();

        if (existing) {
          await admin.from('user_connections').delete().eq('id', conn.id);
        } else {
          await admin
            .from('user_connections')
            .update({ target_service_id: globalServiceId })
            .eq('id', conn.id);
        }
      }
    }

    // ── 4. service_accounts: UNIQUE(project_id, service_id, user_id) ──
    const { data: customSA } = await admin
      .from('service_accounts')
      .select('id, project_id, user_id')
      .eq('service_id', customServiceId);

    if (customSA && customSA.length > 0) {
      for (const sa of customSA) {
        const { data: existing } = await admin
          .from('service_accounts')
          .select('id')
          .eq('project_id', sa.project_id)
          .eq('service_id', globalServiceId)
          .eq('user_id', sa.user_id)
          .single();

        if (existing) {
          await admin.from('service_accounts').delete().eq('id', sa.id);
        } else {
          await admin
            .from('service_accounts')
            .update({ service_id: globalServiceId })
            .eq('id', sa.id);
        }
      }
    }

    // ── 5. project_service_overrides: UNIQUE(project_id, service_id) ──
    const { data: customOverrides } = await admin
      .from('project_service_overrides')
      .select('id, project_id')
      .eq('service_id', customServiceId);

    if (customOverrides && customOverrides.length > 0) {
      for (const ov of customOverrides) {
        const { data: existing } = await admin
          .from('project_service_overrides')
          .select('id')
          .eq('project_id', ov.project_id)
          .eq('service_id', globalServiceId)
          .single();

        if (existing) {
          await admin.from('project_service_overrides').delete().eq('id', ov.id);
        } else {
          await admin
            .from('project_service_overrides')
            .update({ service_id: globalServiceId })
            .eq('id', ov.id);
        }
      }
    }

    // ── 6. service_dependencies: service_id + depends_on_service_id ──
    // service_id side
    const { data: depsSvc } = await admin
      .from('service_dependencies')
      .select('id, depends_on_service_id')
      .eq('service_id', customServiceId);

    if (depsSvc && depsSvc.length > 0) {
      for (const dep of depsSvc) {
        const { data: existing } = await admin
          .from('service_dependencies')
          .select('id')
          .eq('service_id', globalServiceId)
          .eq('depends_on_service_id', dep.depends_on_service_id)
          .single();

        if (existing) {
          await admin.from('service_dependencies').delete().eq('id', dep.id);
        } else {
          await admin
            .from('service_dependencies')
            .update({ service_id: globalServiceId })
            .eq('id', dep.id);
        }
      }
    }

    // depends_on_service_id side
    const { data: depsDep } = await admin
      .from('service_dependencies')
      .select('id, service_id')
      .eq('depends_on_service_id', customServiceId);

    if (depsDep && depsDep.length > 0) {
      for (const dep of depsDep) {
        const { data: existing } = await admin
          .from('service_dependencies')
          .select('id')
          .eq('service_id', dep.service_id)
          .eq('depends_on_service_id', globalServiceId)
          .single();

        if (existing) {
          await admin.from('service_dependencies').delete().eq('id', dep.id);
        } else {
          await admin
            .from('service_dependencies')
            .update({ depends_on_service_id: globalServiceId })
            .eq('id', dep.id);
        }
      }
    }

    // ── 커스텀 서비스 삭제 (나머지 CASCADE 테이블 자동 정리) ──
    const { error: deleteErr } = await admin
      .from('services')
      .delete()
      .eq('id', customServiceId);

    if (deleteErr) return serverError(deleteErr.message);

  } catch (err) {
    const message = err instanceof Error ? err.message : '전환 중 오류가 발생했습니다';
    return serverError(message);
  }

  // 감사 로그
  await logAudit(user.id, {
    action: 'custom_service.migrate',
    resourceType: 'service',
    resourceId: customServiceId,
    details: {
      customServiceName: customService.name,
      globalServiceId,
      globalServiceName: globalService.name,
    },
  });

  return NextResponse.json({
    success: true,
    migratedTo: { id: globalService.id, name: globalService.name },
  });
}
