import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, serverError } from '@/lib/api/errors';
import { z } from 'zod';

const createTeamSchema = z.object({
  name: z.string().min(1, '팀 이름은 필수입니다').max(100),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { data: teams, error } = await supabase
    .from('teams')
    .select('*, team_members(count)')
    .or(`owner_id.eq.${user.id},id.in.(${
      `select team_id from team_members where user_id = '${user.id}'`
    })`);

  if (error) return serverError(error.message);

  return NextResponse.json({ teams: teams || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const body = await request.json();
  const parsed = createTeamSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { data: team, error } = await supabase
    .from('teams')
    .insert({ name: parsed.data.name, owner_id: user.id })
    .select()
    .single();

  if (error) return serverError(error.message);

  // Add owner as admin member
  await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: 'admin',
    invited_by: user.id,
  });

  return NextResponse.json(team, { status: 201 });
}
