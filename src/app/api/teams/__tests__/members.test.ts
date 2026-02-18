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

import { GET } from '../[id]/members/route';
import { createClient } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createRequest(url: string) {
  return new NextRequest(new URL(url, 'http://localhost:3000'));
}

/**
 * Build a mock Supabase client for the teams/members tests.
 *
 * The members route calls `from()` up to 3 times on different tables:
 *  1. `team_members` (membership check)
 *  2. `teams` (owner fallback -- only when membership check returns null)
 *  3. `team_members` (fetch full member list)
 *
 * We track per-table call indices so each successive call can return a
 * different result.
 */
function createMockSupabase(overrides: {
  user?: { id: string; email: string } | null;
  fromResults?: Record<
    string,
    | { data: unknown; error: unknown }
    | Array<{ data: unknown; error: unknown }>
  >;
} = {}) {
  const mockUser =
    overrides.user !== undefined
      ? overrides.user
      : { id: 'user-1', email: 'test@example.com' };

  const callCounts: Record<string, number> = {};

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
    },
    from: vi.fn((table: string) => {
      callCounts[table] = (callCounts[table] ?? 0) + 1;
      const callIndex = callCounts[table] - 1;

      const raw = overrides.fromResults?.[table];
      let result: { data: unknown; error: unknown };
      if (Array.isArray(raw)) {
        result = raw[callIndex] ?? raw[raw.length - 1];
      } else if (raw) {
        result = raw;
      } else {
        result = { data: null, error: null };
      }

      const chain: Record<string, unknown> = {};
      const methods = ['select', 'eq', 'insert', 'delete', 'limit'];
      for (const m of methods) {
        chain[m] = vi.fn().mockReturnValue(chain);
      }
      // Terminal methods resolve to the result
      chain.single = vi.fn().mockResolvedValue(result);
      chain.order = vi.fn().mockResolvedValue(result);
      // Make the chain itself thenable so `await supabase.from(...).select().eq()` works
      chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
        Promise.resolve(result).then(resolve, reject);
      return chain;
    }),
  };
}

/** Simulate Next.js 16 route params (async Promise) */
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

  it('returns 403 for non-team members who are also not team owner', async () => {
    const mock = createMockSupabase({
      fromResults: {
        // 1st call: team_members membership check => not found
        // 2nd call: teams owner check => not owner
        // (we use arrays to separate calls)
        team_members: [
          { data: null, error: null }, // membership check
        ],
        teams: { data: null, error: null }, // owner check fails (no team or not owner)
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('접근 권한');
  });

  it('returns 403 when team exists but user is not the owner', async () => {
    const mock = createMockSupabase({
      fromResults: {
        team_members: [
          { data: null, error: null }, // not a member
        ],
        teams: { data: { owner_id: 'someone-else' }, error: null }, // exists but different owner
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(403);
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
      fromResults: {
        // 1st call: membership check => found (user is a member)
        // 2nd call: fetch member list (terminal is implicit via .eq returning result)
        team_members: [
          { data: { id: 'tm-self' }, error: null }, // membership check passes
          { data: rawMembers, error: null },         // member list
        ],
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.members).toHaveLength(2);

    // Verify safe fields are present
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
      fromResults: {
        team_members: [
          { data: { id: 'tm-self' }, error: null },
          { data: rawMembers, error: null },
        ],
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

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
      fromResults: {
        team_members: [
          { data: { id: 'tm-self' }, error: null },
          { data: rawMembers, error: null },
        ],
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));
    const body = await res.json();
    const member = body.members[0];

    expect(member.user.avatar_url).toBeNull();
    expect(member.user.full_name).toBeNull();
  });

  it('allows team owner to view members even without explicit team_members row', async () => {
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
      fromResults: {
        // 1st team_members call: membership check => NOT found
        // teams call: owner check => owner matches user-1
        // 2nd team_members call: fetch member list
        team_members: [
          { data: null, error: null },          // not a member
          { data: rawMembers, error: null },    // member list
        ],
        teams: { data: { owner_id: 'user-1' }, error: null }, // current user is owner
      },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET(createRequest(`/api/teams/${teamId}/members`), createParams(teamId));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.members).toHaveLength(1);
  });
});
