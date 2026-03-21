import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, validationError, serverError } from '@/lib/api/errors';
import { z } from 'zod';

const reorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1).max(200),
});

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { orderedIds } = parsed.data;

  // 소유권 확인: 모든 배포가 현재 유저 소유인지 검증
  const { data: owned, error: ownErr } = await supabase
    .from('homepage_deploys')
    .select('id')
    .eq('user_id', user.id)
    .in('id', orderedIds);

  if (ownErr) return serverError(ownErr.message);
  if (!owned || owned.length !== orderedIds.length) {
    return NextResponse.json(
      { error: '소유하지 않은 배포가 포함되어 있습니다' },
      { status: 403 },
    );
  }

  // 일괄 업데이트: 각 배포의 display_order를 인덱스 기반으로 설정
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('homepage_deploys')
      .update({ display_order: index })
      .eq('id', id)
      .eq('user_id', user.id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) return serverError(failed.error.message);

  return NextResponse.json({ success: true });
}
