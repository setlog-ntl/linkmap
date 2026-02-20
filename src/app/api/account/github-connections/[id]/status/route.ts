import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, apiError, notFoundError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['active', 'revoked']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { id } = await params;

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues.map((e) => e.message).join(', '), 400);
  }

  const { status } = parsed.data;

  // Verify ownership
  const { data: account } = await supabase
    .from('service_accounts')
    .select('id, oauth_metadata')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!account) return notFoundError('GitHub 연결');

  const { error } = await supabase
    .from('service_accounts')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return apiError(error.message, 500);

  await logAudit(user.id, {
    action: 'github_connection.toggle_status',
    resourceType: 'service_account',
    resourceId: id,
    details: {
      status,
      login: (account.oauth_metadata as Record<string, string>)?.login,
    },
  });

  return NextResponse.json({ success: true });
}
