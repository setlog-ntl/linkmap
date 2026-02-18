import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedError, notFoundError, serverError, apiError } from '@/lib/api/errors';
import { logAudit } from '@/lib/audit';
import { z } from 'zod';

const inviteMemberSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: teamId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Check if requester is a member of the team (or team owner)
  const { data: membership } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    const { data: team } = await supabase.from('teams').select('owner_id').eq('id', teamId).single();
    if (!team || team.owner_id !== user.id) return apiError('접근 권한이 없습니다', 403);
  }

  const { data: members, error } = await supabase
    .from('team_members')
    .select('*, user:user_id(email, raw_user_meta_data)')
    .eq('team_id', teamId);

  if (error) return serverError(error.message);

  // Strip sensitive raw_user_meta_data, expose only safe fields
  const safeMembers = (members || []).map((member) => {
    const { user, ...rest } = member as Record<string, unknown> & { user?: { email?: string; raw_user_meta_data?: Record<string, unknown> } };
    return {
      ...rest,
      user: user ? {
        email: user.email,
        avatar_url: user.raw_user_meta_data?.avatar_url ?? null,
        full_name: user.raw_user_meta_data?.full_name ?? null,
      } : null,
    };
  });

  return NextResponse.json({ members: safeMembers });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: teamId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  // Check if requester is admin of the team
  const { data: requesterMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();

  if (!requesterMember || requesterMember.role !== 'admin') {
    return apiError('팀 관리자만 멤버를 초대할 수 있습니다', 403);
  }

  const body = await request.json();
  const parsed = inviteMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  // Find user by email
  const { data: targetUsers } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', parsed.data.email)
    .limit(1);

  if (!targetUsers || targetUsers.length === 0) {
    return notFoundError('사용자');
  }

  const targetUserId = targetUsers[0].id;

  // Check if already a member
  const { data: existing } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('user_id', targetUserId)
    .single();

  if (existing) {
    return apiError('이미 팀 멤버입니다', 409);
  }

  const { data: member, error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: targetUserId,
      role: parsed.data.role,
      invited_by: user.id,
    })
    .select()
    .single();

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'team_member.add',
    resourceType: 'team_member',
    resourceId: member.id,
    details: { team_id: teamId, target_user_id: targetUserId, role: parsed.data.role },
  });

  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: teamId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorizedError();

  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get('member_id');
  if (!memberId) return apiError('member_id가 필요합니다', 400);

  // Check if requester is admin
  const { data: requesterMember } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', user.id)
    .single();

  if (!requesterMember || requesterMember.role !== 'admin') {
    return apiError('팀 관리자만 멤버를 제거할 수 있습니다', 403);
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', memberId)
    .eq('team_id', teamId);

  if (error) return serverError(error.message);

  await logAudit(user.id, {
    action: 'team_member.remove',
    resourceType: 'team_member',
    resourceId: memberId,
    details: { team_id: teamId },
  });

  return NextResponse.json({ success: true });
}
