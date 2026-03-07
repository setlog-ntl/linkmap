import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError } from '@/lib/api/errors';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 1. 배포 기반 쇼케이스
  const { data: deployShowcases, error: deployError } = await supabase
    .from('homepage_deploys')
    .select(`
      id,
      site_name,
      pages_url,
      deployment_url,
      deploy_method,
      deployed_at,
      created_at,
      user_id,
      showcase_description,
      showcase_tags,
      showcase_category,
      homepage_templates (
        id,
        slug,
        name,
        name_ko,
        framework,
        preview_image_url
      ),
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .eq('user_id', user.id)
    .eq('is_showcase', true)
    .eq('deploy_status', 'ready')
    .order('deployed_at', { ascending: false });

  // 2. 프로젝트 기반 쇼케이스
  const { data: projectShowcases, error: projectError } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      link_url,
      description,
      icon_type,
      icon_value,
      showcase_description,
      showcase_tags,
      showcase_category,
      created_at,
      user_id,
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .eq('user_id', user.id)
    .eq('is_showcase', true)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  // profiles join 실패 시 profiles 없이 재시도
  let projectData = projectShowcases;
  if (projectError && !projectShowcases) {
    console.error('[Showcase Mine API] project query error (retrying without profiles):', projectError.message);
    const { data: fallback } = await supabase
      .from('projects')
      .select(`
        id, name, link_url, description, icon_type, icon_value,
        showcase_description, showcase_tags, showcase_category,
        created_at, user_id
      `)
      .eq('user_id', user.id)
      .eq('is_showcase', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    projectData = fallback?.map((p) => ({ ...p, profiles: null as unknown as { name: string; avatar_url: string }[] })) ?? null;
  }

  if (deployError) {
    console.error('[Showcase Mine API] deploy error:', deployError.message);
  }

  const combined = [
    ...(deployShowcases || []).map((d) => {
      const dProf = Array.isArray(d.profiles) ? d.profiles[0] ?? null : d.profiles ?? null;
      return {
        ...d,
        profiles: dProf as { name: string | null; avatar_url: string | null } | null,
        source: 'deploy' as const,
      };
    }),
    ...(projectData || []).map((p) => {
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
        homepage_templates: null,
        profiles: prof as { name: string | null; avatar_url: string | null } | null,
        project_icon_type: p.icon_type,
        project_icon_value: p.icon_value,
        source: 'project' as const,
      };
    }),
  ];

  combined.sort((a, b) => {
    const dateA = a.deployed_at || a.created_at;
    const dateB = b.deployed_at || b.created_at;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return NextResponse.json({ showcases: combined });
}
