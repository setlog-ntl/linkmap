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
      return NextResponse.json({ config: null, qna: [] });
    }

    // Load Q&A for this feature
    const { data: qnaData } = await adminSupabase
      .from('ai_feature_qna')
      .select('id, question, question_ko, answer_guide, sort_order')
      .eq('feature_slug', featureSlug)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

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
      qna: qnaData || [],
    });
  } catch (err) {
    console.error('Feature config error:', err);
    return serverError('기능 설정을 불러올 수 없습니다');
  }
}
