import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const patchSchema = z.object({
  name: z.string().min(1, '이름은 필수입니다').max(50),
});

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues.map((e) => e.message).join(', '), 400);
  }

  const { name } = parsed.data;

  const { error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', user.id);

  if (error) return apiError(error.message, 500);

  await logAudit(user.id, {
    action: 'profile.update',
    resourceType: 'profile',
    resourceId: user.id,
    details: { name },
  });

  return NextResponse.json({ success: true });
}
