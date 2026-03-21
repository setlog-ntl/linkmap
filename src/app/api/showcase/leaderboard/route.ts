import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const querySchema = z.object({
  period: z.enum(['week', 'month', 'all']).default('month'),
  category: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    period: searchParams.get('period') || 'month',
    category: searchParams.get('category') || undefined,
  });

  const { period, category } = parsed.success
    ? parsed.data
    : { period: 'month' as const, category: undefined };

  // 기간 필터 계산
  const now = new Date();
  let periodStart: string | null = null;
  if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    periodStart = weekAgo.toISOString();
  } else if (period === 'month') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    periodStart = monthStart.toISOString();
  }

  // 1. 배포 기반 쇼케이스
  let deployQuery = supabase
    .from('homepage_deploys')
    .select(`
      id, site_name, pages_url, deployment_url, deploy_method, deployed_at,
      created_at, user_id, showcase_description, showcase_tags, showcase_category,
      showcase_image_url, like_count, comment_count, view_count,
      homepage_templates ( id, slug, name, name_ko, framework, preview_image_url ),
      profiles:user_id ( name, avatar_url )
    `)
    .eq('is_showcase', true)
    .eq('deploy_status', 'ready');

  if (category) {
    deployQuery = deployQuery.eq('showcase_category', category);
  }
  if (periodStart) {
    deployQuery = deployQuery.gte('created_at', periodStart);
  }

  const { data: deployShowcases } = await deployQuery
    .order('like_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  // 2. 프로젝트 기반 쇼케이스
  let projectQuery = supabase
    .from('projects')
    .select(`
      id, name, link_url, description, icon_type, icon_value,
      showcase_description, showcase_tags, showcase_category, showcase_image_url,
      like_count, comment_count, view_count,
      created_at, user_id,
      profiles:user_id ( name, avatar_url )
    `)
    .eq('is_showcase', true)
    .is('deleted_at', null);

  if (category) {
    projectQuery = projectQuery.eq('showcase_category', category);
  }
  if (periodStart) {
    projectQuery = projectQuery.gte('created_at', periodStart);
  }

  const { data: projectShowcases } = await projectQuery
    .order('like_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  // 활성 hide 액션 조회
  const { data: hideActions } = await supabase
    .from('showcase_admin_actions')
    .select('showcase_id')
    .eq('action_type', 'hide')
    .eq('is_active', true);

  const hiddenIds = new Set((hideActions || []).map((a) => a.showcase_id));

  // 활성 boost 액션 조회
  const { data: boostActions } = await supabase
    .from('showcase_admin_actions')
    .select('showcase_id, boost_score')
    .eq('action_type', 'boost')
    .eq('is_active', true);

  const boostMap = new Map<string, number>();
  for (const b of boostActions || []) {
    boostMap.set(b.showcase_id, (boostMap.get(b.showcase_id) || 0) + (b.boost_score || 0));
  }

  // 통합 + 스코어 계산
  const combined = [
    ...(deployShowcases || []).map((d) => {
      const prof = Array.isArray(d.profiles) ? d.profiles[0] ?? null : d.profiles ?? null;
      return {
        ...d,
        profiles: prof as { name: string | null; avatar_url: string | null } | null,
        source: 'deploy' as const,
      };
    }),
    ...(projectShowcases || []).map((p) => {
      const prof = Array.isArray(p.profiles) ? p.profiles[0] ?? null : p.profiles ?? null;
      return {
        id: p.id,
        site_name: p.name,
        pages_url: p.link_url,
        deployment_url: null,
        deploy_method: null,
        deployed_at: null,
        created_at: p.created_at,
        user_id: p.user_id,
        showcase_description: p.showcase_description || p.description,
        showcase_tags: p.showcase_tags,
        showcase_category: p.showcase_category,
        showcase_image_url: p.showcase_image_url,
        like_count: p.like_count,
        comment_count: p.comment_count,
        view_count: p.view_count,
        homepage_templates: null,
        profiles: prof as { name: string | null; avatar_url: string | null } | null,
        project_icon_type: p.icon_type,
        project_icon_value: p.icon_value,
        source: 'project' as const,
      };
    }),
  ]
    .filter((item) => !hiddenIds.has(item.id))
    .map((item) => {
      const baseScore =
        (item.like_count ?? 0) * 3 +
        (item.comment_count ?? 0) * 2 +
        (item.view_count ?? 0) * 0.1;

      // time_decay: "전체" 탭에서만 적용
      let timeDecay = 0;
      if (period === 'all') {
        const daysSince = Math.max(
          0,
          (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        timeDecay = 50 / (1 + daysSince * 0.1);
      }

      const adminBoost = boostMap.get(item.id) || 0;
      const score = Math.round((baseScore + timeDecay + adminBoost) * 100) / 100;

      return { ...item, score };
    });

  // 스코어 내림차순 정렬
  combined.sort((a, b) => b.score - a.score || b.like_count - a.like_count);

  return NextResponse.json({ showcases: combined.slice(0, 50) });
}
