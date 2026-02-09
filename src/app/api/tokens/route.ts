import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, serverError, apiError } from '@/lib/api/errors';
import { randomBytes, createHash } from 'crypto';
import { z } from 'zod';

const createTokenSchema = z.object({
  name: z.string().min(1, '토큰 이름은 필수입니다').max(100),
  expires_in_days: z.number().min(1).max(365).optional(),
});

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: tokens, error } = await supabase
    .from('api_tokens')
    .select('id, name, last_used_at, expires_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return serverError(error.message);

  return NextResponse.json({ tokens: tokens || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createTokenSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0].message, 400);
  }

  const rawToken = `stl_${randomBytes(32).toString('hex')}`;
  const tokenHash = hashToken(rawToken);
  const expiresAt = parsed.data.expires_in_days
    ? new Date(Date.now() + parsed.data.expires_in_days * 86400000).toISOString()
    : null;

  const { data, error } = await supabase
    .from('api_tokens')
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      token_hash: tokenHash,
      expires_at: expiresAt,
    })
    .select('id, name, expires_at, created_at')
    .single();

  if (error) return serverError(error.message);

  // Return the raw token only once
  return NextResponse.json({ ...data, token: rawToken }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return apiError('ID가 필요합니다', 400);

  const { error } = await supabase
    .from('api_tokens')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return serverError(error.message);

  return NextResponse.json({ success: true });
}
