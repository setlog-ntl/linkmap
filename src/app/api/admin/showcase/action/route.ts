import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { unauthorizedError, validationError, serverError, apiError } from '@/lib/api/errors';

const actionSchema = z.object({
  showcaseId: z.string().uuid(),
  source: z.enum(['deploy', 'project']),
  actionType: z.enum(['boost', 'suppress', 'hide', 'unhide', 'feature', 'unfeature']),
  boostScore: z.number().optional().default(0),
  reason: z.string().max(500).optional(),
  expiresAt: z.string().datetime().optional(),
});

// POST: 관리자 액션 실행
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // 1. 인증
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // 2. 관리자 확인
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return apiError('관리자 권한이 필요합니다', 403);
  }

  // 3. Zod 검증
  const body = await req.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { showcaseId, source, actionType, boostScore, reason, expiresAt } = parsed.data;

  // unhide/unfeature인 경우 기존 액션 비활성화
  if (actionType === 'unhide' || actionType === 'unfeature') {
    const targetType = actionType === 'unhide' ? 'hide' : 'feature';
    await supabase
      .from('showcase_admin_actions')
      .update({ is_active: false })
      .eq('showcase_id', showcaseId)
      .eq('action_type', targetType)
      .eq('is_active', true);
  }

  // feature 액션 시 editors_choice 배지 자동 부여
  if (actionType === 'feature') {
    const table = source === 'deploy' ? 'homepage_deploys' : 'projects';
    const { data: showcaseData } = await supabase
      .from(table)
      .select('user_id')
      .eq('id', showcaseId)
      .maybeSingle();

    if (showcaseData) {
      // 표현식 기반 unique index → upsert 불가, insert + 중복 무시
      await supabase.from('showcase_badges').insert({
        user_id: showcaseData.user_id,
        badge_type: 'editors_choice',
        showcase_id: showcaseId,
      });
    }
  }

  // 4. 액션 기록
  const { data, error } = await supabase
    .from('showcase_admin_actions')
    .insert({
      showcase_id: showcaseId,
      showcase_source: source,
      action_type: actionType,
      boost_score: boostScore,
      reason: reason || null,
      admin_id: user.id,
      expires_at: expiresAt || null,
    })
    .select()
    .single();

  if (error) return serverError('관리자 액션 실행 실패');

  return NextResponse.json(data);
}

// GET: 액션 이력 조회
export async function GET(_req: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return apiError('관리자 권한이 필요합니다', 403);
  }

  const { data, error } = await supabase
    .from('showcase_admin_actions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return serverError('액션 이력 조회 실패');

  return NextResponse.json({ actions: data });
}
