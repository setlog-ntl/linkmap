import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { decrypt } from '@/lib/crypto';
import { unauthorizedError, notFoundError, apiError } from '@/lib/api/errors';
import { requireMfa } from '@/lib/api/mfa-guard';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';
import type { DbSecureNoteWithProject } from '@/lib/supabase/types';

const decryptRequestSchema = z.object({ id: z.string().uuid('유효한 보안 메모 ID가 필요합니다') });

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const mfaResponse = await requireMfa(supabase);
  if (mfaResponse) return mfaResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError('유효하지 않은 JSON 형식입니다', 400);
  }

  const parsed = decryptRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError('유효한 보안 메모 ID가 필요합니다', 400);
  }

  const { id } = parsed.data;

  const { data: note } = await supabase
    .from('secure_notes')
    .select('*, project:projects!inner(user_id)')
    .eq('id', id)
    .single();

  const noteTyped = note as DbSecureNoteWithProject | null;
  if (!noteTyped || noteTyped.project.user_id !== user.id) {
    return notFoundError('보안 메모');
  }

  const content = decrypt(noteTyped.encrypted_content);

  await logAudit(user.id, {
    action: 'secure_note.decrypt',
    resourceType: 'secure_note',
    resourceId: id,
    details: { title: noteTyped.title },
  });

  return NextResponse.json({ content });
}
