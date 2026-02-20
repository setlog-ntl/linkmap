import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, serverError } from '@/lib/api/errors';

export async function GET(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Read feature_slug from query
  const featureSlug = request.nextUrl.searchParams.get('feature_slug');
  if (!featureSlug) {
    return NextResponse.json({ error: 'feature_slug 파라미터가 필요합니다' }, { status: 400 });
  }

  try {
    const adminSupabase = createAdminClient();

    // Fetch feature config with persona name
    const { data: config } = await adminSupabase
      .from('ai_feature_personas')
      .select('*')
      .eq('feature_slug', featureSlug)
      .eq('is_active', true)
      .single();

    if (!config) {
      return NextResponse.json({ config: null, templates: [] });
    }

    // Load assigned templates
    let templates: Array<{ id: string; name: string; name_ko: string | null; prompt_text: string; icon: string }> = [];
    if (config.template_ids?.length) {
      const { data: tmplData } = await adminSupabase
        .from('ai_prompt_templates')
        .select('id, name, name_ko, prompt_text, icon')
        .in('id', config.template_ids)
        .eq('is_active', true);

      templates = tmplData || [];
    }

    // Load persona name if assigned
    let personaName: string | null = null;
    if (config.persona_id) {
      const { data: persona } = await adminSupabase
        .from('ai_personas')
        .select('name')
        .eq('id', config.persona_id)
        .single();
      personaName = persona?.name || null;
    }

    return NextResponse.json({
      config: { ...config, persona_name: personaName },
      templates,
    });
  } catch (err) {
    console.error('Feature config error:', err);
    return serverError('기능 설정을 불러올 수 없습니다');
  }
}
