import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { unauthorizedError, validationError, serverError, apiError } from '@/lib/api/errors';

const pickSchema = z.object({
  showcaseId: z.string().uuid(),
  source: z.enum(['deploy', 'project']),
  yearMonth: z.string().regex(/^\d{4}-\d{2}$/),
  rank: z.number().int().min(1).max(10),
  pickType: z.enum(['algorithm', 'curated']).default('curated'),
  adminNote: z.string().max(500).optional(),
});

// POST: 이달의 페이지 수동 선정
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
  const parsed = pickSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { showcaseId, source, yearMonth, rank, pickType, adminNote } = parsed.data;

  // 4. 선정
  const { data, error } = await supabase
    .from('showcase_monthly_picks')
    .upsert(
      {
        showcase_id: showcaseId,
        showcase_source: source,
        year_month: yearMonth,
        pick_type: pickType,
        rank,
        admin_note: adminNote || null,
        picked_by: user.id,
      },
      { onConflict: 'showcase_id,year_month' }
    )
    .select()
    .single();

  if (error) return serverError('이달의 페이지 선정 실패');

  // 5. 배지 자동 부여
  // showcase의 user_id 조회
  const table = source === 'deploy' ? 'homepage_deploys' : 'projects';
  const { data: showcaseData } = await supabase
    .from(table)
    .select('user_id')
    .eq('id', showcaseId)
    .maybeSingle();

  if (showcaseData) {
    const badgeType = rank === 1 ? 'monthly_winner' : 'monthly_runner_up';
    // 표현식 기반 unique index → upsert 불가, insert + 중복 무시
    await supabase.from('showcase_badges').insert({
      user_id: showcaseData.user_id,
      badge_type: badgeType,
      showcase_id: showcaseId,
      year_month: yearMonth,
    });
  }

  return NextResponse.json(data);
}

// DELETE: 이달의 페이지 선정 취소
export async function DELETE(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);
  const pickId = searchParams.get('id');
  if (!pickId) return apiError('id 파라미터가 필요합니다', 400);

  const { error } = await supabase
    .from('showcase_monthly_picks')
    .delete()
    .eq('id', pickId);

  if (error) return serverError('선정 취소 실패');

  return NextResponse.json({ success: true });
}
