import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const now = new Date();
  const month = searchParams.get('month') ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Lazy Evaluation: 이번 달이 아닌 지난 달 조회 시, picks가 비어있으면 자동 선정
  const isCurrentMonth = month === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { data: existingPicks } = await supabase
    .from('showcase_monthly_picks')
    .select('*')
    .eq('year_month', month)
    .order('rank', { ascending: true });

  if (!existingPicks || existingPicks.length === 0) {
    if (!isCurrentMonth) {
      // 지난 달 자동 선정: SECURITY DEFINER RPC로 RLS 우회
      const [year, monthNum] = month.split('-').map(Number);
      const monthStart = new Date(year, monthNum - 1, 1).toISOString();
      const monthEnd = new Date(year, monthNum, 0, 23, 59, 59).toISOString();

      await supabase.rpc('auto_pick_monthly_showcase', {
        p_year_month: month,
        p_month_start: monthStart,
        p_month_end: monthEnd,
      });

      const { data: newPicks } = await supabase
        .from('showcase_monthly_picks')
        .select('*')
        .eq('year_month', month)
        .order('rank', { ascending: true });

      if (newPicks && newPicks.length > 0) {
        const enriched = await enrichPicks(supabase, newPicks);
        return NextResponse.json({ picks: enriched });
      }
    }
    return NextResponse.json({ picks: [] });
  }

  const enriched = await enrichPicks(supabase, existingPicks);
  return NextResponse.json({ picks: enriched });
}

interface PickRow {
  id: string;
  showcase_id: string;
  showcase_source: string;
  year_month: string;
  pick_type: string;
  rank: number;
  admin_note: string | null;
  picked_by: string | null;
  score_snapshot: number | null;
  created_at: string;
}

async function enrichPicks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  picks: PickRow[]
) {
  // 1. Group picks by showcase_source
  const deployIds = picks
    .filter((p) => p.showcase_source === 'deploy')
    .map((p) => p.showcase_id);
  const projectIds = picks
    .filter((p) => p.showcase_source !== 'deploy')
    .map((p) => p.showcase_id);

  // 2. Batch fetch deploy-source and project-source in parallel
  const [deployResult, projectResult] = await Promise.all([
    deployIds.length > 0
      ? supabase
          .from('homepage_deploys')
          .select(`
            id, site_name, pages_url, deployment_url, deploy_method, deployed_at,
            created_at, user_id, showcase_description, showcase_tags, showcase_category,
            showcase_image_url, like_count, comment_count, view_count,
            profiles:user_id ( name, avatar_url )
          `)
          .in('id', deployIds)
      : Promise.resolve({ data: [] as never[] }),
    projectIds.length > 0
      ? supabase
          .from('projects')
          .select(`
            id, name, link_url, description, icon_type, icon_value,
            showcase_description, showcase_tags, showcase_category, showcase_image_url,
            like_count, comment_count, view_count,
            created_at, user_id,
            profiles:user_id ( name, avatar_url )
          `)
          .in('id', projectIds)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  // 3. Build lookup maps by id
  const deployMap = new Map(
    (deployResult.data ?? []).map((d) => [d.id, d])
  );
  const projectMap = new Map(
    (projectResult.data ?? []).map((p) => [p.id, p])
  );

  // 4. Map results back to picks, preserving original order
  const enriched = [];

  for (const pick of picks) {
    if (pick.showcase_source === 'deploy') {
      const data = deployMap.get(pick.showcase_id);
      if (data) {
        const prof = Array.isArray(data.profiles) ? data.profiles[0] ?? null : data.profiles ?? null;
        enriched.push({
          ...pick,
          showcase: {
            ...data,
            profiles: prof as { name: string | null; avatar_url: string | null } | null,
            source: 'deploy' as const,
            score: pick.score_snapshot ?? 0,
            homepage_templates: null,
          },
        });
      }
    } else {
      const data = projectMap.get(pick.showcase_id);
      if (data) {
        const prof = Array.isArray(data.profiles) ? data.profiles[0] ?? null : data.profiles ?? null;
        enriched.push({
          ...pick,
          showcase: {
            id: data.id,
            site_name: data.name,
            pages_url: data.link_url,
            deployment_url: null,
            deploy_method: null,
            deployed_at: null,
            created_at: data.created_at,
            user_id: data.user_id,
            showcase_description: data.showcase_description || data.description,
            showcase_tags: data.showcase_tags,
            showcase_category: data.showcase_category,
            showcase_image_url: data.showcase_image_url,
            like_count: data.like_count,
            comment_count: data.comment_count,
            view_count: data.view_count,
            profiles: prof as { name: string | null; avatar_url: string | null } | null,
            source: 'project' as const,
            score: pick.score_snapshot ?? 0,
            homepage_templates: null,
          },
        });
      }
    }
  }

  return enriched;
}
