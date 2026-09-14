import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Module mocks -- hoisted before any imports from the route under test
// ---------------------------------------------------------------------------
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));
vi.mock('@/lib/admin', () => ({
  isAdmin: vi.fn(),
}));
vi.mock('@/lib/audit', () => ({
  logAudit: vi.fn(),
}));

import { GET, POST } from '../route';
import { PUT, DELETE } from '../[id]/route';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { logAudit } from '@/lib/audit';

const RESOURCE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createRequest(url: string, options?: RequestInit) {
  return new NextRequest(new URL(url, 'http://localhost:3000'), options as never);
}

function jsonRequest(url: string, method: string, body: unknown) {
  return createRequest(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** 체이너블 쿼리 빌더 — 어떤 체인이든 마지막에 result로 resolve */
function makeChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'insert', 'update', 'delete']) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  chain.single = vi.fn().mockResolvedValue(result);
  chain.order = vi.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
    Promise.resolve(result).then(resolve, reject);
  return chain;
}

function createMockSupabase(overrides: {
  user?: { id: string } | null;
  result?: { data: unknown; error: unknown };
} = {}) {
  const user = overrides.user !== undefined ? overrides.user : { id: 'admin-1' };
  const result = overrides.result ?? { data: null, error: null };
  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from: vi.fn(() => makeChain(result)),
  };
}

const VALID_BODY = {
  slug: 'new-resource',
  sort_order: 2,
  title: '새 자료',
  description: '설명',
  category: 'prompt',
  published_at: '2026-09-14',
  tags: ['태그'],
  hero: { headline: '코드 몰라도,', highlight: '3분 만에', sub: '나만의 도구를 배포합니다' },
  youtube_video_id: null,
  youtube_title: '',
  prompts: [{ id: 'build', title: '지시문', description: '', body: '본문' }],
  links: [],
  download_href: null,
  closing: '',
  is_published: false,
};

const SAVED_ROW = {
  ...VALID_BODY,
  id: RESOURCE_ID,
  created_by: 'admin-1',
  created_at: '2026-09-14T00:00:00Z',
  updated_at: '2026-09-14T00:00:00Z',
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(isAdmin).mockResolvedValue(true);
});

// ---------------------------------------------------------------------------
// GET /api/admin/resources
// ---------------------------------------------------------------------------
describe('GET /api/admin/resources', () => {
  it('returns 401 for unauthenticated users', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase({ user: null }) as never);

    const res = await GET();

    expect(res.status).toBe(401);
  });

  it('returns 403 for non-admin users', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase() as never);
    vi.mocked(isAdmin).mockResolvedValue(false);

    const res = await GET();

    expect(res.status).toBe(403);
  });

  it('returns every resource including unpublished ones', async () => {
    const mock = createMockSupabase({ result: { data: [SAVED_ROW], error: null } });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.resources).toHaveLength(1);
    expect(mock.from).toHaveBeenCalledWith('free_resources');
  });
});

// ---------------------------------------------------------------------------
// POST /api/admin/resources
// ---------------------------------------------------------------------------
describe('POST /api/admin/resources', () => {
  it('returns 401 for unauthenticated users', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase({ user: null }) as never);

    const res = await POST(jsonRequest('/api/admin/resources', 'POST', VALID_BODY));

    expect(res.status).toBe(401);
  });

  it('returns 403 for non-admin users', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase() as never);
    vi.mocked(isAdmin).mockResolvedValue(false);

    const res = await POST(jsonRequest('/api/admin/resources', 'POST', VALID_BODY));

    expect(res.status).toBe(403);
    expect(logAudit).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid slug', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase() as never);

    const res = await POST(
      jsonRequest('/api/admin/resources', 'POST', { ...VALID_BODY, slug: 'Bad Slug!' })
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for a non-JSON body', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase() as never);

    const res = await POST(
      createRequest('/api/admin/resources', { method: 'POST', body: 'not json' })
    );

    expect(res.status).toBe(400);
  });

  it('returns 409 when the slug is already taken', async () => {
    const mock = createMockSupabase({
      result: { data: null, error: { code: '23505', message: 'duplicate key' } },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(jsonRequest('/api/admin/resources', 'POST', VALID_BODY));

    expect(res.status).toBe(409);
    expect(logAudit).not.toHaveBeenCalled();
  });

  it('creates the resource and writes an audit log', async () => {
    const mock = createMockSupabase({ result: { data: SAVED_ROW, error: null } });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await POST(jsonRequest('/api/admin/resources', 'POST', VALID_BODY));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.resource.slug).toBe('new-resource');
    expect(logAudit).toHaveBeenCalledWith(
      'admin-1',
      expect.objectContaining({
        action: 'admin.resource_create',
        resourceType: 'free_resources',
        resourceId: RESOURCE_ID,
      })
    );
  });
});

// ---------------------------------------------------------------------------
// PUT / DELETE /api/admin/resources/[id]
// ---------------------------------------------------------------------------
const ctx = { params: Promise.resolve({ id: RESOURCE_ID }) };

describe('PUT /api/admin/resources/[id]', () => {
  it('returns 400 when nothing is being changed', async () => {
    vi.mocked(createClient).mockResolvedValue(createMockSupabase() as never);

    const res = await PUT(jsonRequest(`/api/admin/resources/${RESOURCE_ID}`, 'PUT', {}), ctx);

    expect(res.status).toBe(400);
  });

  it('returns 404 when no row matches', async () => {
    const mock = createMockSupabase({
      result: { data: null, error: { code: 'PGRST116', message: 'no rows' } },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await PUT(
      jsonRequest(`/api/admin/resources/${RESOURCE_ID}`, 'PUT', { is_published: true }),
      ctx
    );

    expect(res.status).toBe(404);
    expect(logAudit).not.toHaveBeenCalled();
  });

  it('updates a partial payload and writes an audit log', async () => {
    const mock = createMockSupabase({
      result: { data: { ...SAVED_ROW, is_published: true }, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await PUT(
      jsonRequest(`/api/admin/resources/${RESOURCE_ID}`, 'PUT', { is_published: true }),
      ctx
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.resource.is_published).toBe(true);
    expect(logAudit).toHaveBeenCalledWith(
      'admin-1',
      expect.objectContaining({
        action: 'admin.resource_update',
        resourceId: RESOURCE_ID,
        details: expect.objectContaining({ fields: ['is_published'], is_published: true }),
      })
    );
  });
});

describe('DELETE /api/admin/resources/[id]', () => {
  it('returns 404 when the id is not a UUID', async () => {
    const mock = createMockSupabase({
      result: { data: null, error: { code: '22P02', message: 'invalid input syntax for type uuid' } },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await DELETE(createRequest('/api/admin/resources/not-a-uuid', { method: 'DELETE' }), {
      params: Promise.resolve({ id: 'not-a-uuid' }),
    });

    expect(res.status).toBe(404);
  });

  it('deletes the resource and writes an audit log', async () => {
    const mock = createMockSupabase({
      result: { data: { id: RESOURCE_ID, slug: 'new-resource' }, error: null },
    });
    vi.mocked(createClient).mockResolvedValue(mock as never);

    const res = await DELETE(
      createRequest(`/api/admin/resources/${RESOURCE_ID}`, { method: 'DELETE' }),
      ctx
    );

    expect(res.status).toBe(200);
    expect(logAudit).toHaveBeenCalledWith(
      'admin-1',
      expect.objectContaining({
        action: 'admin.resource_delete',
        resourceId: RESOURCE_ID,
        details: { slug: 'new-resource' },
      })
    );
  });
});
