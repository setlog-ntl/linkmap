import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));
vi.mock('@/lib/audit', () => ({
  logAudit: vi.fn(),
}));
vi.mock('@/lib/api/team-auth', () => ({
  requireTeamRole: vi.fn(),
  isTeamAuthError: vi.fn((result: unknown) => result instanceof Response),
}));

import { GET } from '../[id]/members/route';
import { createClient } from '@/lib/supabase/server';
import { requireTeamRole } from '@/lib/api/team-auth';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

function createMockSupabase(overrides: {
  user?: { id: string; email: string } | null;
  membersResult?: { data: unknown; error: unknown };
} = {}) {
  const mockUser =
    overrides.user !== undefined
      ? overrides.user
      : { id: 'user-1', email: 'test@example.com' };

  const membersResult = overrides.membersResult ?? { data: [], error: null };

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
    },
    from: vi.fn(() => {
      const chain: Record<string, unknown> = {};
      const methods = ['select', 'eq', 'insert', 'delete', 'limit', 'order'];
      for (const m of methods) {
        chain[m] = vi.fn().mockReturnValue(chain);
      }
      chain.single = vi.fn().mockResolvedValue(membersResult);
      chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
        Promise.resolve(membersResult).then(resolve, reject);
      return chain;
    }),
  };
}

function createParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('GET /api/teams/[id]/members', () => {
  const teamId = 'team-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for unauthenticated users', async () => {
    const mock = createMockSupabase({ user: null });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('인증');
  });

  it('returns 403 for non-team members', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);
    // requireTeamRole returns a 403 Response
    const errorResponse = new Response(JSON.stringify({ error: '팀 멤버가 아닙니다' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
    vi.mocked(requireTeamRole).mockResolvedValue(errorResponse);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(403);
  });

  it('returns 404 when team does not exist', async () => {
    const mock = createMockSupabase();
    vi.mocked(createClient).mockResolvedValue(mock as never);
    const errorResponse = new Response(JSON.stringify({ error: '팀을 찾을 수 없습니다' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
    vi.mocked(requireTeamRole).mockResolvedValue(errorResponse);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(404);
  });

  it('returns members with safe fields (no raw_user_meta_data exposed)', async () => {
    const rawMembers = [
      {
        id: 'tm-1',
        team_id: teamId,
        user_id: 'u1',
        role: 'admin',
        user: {
          email: 'admin@example.com',
          raw_user_meta_data: {
            avatar_url: 'https://avatars.example.com/u1.png',
            full_name: 'Admin User',
            some_internal_field: 'should-be-stripped',
          },
        },
      },
      {
        id: 'tm-2',
        team_id: teamId,
        user_id: 'u2',
        role: 'viewer',
        user: {
          email: 'viewer@example.com',
          raw_user_meta_data: {
            avatar_url: 'https://avatars.example.com/u2.png',
            full_name: 'Viewer User',
          },
        },
      },
    ];

    const mock = createMockSupabase({
      membersResult: { data: rawMembers, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    vi.mocked(requireTeamRole).mockResolvedValue({ role: 'admin' });

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.members).toHaveLength(2);

    const member1 = body.members[0];
    expect(member1.user.email).toBe('admin@example.com');
    expect(member1.user.avatar_url).toBe('https://avatars.example.com/u1.png');
    expect(member1.user.full_name).toBe('Admin User');

    // Verify raw_user_meta_data is NOT directly exposed
    expect(member1.user.raw_user_meta_data).toBeUndefined();
    expect(member1.user.some_internal_field).toBeUndefined();
  });

  it('extracts avatar_url and full_name from raw_user_meta_data', async () => {
    const rawMembers = [
      {
        id: 'tm-1',
        team_id: teamId,
        user_id: 'u1',
        role: 'editor',
        user: {
          email: 'user@example.com',
          raw_user_meta_data: {
            avatar_url: 'https://cdn.example.com/pic.jpg',
            full_name: 'Test Person',
          },
        },
      },
    ];

    const mock = createMockSupabase({
      membersResult: { data: rawMembers, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    vi.mocked(requireTeamRole).mockResolvedValue({ role: 'viewer' });

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));
    const body = await res.json();
    const member = body.members[0];

    expect(member.user.avatar_url).toBe('https://cdn.example.com/pic.jpg');
    expect(member.user.full_name).toBe('Test Person');
  });

  it('returns null for avatar_url and full_name when raw_user_meta_data is empty', async () => {
    const rawMembers = [
      {
        id: 'tm-1',
        team_id: teamId,
        user_id: 'u1',
        role: 'viewer',
        user: {
          email: 'bare@example.com',
          raw_user_meta_data: {},
        },
      },
    ];

    const mock = createMockSupabase({
      membersResult: { data: rawMembers, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    vi.mocked(requireTeamRole).mockResolvedValue({ role: 'viewer' });

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));
    const body = await res.json();
    const member = body.members[0];

    expect(member.user.avatar_url).toBeNull();
    expect(member.user.full_name).toBeNull();
  });

  it('allows team owner to view members via requireTeamRole', async () => {
    const rawMembers = [
      {
        id: 'tm-1',
        team_id: teamId,
        user_id: 'u2',
        role: 'viewer',
        user: {
          email: 'member@example.com',
          raw_user_meta_data: { full_name: 'Member' },
        },
      },
    ];

    const mock = createMockSupabase({
      membersResult: { data: rawMembers, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);
    // Owner is treated as admin by requireTeamRole
    vi.mocked(requireTeamRole).mockResolvedValue({ role: 'admin' });

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.members).toHaveLength(1);
  });
});
