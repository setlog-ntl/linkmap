import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, apiError, validationError, serverError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { DETECTABLE_SLUGS } from '@/lib/oneclick/service-signatures';
import { z } from 'zod';

const addServicesSchema = z.object({
  slugs: z.array(z.string().min(1).max(80)).min(1, '추가할 서비스를 선택해주세요').max(20),
});

/**
 * 배포한 사이트가 쓰는 서비스를 프로젝트(서비스맵)에 담는다 — Phase 3 퍼널 브릿지.
 *
 * 감지는 배포 시점에 끝나 있고(`config_data.detected_services`), 여기서는 사용자가 고른 것만
 * 등록한다. 자동 등록하지 않는 이유: 서비스맵은 사용자가 "내 서비스는 이렇게 생겼다"고
 * 스스로 그리는 곳이라, 추측으로 채우면 신뢰를 잃는다.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorizedError();

    const body = await request.json();
    const parsed = addServicesSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error);

    // 소유권 확인
    const { data: deploy } = await supabase
      .from('homepage_deploys')
      .select('id, site_name, project_id, config_data')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!deploy) return notFoundError('배포');
    if (!deploy.project_id) return apiError('연결된 프로젝트가 없습니다', 400);

    // 이 배포가 가리키는 프로젝트가 정말 본인 것인지 확인한다.
    // 배포 row의 user_id만 보면 부족하다 — project_id는 생성 이후에도 바뀔 수 있고,
    // RLS 한 겹에만 기대지 않는 것이 이 저장소의 규칙이다.
    const { data: ownedProject } = await supabase
      .from('projects')
      .select('id')
      .eq('id', deploy.project_id)
      .eq('user_id', user.id)
      .single();

    if (!ownedProject) return notFoundError('프로젝트');

    // 감지된 목록에 있는 것만 허용한다.
    // ⚠️ config_data는 사용자가 자기 배포 row를 직접 수정해 바꿀 수 있으므로 이 필터는
    // 권한 경계가 아니라 UX 가드다. 실제 상한은 아래 DETECTABLE_SLUGS(서버 상수)가 잡는다.
    const config = (deploy.config_data ?? {}) as { detected_services?: { slug?: unknown }[] };
    const detected = new Set(
      (config.detected_services ?? [])
        .map((d) => d?.slug)
        .filter((s): s is string => typeof s === 'string'),
    );
    const detectable = new Set(DETECTABLE_SLUGS);
    const requested = parsed.data.slugs.filter((s) => detected.has(s) && detectable.has(s));
    if (requested.length === 0) {
      return apiError('이 사이트에서 감지되지 않은 서비스입니다', 400);
    }

    const { data: services } = await supabase
      .from('services')
      .select('id, slug, name')
      .in('slug', requested);

    if (!services || services.length === 0) return notFoundError('서비스');

    // 이미 담긴 것은 건너뛴다 (중복 추가로 서비스맵이 지저분해지지 않게)
    const { data: existing } = await supabase
      .from('project_services')
      .select('service_id')
      .eq('project_id', deploy.project_id);

    const already = new Set((existing ?? []).map((e) => e.service_id));
    const toAdd = services.filter((s) => !already.has(s.id));

    if (toAdd.length > 0) {
      const { error } = await supabase.from('project_services').insert(
        toAdd.map((s) => ({ project_id: deploy.project_id, service_id: s.id })),
      );
      // DB 오류 원문(RLS 정책 문구 등)을 그대로 내려보내지 않는다
      if (error) {
        console.error('project_services insert failed:', error.message);
        return serverError('서비스맵에 추가하지 못했습니다');
      }
    }

    // 담은 서비스를 기록해 다음에 다시 제안하지 않는다
    const linkedSlugs = [
      ...new Set([
        ...((config as { linked_services?: unknown }).linked_services as string[] | undefined ?? []),
        ...services.map((s) => s.slug),
      ]),
    ];
    await supabase
      .from('homepage_deploys')
      .update({ config_data: { ...config, linked_services: linkedSlugs } })
      .eq('id', id)
      .eq('user_id', user.id);

    await logAudit(user.id, {
      action: 'oneclick.services_linked',
      resourceType: 'homepage_deploy',
      resourceId: id,
      details: {
        site_name: deploy.site_name,
        project_id: deploy.project_id,
        added: toAdd.map((s) => s.slug),
        already_linked: services.filter((s) => already.has(s.id)).map((s) => s.slug),
      },
    });

    return NextResponse.json({
      added: toAdd.map((s) => ({ slug: s.slug, name: s.name })),
      already_linked: services.filter((s) => already.has(s.id)).map((s) => s.slug),
      project_id: deploy.project_id,
    });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Unknown error');
  }
}
