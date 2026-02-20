import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { isAdmin } from '@/lib/admin';
import { logAudit } from '@/lib/audit';
import { PRESETS, FEATURE_DEFINITIONS } from '@/data/seed/ai-feature-defaults';

const applyPresetSchema = z.object({
  preset: z.enum(['default', 'expert', 'concise']),
});

/** GET — List available presets */
export async function GET() {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  const presets = PRESETS.map((p) => {
    const featureCount = Object.keys(p.features).length;
    const qnaCount = Object.values(p.features).reduce(
      (sum, fc) => sum + fc.qna.length, 0
    );
    return {
      key: p.key,
      name_ko: p.name_ko,
      name_en: p.name_en,
      description_ko: p.description_ko,
      description_en: p.description_en,
      feature_count: featureCount,
      qna_count: qnaCount,
    };
  });

  return NextResponse.json({ presets });
}

/** POST — Apply a preset to all features */
export async function POST(request: NextRequest) {
  // 1. Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. Admin check
  if (!(await isAdmin(user.id))) return unauthorizedError();

  // 3. Zod safeParse
  const body = await request.json().catch(() => null);
  if (!body) return validationError({ issues: [{ message: '잘못된 요청입니다' }] } as never);

  const parsed = applyPresetSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { preset: presetKey } = parsed.data;
  const preset = PRESETS.find((p) => p.key === presetKey);
  if (!preset) return serverError('프리셋을 찾을 수 없습니다');

  try {
    const adminSupabase = createAdminClient();

    // Ensure all features exist
    const featureRows = FEATURE_DEFINITIONS.map((f) => ({
      feature_slug: f.slug,
      is_active: true,
    }));
    await adminSupabase
      .from('ai_feature_personas')
      .upsert(featureRows, { onConflict: 'feature_slug' });

    // Update each feature's system_prompt_override
    for (const [slug, config] of Object.entries(preset.features)) {
      await adminSupabase
        .from('ai_feature_personas')
        .update({
          system_prompt_override: config.system_prompt_override,
          updated_at: new Date().toISOString(),
        })
        .eq('feature_slug', slug);
    }

    // Delete all existing Q&A and insert preset Q&A
    const slugs = Object.keys(preset.features);
    await adminSupabase
      .from('ai_feature_qna')
      .delete()
      .in('feature_slug', slugs);

    const qnaRows = slugs.flatMap((slug) =>
      preset.features[slug].qna.map((q) => ({
        feature_slug: slug,
        question: q.question,
        question_ko: q.question_ko,
        answer_guide: q.answer_guide,
        sort_order: q.sort_order,
        is_active: true,
      }))
    );

    if (qnaRows.length > 0) {
      await adminSupabase.from('ai_feature_qna').insert(qnaRows);
    }

    // 5. Audit log
    await logAudit(user.id, {
      action: 'admin.ai_feature_preset_apply',
      resourceType: 'ai_feature_preset',
      resourceId: presetKey,
      details: { preset: presetKey, feature_count: slugs.length, qna_count: qnaRows.length },
    });

    return NextResponse.json({
      success: true,
      preset: presetKey,
      features_updated: slugs.length,
      qna_inserted: qnaRows.length,
    });
  } catch (err) {
    console.error('Feature preset apply error:', err);
    return serverError('프리셋 적용에 실패했습니다');
  }
}
