import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { isAdmin } from '@/lib/admin';
import { aiFeaturePersonaUpdateSchema } from '@/lib/validations/ai-chat';
import { logAudit } from '@/lib/audit';
import { FEATURE_DEFINITIONS, DEFAULT_QNA } from '@/data/seed/ai-feature-defaults';

export async function GET() {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  try {
    const adminSupabase = createAdminClient();
    let { data: features } = await adminSupabase
      .from('ai_feature_personas')
      .select('*')
      .order('feature_slug');

    // Auto-seed when no features exist
    if (!features || features.length === 0) {
      const rows = FEATURE_DEFINITIONS.map((f) => ({
        feature_slug: f.slug,
        system_prompt_override: f.default_prompt_override,
        is_active: true,
      }));

      await adminSupabase
        .from('ai_feature_personas')
        .upsert(rows, { onConflict: 'feature_slug' });

      // Seed default Q&A
      const qnaRows = DEFAULT_QNA.map((q) => ({
        feature_slug: q.feature_slug,
        question: q.question,
        question_ko: q.question_ko,
        answer_guide: q.answer_guide,
        sort_order: q.sort_order,
        is_active: true,
      }));

      await adminSupabase
        .from('ai_feature_qna')
        .insert(qnaRows);

      // Re-fetch
      const { data: seeded } = await adminSupabase
        .from('ai_feature_personas')
        .select('*')
        .order('feature_slug');

      features = seeded;
    }

    // Join persona names
    const personaIds = (features || [])
      .map((f) => f.persona_id)
      .filter(Boolean) as string[];

    let personaMap: Record<string, string> = {};
    if (personaIds.length) {
      const { data: personas } = await adminSupabase
        .from('ai_personas')
        .select('id, name')
        .in('id', personaIds);

      personaMap = Object.fromEntries(
        (personas || []).map((p) => [p.id, p.name])
      );
    }

    const enriched = (features || []).map((f) => ({
      ...f,
      persona_name: f.persona_id ? (personaMap[f.persona_id] || null) : null,
    }));

    return NextResponse.json({ features: enriched });
  } catch (err) {
    console.error('Feature personas GET error:', err);
    return serverError('기능 매핑을 불러올 수 없습니다');
  }
}

export async function PUT(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  // 3. Zod safeParse
  const body = await request.json().catch(() => null);
  if (!body) return validationError({ issues: [{ message: '잘못된 요청입니다' }] } as never);

  const parsed = aiFeaturePersonaUpdateSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { feature_slug, persona_id, system_prompt_override, is_active } = parsed.data;

  try {
    const adminSupabase = createAdminClient();

    const updateData: Record<string, unknown> = {
      persona_id,
      system_prompt_override,
      updated_at: new Date().toISOString(),
    };
    if (is_active !== undefined) {
      updateData.is_active = is_active;
    }

    const { data: updated, error: updateError } = await adminSupabase
      .from('ai_feature_personas')
      .update(updateData)
      .eq('feature_slug', feature_slug)
      .select()
      .single();

    if (updateError) throw updateError;

    // 5. Audit log
    await logAudit(user.id, {
      action: 'admin.ai_feature_persona_update',
      resourceType: 'ai_feature_persona',
      resourceId: feature_slug,
      details: { persona_id },
    });

    return NextResponse.json({ feature: updated });
  } catch (err) {
    console.error('Feature personas PUT error:', err);
    return serverError('기능 매핑 업데이트에 실패했습니다');
  }
}
